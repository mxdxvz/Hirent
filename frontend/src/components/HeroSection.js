import React from 'react';

const HeroSection = () => {
  return React.createElement(
    'section',
    {
      className: 'relative px-6 md:px-16 lg:px-24 py-16 md:py-24',
      style: {
        backgroundImage: 'url(/bg/landingBg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#C084FC'
      }
    },
    // Gradient overlay
    React.createElement('div', {
      className: 'absolute inset-0',
      style: {
        background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.5) 0%, rgba(240, 171, 252, 0.4) 50%, rgba(221, 214, 254, 0.5) 100%)'
      }
    }),
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto relative z-10' },
      React.createElement(
        'div',
        { className: 'max-w-3xl' },
        
        // Main Heading
        React.createElement(
          'h1',
          { className: 'text-4xl md:text-5xl font-inter font-bold text-black mb-4 leading-tight' },
          'Rent What You Need.',
          React.createElement('br'),
          'Earn From What You Don\'t.'
        ),
        
        // Subheading
        React.createElement(
          'p',
          { className: 'text-sm md:text-base font-inter text-black mb-6 leading-relaxed' },
          'Save money, reduce waste, and join the sharing economy with HiRENT.',
          React.createElement('br'),
          'Discover thousands of items available for rent near you.'
        ),
        
        // CTA Buttons - FIXED Learn More to be transparent
        React.createElement(
          'div',
          { className: 'flex flex-wrap gap-3 mb-12' },
          React.createElement(
            'button',
            { 
              className: 'px-6 py-2.5 text-white rounded-md font-inter font-semibold hover:opacity-90 transition shadow-md flex items-center gap-2 text-sm', 
              style: { backgroundColor: '#7A1CA9' } 
            },
            'Explore Rentals ',
            React.createElement('span', null, '→')
          ),
          React.createElement(
            'button',
            { 
              className: 'px-6 py-2.5 bg-transparent rounded-md font-inter font-semibold hover:bg-black hover:bg-opacity-5 transition text-sm', 
              style: { 
                border: '2px solid #000000',
                color: '#000000'
              } 
            },
            'Learn More'
          )
        ),
        
        // Stats Section
        React.createElement(
          'div',
          { className: 'flex flex-wrap gap-8 md:gap-12' },
          React.createElement(
            'div',
            null,
            React.createElement('h3', { 
              className: 'text-2xl md:text-3xl font-inter font-bold mb-1',
              style: { color: '#7A1CA9' }
            }, '10,000+'),
            React.createElement('p', { 
              className: 'text-xs md:text-sm font-inter font-medium',
              style: { color: '#1F2937' }
            }, 'Items Listed')
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { 
              className: 'text-2xl md:text-3xl font-inter font-bold mb-1',
              style: { color: '#7A1CA9' }
            }, '5,000+'),
            React.createElement('p', { 
              className: 'text-xs md:text-sm font-inter font-medium',
              style: { color: '#1F2937' }
            }, 'Active Users')
          ),
          React.createElement(
            'div',
            null,
            React.createElement('h3', { 
              className: 'text-2xl md:text-3xl font-inter font-bold mb-1',
              style: { color: '#7A1CA9' }
            }, '99%'),
            React.createElement('p', { 
              className: 'text-xs md:text-sm font-inter font-medium',
              style: { color: '#1F2937' }
            }, 'Satisfaction')
          )
        )
      )
    )
  );
};

export default HeroSection;
