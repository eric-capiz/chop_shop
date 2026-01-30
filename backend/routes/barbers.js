const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const BarberProfile = require("../model/admin/BarberProfile");
const Service = require("../model/admin/Service");
const GalleryItem = require("../model/admin/GalleryItem");
const Review = require("../model/review/Review");

const publicBarberFields =
  "name email username bio specialties yearsOfExperience profileImage socialMedia";

// @route   GET /api/barbers
// @desc    List all barbers (for Our Barbers + booking)
// @access  Public
router.get("/", async (req, res) => {
  const barbers = await BarberProfile.find().select(publicBarberFields).lean();
  res.json(barbers);
});

// Nested routes first so :id is not confused with "services", "gallery", "reviews"
// @route   GET /api/barbers/:id/services
router.get("/:id/services", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid barber id" });
  }
  const services = await Service.find({
    adminId: id,
    isActive: true,
  }).lean();
  res.json(services);
});

// @route   GET /api/barbers/:id/gallery
router.get("/:id/gallery", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid barber id" });
  }
  const gallery = await GalleryItem.find({
    adminId: id,
    isActive: true,
  })
    .populate("serviceType", "name")
    .lean();
  res.json(gallery);
});

// @route   GET /api/barbers/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid barber id" });
  }
  const reviews = await Review.find({
    adminId: id,
    isActive: true,
  })
    .populate("userId", "name")
    .populate({
      path: "appointmentId",
      select: "appointmentDate",
      populate: { path: "serviceId", select: "name" },
    })
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews);
});

// @route   GET /api/barbers/:id
// @desc    Get barber by id (public profile for /barber/:id)
// @access  Public
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid barber id" });
  }
  const barber = await BarberProfile.findById(id).select(publicBarberFields);
  if (!barber) {
    return res.status(404).json({ message: "Barber not found" });
  }
  res.json(barber);
});

module.exports = router;
