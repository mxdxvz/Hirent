import React, { useState, useRef, useEffect } from "react";
import "../../assets/Onboarding.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Onboarding2 = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("myself");
  const [step, setStep] = useState(2);

  const handleNext = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate("/onboarding3");
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <motion.div
      className="flex flex-col relative onboarding-content-wrapper"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="flex flex-col relative onboarding-content-wrapper">

        {/* Main Content */}
        <div className="onboarding-inner flex flex-col items-center justify-center px-6 relative z-10">
          <div className="onboarding-content">

            {/* Heading */}
            <h2 className="text-[28px] font-bold text-gray-900 mt-6 mb-2 text-center whitespace-nowrap max-w-none">
              How are you planning to use Hirent?
            </h2>
            <p className="text-[15px] text-gray-600 mb-8 text-center whitespace-nowrap max-w-none">
              We’ll customize your setup to fit your rental needs.
            </p>

            {/* Options */}
            <div className="option-container mb-8">
              <div
                className={`option-card ${selectedOption === "myself" ? "selected" : ""
                  }`}
                onClick={() => setSelectedOption("myself")}
              >
                <div className="icon mb-3">👤</div>
                <h3 className="font-semibold text-gray-900 mb-1">As Renter</h3>
                <p className="text-sm text-gray-600 text-center">
                  Browse, compare, and book from trusted owners.
                </p>
              </div>

              <div
                className={`option-card ${selectedOption === "team" ? "selected" : ""
                  }`}
                onClick={() => setSelectedOption("team")}
              >
                <div className="icon mb-3">👤</div>
                <h3 className="font-semibold text-gray-900 mb-1">As Owner</h3>
                <p className="text-sm text-gray-600 text-center">
                  List, manage, and earn from what you already own.
                </p>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              onClick={handleNext}
              className="relative w-[90%] mx-auto bg-[#7A1CA9] text-white py-3.5 text-[15px] font-medium rounded-md overflow-hidden group transition-all duration-300 mt-2 hover:bg-[#65188a]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-600 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
              <span className="absolute inset-0 bg-white opacity-20 rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] blur-sm transition-transform duration-700 ease-in-out"></span>
              <span className="relative z-10">Next</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Onboarding2;
