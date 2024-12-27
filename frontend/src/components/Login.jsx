import { useState } from "react";
import { loginUser } from "../functions/login";
import { useNavigate } from "react-router-dom";

function Login() {
  const initial = {
    email: "",
    password: "",
  };
  const [loginForm, setLoginForm] = useState({ ...initial });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    const newErrors = { email: "", password: "" };

    if (!validateEmail(loginForm.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!validatePassword(loginForm.password)) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      loginUser(loginForm)
        .then((response) => {
          setLoginForm({ ...initial });
          setErrors({ ...initial });
          if (response.token) {
            navigate("/otp", {
              state: { token: response.token },
            });
          }
        })
        .catch((error) => {
          console.error("Error in login user:", error);
          setErrors(...initial);
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <div className="space-y-4">
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
              value={loginForm.email}
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
              value={loginForm.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
        <p className="text-sm text-center text-gray-600">
          Dont have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
