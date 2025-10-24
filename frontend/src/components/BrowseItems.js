import React, { useState } from 'react';

const BrowseItems = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const items = [
    {
      id: 1,
      name: 'AK-900 Wired Keyboard',
      price: '₱200',
      rating: 5,
      reviews: 65,
      image: '/items/Keyboard.png',
      badge: null,
    },
    {
      id: 2,
      name: 'Gucci duffle bag',
      price: '₱960',
      originalPrice: '₱1160',
      rating: null,
      reviews: null,
      image: '/items/gucci_duffle_bag.png',
      badge: '-35%',
      badgeColor: '#7A1CA9',
    },
    {
      id: 3,
      name: 'RGB liquid CPU Cooler',
      price: '₱1960',
      rating: null,
      reviews: null,
      image: '/items/RGB_liquid_CPU.png',
      badge: null,
    },
    {
      id: 4,
      name: 'HAVIT HV-G92 Gamepad',
      price: '₱560',
      rating: 5,
      reviews: 65,
      image: '/items/havit_hv.png',
      badge: 'NEW',
      badgeColor: '#00FF66',
    },
    {
      id: 5,
      name: 'IPS LCD Gaming Monitor',
      price: '₱1160',
      rating: 5,
      reviews: 65,
      image: '/items/IPS_lcd.png',
      badge: null,
    },
    {
      id: 6,
      name: 'ASUS FHD Gaming Laptop',
      price: '₱700',
      rating: 5,
      reviews: 65,
      image: '/items/laptop.png',
      badge: null,
    },
  ];

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, items.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const ItemCard = ({ item, index }) => {
    const isEdgeItem = (index < currentIndex) || (index >= currentIndex + itemsPerPage);
    
    return (
      <div
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex-shrink-0"
        style={{
          width: 'calc(25% - 18px)',
          opacity: isEdgeItem ? 0.4 : 1,
          filter: isEdgeItem ? 'blur(2px)' : 'none'
        }}
      >
        {/* Image Container */}
        <div className="relative bg-gray-50 p-8 h-64 flex items-center justify-center">
          {item.badge && (
            <span
              className="absolute top-4 left-4 text-white text-xs font-inter font-semibold px-3 py-1.5 rounded"
              style={{ backgroundColor: item.badgeColor }}
            >
              {item.badge}
            </span>
          )}
          
          {/* Eye Icon */}
          <div className="absolute top-4 right-4">
            <button
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:text-white transition-all shadow-md"
              style={{ color: '#1F2937' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7A1CA9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          
          <img
            src={item.image}
            alt={item.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-5 space-y-3">
          <button
            className="w-full text-white py-3 rounded-lg font-inter font-semibold hover:opacity-90 transition-opacity text-sm"
            style={{ backgroundColor: '#7A1CA9' }}
          >
            Add To Cart
          </button>
          
          <h4 className="font-inter font-medium text-gray-900 text-base min-h-[3rem] flex items-start">
            {item.name}
          </h4>
          
          <div className="flex items-center gap-3">
            <span className="text-lg font-inter font-bold" style={{ color: '#7A1CA9' }}>
              {item.price}
            </span>
            {item.originalPrice && (
              <span className="text-sm font-inter text-gray-400 line-through">
                {item.originalPrice}
              </span>
            )}
          </div>
          
          {item.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(item.rating)}
              </div>
              <span className="text-sm font-inter text-gray-600">
                ({item.reviews})
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-inter font-bold text-gray-900 mb-4">
            Browse Items
          </h2>
          <p className="text-base font-inter text-gray-600 max-w-2xl mx-auto">
            Browse through our popular categories and find exactly what you need
          </p>
        </div>
        
        {/* Recommended Items Label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1.5 h-12 rounded" style={{ backgroundColor: '#7A1CA9' }} />
          <h3 className="text-xl font-inter font-semibold" style={{ color: '#7A1CA9' }}>
            Recommended Items
          </h3>
        </div>
        
        {/* Carousel Container */}
        <div className="relative px-20">
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all select-none"
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Items Slider */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {items.map((item, index) => (
                <ItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
          
          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all select-none"
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Login Button */}
        <div className="text-center mt-20">
          <button
            className="px-14 py-3.5 border-2 rounded-lg font-inter font-semibold text-base transition-all hover:bg-purple-50"
            style={{ borderColor: '#7A1CA9', color: '#7A1CA9' }}
          >
            Login To See More
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseItems;
