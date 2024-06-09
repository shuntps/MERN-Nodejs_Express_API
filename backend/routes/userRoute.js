const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
   registerUser,
   loginUser,
   logout,
   getUser,
   loginStatus,
   updateUser,
   updatePassword,
} = require("../controllers/userController");

// Unprotected routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/loggedin", loginStatus);

// Protected routes
router.get("/getUser", protect, getUser);
router.patch("/updateuser", protect, updateUser);
router.patch("/updatepassword", protect, updatePassword);

module.exports = router;
