const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const upload = require("../../cloudinary/CloudinaryMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../cloudinary/cloudinaryUtils");

const GalleryItem = require("../../model/admin/GalleryItem");

// All routes require barber auth (scoped to logged-in barber)
router.use(auth);
router.use(isAdmin);

// @route   GET /api/admin/gallery
// @desc    Get logged-in barber's gallery items
// @access  Private/Admin
router.get("/", async (req, res) => {
  const gallery = await GalleryItem.find({ adminId: req.user.id }).populate(
    "serviceType",
    "name"
  );
  res.json(gallery);
});

// @route   POST /api/admin/gallery
// @desc    Add gallery items (up to 5 images)
// @access  Private/Admin
router.post("/", upload.single("images"), async (req, res) => {
  try {
    const { description, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    try {
      const result = await uploadToCloudinary(req.file, "gallery");

      // Create new gallery item
      const newItem = new GalleryItem({
        adminId: req.user.id, // Changed from req.user._id to req.user.id
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
        description,
        tags: tags ? JSON.parse(tags) : [],
        isActive: true,
      });

      const savedItem = await newItem.save();
      await savedItem.populate("adminId", "name email");

      res.json(savedItem);
    } catch (error) {
      console.error("Inner error:", error);
      res.status(500).json({
        message: "Failed to save gallery item",
        error: error.message,
        stack: error.stack,
      });
    }
  } catch (err) {
    console.error("Outer error:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
});

// @route   PUT /api/admin/gallery/:id
// @desc    Update a gallery item
// @access  Private/Admin
router.put("/:id", upload.single("images"), async (req, res) => {
  try {
    const { description, tags } = req.body;
    const updateData = {
      description,
      tags: tags ? JSON.parse(tags) : [], // Make sure to parse the tags
    };

    if (req.file) {
      const result = await uploadToCloudinary(req.file, "gallery");
      updateData.image = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    if (item.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const updatedItem = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("adminId", "name email");

    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({
      message: "Failed to update gallery item",
      error: error.message,
    });
  }
});

// @route   DELETE /api/admin/gallery/:id
// @desc    Delete a gallery item
// @access  Private/Admin
router.delete("/:id", async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    if (galleryItem.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    try {
      // Delete from Cloudinary first
      if (galleryItem.image.publicId) {
        await deleteFromCloudinary(galleryItem.image.publicId);
      }
    } catch (error) {
      console.error("Cloudinary deletion failed:", error);
      // Continue with DB deletion even if Cloudinary fails
    }

    await galleryItem.deleteOne();
    res.json({ message: "Gallery item removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
