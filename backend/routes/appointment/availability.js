const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const SalonAvailability = require("../../model/admin/SalonAvailability");
const Appointment = require("../../model/appointment/Appointment");

// @route   GET /api/availability?adminId=...
// @desc    Get technician's availability (public, for booking)
// @access  Public
router.get("/", async (req, res) => {
  const adminId = req.query.adminId;
  if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Valid adminId query is required" });
  }
  const availability = await SalonAvailability.findOne({ adminId });
  if (!availability) {
    return res
      .status(404)
      .json({ message: "No availability found for this technician" });
  }
  res.json(availability);
});

// @route   GET /api/availability/booked-slots?adminId=...
// @desc    Get booked time slots for a technician (no customer info)
// @access  Public
router.get("/booked-slots", async (req, res) => {
  const adminId = req.query.adminId;
  if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Valid adminId query is required" });
  }
  const activeAppointments = await Appointment.find({
    adminId,
    status: {
      $in: [
        "pending",
        "confirmed",
        "reschedule-pending",
        "reschedule-confirmed",
      ],
    },
  });

  const bookedSlots = activeAppointments
    .filter((a) => a.timeSlot && a.timeSlot.start && a.timeSlot.end)
    .map((appointment) => ({
      start: appointment.timeSlot.start,
      end: appointment.timeSlot.end,
    }));

  res.json({ bookedSlots });
});

module.exports = router;
