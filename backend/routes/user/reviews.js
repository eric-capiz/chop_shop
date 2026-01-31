const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const upload = require("../../cloudinary/CloudinaryMiddleware");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../cloudinary/cloudinaryUtils");
const mongoose = require("mongoose");

const Review = require("../../model/review/Review");
const Appointment = require("../../model/appointment/Appointment");

// @route   GET /api/user/reviews/my-reviews
// @desc    Get logged-in user's reviews
// @access  Private
router.get("/my-reviews", auth, async (req, res) => {
  try {
    const reviews = await Review.find({
      isActive: true,
      userId: req.user.id,
    })
      .populate("userId", "name")
      .populate("adminId", "name")
      .populate({
        path: "appointmentId",
        populate: {
          path: "serviceId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Apply auth middleware for protected routes
router.use(auth);

// @route   POST /api/user/reviews
// @desc    Create a review for a completed appointment
// @access  Private
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { appointmentId, rating, feedback } = req.body;

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        userId: req.user.id,
        status: "completed",
      }).session(session);

      if (!appointment) {
        await session.abortTransaction();
        return res.status(404).json({
          message: "Appointment not found or not eligible for review",
          details: { appointmentId, userId: req.user.id },
        });
      }

      const existingReview = await Review.findOne({ appointmentId }).session(
        session
      );
      if (existingReview) {
        await session.abortTransaction();
        return res.status(400).json({
          message: "Review already exists for this appointment",
          reviewId: existingReview._id,
        });
      }

      let image = {};
      if (req.file) {
        try {
          const result = await uploadToCloudinary(req.file, "reviews");
          image = {
            url: result.secure_url,
            publicId: result.public_id,
          };
        } catch (error) {
          await session.abortTransaction();
          console.error("Cloudinary upload error:", error);
          return res.status(400).json({
            message: "Failed to upload image",
            error: error.message,
          });
        }
      }

      const newReview = new Review({
        userId: req.user.id,
        adminId: appointment.adminId,
        appointmentId,
        rating: Number(rating),
        feedback,
        image,
        isActive: true,
      });

      const review = await newReview.save({ session });

      // Update the appointment with the review reference
      appointment.review = review._id;
      appointment.hasReview = true;
      await appointment.save({ session });

      // Populate the review data
      await review.populate([
        { path: "userId", select: "name" },
        { path: "appointmentId", select: "appointmentDate" },
      ]);

      // Commit the transaction
      await session.commitTransaction();
      res.json(review);
    } catch (error) {
      // If anything fails, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    console.error("Review creation error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PATCH /api/user/reviews/:id
// @desc    Update a review
// @access  Private
router.patch("/:id", upload.single("image"), async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Handle image update if new image is uploaded
    if (req.file) {
      try {
        // Delete old image if exists
        if (review.image && review.image.publicId) {
          await deleteFromCloudinary(review.image.publicId);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file, "reviews");
        review.image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      } catch (error) {
        return res.status(400).json({
          message: "Failed to update image",
          error: error.message,
        });
      }
    }

    if (rating) review.rating = rating;
    if (feedback) review.feedback = feedback;

    await review.save();
    await review.populate("userId", "name");
    await review.populate("appointmentId", "appointmentDate");

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/user/reviews/:id
// @desc    Delete a review (user: own review; barber: review on their profile)
// @access  Private
router.delete("/:id", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const review = await Review.findById(req.params.id).session(session);

    if (!review) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Review not found" });
    }

    const isOwnerUser = review.userId && review.userId.toString() === req.user.id;
    const isOwnerBarber =
      (req.user.role === "admin" || req.user.role === "superadmin") &&
      review.adminId.toString() === req.user.id;
    if (!isOwnerUser && !isOwnerBarber) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete image from Cloudinary if exists
    if (review.image && review.image.publicId) {
      try {
        await deleteFromCloudinary(review.image.publicId);
      } catch (error) {
        console.error("Failed to delete image from Cloudinary:", error);
      }
    }

    // Update the associated appointment
    const appointment = await Appointment.findById(
      review.appointmentId
    ).session(session);
    if (appointment) {
      appointment.review = null;
      appointment.hasReview = false;
      await appointment.save({ session });
    }

    // Delete the review
    await Review.findByIdAndDelete(review._id).session(session);

    await session.commitTransaction();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
