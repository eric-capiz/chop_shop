const mongoose = require("mongoose");

const rescheduleRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: String,
      enum: ["admin", "user", null],
      default: null,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    proposedDate: {
      type: Date,
      required: true,
    },
    proposedTimeSlot: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected"],
      default: "pending",
    },
  },
  { _id: false },
);

const AppointmentSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarberProfile",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reschedule-pending",
        "confirmed",
        "reschedule-confirmed",
        "completed",
        "cancelled",
        "no-show",
        "rejected",
        "reschedule-rejected",
      ],
      default: "pending",
    },
    rejectionDetails: {
      note: {
        type: String,
        default: null,
      },
      rejectedAt: {
        type: Date,
        default: null,
      },
    },
    contactInfo: {
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    notes: {
      type: String,
    },
    rescheduleRequest: {
      type: rescheduleRequestSchema,
      required: false,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: null,
    },
    hasReview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

AppointmentSchema.index({ adminId: 1 });
AppointmentSchema.index({ userId: 1 });
module.exports = mongoose.model("Appointment", AppointmentSchema);
