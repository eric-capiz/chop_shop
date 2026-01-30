const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

router.use("/profile", require("./profile"));
router.use("/services", require("./services"));
router.use("/gallery", require("./gallery"));
router.use("/barbers", require("./barbers"));

router.use(auth);
router.use(isAdmin);
router.use("/availability", require("./availability"));

module.exports = router;
