const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const SalonProfile = require("../model/admin/SalonProfile");
const Service = require("../model/admin/Service");
const GalleryItem = require("../model/admin/GalleryItem");
const Review = require("../model/review/Review");

const publicTechnicianFields =
  "name email username bio specialties yearsOfExperience profileImage socialMedia";

// @route   GET /api/technicians
// @desc    List all technicians (for Our Technicians + booking)
// @access  Public
router.get("/", async (req, res) => {
  const technicians = await SalonProfile.find().select(publicTechnicianFields).lean();
  res.json(technicians);
});

// Nested routes first so :id is not confused with "services", "gallery", "reviews"
// @route   GET /api/technicians/:id/services
router.get("/:id/services", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid technician id" });
  }
  const services = await Service.find({
    adminId: id,
    isActive: true,
  }).lean();
  res.json(services);
});

// @route   GET /api/technicians/:id/gallery
router.get("/:id/gallery", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid technician id" });
  }
  const gallery = await GalleryItem.find({
    adminId: id,
    isActive: true,
  })
    .populate("serviceType", "name")
    .lean();
  res.json(gallery);
});

// @route   GET /api/technicians/:id/reviews
router.get("/:id/reviews", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid technician id" });
  }
  const reviews = await Review.find({
    adminId: id,
    isActive: true,
  })
    .populate("userId", "name")
    .populate("adminId", "name")
    .populate({
      path: "appointmentId",
      select: "appointmentDate",
      populate: { path: "serviceId", select: "name" },
    })
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews);
});

// @route   GET /api/technicians/:id
// @desc    Get technician by id (public profile for /technician/:id)
// @access  Public
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid technician id" });
  }
  const technician = await SalonProfile.findById(id).select(publicTechnicianFields);
  if (!technician) {
    return res.status(404).json({ message: "Technician not found" });
  }
  res.json(technician);
});

module.exports = router;
