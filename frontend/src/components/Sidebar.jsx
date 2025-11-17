import React, { useState } from 'react';
import { Menu, Home, ShoppingBag, CalendarPlus, MessageCircle, User, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const sidebarItems = [
        { icon: Home, link: '/', label: 'Home' },
        { icon: ShoppingBag, link: '/my-rentals', label: 'My Rentals' },
        { icon: CalendarPlus, link: '/booking', label: 'Booking' },
        { icon: MessageCircle, link: '/chat', label: 'Chat' },
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
            className={`bg-white border-r border-gray-200 flex flex-col
              sticky top-0 min-h-screen
 transition-all duration-300 z-10 ${isExpanded ? 'w-60' : 'w-16'
                }`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Top Menu Items */}
            <div className="flex flex-col pt-3 flex-1 overflow-y-auto">

                <div className="px-5 py-2 mb-1 flex items-center">
                    <Menu className="w-5 h-5 text-gray-500" />
                </div>

                {sidebarItems.map((item, index) => {
                    const active = isActive(item.link);
                    return (
                        <Link
                            key={index}
                            to={item.link}
                            className={`relative transition-all ${active
                                ? 'bg-gray-100 text-[#7A1CA9] border-l-4 border-l-[#7A1CA9]'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-4 px-5 py-2">
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {isExpanded && (
                                    <span className="text-[13px] font-medium whitespace-nowrap">
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        </Link>

                    );
                })}
            </div>

            {/* Logout Button */}
            <div className="border-t border-gray-200">
                <button
                    className="flex items-center gap-4 px-5 py-3 text-gray-700 hover:bg-gray-50 transition-all w-full"
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

export default Sidebar;