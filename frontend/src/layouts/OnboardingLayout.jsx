import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Outlet, useLocation } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Footer from "../components/Footer";
import hirentLogoPurple from "../assets/hirent-logo-purple.png"; 

const OnboardingLayout = () => {
  const location = useLocation();
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (location.pathname.includes("onboarding1")) setStep(1);
    else if (location.pathname.includes("onboarding2")) setStep(2);
    else if (location.pathname.includes("onboarding3")) setStep(3);
    else if (location.pathname.includes("onboarding4")) setStep(4);
  }, [location]);

  return (
    <div className="onboarding-screen flex flex-col w-full">
      <div className="flex flex-col items-center justify-start w-full min-h-screen pt-16 pb-32 overflow-visible relative">

        <div className="mt-6 mb-6 flex justify-center">
          <img
            src={hirentLogoPurple}
            alt="Hirent Logo"
            className="w-26 md:w-32"
          />
        </div>

        <div className="pt-2 w-full">
          <ProgressBar step={step} />
        </div>

        <div className="flex flex-col items-center justify-center relative z-[9999] onboarding-content-wrapper w-full overflow-visible">

          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OnboardingLayout;
