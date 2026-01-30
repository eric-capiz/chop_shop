const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const Service = require("../../model/admin/Service");

// All routes require barber auth (scoped to logged-in barber)
router.use(auth);
router.use(isAdmin);

// @route   GET /api/admin/services
// @desc    Get logged-in barber's services
// @access  Private/Admin
router.get("/", async (req, res) => {
  const services = await Service.find({ adminId: req.user.id });
  res.json(services);
});

// @route   POST /api/admin/services
// @desc    Create a service
// @access  Private/Admin
router.post("/", async (req, res) => {
  try {
    const { name, description, duration, price, category } = req.body;

    const newService = new Service({
      adminId: req.user.id,
      name,
      description,
      duration,
      price,
      category,
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/admin/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put("/:id", async (req, res) => {
  try {
    const { name, description, duration, price, category, isActive } = req.body;

    let service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Make sure admin owns service
    if (service.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.duration = duration || service.duration;
    service.price = price || service.price;
    service.category = category || service.category;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    await service.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/admin/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Make sure admin owns service
    if (service.adminId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Option 1: Use findByIdAndDelete
    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Service removed" });
  } catch (err) {
    console.error("Delete service error:", err.message); // Added more detailed logging
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
