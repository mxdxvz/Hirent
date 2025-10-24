import React from 'react';

const FeaturedCategories = () => {
  const createCategoryCard = (
    title,
    description,
    images,
    {
      isDoubleImage = false,
      className = '',
      imageClassName = '',
      imageWrapClass = '',
    } = {}
  ) => {
    return React.createElement(
      'div',
      {
        className:
          `bg-white rounded-xl p-8 flex items-center justify-between shadow-sm border border-gray-100 ${className}`,
      },
      // Left: text
      React.createElement(
        'div',
        { className: 'flex-1 min-w-0 pr-6' },
        React.createElement(
          'h3',
          { className: 'text-2xl font-inter font-semibold text-gray-900 mb-3' },
          title
        ),
        React.createElement('p', {
          className: 'text-base font-inter text-gray-600 mb-5',
          dangerouslySetInnerHTML: { __html: description },
        }),
        React.createElement(
          'button',
          {
            className:
              'px-6 py-2.5 border-2 rounded-lg font-inter font-semibold text-sm inline-flex items-center gap-2 hover:bg-purple-50 transition-colors',
            style: { borderColor: '#7A1CA9', color: '#7A1CA9', backgroundColor: 'white' },
          },
          'Browse',
          React.createElement(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M9 5l7 7-7 7',
            })
          )
        )
      ),
      // Right: images
      isDoubleImage
        ? React.createElement(
            'div',
            { className: `relative flex items-center justify-center ${imageWrapClass}` },
            images.map((img, idx) =>
              React.createElement('img', {
                key: idx,
                src: img,
                alt: title,
                className:
                  `object-contain select-none pointer-events-none ${imageClassName}`,
                style: {
                  marginLeft: idx === 1 ? '-25px' : '0',
                  zIndex: idx === 0 ? 10 : 0,
                },
              })
            )
          )
        : React.createElement('img', {
            src: images[0],
            alt: title,
            className: `object-contain select-none pointer-events-none ${imageClassName}`,
          })
    );
  };

  return React.createElement(
    'section',
    { className: 'py-20 px-6 md:px-16 lg:px-24 bg-gray-50' },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto' },

      // Header
      React.createElement(
        'div',
        { className: 'text-center mb-16' },
        React.createElement(
          'h2',
          { className: 'text-4xl md:text-5xl font-inter font-bold text-gray-900 mb-4' },
          'Featured Categories'
        ),
        React.createElement(
          'p',
          { className: 'text-base font-inter text-gray-600' },
          'Browse through our popular categories and find exactly what you need'
        )
      ),

      // Grid Layout - Custom structure
      React.createElement(
        'div',
        { className: 'space-y-8', style: { marginLeft: '10px' } },

        // Row 1: Clothes + Homes & Apartments (full width)
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },

          // Clothes
          createCategoryCard(
            'Clothes',
            'Designer wear for<br />every occasion',
            ['/categories/suits.png', '/categories/gown.png'],
            {
              isDoubleImage: true,
              className: 'min-h-[280px]',
              imageWrapClass: 'ml-6 flex-shrink-0',
              imageClassName: 'h-[185px] md:h-[196px] lg:h-[212px]',
            }
          ),

          // Homes & Apartments (spans to full width on right side)
          createCategoryCard(
            'Homes & Apartments',
            'Short-term and long-<br />term stays',
            ['/categories/house.png'],
            {
              className: 'min-h-[280px]',
              imageClassName: 'h-44 md:h-48 lg:h-52 ml-6 flex-shrink-0',
            }
          )
        ),

        // Row 2: Vehicles (full width) + Gadgets
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },

          // Vehicles (spans full width on left side)
          createCategoryCard(
            'Vehicles',
            'From compact to luxury vehicles',
            ['/categories/car.png'],
            {
              className: 'min-h-[280px]',
              imageClassName: 'h-44 md:h-48 lg:h-52 ml-6 flex-shrink-0',
            }
          ),

          // Gadgets
          createCategoryCard(
            'Gadgets',
            'Latest tech and<br />electronics',
            ['/categories/gadgets.png'],
            {
              className: 'min-h-[280px]',
              imageClassName: 'h-[185px] md:h-[196px] lg:h-[212px] ml-6 flex-shrink-0',
            }
          )
        )
      ),

      // See all button
      React.createElement(
        'div',
        { className: 'text-center mt-16' },
        React.createElement(
          'button',
          {
            className:
              'px-12 py-3.5 border-2 rounded-lg font-inter font-semibold text-base inline-flex items-center gap-2 hover:bg-purple-50 transition-colors',
            style: { borderColor: '#7A1CA9', color: '#7A1CA9' },
          },
          'See all',
          React.createElement(
            'svg',
            { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M19 9l-7 7-7-7',
            })
          )
        )
      )
    )
  );
};

export default FeaturedCategories;
