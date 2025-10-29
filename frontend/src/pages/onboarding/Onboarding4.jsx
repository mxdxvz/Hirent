import React, { useState, useRef, useEffect } from "react";
import "../../assets/Onboarding.css";
import arrow from "../../assets/white-arrow.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Onboarding = () => {
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState("myself");

    const handleNext = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            navigate("/onboarding2");
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

                {/* Main Onboarding Section */}
                <div className="onboarding-inner flex flex-col items-center justify-center px-6 relative z-10">
                    <div className="onboarding-content">

                        {/* Heading & Paragraph */}
                        <h3 className="text-[24px] text-gray-800 mt-16 text-center whitespace-nowrap max-w-none">
                            Welcome,
                        </h3>
                        <h2 className="text-[32px] font-bold text-gray-900 mb-16 text-center whitespace-nowrap max-w-none">
                            Genlou Bandin!
                        </h2>


                        {/* Next Button */}
                        <div className="flex justify-center w-[390px] mt-8 relative">

                            <button
                                type="submit"
                                onClick={handleNext}
                                className="relative w-[115%] max-w-[520px] bg-[#7A1CA9] text-white py-3.5 text-[15px] font-medium rounded-md overflow-hidden group transition-all duration-300"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-600 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
                                <span className="absolute inset-0 bg-white opacity-20 rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] blur-sm transition-transform duration-700 ease-in-out"></span>
                                <span className="relative z-10">Get Started</span>
                            </button>
                        </div>

                        {/* Arrow outside button/container */}
                        <img
                            src={arrow}
                            alt="Arrow"
                            className="absolute top-[calc(50%+30px)] left-[calc(50%+210px)] w-[150px] h-[150px] object-contain z-10"
                        />

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Onboarding;
