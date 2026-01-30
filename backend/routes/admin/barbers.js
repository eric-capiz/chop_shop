const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { body, param, validationResult } = require("express-validator");

const { auth, isAdmin, isSuperAdmin } = require("../../middleware");
const BarberProfile = require("../../model/admin/BarberProfile");
const BarberAvailability = require("../../model/admin/BarberAvailability");
const Service = require("../../model/admin/Service");
const GalleryItem = require("../../model/admin/GalleryItem");
const Appointment = require("../../model/appointment/Appointment");
const Review = require("../../model/review/Review");
const { deleteFromCloudinary } = require("../../cloudinary/cloudinaryUtils");

// All routes require super admin
router.use(auth);
router.use(isAdmin);
router.use(isSuperAdmin);

// @route   GET /api/admin/barbers
// @desc    List all barbers (super admin only)
// @access  Private/SuperAdmin
router.get("/", async (req, res) => {
  const barbers = await BarberProfile.find()
    .select("-password")
    .lean();
  res.json(barbers);
});

// @route   POST /api/admin/barbers
// @desc    Create a new barber (username, name, email, password)
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

    const existingUsername = await BarberProfile.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await BarberProfile.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const barber = new BarberProfile({
      username,
      password: hashedPassword,
      name,
      email,
      role: "admin",
    });
    await barber.save();

    const profile = await BarberProfile.findById(barber._id).select("-password");
    res.status(201).json(profile);
  }
);

// @route   PUT /api/admin/barbers/:id/super-admin
// @desc    Transfer super admin role to another barber (current user is downgraded, frontend should log out)
// @access  Private/SuperAdmin
router.put(
  "/:id/super-admin",
  param("id").isMongoId().withMessage("Invalid barber id"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const targetId = req.params.id;
    if (targetId === req.user.id) {
      return res.status(400).json({ message: "Cannot transfer super admin to yourself" });
    }

    const targetBarber = await BarberProfile.findById(targetId);
    if (!targetBarber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    await BarberProfile.findByIdAndUpdate(req.user.id, { role: "admin" });
    await BarberProfile.findByIdAndUpdate(targetId, { role: "superadmin" });

    res.json({
      message: "Super admin role transferred. Please log in again.",
      transferredTo: { id: targetBarber._id, name: targetBarber.name },
    });
  }
);

// @route   DELETE /api/admin/barbers/:id
// @desc    Delete a barber and cascade (profile, availability, services, gallery, appointments, reviews, Cloudinary images). Cannot delete self.
// @access  Private/SuperAdmin
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Invalid barber id"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const adminId = req.params.id;
    if (adminId === req.user.id) {
      return res.status(400).json({ message: "Cannot delete your own profile" });
    }

    const profile = await BarberProfile.findById(adminId);
    if (!profile) {
      return res.status(404).json({ message: "Barber not found" });
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
    await BarberAvailability.deleteMany({ adminId });

    if (profile.profileImage && profile.profileImage.publicId) {
      try {
        await deleteFromCloudinary(profile.profileImage.publicId);
      } catch (e) {
        console.error("Cloudinary delete profile image:", e.message);
      }
    }
    await BarberProfile.findByIdAndDelete(adminId);

    res.json({ message: "Barber and all associated data deleted" });
  }
);

module.exports = router;
