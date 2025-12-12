import React from 'react';
import { MapPin, Tag } from "lucide-react";

const ItemSummary = ({ product, days, coupon }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-[16px] text-purple-900 mb-4">Item Summary</h2>

      <div className="flex gap-4">
        
        {/* Product Image */}
        <div className="w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/160'}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/160'; }}
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 ml-4">
          {/* Product Title */}
          <h3 className="font-semibold text-lg mb-3">{product.title}</h3>

          {/* Owner */}
          {product.owner && (
            <div className="flex items-center gap-3 mb-2">
              <img src={product.owner.avatar || 'https://via.placeholder.com/150'} alt={product.owner.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="text-sm text-gray-600">
                <span className="font-light text-gray-500 mb-2">Listed by</span>
                <br />
                <span className=" text-purple-900 ">{product.owner.name}</span>
              </div>
            </div>
          )}

          {/* Price + Location in same row */}
          <div className="flex items-center justify-start border-b pb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-[#7A1CA9] font-bold text-lg">₱{product.pricePerDay || product.price || 0}</span>
              <span className="text-gray-500 text-sm">per day</span>
            </div>

            {product.location && (
              <div className="flex items-center gap-1 ml-5 text-purple-900 text-sm">
                <MapPin className="w-4 h-4" />
                {product.location}
              </div>
            )}
          </div>

          {/* Coupon */}
          {coupon.applied && (
            <div className="flex items-center gap-2 mt-3">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">
                Coupon applied:
              </span>
              <span className="text-sm bg-green-100 text-green-600 px-2 py-0.5 rounded-md font-medium">
                {coupon.discount}% off
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemSummary;
