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
    },
    password: {
      type: String,
      require: true,
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
    },
    about: {
      type: String,
      default: "This is default About section provided by the Backend",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
