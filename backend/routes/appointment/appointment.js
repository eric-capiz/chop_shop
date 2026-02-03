const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const Appointment = require("../../model/appointment/Appointment");
const BarberAvailability = require("../../model/admin/BarberAvailability");
const BarberProfile = require("../../model/admin/BarberProfile");
const Service = require("../../model/admin/Service");
const User = require("../../model/user/User");
const { sendAppointmentEmail } = require("../../services/emailService");

// Protected routes - both user and admin need auth
router.use(auth);

// User routes (role user only for booking; both can view their own)
router.get("/user", async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user.id })
    .populate("adminId", "name")
    .populate("serviceId", "name duration price")
    .populate("review")
    .sort({ appointmentDate: 1 });
  res.json(appointments);
});

router.post("/book", async (req, res) => {
  if (req.user.role !== "user") {
    return res
      .status(403)
      .json({ message: "Only logged-in users can book appointments" });
  }
  const { adminId, serviceId, appointmentDate, timeSlot, contactInfo, notes } =
    req.body;

  if (
    !adminId ||
    !serviceId ||
    !appointmentDate ||
    !timeSlot ||
    !timeSlot.start ||
    !timeSlot.end
  ) {
    return res.status(400).json({
      message:
        "adminId, serviceId, appointmentDate, and timeSlot (start, end) are required",
    });
  }

  const bookingDate = new Date(appointmentDate);
  bookingDate.setUTCHours(0, 0, 0, 0);

  const service = await Service.findOne({
    _id: serviceId,
    adminId,
    isActive: true,
  });
  if (!service) {
    return res.status(400).json({
      message: "Service not found or does not belong to this barber",
    });
  }

  const availability = await BarberAvailability.findOne({
    adminId,
  });

  if (!availability) {
    return res
      .status(400)
      .json({ message: "No availability found for this barber/date" });
  }

  const scheduleDay = availability.schedule.find((day) => {
    const scheduleDate = new Date(day.date);
    scheduleDate.setUTCHours(0, 0, 0, 0);
    return scheduleDate.getTime() === bookingDate.getTime();
  });

  if (!scheduleDay || !scheduleDay.isWorkingDay) {
    return res.status(400).json({
      message: "Not a working day",
      debug: {
        scheduleDay,
        bookingDate: bookingDate.toISOString(),
      },
    });
  }
  if (
    !scheduleDay.workHours ||
    !scheduleDay.workHours.start ||
    !scheduleDay.workHours.end
  ) {
    return res.status(400).json({
      message: "Barber has no working hours set for this day",
    });
  }

  const requestedStart = new Date(timeSlot.start);
  const requestedEnd = new Date(timeSlot.end);

  // Slots are on the hour only; each booking is exactly 1 hour
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const startOnHour =
    requestedStart.getMinutes() === 0 && requestedStart.getSeconds() === 0;
  const endOnHour =
    requestedEnd.getMinutes() === 0 && requestedEnd.getSeconds() === 0;
  const durationMs = requestedEnd.getTime() - requestedStart.getTime();
  if (!startOnHour || !endOnHour || Math.abs(durationMs - ONE_HOUR_MS) > 1000) {
    return res.status(400).json({
      message:
        "Time slot must be on the hour and exactly 1 hour (e.g. 10:00–11:00)",
    });
  }

  const workStart = new Date(scheduleDay.workHours.start);
  const workEnd = new Date(scheduleDay.workHours.end);

  const overlapping = await Appointment.findOne({
    adminId,
    status: {
      $in: [
        "pending",
        "confirmed",
        "reschedule-pending",
        "reschedule-confirmed",
      ],
    },
    $or: [
      {
        "timeSlot.start": { $lt: requestedEnd },
        "timeSlot.end": { $gt: requestedStart },
      },
      {
        "rescheduleRequest.proposedTimeSlot.start": { $lt: requestedEnd },
        "rescheduleRequest.proposedTimeSlot.end": { $gt: requestedStart },
      },
    ],
  }).lean();
  if (overlapping) {
    return res.status(400).json({
      message:
        "This time slot is already booked or overlaps with an existing appointment",
    });
  }

  workStart.setFullYear(
    requestedStart.getFullYear(),
    requestedStart.getMonth(),
    requestedStart.getDate()
  );
  workEnd.setFullYear(
    requestedStart.getFullYear(),
    requestedStart.getMonth(),
    requestedStart.getDate()
  );

  if (
    requestedStart < workStart ||
    requestedStart >= workEnd ||
    requestedEnd > workEnd
  ) {
    return res.status(400).json({
      message: "Time slot outside working hours",
      debug: {
        requestedStart: requestedStart.toISOString(),
        requestedEnd: requestedEnd.toISOString(),
        workStart: workStart.toISOString(),
        workEnd: workEnd.toISOString(),
      },
    });
  }

  const newAppointment = new Appointment({
    userId: req.user.id,
    adminId,
    serviceId,
    appointmentDate: bookingDate,
    timeSlot,
    contactInfo,
    notes,
    status: "pending",
  });

  const saved = await newAppointment.save();

  // Send booking emails to user and barber (do not fail the request on email errors)
  try {
    const [barber, user] = await Promise.all([
      BarberProfile.findById(adminId).select("name email").lean(),
      User.findById(req.user.id).select("name email").lean(),
    ]);
    const appointmentData = {
      barberName: barber?.name,
      barberEmail: barber?.email,
      userName: user?.name,
      userEmail: user?.email,
      serviceName: service.name,
      date: saved.appointmentDate,
      timeSlot: saved.timeSlot,
      status: "pending",
      notes: null,
    };
    const [userResult, barberResult] = await Promise.all([
      user?.email
        ? sendAppointmentEmail(user.email, "user", appointmentData)
        : Promise.resolve({ success: false }),
      barber?.email
        ? sendAppointmentEmail(barber.email, "barber", appointmentData)
        : Promise.resolve({ success: false }),
    ]);
    if (!userResult.success)
      console.error("[book] user email failed:", userResult.error);
    if (!barberResult.success && barber?.email)
      console.error("[book] barber email failed:", barberResult.error);
  } catch (err) {
    console.error("[book] email send error:", err);
  }

  const appointment = await Appointment.findById(saved._id)
    .populate("adminId", "name")
    .populate("serviceId", "name duration price");
  res.json(appointment);
});

