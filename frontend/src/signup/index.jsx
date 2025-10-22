import React from "react";
import "./index.css";
import bgImage from "../assets/bg-signup.jpg";

const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute top-6 left-6">
          <h1 className="text-white font-extrabold text-2xl">HIRENT.</h1>
        </div>

        <div className="z-10 bg-white w-80 md:w-96 lg:w-[500px] h-[550px] rounded-xl shadow-lg p-10 flex flex-col justify-center 
                hover:shadow-2xl hover:scale-105 transition-all duration-300">

          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create an account
          </h2>
          <p className="text-base text-gray-600 mb-10 text-center">
            Enter your details below
          </p>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Name"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-600 pb-2 text-base"
            />

            <input
              type="email"
              placeholder="Email or Phone Number"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-600 pb-2"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 focus:outline-none focus:border-purple-600 pb-2"
            />

            <div className="flex flex-col gap-3">
              <button type="submit" className="w-full bg-purple-800 text-white py-3 rounded-md hover:bg-purple-600 transition-all">
                Create Account
              </button>

              <button type="button" className="w-full border border-gray-400 flex items-center justify-center gap-2 py-3 rounded-md text-gray-700 hover:border-purple-600 hover:bg-gray-50 transition-all"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>
            </div>


          </form>

          <p className="text-sm text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <a href="#" className="text-purple-700 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      <footer className="bg-purple-800 text-white py-10 px-10 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">HIRENT</h3>
            <p className="text-sm text-gray-300 mb-3">
              Get 10% off your first order
            </p>
            <div className="flex border border-gray-400 rounded overflow-hidden w-52">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-2 py-1 text-gray-700 focus:outline-none"
              />
              <button className="bg-purple-600 px-3">➤</button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Support</h3>
            <p className="text-sm text-gray-300">
              Naga City, Camarines Sur, Philippines 4400
            </p>
            <p className="text-sm text-gray-300">info@hirent.com</p>
            <p className="text-sm text-gray-300">+88015-88888-9999</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Account</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>My Account</li>
              <li>Login / Register</li>
              <li>Cart</li>
              <li>Wishlist</li>
              <li>Shop</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Quick Link</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-gray-300 mt-8 border-t border-gray-400 pt-4">
          © Copyright Hirent 2025. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Signup;