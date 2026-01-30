const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../model/user/User");
const BarberProfile = require("../../model/admin/BarberProfile");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    // Check if username exists
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email exists
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      name,
      email,
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: "user",
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user or admin & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for admin first
    let admin = await BarberProfile.findOne({ username });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: admin.id,
          role: admin.role || "admin",
        },
      };

      const isSuperAdmin = admin.role === "superadmin";
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            isAdmin: true,
            isSuperAdmin,
            role: admin.role || "admin",
          });
        },
      );
    } else {
      // Check for user
      let user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
          role: "user",
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, isAdmin: false });
        },
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
