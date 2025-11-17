import React, { useState, useContext, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import hirentLogo from "../assets/hirent-logo.png";
import LogoutButton from "../components/LogoutButton";
import { getFakeUser } from "../utils/fakeAuth";

const Navbar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState("");
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleSearch = () => {
    if (onSearch) onSearch(inputValue.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "About Us", path: "/about" },
  ];

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const user = getFakeUser();
    if (user && user.cart) {
      setCartCount(user.cart.length);
    } else {
      setCartCount(0);
    }
  }, []);

  return (
    <>
      <nav
        className="px-6 md:px-16 lg:px-24 fixed top-0 left-0 w-full z-50 shadow-sm"
        style={{ backgroundColor: "#7A1CA9", height: "55px" }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto h-full">

          {/* Logo */}
          <div className="flex items-center h-full">
            <img src={hirentLogo} alt="HiRENT" className="h-7" />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center h-full font-inter text-[13px]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`px-5 flex items-center h-full transition-colors ${isActive
                    ? "bg-[#59087f] text-white border-b-[4px] border-white"
                    : "text-white hover:bg-[#680e91]"
                    }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center h-full space-x-4">
            {isLoggedIn ? (
              <>
                {/* Search Bar */}
                <div className="flex items-center bg-white rounded-full px-4 py-1.5 text-gray-700 w-72">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (onSearch) onSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 outline-none text-[13px] bg-transparent placeholder-gray-400"
                  />
                  <Search
                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition"
                    onClick={handleSearch}
                  />
                </div>

                {/* Icons */}
                <div className="flex items-stretch space-x-1 h-full">
                  {[
                    { icon: <Heart className="w-5 h-5" />, path: "/wishlist" },
                    {
                      icon: (
                        <div className="relative">
                          <ShoppingCart className="w-5 h-5" />
                          {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                              {cartCount}
                            </span>
                          )}
                        </div>
                      ),
                      path: "/cart",
                    },
                    { icon: <User className="w-5 h-5" />, path: "/profile" },
                  ].map(({ icon, path }) => {
                    const isActive = location.pathname === path;
                    return (
                      <NavLink
                        key={path}
                        to={path}
                        className={`flex items-center justify-center h-full w-[40px] transition-colors ${isActive
                            ? "bg-[#59087f] text-white border-b-[4px] border-white"
                            : "text-white hover:bg-[#680e91]"
                          }`}
                        style={{ margin: 0, paddingTop: 0, paddingBottom: 0 }}
                      >
                        {icon}
                      </NavLink>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <LogoutButton />
              </>
            ) : (
              // main nav for guests (login/signup)
              <>
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-white hover:bg-[#680e91] rounded transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-4 py-2 text-white hover:bg-[#680e91] rounded transition"
                >
                  Signup
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
