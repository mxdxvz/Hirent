import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import hirentLogo from "../assets/hirent-logo.png";

const MainNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <>
      <nav
        className="px-6 md:px-16 lg:px-24 fixed top-0 left-0 w-full z-50 shadow-sm"
        style={{ backgroundColor: "#7A1CA9", height: "55px" }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto h-full">

          {/* Logo */}
          <div className="flex items-center h-full cursor-pointer" onClick={() => navigate("/")}>
            <img src={hirentLogo} alt="HiRENT" className="h-7" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-stretch h-full font-inter text-[13px]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-center px-5 h-full transition-colors ${isActive
                      ? "bg-[#59087f] text-white border-b-[4px] border-white"
                      : "text-white hover:bg-[#680e91]"
                    }`}
                  style={{
                    margin: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  {link.name}
                </NavLink>
              );
            })}

            {/* “Be an Owner” */}
            <NavLink
              to="/seller"
              className="flex items-center justify-center px-5 h-full transition-colors"
              style={{ color: "#FFFB83" }}
            >
              <span className="underline underline-offset-2 hover:decoration-yellow-400 hover:text-yellow-300 transition-all">Be an Owner</span>
            </NavLink>
          </div>

          {/* Buttons (Login / Register) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="w-20 h-8 bg-white/5 border border-white/70 text-white rounded-md font-inter font-semibold hover:bg-white/20 transition text-[13px]"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-24 h-8 bg-white rounded-md font-inter font-semibold hover:bg-gray-100 transition text-[13px]"
              style={{ color: "#743593" }}
            >
              Register
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNav;
