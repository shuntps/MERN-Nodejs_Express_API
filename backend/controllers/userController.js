const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
   });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
   const { name, email, password } = req.body;

   // Validation
   if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
   }
   if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
   }
   /*    if (password.length > 23) {
      res.status(400);
      throw new Error("Password must not be more than 23 characters");
   } */

   // Check if the email already exists
   const userExists = await User.findOne({ email });
   if (userExists) {
      res.status(400);
      throw new Error("Email has already been registered");
   }

   // Create a new user
   const user = await User.create({
      name,
      email,
      password,
   });

   // Generate token
   const token = generateToken(user._id);

   // Send HTTP-only cookie
   res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
   });

   if (user) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(201).json({
         _id,
         name,
         email,
         photo,
         phone,
         bio,
         token,
      });
   } else {
      res.status(400);
      throw new Error("Invalid user data");
   }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;

   // Validation
   if (!email || !password) {
      res.status(400);
      throw new Error("Please fill all required fields");
   }

   // Check if user exists
   const user = await User.findOne({ email });

   if (!user) {
      res.status(400);
      throw new Error("User not found, please sign up");
   }

   // User exists, check if password is correct
   const passwordIsCorrect = await bcrypt.compare(password, user.password);

   // Generate token
   const token = generateToken(user._id);

   // Send HTTP-only cookie
   res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
      sameSite: "none",
      secure: true,
   });

   if (user && passwordIsCorrect) {
      const { _id, name, email, photo, phone, bio } = user;
      res.status(200).json({
         _id,
         name,
         email,
         photo,
         phone,
         bio,
         token,
      });
   } else {
      res.status(400);
      throw new Error("Invalid email or password");
   }
});

module.exports = {
   registerUser,
   loginUser,
};
