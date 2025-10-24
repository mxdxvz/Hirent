import React from 'react';

const Navbar = () => {
  return React.createElement(
    'nav',
    { className: 'px-6 md:px-16 lg:px-24 py-4', style: { backgroundColor: '#7A1CA9' } },
    React.createElement(
      'div',
      { className: 'flex items-center justify-between max-w-7xl mx-auto' },
      
      // Logo - Made bigger
      React.createElement(
        'div',
        { className: 'flex items-center' },
        React.createElement('img', {
          src: '/hirent.png',
          alt: 'HiRENT',
          className: 'h-12'
        })
      ),
      
      // Navigation Links
      React.createElement(
        'div',
        { className: 'hidden md:flex items-center space-x-8 font-inter text-sm' },
        React.createElement('a', {
          href: '#home',
          className: 'text-white hover:text-gray-200 transition'
        }, 'Home'),
        React.createElement('a', {
          href: '#browse',
          className: 'text-white hover:text-gray-200 transition'
        }, 'Browse'),
        React.createElement('a', {
          href: '#how-it-works',
          className: 'text-white hover:text-gray-200 transition'
        }, 'How It Works'),
        React.createElement('a', {
          href: '#about',
          className: 'text-white hover:text-gray-200 transition'
        }, 'About Us'),
        React.createElement('a', {
          href: '#seller',
          className: 'hover:opacity-80 transition underline',
          style: { color: '#FFFB83' }
        }, 'Be A Seller')
      ),
      
      // Auth Buttons
      React.createElement(
        'div',
        { className: 'flex items-center space-x-3' },
        React.createElement(
          'button',
          { 
            className: 'px-6 py-2 bg-transparent border-2 border-white text-white rounded-md font-inter font-semibold hover:bg-white transition text-sm',
            onMouseEnter: (e) => e.currentTarget.style.color = '#7A1CA9',
            onMouseLeave: (e) => e.currentTarget.style.color = '#ffffff'
          },
          'Login'
        ),
        React.createElement(
          'button',
          { 
            className: 'px-6 py-2 bg-white rounded-md font-inter font-semibold hover:bg-gray-100 transition text-sm',
            style: { color: '#743593' }
          },
          'Register'
        )
      )
    )
  );
};

export default Navbar;
