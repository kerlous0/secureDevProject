import { useState } from "react";
import { registerUser } from "../functions/register";
import { useNavigate } from "react-router-dom";

function Register() {
  const initial = {
    username: "",
    email: "",
    password: "",
    cpassword: "",
  };
  const [registerForm, setRegisterForm] = useState({ ...initial });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [message, setMessage] = useState({ message: "", color: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleRegister = () => {
    setMessage({ message: "", color: "" });
    const newErrors = { username: "", email: "", password: "", cpassword: "" };

    if (!registerForm.username || registerForm.username.trim().length <= 2) {
      newErrors.username =
        "Username is required and must be longer than 2 characters.";
    }

    if (!validateEmail(registerForm.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(registerForm.password)) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (registerForm.cpassword !== registerForm.password) {
      newErrors.cpassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (
      !newErrors.username &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.cpassword
    ) {
      registerUser(registerForm)
        .then((response) => {
          console.log(response);
          setMessage({ message: response.message, color: "green" });
          setRegisterForm({ ...initial });
          setErrors({ ...initial });
          if (response.token) {
            navigate("/otp", {
              state: { token: response.token },
            });
          }
        })
        .catch((error) => {
          console.error("Error registering user:", error);
          setMessage({ message: "registeration failed", color: "red" });
          setErrors(...initial);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Register
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your name"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={registerForm.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={registerForm.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={registerForm.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={registerForm.cpassword}
              onChange={handleChange}
            />
            {errors.cpassword && (
              <p className="mt-1 text-sm text-red-500">{errors.cpassword}</p>
            )}
          </div>
          <button
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={handleRegister}
          >
            Register
          </button>
        </div>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
        {message.message && (
          <div
            className={`mt-4 text-center text-m text-${message.color}-600 p-2 bg-${message.color}-100`}
          >
            {message.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
