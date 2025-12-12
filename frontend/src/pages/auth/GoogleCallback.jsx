import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * GoogleCallback - Handles redirect from Google OAuth
 * Ensures existing users' roles are never overwritten
 * Redirects renter trying to sign up as owner to /login with error
 */
const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const processedRef = useRef(false);
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = () => {
      try {
        const token = searchParams.get("token");
        const userParam = searchParams.get("user");
        const error = searchParams.get("error");

        if (error) throw new Error(decodeURIComponent(error));
        if (!token) throw new Error("Missing authentication token");

        let userData = null;
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
          } catch (err) {
            console.error("Error parsing user data:", err);
          }
        }

        // Handle special case: renter trying to sign up as owner
        if (userData?.role === "renter" && userData?.isNewUser === false && searchParams.get("state") === "owner") {
          setMessage("Your account is registered as a renter. Redirecting to login...");
          setTimeout(() => {
            navigate("/login", {
              replace: true,
              state: { error: "You already have an account as a renter. Please login." },
            });
          }, 2000);
          return;
        }

        // Log user in
        login(token, userData);

        // Redirect after login
        setTimeout(() => {
          if (userData?.isNewUser) {
            // New users navigate based on role
            if (userData.role === "owner") {
              navigate("/ownersetup", {
                replace: true,
                state: { googleData: userData, message: "Complete your owner profile" },
              });
            } else {
              navigate("/signup", {
                replace: true,
                state: { googleData: userData, message: "Complete your profile" },
              });
            }
          } else {
            // Existing users: redirect strictly based on backend role
            if (userData.role === "owner") {
              if (!userData?.ownerSetupCompleted) {
                navigate("/ownersetup", { replace: true });
              } else {
                navigate("/owner/dashboard", { replace: true });
              }
            } else {
              // Renter (existing) - always go to home
              navigate("/", { replace: true });
            }
          }
        }, 100);
      } catch (err) {
        console.error("Google callback error:", err);
        setMessage(err.message);
        setTimeout(() => {
          navigate("/login", { replace: true, state: { error: err.message } });
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="text-center">
        <div className="mb-6">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-16 h-16 mx-auto animate-pulse"
          />
        </div>
        <p className="text-lg font-semibold text-gray-700 mb-4">{message}</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600"></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Please wait while we complete your authentication
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
