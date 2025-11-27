const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware"); 

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

module.exports = router;
