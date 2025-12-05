const express = require("express");
const router = express.Router();
const { getMe, updateMe, changePassword } = require("../controllers/userController");
const { requireAuth } = require("../middleware/authMiddleware"); 

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.post("/change-password", requireAuth, changePassword);

module.exports = router;
