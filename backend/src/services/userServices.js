const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kerlousnasser0@gmail.com",
    pass: "fxlo jmer atol jrmb",
  },
});

// Send OTP function
async function sendOTP(email, otp) {
  const mailOptions = {
    from: "kerlousnasser0@gmail.com",
    to: email,
    subject: "Your 2FA OTP Code",
    text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
}

async function storeOTP(userId, otp, req) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await req.db.execute(
    "INSERT INTO otp (user_id, otp_code, expires_at) VALUES (?, ?, ?)",
    [userId, otp, expiresAt]
  );
}

async function verifyOTP(userId, enteredOtp, req) {
  // console.log(req.db);

  const [rows] = await req.db.execute(
    "SELECT otp_code, expires_at, is_used FROM otp WHERE user_id = ? ORDER BY otp_id DESC LIMIT 1",
    [userId]
  );

  if (rows.length === 0) return { success: false, message: "OTP not found" };

  const { otp_code, expires_at, is_used } = rows[0];

  if (is_used) return { success: false, message: "OTP already used" };
  if (new Date() > new Date(expires_at))
    return { success: false, message: "OTP expired" };
  if (otp_code !== enteredOtp)
    return { success: false, message: "Invalid OTP" };

  // Mark OTP as used
  await req.db.execute(
    "UPDATE otp SET is_used = TRUE WHERE user_id = ? AND otp_code = ?",
    [userId, enteredOtp]
  );

  return { success: true, message: "OTP verified" };
}

module.exports = {
  generateOTP,
  sendOTP,
  storeOTP,
  verifyOTP,
};
