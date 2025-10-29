import React, { useState } from "react";
import "../../assets/Auth.css";
import hirentLogo from "../../assets/hirent-logo.png";
import bg from "../../assets/auth-bg.gif";
import Footer from "../../components/Footer";
import { Link, useNavigate } from "react-router-dom";


const AuthForm = ({ mode }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const validateName = (name) => {
        const words = name.trim().split(" ").filter((w) => w.length > 1);
        return words.length >= 2;
    };

    const validateEmail = (email) => {
        // simple regex for email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // required fields
        if (mode === "signup" && !formData.name) {
            setError("Name is required.");
            return;
        }
        if (!formData.email || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        // name validation
        if (mode === "signup") {
            if (!formData.name) {
                setError("Full name is required.");
                return;
            }
            if (!validateName(formData.name)) {
                setError("Enter your first and last name (min 2 characters each).");
                return;
            }
        }

        // email validation
        if (!formData.email) {
            setError("Email is required.");
            return;
        }
        if (!validateEmail(formData.email)) {
            setError("Enter a valid email address.");
            return;
        }

        // password validation
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

        // TODO: add error handling for email and password correctness later

        setError("");

        // TODO: Integrate with backend Axios request here
        if (mode === "signup") {
            console.log("Signup data:", formData);
            navigate("/onboarding1");
        } else {
            console.log("Login data:", formData);
            navigate("/homepage"); // redirect to homepage after login
        }
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
                <div className="absolute top-6 left-6">
                    <img src={hirentLogo} alt="Hirent Logo" className="w-24 h-auto mb-3" />
                </div>

                <div
                    className={`z-10 bg-white w-100 md:w-[350px] lg:w-[400px] rounded-lg shadow-lg p-10 flex flex-col justify-center hover:shadow-2xl hover:scale-105 transition-all duration-300 ${mode === "signup" ? "h-[520px]" : "h-[460px]"
                        }`}
                >

                    <h2 className="text-[24px] font-bold text-gray-900 mb-1 text-center">
                        {mode === "signup" ? "Create an account" : "Log In to Hirent"}
                    </h2>
                    <p className="text-[15px] text-gray-600 mb-5 text-center">
                        {mode === "signup" ? "Enter your details below" : "Enter your login details"}
                    </p>

                    <form className="space-y-1" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <div className="relative w-[95%] mx-auto rounded-b-md overflow-hidden">
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder=" "
                                    className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-[15px] text-gray-900 bg-white border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                                />
                                <label
                                    htmlFor="name"
                                    className="absolute text-sm duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-1
                  peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
                  peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                                >
                                    Full Name
                                </label>
                            </div>
                        )}

                        <div className="relative w-[95%] mx-auto rounded-b-md overflow-hidden">
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder=" "
                                className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-[15px] text-gray-900 bg-white border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-1
                  peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
                  peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                            >
                                Email
                            </label>
                        </div>

                        <div className="relative w-[95%] mx-auto rounded-b-md overflow-hidden">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder=" "
                                className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-[15px] text-gray-900 bg-white border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-[#bb84d6] peer"
                            />
                            <label
                                htmlFor="password"
                                className="absolute text-sm duration-300 transform -translate-y-3 scale-75 top-3 z-10 origin-[0] left-1
      peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500
      peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-[#bb84d6]"
                            >
                                Password
                            </label>

                            {formData.password.length > 0 && (
                                <input
                                    type="checkbox"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                            )}
                        </div>

                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <div className="flex flex-col gap-2 mt-5">
                            <button
                                type="submit"
                                className="relative w-[95%] mx-auto bg-[#7A1CA9] text-white py-2.5 text-[15px] font-medium rounded-md overflow-hidden group transition-all duration-300 mt-4"
                            >
                                <span className="relative z-10">{mode === "signup" ? "Create Account" : "Log In"}</span>
                            </button>


                            <button
                                type="button"
                                className="w-[95%] mx-auto border border-gray-400 flex items-center justify-center gap-2 py-2.5 text-[15px] rounded-md text-gray-700 hover:text-[#9935cb] hover:border-[#9935cb] hover:bg-gray-10 transition-all"
                            >
                                <img
                                    src="https://www.svgrepo.com/show/355037/google.svg"
                                    alt="Google"
                                    className="w-5 h-5"
                                />
                                {mode === "signup" ? "Sign up" : "Sign in"} with Google
                            </button>
                        </div>
                    </form>

                    <p className="text-[15px] text-gray-600 text-center mt-6">
                        {mode === "signup" ? "Already have an account?" : "Don’t have an account?"}{" "}
                        <Link to={mode === "signup" ? "/login" : "/signup"} className="text-[#862bb3] hover:underline font-medium">
                            {mode === "signup" ? "Login" : "Signup"}
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AuthForm;
