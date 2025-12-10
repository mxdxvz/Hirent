import React, { useContext, useState } from "react";
import "../../assets/Auth.css";
import hirentLogo from "../../assets/hirent-logo-purple.png";
import bg from "../../assets/auth-bg.jpg";
import Footer from "../layouts/Footer";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthForm = ({ mode }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // SIMPLE NAME VALIDATION
  const validateName = (name) => {
    return name.trim().length >= 2; // At least 2 characters
  };

  // SIMPLE EMAIL VALIDATION
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NAME (signup only) ---
    if (mode === "signup" && !formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (mode === "signup" && !validateName(formData.name)) {
      setError("Name must be at least 2 characters.");
      return;
    }

    // --- EMAIL ---
    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Enter a valid email address.");
      return;
    }

    // --- PASSWORD ---
    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError("Password must include at least one number.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setError("Password must include at least one special character.");
      return;
    }

    // --- CLEAR ERRORS ---
    setError("");

    // CALL BACKEND API
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "signup" 
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || data.message || "Authentication failed");
        return;
      }

      if (data.token) {
        // Store token and user data
        const user = data.user || { email: formData.email };
        login(data.token, user);
        
        // Redirect based on user role
        setTimeout(() => {
          if (user.role === 'owner') {
            navigate('/owner/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }, 300);
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Network error. Please try again.");
    }
  };

  // GOOGLE LOGIN HANDLER
  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint
    // For signup: uses standard /google route (creates renter by default)
    // For login: uses standard /google route (logs in existing user)
    window.location.href = 'http://localhost:5000/api/auth/google';
  };


  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* AUTH CARD */}
        <div
          className={`z-10 cursor-default bg-white ${
            mode === "signup" ? "w-[480px] h-[650px]" : "w-[450px] h-[550px]"
          } rounded-2xl shadow-2xl flex flex-row overflow-hidden hover:shadow-3xl hover:scale-[1.01] transition-all duration-300`}
        >
          {/* FORM AREA */}
          <div className="flex flex-col justify-center items-center w-full p-5">
            <div className="flex flex-col items-start justify-start ml-12 w-full">
              <img src={hirentLogo} alt="Hirent Logo" className="w-24 h-auto mb-6" />
            </div>

            <div className="w-full flex flex-col items-start ml-12">
              {mode === "signup" && (
                <Link
                  to="/ownersignup"
                  className="text-[13px] font-medium text-[#7a19aa] hover:underline mb-1"
                >
                  Be an Owner ➔
                </Link>
              )}

              {mode === "login" && (
                <Link
                  to="/ownerlogin"
                  className="text-[13px] font-medium text-[#7a19aa] hover:underline mb-1"
                >
                  Log In as Owner ➔
                </Link>
              )}

              <h2 className="text-[23px] font-bold text-gray-900">
                {mode === "signup" ? "Get started with Hirent" : "Log In"}
              </h2>

              <p className="text-[14.5px] font-medium text-gray-600 mb-4">
                {mode === "signup" ? "Sign up now and explore the platform" : "Continue to Hirent"}
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-2 w-[90%]" onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="relative w-full mx-auto rounded-b-md overflow-hidden">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder=" "
                    className="block rounded-t-lg px-2 pb-2 pt-4 w-full text-[14px]  text-gray-900  bg-[#f9f9f9] border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-[14px] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] left-2
                    peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
                    peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                  >
                    Full Name
                  </label>
                </div>
              )}

              <div className="relative w-full mx-auto rounded-b-md overflow-hidden">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder=" "
                  className="block rounded-t-lg px-2 pb-2 pt-4 w-full text-[14px]   text-gray-900  bg-[#f9f9f9]  border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                />
                <label
                  htmlFor="email"
                  className="absolute text-[14px] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] left-2
                    peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
                    peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                >
                  Email
                </label>
              </div>

              <div className="relative w-full mx-auto rounded-b-md overflow-hidden">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder=" "
                  autoComplete="current-password"
                  className="block rounded-t-lg px-2 pb-2 pt-4 w-full text-[14px]   text-gray-900  bg-[#f9f9f9]  border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                />

                <label
                  htmlFor="password"
                  className="absolute text-[14px] duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] left-2
                    peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
                    peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                >
                  Password
                </label>

                {/* Eye toggle */}
                {formData.password.length > 0 && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#7A1CA9]"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </span>
                )}
              </div>
              {/* ERROR MESSAGE */}
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full border bg-[#7A1CA9] text-white py-3 text-[14px] font-medium rounded-md hover:bg-[#65188a] transition-all"
              >
                Continue with email
              </button>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full border border-gray-400 flex items-center justify-center gap-2 py-3 text-[14px] rounded-md text-gray-700 hover:text-[#9935cb] hover:border-[#9935cb] transition-all"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                {mode === "signup" ? "Sign up" : "Sign in"} with Google
              </button>
            </form>

            {/* SWITCH LOGIN / SIGNUP */}
            <p className="text-[12.5px] text-gray-600 text-center mt-5 mb-8">
              {mode === "signup" ? "Already have an account?" : "Don’t have an account?"}{" "}
              <Link
                to={mode === "signup" ? "/login" : "/signup"}
                className="text-[#862bb3] hover:underline font-medium"
              >
                {mode === "signup" ? "Login ➔" : "Signup ➔"}
              </Link>
            </p>

            {/* FOOTNOTE */}
            {mode === "signup" && (
              <div className="w-full flex flex-col items-start ml-12">
                <p className="text-[12px] text-gray-600 mb-3">
                  By proceeding, you agree to the{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">Terms and Conditions</span>{" "}
                  and
                  <br />
                  <span className="text-blue-600 cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>
            )}

            {/* BOTTOM LINKS */}
            <div
              className={`w-full flex gap-3 text-[12px] text-gray-500 mt-4 ${
                mode === "login" ? "justify-center" : "justify-start ml-12"
              }`}
            >
              <span className="hover:underline cursor-pointer">Help</span>
              <span className="hover:underline cursor-pointer">Privacy</span>
              <span className="hover:underline cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthForm;
