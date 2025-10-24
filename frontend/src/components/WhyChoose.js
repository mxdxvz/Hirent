import React from 'react';

const WhyChoose = () => {
  const benefits = [
    {
      title: 'Save Money',
      description: 'Why buy when you can rent? Access what you need at a fraction of the cost. Perfect for one-time events or temporary needs.',
      icon: '/icons/savemoney.png',
    },
    {
      title: 'Earn Income',
      description: 'Turn your unused items into cash. List what you own and start earning passive income from items sitting idle in your home.',
      icon: '/icons/earnmoney.png',
    },
    {
      title: 'Support Sustainability',
      description: 'Reduce waste and your carbon footprint. By sharing resources, we create a more sustainable future for everyone.',
      icon: '/icons/supportsus.png',
    },
  ];

  const createBenefitCard = (benefit, index) => {
    return React.createElement(
      'div',
      { 
        key: index, 
        className: 'rounded-2xl p-10 text-white shadow-lg hover:shadow-xl transition-shadow', 
        style: { background: 'linear-gradient(135deg, #7A1CA9 0%, #5B21B6 100%)' } 
      },
      
      // Icon Image
      React.createElement(
        'div',
        { className: 'flex justify-center mb-6' },
        React.createElement('img', {
          src: benefit.icon,
          alt: benefit.title,
          className: 'w-20 h-20 object-contain'
        })
      ),
      
      // Title
      React.createElement('h3', { 
        className: 'text-2xl font-inter font-bold text-center mb-4' 
      }, benefit.title),
      
      // Description
      React.createElement('p', { 
        className: 'text-sm font-inter text-center leading-relaxed', 
        style: { color: '#E9D5FF' } 
      }, benefit.description)
    );
  };

  return React.createElement(
    'section',
    { className: 'py-20 px-6 md:px-16 lg:px-24', style: { backgroundColor: '#F5F5F5' } },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto' },
      
      // Header
      React.createElement(
        'div',
        { className: 'text-center mb-14' },
        React.createElement('h2', { 
          className: 'text-4xl font-inter font-bold text-gray-900 mb-4' 
        }, 'Why Choose Hirent?'),
        React.createElement('p', { 
          className: 'text-base font-inter text-gray-600' 
        }, 'Join thousands of users who are already saving money and earning income')
      ),
      
      // Benefits Grid
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
        ...benefits.map(createBenefitCard)
      )
    )
  );
};

export default WhyChoose;
