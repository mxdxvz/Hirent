import React from 'react';

const Footer = () => {
  const createFooterSection = (title, links) => {
    return React.createElement(
      'div',
      null,
      React.createElement('h4', { className: 'font-inter font-semibold mb-4' }, title),
      React.createElement(
        'ul',
        { className: 'space-y-2 text-sm font-inter text-purple-100' },
        ...links.map((link, index) =>
          React.createElement(
            'li',
            { key: index },
            React.createElement(
              'a',
              { href: '#', className: 'hover:text-white transition' },
              link
            )
          )
        )
      )
    );
  };

  return React.createElement(
    'footer',
    { className: 'bg-gradient-to-br from-purple-600 to-purple-900 text-white py-12 px-6 md:px-16 lg:px-24' },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto' },
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-4 gap-8 mb-8' },
        
        // Brand Section
        React.createElement(
          'div',
          null,
          React.createElement('h3', { className: 'text-xl font-inter font-bold mb-4' }, 'HIRENT'),
          React.createElement('p', { className: 'text-sm font-inter text-purple-100 mb-4' }, 'Subscribe'),
          React.createElement('p', { className: 'text-sm font-inter text-purple-100 mb-4' }, 'Get 10% off your first order'),
          React.createElement(
            'div',
            { className: 'flex' },
            React.createElement('input', {
              type: 'email',
              placeholder: 'Enter your email',
              className: 'flex-1 px-4 py-2 rounded-l-md text-gray-900 font-inter focus:outline-none'
            }),
            React.createElement(
              'button',
              { className: 'px-4 py-2 bg-white text-primary-purple rounded-r-md font-inter font-semibold hover:bg-gray-100 transition' },
              '→'
            )
          )
        ),
        
        // Support Section
        createFooterSection('Support', [
          'Help Center',
          'Our Community',
          'Insurance Policy',
          'Upload rented items'
        ]),
        
        // Account Section
        createFooterSection('Account', [
          'My Account',
          'Login / Register',
          'Cart',
          'Wishlist',
          'Shop'
        ]),
        
        // Quick Links & Download Section
        React.createElement(
          'div',
          null,
          React.createElement('h4', { className: 'font-inter font-semibold mb-4' }, 'Quick Link'),
          React.createElement(
            'ul',
            { className: 'space-y-2 text-sm font-inter text-purple-100 mb-6' },
            React.createElement('li', null, React.createElement('a', { href: '#', className: 'hover:text-white transition' }, 'Privacy Policy')),
            React.createElement('li', null, React.createElement('a', { href: '#', className: 'hover:text-white transition' }, 'Terms Of Use')),
            React.createElement('li', null, React.createElement('a', { href: '#', className: 'hover:text-white transition' }, 'FAQ')),
            React.createElement('li', null, React.createElement('a', { href: '#', className: 'hover:text-white transition' }, 'Contact'))
          ),
          React.createElement('h4', { className: 'font-inter font-semibold mb-4' }, 'Download App'),
          React.createElement(
            'div',
            { className: 'flex gap-2 mb-4' },
            React.createElement(
              'div',
              { className: 'w-20 h-20 bg-white rounded p-1' },
              React.createElement('div', { className: 'w-full h-full bg-gray-800 rounded flex items-center justify-center text-white text-xs font-bold' }, 'QR')
            ),
            React.createElement(
              'div',
              { className: 'flex flex-col gap-2' },
              React.createElement('div', { className: 'h-9 bg-black rounded px-3 flex items-center gap-2 text-white text-xs' },
                React.createElement('span', null, '▶'),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-[8px]' }, 'GET IT ON'),
                  React.createElement('div', { className: 'font-semibold text-xs' }, 'Google Play')
                )
              ),
              React.createElement('div', { className: 'h-9 bg-black rounded px-3 flex items-center gap-2 text-white text-xs' },
                React.createElement('span', null, ''),
                React.createElement('div', null,
                  React.createElement('div', { className: 'text-[8px]' }, 'Download on the'),
                  React.createElement('div', { className: 'font-semibold text-xs' }, 'App Store')
                )
              )
            )
          )
        )
      ),
      
      // Bottom Bar
      React.createElement(
        'div',
        { className: 'border-t border-purple-500 pt-6 text-center' },
        React.createElement(
          'p',
          { className: 'text-sm font-inter text-purple-200' },
          '© Copyright Hirent 2025. All right reserved'
        )
      )
    )
  );
};

export default Footer;
