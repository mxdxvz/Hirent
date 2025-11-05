import React, { useState } from 'react';
import { Menu, X, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="text-white fixed top-0 left-0 w-full z-50 shadow-md" style={{ backgroundColor: '#7A1CA9' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="/assets/icons/hirent-white.png"  // Updated path based on your folder structure
              alt="HIRENT Logo"
              className="w-24 h-auto"  // Adjust the size of your logo as needed
            />
          </Link>

          {/* Desktop Menu - Adjusted to move left */}
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/4">
            <Link to="/" className="text-sm font-medium hover:text-white/80 transition">Home</Link>
            <Link to="/browse" className="text-sm font-medium hover:text-white/80 transition">Browse</Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-white/80 transition">How It Works</Link>
            <Link to="/about" className="text-sm font-medium hover:text-white/80 transition">About Us</Link>
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-6 flex-shrink-0">
            {/* Search Bar */}
            <div className="flex items-center bg-white rounded-full px-4 py-2.5 text-gray-700 w-72">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600 transition" />
            </div>

            {/* Icon Buttons */}
            <button className="hover:text-white/80 transition">
              <Heart className="w-5 h-5" />
            </button>
            <button className="hover:text-white/80 transition">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button className="hover:text-white/80 transition">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden ml-auto text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="lg:hidden px-6 py-4 space-y-3" style={{ backgroundColor: '#6B1595' }}>
            <Link to="/" className="block text-sm font-medium hover:text-white/80">Home</Link>
            <Link to="/browse" className="block text-sm font-medium hover:text-white/80">Browse</Link>
            <Link to="/how-it-works" className="block text-sm font-medium hover:text-white/80">How It Works</Link>
            <Link to="/about" className="block text-sm font-medium hover:text-white/80">About Us</Link>
            
            {/* Mobile Search */}
            <div className="flex items-center bg-white rounded-full px-4 py-2 text-gray-700 mt-4">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Mobile Icons */}
            <div className="flex items-center space-x-6 pt-3">
              <Heart className="w-5 h-5" />
              <ShoppingCart className="w-5 h-5" />
              <User className="w-5 h-5" />
            </div>
          </div>
        )}
      </nav>

      {/* PUSH CONTENT DOWN SO IT DOESN'T OVERLAP NAV */}
      <div className="pt-[72px]"></div>
    </>
  );
};

export default Navbar;
