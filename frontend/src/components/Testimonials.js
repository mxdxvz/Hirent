import React from 'react';

const Testimonials = () => {
  const createStarIcon = () => {
    return React.createElement(
      'svg',
      { className: 'w-5 h-5 text-yellow-400', fill: 'currentColor', viewBox: '0 0 20 20' },
      React.createElement('path', {
        d: 'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'
      })
    );
  };

  const testimonials = [
    {
      name: 'Maria Santos',
      role: '5 star renter since 2023',
      rating: 5,
      comment: 'Super easy to use and I get products I needed at such great prices. I\'m hooked!',
      avatar: 'MS',
      bgColor: 'bg-purple-600',
    },
    {
      name: 'John Reyes',
      role: 'Renter',
      rating: 5,
      comment: 'Hassle free renting, exactly what I needed for my event!',
      avatar: 'JR',
      bgColor: 'bg-purple-600',
    },
    {
      name: 'Sarah Chen',
      role: '5 star renter since 2023',
      rating: 5,
      comment: 'Great service to buy cameras for makoto',
      avatar: 'SC',
      bgColor: 'bg-purple-600',
    },
  ];

  const createTestimonialCard = (testimonial, index) => {
    return React.createElement(
      'div',
      { key: index, className: 'bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition' },
      
      // Stars
      React.createElement(
        'div',
        { className: 'flex items-center gap-1 mb-4' },
        ...Array(testimonial.rating).fill(0).map((_, i) => createStarIcon())
      ),
      
      // Comment
      React.createElement('p', { className: 'font-inter text-gray-700 mb-6 leading-relaxed' }, `"${testimonial.comment}"`),
      
      // User Info
      React.createElement(
        'div',
        { className: 'flex items-center gap-4' },
        React.createElement(
          'div',
          { className: `w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-inter font-semibold` },
          testimonial.avatar
        ),
        React.createElement(
          'div',
          null,
          React.createElement('h4', { className: 'font-inter font-semibold text-gray-900' }, testimonial.name),
          React.createElement('p', { className: 'text-sm font-inter text-gray-600' }, testimonial.role)
        )
      )
    );
  };

  return React.createElement(
    'section',
    { className: 'py-16 px-6 md:px-16 lg:px-24 bg-gray-50' },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto' },
      
      // Header
      React.createElement(
        'div',
        { className: 'text-center mb-12' },
        React.createElement('h2', { className: 'text-3xl md:text-4xl font-inter font-medium text-gray-900 mb-4' }, 'Our Happy Customers'),
        React.createElement('p', { className: 'text-base md:text-lg font-inter text-gray-600' }, 'Real stories from real members who transformed their lives with Hirent')
      ),
      
      // Testimonials Grid
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 md:grid-cols-3 gap-8' },
        ...testimonials.map(createTestimonialCard)
      )
    )
  );
};

export default Testimonials;
