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
      imageHeightAdjust = 0, // adjustment for image height
    } = {}
  ) => {
    const baseHeight = 220; // box height
    const adjustedHeight = baseHeight - imageHeightAdjust;

    return React.createElement(
      'div',
      {
        className: `bg-white rounded-xl p-6 flex items-center justify-between shadow-sm border border-gray-100 ${className} relative`,
        style: { minHeight: `${baseHeight}px`, overflow: 'hidden' },
      },
      // Left: text
      React.createElement(
        'div',
        { className: 'flex-1 min-w-0 pr-4 z-10' },
        React.createElement(
          'h3',
          { className: 'text-xl font-inter font-semibold text-gray-900 mb-2' },
          title
        ),
        React.createElement('p', {
          className: 'text-sm font-inter text-gray-600 mb-4',
          dangerouslySetInnerHTML: { __html: description },
        }),
        React.createElement(
          'button',
          {
            className:
              'px-5 py-2 border-2 rounded-lg font-inter font-semibold text-xs inline-flex items-center gap-1.5 hover:bg-purple-50 transition-colors',
            style: {
              borderColor: '#7A1CA9',
              color: '#7A1CA9',
              backgroundColor: 'white',
            },
          },
          'Browse',
          React.createElement(
            'svg',
            {
              className: 'w-3.5 h-3.5',
              fill: 'none',
              stroke: 'currentColor',
              viewBox: '0 0 24 24',
            },
            React.createElement('path', {
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: 2,
              d: 'M9 5l7 7-7 7',
            })
          )
        )
      ),
      // Right: image(s)
      isDoubleImage
        ? React.createElement(
            'div',
            { className: `relative flex items-end justify-center ${imageWrapClass}` },
            images.map((img, idx) =>
              React.createElement('img', {
                key: idx,
                src: img,
                alt: title,
                className: `object-contain select-none pointer-events-none ${imageClassName} absolute bottom-0`,
                style: {
                  marginLeft: idx === 1 ? '-20px' : '0',
                  zIndex: idx === 0 ? 10 : 0,
                  height: '100%',
                  maxHeight: `${adjustedHeight}px`,
                  right: idx === 0 ? 'auto' : '0',
                },
              })
            )
          )
        : React.createElement('img', {
            src: images[0],
            alt: title,
            className: `object-contain select-none pointer-events-none ${imageClassName} absolute bottom-0`,
            style: {
              height: '100%',
              maxHeight: `${adjustedHeight}px`,
              right: 0,
            },
          })
    );
  };

  return React.createElement(
    'section',
    { className: 'py-14 px-4 md:px-12 lg:px-20 bg-gray-50' },
    React.createElement(
      'div',
      { className: 'max-w-6xl mx-auto' },
      // Header
      React.createElement(
        'div',
        { className: 'text-center mb-12' },
        React.createElement(
          'h2',
          { className: 'text-3xl md:text-4xl font-inter font-bold text-gray-900 mb-3' },
          'Featured Categories'
        ),
        React.createElement(
          'p',
          { className: 'text-sm font-inter text-gray-600' },
          'Browse through our popular categories and find exactly what you need'
        )
      ),
      // Grid Layout
      React.createElement(
        'div',
        { className: 'space-y-6', style: { marginLeft: '10px' } },
        // Row 1
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          createCategoryCard(
            'Clothes',
            'Designer wear for<br />every occasion',
            ['/categories/clothes.png'],
            { className: 'min-h-[220px]' }
          ),
          createCategoryCard(
            'Homes & Apartments',
            'Short-term and long-<br />term stays',
            ['/categories/house.png'],
            { className: 'min-h-[200px]', imageHeightAdjust: 10 } 
          )
        ),
        // Row 2
        React.createElement(
          'div',
          { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
          createCategoryCard(
            'Vehicles',
            'From compact to luxury vehicles',
            ['/categories/car.png'],
            { className: 'min-h-[190px] mt-2', imageHeightAdjust: 52 } 
          ),
          createCategoryCard(
            'Gadgets',
            'Latest tech and<br />electronics',
            ['/categories/gadgets.png'],
            { className: 'min-h-[220px]' }
          )
        )
      ),
      // See all button
      React.createElement(
        'div',
        { className: 'text-center mt-12' },
        React.createElement(
          'button',
          {
            className:
              'px-10 py-2.5 border-2 rounded-lg font-inter font-semibold text-sm inline-flex items-center gap-2 hover:bg-purple-50 transition-colors',
            style: { borderColor: '#7A1CA9', color: '#7A1CA9' },
          },
          'See all',
          React.createElement(
            'svg',
            { className: 'w-4 h-4', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
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
