import React from 'react';
import { Heart, Eye } from 'lucide-react';

const RelatedItems = ({ products }) => {
  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-purple-600 rounded"></div>
        <h2 className="text-lg font-bold text-gray-900">Related Items</h2>
      </div>

      {/* Products Grid - Removed extra padding */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -ml-px">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Product Image Container */}
            <div className="relative bg-gray-100 aspect-square flex items-center justify-center p-5 mb-2 rounded-lg overflow-hidden">
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-3 left-3 bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-bold z-10">
                  -{product.discount}%
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-purple-600 hover:text-white transition-all">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-purple-600 hover:text-white transition-all">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
              />

              {/* Add to Cart Button */}
              <button className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white py-2 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-purple-700">
                Add To Cart
              </button>
            </div>

            {/* Product Info */}
            <div className="px-4 pb-4 space-y-2">
              <h3 className="font-semibold text-gray-900 text-xs line-clamp-2">{product.name}</h3>
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-purple-600 font-bold text-sm">
                  ₱{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 line-through text-xs">
                    ₱{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-xs">({product.reviews})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
