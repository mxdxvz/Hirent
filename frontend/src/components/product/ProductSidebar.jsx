import React, { useState } from 'react';
import { Home, ShoppingCart, Gift, Heart, User, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ProductSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, link: '/', label: 'Home' },
    { icon: ShoppingCart, link: '/my-rentals', label: 'My Rentals' },
    { icon: Gift, link: '/my-cart', label: 'My Cart' },
    { icon: Heart, link: '/wishlist', label: 'Wishlist' },
    { icon: User, link: '/profile', label: 'Profile' },
    { icon: Settings, link: '/settings', label: 'Settings' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/product');
    }
    return location.pathname === path;
  };

  return (
    <div 
      className={`bg-white border-r border-gray-200 flex flex-col fixed left-0 top-[25px] h-[calc(100vh-25px)] transition-all duration-300 z-40 ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Top Menu Items */}
      <div className="flex flex-col pt-20 flex-1 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const active = isActive(item.link);
          return (
            <Link
              key={index}
              to={item.link}
              className={`relative flex items-center gap-4 px-4 py-3.5 transition-all ${
                active 
                  ? 'bg-gray-100 text-purple-600 border-l-4 border-l-purple-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout Button at Bottom */}
      <div className="border-t border-gray-200">
        <button 
          className="flex items-center gap-4 px-4 py-3.5 text-gray-700 hover:bg-gray-50 transition-all w-full"
          onClick={() => {
            // Handle logout logic
            console.log('Logout clicked');
          }}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && (
            <span className="text-sm font-medium whitespace-nowrap">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductSidebar;
