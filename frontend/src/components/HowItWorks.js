import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Search',
      description: 'Browse thousands of items available for rent in your area. Filter by category, price, and location.',
      icon: '/icons/search.png',
    },
    {
      number: 2,
      title: 'Rent',
      description: 'Book the item for your desired dates. Connect with the owner and arrange pickup or delivery.',
      icon: '/icons/rent.png',
    },
    {
      number: 3,
      title: 'Return',
      description: 'Use the item and return it when done. Rate your experience and help build our trusted community.',
      icon: '/icons/return.png',
    },
  ];

  const createStepCard = (step, index, totalSteps) => {
    return React.createElement(
      'div',
      { key: step.number, className: 'relative flex flex-col items-center' },
      
      // Connecting Line (between icons)
      index < totalSteps - 1 && React.createElement('div', {
        className: 'hidden md:block absolute h-0.5',
        style: { 
          width: '100%',
          top: '60px',
          left: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 0
        }
      }),
      
      // Icon Image (includes white box and badge)
      React.createElement(
        'div',
        { className: 'relative z-10 mb-4' },
        React.createElement('img', {
          src: step.icon,
          alt: step.title,
          className: 'w-32 h-32 object-contain'
        })
      ),
      
      // Title (BELOW the icon) - Decreased by 2
      React.createElement('h3', { 
        className: 'text-xl font-inter font-semibold text-center mb-2 text-white'
      }, step.title),
      
      // Description (BELOW the title) - Decreased by 2
      React.createElement('p', { 
        className: 'text-base font-inter text-center max-w-sm',
        style: { 
          color: '#E9D5FF',
          lineHeight: '1.5'
        }
      }, step.description)
    );
  };

  return React.createElement(
    'section',
    {
      className: 'py-20 px-6 md:px-16 lg:px-24 relative',
      style: {
        backgroundImage: 'url(/bg/howitworks_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#7A1CA9'
      }
    },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto relative z-10' },
      
      // Header
      React.createElement(
        'div',
        { className: 'text-center mb-16' },
        React.createElement('h2', { 
          className: 'text-4xl font-inter font-bold text-white mb-4' 
        }, 'How It Works'),
        React.createElement('p', { 
          className: 'text-base font-inter',
          style: { color: '#E9D5FF' }
        }, 'Renting on HiRENT is simple and secure. Get started in three easy steps.')
      ),
      
      // Steps Grid
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-12 relative' },
        ...steps.map((step, index) => createStepCard(step, index, steps.length))
      )
    )
  );
};

export default HowItWorks;
