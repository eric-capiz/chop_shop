const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { body, param, validationResult } = require("express-validator");

const { auth, isAdmin, isSuperAdmin } = require("../../middleware");
const SalonProfile = require("../../model/admin/SalonProfile");
const SalonAvailability = require("../../model/admin/SalonAvailability");
const Service = require("../../model/admin/Service");
const GalleryItem = require("../../model/admin/GalleryItem");
const Appointment = require("../../model/appointment/Appointment");
const Review = require("../../model/review/Review");
const { deleteFromCloudinary } = require("../../cloudinary/cloudinaryUtils");

// All routes require super admin
router.use(auth);
router.use(isAdmin);
router.use(isSuperAdmin);

// @route   GET /api/admin/technicians
// @desc    List all technicians (super admin only)
// @access  Private/SuperAdmin
router.get("/", async (req, res) => {
  const technicians = await SalonProfile.find()
    .select("-password")
    .lean();
  res.json(technicians);
});

// @route   POST /api/admin/technicians
// @desc    Create a new technician (username, name, email, password)
// @access  Private/SuperAdmin
router.post(
  "/",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, name, email } = req.body;

    const existingUsername = await SalonProfile.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await SalonProfile.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const technician = new SalonProfile({
      username,
      password: hashedPassword,
      name,
      email,
      role: "admin",
    });
    await technician.save();

    const profile = await SalonProfile.findById(technician._id).select("-password");
    res.status(201).json(profile);
  }
);

// @route   PUT /api/admin/technicians/:id/super-admin
// @desc    Transfer super admin role to another technician (current user is downgraded, frontend should log out)
// @access  Private/SuperAdmin
router.put(
  "/:id/super-admin",
  param("id").isMongoId().withMessage("Invalid technician id"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const targetId = req.params.id;
    if (targetId === req.user.id) {
      return res.status(400).json({ message: "Cannot transfer super admin to yourself" });
    }

    const targetTechnician = await SalonProfile.findById(targetId);
    if (!targetTechnician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    await SalonProfile.findByIdAndUpdate(req.user.id, { role: "admin" });
    await SalonProfile.findByIdAndUpdate(targetId, { role: "superadmin" });

    res.json({
      message: "Super admin role transferred. Please log in again.",
      transferredTo: { id: targetTechnician._id, name: targetTechnician.name },
    });
  }
);

// @route   DELETE /api/admin/technicians/:id
// @desc    Delete a technician and cascade (profile, availability, services, gallery, appointments, reviews, Cloudinary images). Cannot delete self.
// @access  Private/SuperAdmin
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid technician id"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const adminId = req.params.id;
    if (adminId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own profile" });
    }

    const profile = await SalonProfile.findById(adminId);
    if (!profile) {
      return res.status(404).json({ message: "Technician not found" });
    }

    const galleryItems = await GalleryItem.find({ adminId });
    for (const item of galleryItems) {
      if (item.image && item.image.publicId) {
        try {
          await deleteFromCloudinary(item.image.publicId);
        } catch (e) {
          console.error("Cloudinary delete gallery:", e.message);
        }
      }
    }
    await GalleryItem.deleteMany({ adminId });

    const reviews = await Review.find({ adminId });
    for (const r of reviews) {
      if (r.image && r.image.publicId) {
        try {
          await deleteFromCloudinary(r.image.publicId);
        } catch (e) {
          console.error("Cloudinary delete review image:", e.message);
        }
      }
    }
    await Review.deleteMany({ adminId });
    await Appointment.deleteMany({ adminId });
    await Service.deleteMany({ adminId });
    await SalonAvailability.deleteMany({ adminId });

    if (profile.profileImage && profile.profileImage.publicId) {
      try {
        await deleteFromCloudinary(profile.profileImage.publicId);
      } catch (e) {
        console.error("Cloudinary delete profile image:", e.message);
      }
    }
    await SalonProfile.findByIdAndDelete(adminId);

    res.json({ message: "Technician and all associated data deleted" });
  }
);

module.exports = router;
