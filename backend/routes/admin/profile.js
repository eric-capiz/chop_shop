const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const upload = require("../../cloudinary/CloudinaryMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../cloudinary/cloudinaryUtils");
const bcrypt = require("bcryptjs");

const BarberProfile = require("../../model/admin/BarberProfile");

// All routes require barber auth (dashboard "my profile")
router.use(auth);
router.use(isAdmin);

// @route   GET /api/admin/profile
// @desc    Get logged-in barber's profile (dashboard)
// @access  Private/Admin
router.get("/", async (req, res) => {
  const profile = await BarberProfile.findById(req.user.id).select("-password");
  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }
  res.json(profile);
});

// @route   PUT /api/admin/profile
// @desc    Update barber profile
// @access  Private/Admin
router.put("/", async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      bio,
      specialties,
      yearsOfExperience,
      socialMedia,
      password,
    } = req.body;

    let profile = await BarberProfile.findById(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check unique fields
    if (username && username !== profile.username) {
      const existingUser = await BarberProfile.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    if (email && email !== profile.email) {
      const existingUser = await BarberProfile.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update fields
    if (name) profile.name = name;
    if (email) profile.email = email;
    if (username) profile.username = username;
    if (bio) profile.bio = bio;
    if (specialties) profile.specialties = specialties;
    if (yearsOfExperience) profile.yearsOfExperience = yearsOfExperience;
    if (socialMedia) profile.socialMedia = socialMedia;

    // Handle password update
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      profile.password = hashedPassword;
    }

    await profile.save();

    // Return updated profile without password
    const updatedProfile = await BarberProfile.findById(req.user.id).select(
      "-password"
    );
    res.json(updatedProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/profile/image
// @desc    Update profile image
// @access  Private/Admin
router.put("/image", upload.single("image"), async (req, res) => {
  try {
    let profile = await BarberProfile.findById(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    try {
      if (profile.profileImage.publicId) {
        await deleteFromCloudinary(profile.profileImage.publicId);
      }

      const result = await uploadToCloudinary(req.file, "profile");
      profile.profileImage = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      await profile.save();
      res.json(profile);
    } catch (error) {
      return res.status(400).json({
        message: "Failed to update profile image",
        error: error.message,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/profile/image
// @desc    Delete profile image
// @access  Private/Admin
router.delete("/image", async (req, res) => {
  try {
    let profile = await BarberProfile.findById(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!profile.profileImage.publicId) {
      return res.status(400).json({ message: "No profile image exists" });
    }

    try {
      await deleteFromCloudinary(profile.profileImage.publicId);

      profile.profileImage = {
        url: "",
        publicId: "",
      };

      await profile.save();
      res.json(profile);
    } catch (error) {
      return res.status(400).json({
        message: "Failed to delete profile image",
        error: error.message,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
