import React, { useState, useEffect } from "react";
import "../../assets/Auth.css";
import hirentLogo from "../../assets/hirent-logo.png";
import bg from "../../assets/auth-bg.gif";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [useForward, setUseForward] = useState(true);

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

        <div className="z-10 bg-white w-100 md:w-[350px] lg:w-[400px] h-[510px] rounded-lg shadow-lg p-10 flex flex-col justify-center hover:shadow-2xl hover:scale-105 transition-all duration-300">
          <h2 className="text-[24px] font-bold text-gray-900 mb-1 text-center">
            Log In to Hirent
          </h2>
          <p className="text-[15px] text-gray-600 mb-5 text-center">Enter your details below</p>
          <form className="space-y-2.5">
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
                type="password"
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
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <button
                type="submit"
                className="relative w-[95%] mx-auto bg-[#7A1CA9] text-white py-2.5 text-[15px] font-medium rounded-md overflow-hidden group transition-all duration-300 mt-2"
              >
                <span className="relative z-10">Log In</span>
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
                Sign in with Google
              </button>
            </div>
          </form>
          <p className="text-[15px] text-gray-600 text-center mt-6">
            Doesn’t have an account?{" "}
            <Link to="/" className="text-[#862bb3] hover:underline font-medium">
              Signup
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;