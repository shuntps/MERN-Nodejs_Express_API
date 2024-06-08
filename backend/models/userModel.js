const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please enter a name"],
      },
      email: {
         type: String,
         required: [true, "Please enter a valid email address"],
         unique: true,
         trim: true,
         match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email address",
         ],
      },
      password: {
         type: String,
         required: [true, "Please enter a password"],
         minlength: [6, "Password must be at least 6 characters"],
         // maxlength: [23, "Password must not be more than 23 characters"],
      },
      photo: {
         type: String,
         required: [true, "Please enter a photo"],
         default: "../images/users/default.png",
      },
      phone: {
         type: String,
         default: "phone number",
      },
      bio: {
         type: String,
         maxlength: [250, "Bio must not be more than 250 characters"],
         default: "bio",
      },
   },
   {
      timestamps: true,
   }
);

// Hash the password before saving to database
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      return next();
   }

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(this.password, salt);
   this.password = hashedPassword;
   next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
