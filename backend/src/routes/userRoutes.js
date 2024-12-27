const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { authenticateToken } = require("../middleware/authenticateToken");
const router = express.Router();

const {
  generateOTP,
  sendOTP,
  storeOTP,
  verifyOTP,
} = require("../services/userServices"); // Modularized functions

// User login route
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // Check if the email exists in the database
      const [results] = await req.db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Compare the provided password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        "27695e7a96e0b07ca2e350272e58c271b85904a23ae86dd35e56b66110350502", // Replace with your secret key
        { expiresIn: "1h" }
      );

      // Generate OTP
      const otp = generateOTP();
      await sendOTP(email, otp);
      await storeOTP(user.user_id, otp, req);

      // Send the token in the response
      res.status(200).json({ message: "OTP sent to your email", token });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// User registration route

router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Check if the email already exists in the database
      const [results] = await req.db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Insert the new user into the database
      const [insertResult] = await req.db.query(
        "INSERT INTO users (email, password, username) VALUES (?,?,?)",
        [email, hashedPassword, username]
      );

      // Generate a JWT token
      const token = jwt.sign(
        { userId: insertResult.insertId, username },
        "27695e7a96e0b07ca2e350272e58c271b85904a23ae86dd35e56b66110350502", // replace with your secret key
        { expiresIn: "30d" }
      );

      // Generate OTP
      const otp = generateOTP();
      await sendOTP(email, otp);
      await storeOTP(insertResult.insertId, otp, req);

      // Send the token in the response
      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Verify OTP route
router.post("/verify-otp", authenticateToken, async (req, res) => {
  const { otp } = req.body;
  const { userId, username } = req.user;

  const result = await verifyOTP(userId, otp, req);
  if (result.success) {
    const token = jwt.sign(
      { userId: userId, username },
      "27695e7a96e0b07ca2e350272e58c271b85904a23ae86dd35e56b66110350502", // replace with your secret key
      { expiresIn: "30d" }
    );

    res.status(200).json({ message: "OTP verified, login successful", token });
  } else {
    res.status(400).json({ message: result.message });
  }
});

module.exports = router;
