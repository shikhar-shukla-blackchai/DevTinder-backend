const validator = require("validator");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 40,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      require: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address is wrong " + value);
        }
      },
    },
    password: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password  is week, change it");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported",
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZwFQlGVN6PKDwi5_rGrArjUWFH3XnGcQWsQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo url is not working URL " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default About section provided by the Backend",
    },
    skills: {
      type: [String],
      validate: {
        validator(arr) {
          if (arr.length >= 5) {
            throw new Error("there are to many skills");
          }
        },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
