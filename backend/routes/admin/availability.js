const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { format, parse, setMinutes } = require("date-fns");

const BarberAvailability = require("../../model/admin/BarberAvailability");
const Appointment = require("../../model/appointment/Appointment");

// Slots are "booked" if any active appointment's timeSlot overlaps (single source: Appointment).
// Cancelled/rescheduled slots are automatically available again.
function slotOverlapsAppointment(slotStart, slotEnd, apptStart, apptEnd) {
  return slotStart < apptEnd && slotEnd > apptStart;
}

// @route   GET /api/admin/availability
// @desc    Get barber's current month availability (booked state from Appointment so cancel/reschedule frees slots)
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      return res.status(404).json({ message: "No availability found" });
    }

    const activeAppointments = await Appointment.find({
      adminId: req.user.id,
      status: {
        $in: [
          "pending",
          "confirmed",
          "reschedule-pending",
          "reschedule-confirmed",
        ],
      },
    })
      .select("timeSlot")
      .lean();

    const processedSchedule = availability.schedule.map((day) => {
      const dayDate = new Date(day.date);
      const dayStr = format(dayDate, "yyyy-MM-dd");
      const slotsFiltered = day.timeSlots.filter((slot) => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);
        const isBookedByAppointment = activeAppointments.some((apt) => {
          const aptStart = new Date(apt.timeSlot.start);
          const aptEnd = new Date(apt.timeSlot.end);
          return slotOverlapsAppointment(slotStart, slotEnd, aptStart, aptEnd);
        });
        return !isBookedByAppointment;
      });
      return {
        ...day.toObject(),
        timeSlots: slotsFiltered,
      };
    });

    res.json({
      ...availability.toObject(),
      schedule: processedSchedule,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/admin/availability/month
// @desc    Initial setup for next month's schedule
// @access  Private/Admin
router.post("/month", async (req, res) => {
  try {
    const { month, year, workingDays } = req.body;

    // Create array of all days in the month with workingDay status
    const schedule = workingDays.map((day) => ({
      date: new Date(year, month - 1, day),
      isWorkingDay: true,
      workHours: null,
      timeSlots: [],
    }));

    let availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      availability = new BarberAvailability({
        adminId: req.user.id,
        currentMonth: { month, year, isSet: true },
        schedule,
      });
    } else {
      availability.currentMonth = { month, year, isSet: true };
      availability.schedule = schedule;
    }

    await availability.save();
    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/availability/day/:date
// @desc    Set or update working hours for a specific day
// @access  Private/Admin
router.put("/day/:date", async (req, res) => {
  try {
    let { startTime, endTime } = req.body;

    const date = new Date(req.params.date);

    if (startTime && endTime) {
      // Parse as-is: frontend sends local time (e.g. "2025-01-31T09:00:00").
      // Do NOT append Z - that would force UTC and break timezone alignment.
      startTime = new Date(startTime);
      endTime = new Date(endTime);

      // Snap to the hour: slots are only on the hour (no :15, :30, :45)
      startTime.setMinutes(0, 0, 0);
      endTime.setMinutes(0, 0, 0);
    }

    let availability = await BarberAvailability.findOne({
      adminId: req.user.id,
    });

    if (!availability) {
      availability = new BarberAvailability({
        adminId: req.user.id,
        currentMonth: {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          isSet: true,
        },
        schedule: [
          {
            date: date,
            isWorkingDay: startTime && endTime ? true : false,
            workHours:
              startTime && endTime ? { start: startTime, end: endTime } : null,
            timeSlots:
              startTime && endTime ? generateTimeSlots(startTime, endTime) : [],
          },
        ],
      });
    } else {
      const dayIndex = availability.schedule.findIndex(
        (day) =>
          format(new Date(day.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd"),
      );

      if (dayIndex === -1) {
        availability.schedule.push({
          date: date,
          isWorkingDay: startTime && endTime ? true : false,
          workHours:
            startTime && endTime ? { start: startTime, end: endTime } : null,
          timeSlots:
            startTime && endTime ? generateTimeSlots(startTime, endTime) : [],
        });
      } else {
        if (!startTime || !endTime) {
          availability.schedule[dayIndex].isWorkingDay = false;
          availability.schedule[dayIndex].workHours = null;
          availability.schedule[dayIndex].timeSlots = [];
        } else {
          availability.schedule[dayIndex].isWorkingDay = true;
          availability.schedule[dayIndex].workHours = {
            start: startTime,
            end: endTime,
          };
          availability.schedule[dayIndex].timeSlots = generateTimeSlots(
            startTime,
            endTime,
          );
        }
      }
    }

    await availability.save();
    res.json(availability);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper: generate 1-hour slots on the hour only (no :15, :30, :45)
const SLOT_MINUTES = 60;
const generateTimeSlots = (start, end) => {
  const slots = [];
  let current = new Date(start);
  const endMs = end.getTime();

  while (current.getTime() + SLOT_MINUTES * 60000 <= endMs) {
    slots.push({
      startTime: new Date(current),
      endTime: new Date(current.getTime() + SLOT_MINUTES * 60000),
      isBooked: false,
    });
    current = new Date(current.getTime() + SLOT_MINUTES * 60000);
  }

  return slots;
};

module.exports = router;
