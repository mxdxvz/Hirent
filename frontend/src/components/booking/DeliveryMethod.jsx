import React from 'react';

const DeliveryMethod = ({ deliveryMethod, setDeliveryMethod, deliveryOptions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Booking Details</h2>

      <h3 className="text-[16px] text-purple-900 mb-3">Delivery Method</h3>

      {deliveryOptions && deliveryOptions.offersDelivery && (
        <label
          className={`flex items-start mb-4 gap-3 p-5 rounded-xl cursor-pointer transition 
      border ${deliveryMethod === "delivery" ? "border-[#7A1CA9]  bg-purple-50" : "border-gray-300 hover:bg-gray-50"}`}
        >
          <input
            type="radio"
            name="delivery"
            checked={deliveryMethod === 'delivery'}
            onChange={() => setDeliveryMethod('delivery')}
            className="w-4 h-4 mt-1 accent-[#7A1CA9]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img src="/assets/icons/delivery.svg" alt="Delivery" className="w-5 h-5" />
              <span className="font-medium text-[15px]">Delivery</span>
            </div>
            <p className="text-sm text-gray-600">Item will be delivered to your address</p>
            <p className="text-sm text-[#7A1CA9] font-medium mt-1">
              +{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(deliveryOptions.deliveryFee)} shipping fee
            </p>
          </div>
        </label>
      )}

      {deliveryOptions && deliveryOptions.offersPickup && (
        <label
          className={`flex items-start gap-3 p-5 rounded-xl cursor-pointer transition 
      border ${deliveryMethod === "pickup" ? "border-[#7A1CA9]  bg-purple-50" : "border-gray-300 hover:bg-gray-50    "}`}
        >
          <input
            type="radio"
            name="delivery"
            checked={deliveryMethod === 'pickup'}
            onChange={() => setDeliveryMethod('pickup')}
            className="w-4 h-4 mt-1 accent-[#7A1CA9]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <img src="/assets/icons/pickup.svg" alt="Pickup" className="w-5 h-5" />
              <span className="font-medium text-[15px]">Pickup</span>
            </div>
            <p className="text-sm text-gray-600">Pick up the item from the owner's location</p>
            <p className="text-sm text-green-600 mt-1">Free - No Shipping Fee</p>
          </div>
        </label>
      )}

      {/* Notes for Owner */}
      <div className="mt-6">
        <h3 className=" text-[16px] text-purple-900 mb-2">Notes for Owner (Optional)</h3>
        <textarea
          placeholder="Any special requests or instructions for the owner..."
          rows="4"
          className="w-full h-24 px-4 py-3 text-[15px] placeholder:text-gray-400 bg-gray-50     rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          maxLength={500}
        />
        <p className="text-[15px] text-gray-500 mt-0.5">0/500 characters</p>
      </div>
    </div>
  );
};

export default DeliveryMethod;
