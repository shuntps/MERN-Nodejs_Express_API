const express = require("express");
const router = express.Router();

const {
   registerUser,
   loginUser,
   logout,
   getUser,
   loginStatus,
   updateUser,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

// Unprotected routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/loggedin", loginStatus);

// Protected routes
router.get("/getUser", protect, getUser);
router.patch("/updateuser", protect, updateUser);

module.exports = router;
