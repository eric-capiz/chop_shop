const mongoose = require("mongoose");

const BarberAvailabilitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberProfile",
      required: true,
    },
    currentMonth: {
      month: Number,
      year: Number,
      isSet: {
        type: Boolean,
        default: false,
      },
    },
    schedule: [
      {
        date: {
          type: Date,
          required: true,
        },
        isWorkingDay: {
          type: Boolean,
          default: false,
        },
        workHours: {
          start: Date,
          end: Date,
        },
        timeSlots: [
          {
            startTime: {
              type: Date,
              required: true,
            },
            endTime: {
              type: Date,
              required: true,
            },
            isBooked: {
              type: Boolean,
              default: false,
            },
            appointmentId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Appointment",
              default: null,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

BarberAvailabilitySchema.index({ adminId: 1 });
module.exports = mongoose.model("BarberAvailability", BarberAvailabilitySchema);
