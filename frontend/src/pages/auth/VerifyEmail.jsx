import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logo.png";
import bg from "../../assets/auth-owner-bg.jpg";
import Footer from "../../components/layouts/Footer";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setError("No verification token provided");
          return;
        }

        console.log("[VerifyEmail] Verifying with token...");

        const response = await fetch("http://localhost:5000/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        console.log("[VerifyEmail] Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("[VerifyEmail] Response data:", data);

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");

          // Redirect to owner dashboard after 3 seconds
          setTimeout(() => {
            navigate("/owner/dashboard", { replace: true });
          }, 3000);
        } else {
          setStatus("error");
          setError(data.message || "Failed to verify email");
        }
      } catch (err) {
        console.error("[VerifyEmail] Error:", err);
        setStatus("error");
        setError(err.message || "An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-6 left-6">
          <img src={logo} alt="Hirent Logo" className="w-8 h-auto" />
        </div>

        <div className="relative z-10 bg-white w-100 md:w-[500px] rounded-lg shadow-lg p-10 flex flex-col items-center justify-center">
          {status === "verifying" && (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#7A1CA9] mb-6"></div>
              <h1 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
                Verifying Email
              </h1>
              <p className="text-gray-600 text-[15px] text-center">
                {message}
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircleIcon className="w-20 h-20 text-[#4CE976] mb-6" />
              <h1 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
                Email Verified!
              </h1>
              <p className="text-gray-600 text-[15px] text-center mb-6">
                {message}
              </p>
              <p className="text-gray-500 text-[13px] text-center">
                Redirecting to your dashboard...
              </p>
              <div className="mt-6 w-full">
                <button
                  onClick={() => navigate("/owner/dashboard", { replace: true })}
                  className="w-full bg-[#7A1CA9] text-white rounded-md py-2 hover:bg-purple-600 transition text-[15px] font-medium"
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <ExclamationCircleIcon className="w-20 h-20 text-red-500 mb-6" />
              <h1 className="text-[24px] font-bold text-gray-900 mb-2 text-center">
                Verification Failed
              </h1>
              <p className="text-red-600 text-[15px] text-center mb-6">
                {error}
              </p>
              <p className="text-gray-500 text-[13px] text-center mb-6">
                The verification link may be invalid or expired. Please request a new verification email.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate("/owner/profile", { replace: true })}
                  className="flex-1 bg-[#7A1CA9] text-white rounded-md py-2 hover:bg-purple-600 transition text-[15px] font-medium"
                >
                  Go to Profile
                </button>
                <button
                  onClick={() => navigate("/", { replace: true })}
                  className="flex-1 border border-gray-400 text-gray-700 rounded-md py-2 hover:bg-gray-100 transition text-[15px] font-medium"
                >
                  Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyEmail;
