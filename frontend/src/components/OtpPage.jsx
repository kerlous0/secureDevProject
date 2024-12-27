import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyOTP } from "../functions/verifyOTP";
import { useNavigate } from "react-router-dom";

const OtpPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = location.state || {};

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus on the next input
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handleSubmit = () => {
    console.log(otp.join(""));
    if (otp.join("").length !== 6) {
      alert("Please enter a valid OTP");
      return;
    }
    verifyOTP(token, otp.join(""))
      .then((response) => {
        localStorage.setItem("token", response.token);
        navigate("/home");
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-700">Enter OTP</h1>
      <p className="mt-2 text-gray-500">
        We have sent a 6-digit OTP to your phone.
      </p>

      <div className="flex justify-center mt-6 space-x-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 mt-6 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Submit OTP
      </button>
    </div>
  );
};

export default OtpPage;