router.put("/:id/reschedule", async (req, res) => {
  const { proposedDate, proposedTimeSlot } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  if (appointment.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (!["pending", "confirmed"].includes(appointment.status)) {
    return res.status(400).json({
      message: "Only pending or confirmed appointments can be rescheduled",
    });
  }

  const currentStatus = appointment.status;
  appointment.status = "reschedule-pending";
  appointment.rescheduleRequest = {
    requestedBy: "user",
    previousStatus: currentStatus,
    proposedDate: new Date(proposedDate),
    proposedTimeSlot: {
      start: new Date(proposedTimeSlot.start),
      end: new Date(proposedTimeSlot.end),
    },
    status: "pending",
  };

  await appointment.save();
  const updated = await Appointment.findById(appointment._id)
    .populate("adminId", "name email")
    .populate("userId", "name email")
    .populate("serviceId", "name duration price")
    .populate("review");

  // Emails: reschedule → both (new date/time; barber gets "log in to confirm")
  try {
    const barber = updated.adminId;
    const user = updated.userId;
    const rr = updated.rescheduleRequest;
    const appointmentData = {
      barberName: barber?.name,
      barberEmail: barber?.email,
      userName: user?.name,
      userEmail: user?.email,
      serviceName: updated.serviceId?.name,
      date: rr?.proposedDate,
      timeSlot: rr?.proposedTimeSlot,
      status: "reschedule-pending",
      notes: null,
    };
    if (user?.email)
      await sendAppointmentEmail(user.email, "user", appointmentData);
    if (barber?.email)
      await sendAppointmentEmail(barber.email, "barber", appointmentData);
  } catch (err) {
    console.error("[PUT /:id/reschedule] email error:", err);
  }

  res.json(updated);
});

router.put("/:id/status", async (req, res) => {
  const { status, rejectionDetails } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  const isOwnerUser = appointment.userId.toString() === req.user.id;
  const isOwnerBarber =
    (req.user.role === "admin" || req.user.role === "superadmin") &&
    appointment.adminId.toString() === req.user.id;
  if (!isOwnerUser && !isOwnerBarber) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (isOwnerUser && status !== "cancelled") {
    return res
      .status(403)
      .json({ message: "Users may only cancel their appointments" });
  }

  const previousStatus =
    appointment.status === "reschedule-pending"
      ? appointment.rescheduleRequest?.previousStatus || "pending"
      : appointment.status;

  if (status === "reschedule-rejected") {
    appointment.status = previousStatus;
    appointment.rejectionDetails = {
      note: rejectionDetails?.note || null,
      rejectedAt: new Date(),
    };
    appointment.rescheduleRequest = {
      ...appointment.rescheduleRequest,
      status: "rejected",
    };
  } else if (status === "rejected") {
    appointment.status = status;
    appointment.rejectionDetails = {
      note: rejectionDetails?.note || null,
      rejectedAt: new Date(),
    };
  } else if (
    status === "confirmed" &&
    appointment.status === "reschedule-pending"
  ) {
    appointment.status = "reschedule-confirmed";
    appointment.appointmentDate = appointment.rescheduleRequest.proposedDate;
    appointment.timeSlot = appointment.rescheduleRequest.proposedTimeSlot;
    appointment.rescheduleRequest.status = "confirmed";
  } else {
    appointment.status = status;
  }

  await appointment.save();
  const updated = await Appointment.findById(appointment._id)
    .populate("adminId", "name email")
    .populate("userId", "name email")
    .populate("serviceId", "name duration price")
    .populate("review");

  // Emails: confirm → user; reject → user + note; cancel → both
  try {
    const requestedStatus = req.body.status;
    const barber = updated.adminId;
    const user = updated.userId;
    const baseData = {
      barberName: barber?.name,
      barberEmail: barber?.email,
      userName: user?.name,
      userEmail: user?.email,
      serviceName: updated.serviceId?.name,
      date: updated.appointmentDate,
      timeSlot: updated.timeSlot,
      notes: updated.rejectionDetails?.note ?? null,
    };
    if (requestedStatus === "cancelled") {
      const data = { ...baseData, status: "cancelled" };
      await Promise.all(
        [
          user?.email ? sendAppointmentEmail(user.email, "user", data) : null,
          barber?.email
            ? sendAppointmentEmail(barber.email, "barber", data)
            : null,
        ].filter(Boolean)
      );
    } else if (
      requestedStatus === "confirmed" ||
      requestedStatus === "reschedule-rejected"
    ) {
      const emailStatus =
        requestedStatus === "reschedule-rejected"
          ? "reschedule-rejected"
          : updated.status;
      const data = { ...baseData, status: emailStatus };
      if (user?.email) await sendAppointmentEmail(user.email, "user", data);
    } else if (requestedStatus === "rejected") {
      const data = { ...baseData, status: "rejected" };
      if (user?.email) await sendAppointmentEmail(user.email, "user", data);
    }
  } catch (err) {
    console.error("[PUT /:id/status] email error:", err);
  }

  res.json(updated);
});

// Barber routes (logged-in barber's appointments)
router.use(isAdmin);

router.get("/barber", async (req, res) => {
  const appointments = await Appointment.find({ adminId: req.user.id })
    .populate("userId", "name email")
    .populate("serviceId", "name duration price")
    .populate("review")
    .sort({ appointmentDate: 1 });
  res.json(appointments);
});

router.put("/:id/reschedule-response", async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }
  if (appointment.adminId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }
  if (appointment.status !== "reschedule-pending") {
    return res.status(400).json({ message: "No pending reschedule request" });
  }

  if (status === "confirm") {
    appointment.status = "reschedule-confirmed";
    appointment.appointmentDate = appointment.rescheduleRequest.proposedDate;
    appointment.timeSlot = appointment.rescheduleRequest.proposedTimeSlot;
    appointment.rescheduleRequest.status = "confirmed";
  } else {
    appointment.status =
      appointment.rescheduleRequest.previousStatus || "pending";
    appointment.rescheduleRequest.status = "rejected";
    appointment.rejectionDetails = {
      note: req.body.rejectionDetails?.note || null,
      rejectedAt: new Date(),
    };
  }

  await appointment.save();

  const updated = await Appointment.findById(appointment._id)
    .populate("adminId", "name email")
    .populate("userId", "name email")
    .populate("serviceId", "name duration price")
    .populate("review");

  // Emails: barber confirmed reschedule → user (Reschedule Confirmed); barber rejected → user (Reschedule Rejected + note)
  try {
    const barber = updated.adminId;
    const user = updated.userId;
    const baseData = {
      barberName: barber?.name,
      barberEmail: barber?.email,
      userName: user?.name,
      userEmail: user?.email,
      serviceName: updated.serviceId?.name,
      date: updated.appointmentDate,
      timeSlot: updated.timeSlot,
      notes: updated.rejectionDetails?.note ?? null,
    };
    if (status === "confirm") {
      const data = { ...baseData, status: "reschedule-confirmed" };
      if (user?.email) await sendAppointmentEmail(user.email, "user", data);
    } else {
      const data = { ...baseData, status: "reschedule-rejected" };
      if (user?.email) await sendAppointmentEmail(user.email, "user", data);
    }
  } catch (err) {
    console.error("[PUT /:id/reschedule-response] email error:", err);
  }

  res.json(updated);
});

module.exports = router;
