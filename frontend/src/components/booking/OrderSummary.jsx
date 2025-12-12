import React from 'react';

const OrderSummary = ({ product, pricing, rentalData, handleBooking, isBooking, deliveryMethod, termsAccepted, setTermsAccepted }) => {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 2,
    }).format(value ?? 0);

  const showShippingFee = deliveryMethod === 'delivery' && product.deliveryOptions?.offersDelivery;
  const showSecurityDeposit = product.securityDeposit > 0;
  const showDiscount = pricing.discount > 0;
  const datesSelected = rentalData.startDate && rentalData.endDate;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-md font-semibold mb-4 ">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {/* Product Info */}
        <div className="flex items-center justify-between text-[15px]">
          <h3 className=" text-gray-900">{product.title || 'Item'}</h3>
          <p className="text-[#7A1CA9] font-bold">
            ₱{product.pricePerDay || 0}
            <span className="font-normal text-gray-600"> per day</span>
          </p>
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-3 border-gray-200">
          {/* Subtotal */}
          <div className="flex justify-between text-[14px] mb-0.5">
            <span className="text-gray-900">Subtotal</span>
            <span className=" text-gray-900 ">
              {pricing.subtotal > 0 ? formatCurrency(pricing.subtotal) : "---"}
            </span>
          </div>

          {/* Subtotal Explanation */}
          {pricing.subtotal > 0 && (
            <p className="text-sm text-[#7A1CA9] mb-2 ml-1">
              ({rentalData.days} {rentalData.days === 1 ? "day" : "days"}
              {" × "}
              {formatCurrency(product.pricePerDay || 0)}
              /day)
            </p>
          )}

          {/* Discount */}
          {showDiscount && (
            <div className="flex justify-between text-[14px] mb-1">
              <span className="text-gray-900">Discount</span>
              <span className="text-red-500">-{formatCurrency(pricing.discount)}</span>
            </div>
          )}

          {/* Shipping */}
          {showShippingFee && (
            <div className="flex justify-between text-[14px] mb-1">
              <span className="text-gray-900">Shipping Fee</span>
              <span className=" text-gray-900 ">
                +{formatCurrency(pricing.shippingFee)}
              </span>
            </div>
          )}

          {/* Security Deposit */}
          {showSecurityDeposit && (
            <div className="flex justify-between text-[14px] mb-1">
              <span className="text-gray-900">Security Deposit</span>
              <span className=" text-gray-900 ">
                +{formatCurrency(pricing.securityDeposit)}
              </span>
            </div>
          )}
        </div>

        {/* Total + Actions */}
        <div className="border-t pt-3 border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-md text-gray-900 ">Total</span>
            <span className="text-lg font-bold  text-gray-900 ">
              {formatCurrency(pricing.total)}
            </span>
          </div>

          {!datesSelected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                Select rental dates to see total price
              </p>
            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={!datesSelected || isBooking || !termsAccepted}
            className="w-full bg-[#7A1CA9] text-white text-sm py-2.5 
  rounded-full font-medium transition-all duration-300 ease-in-out 
  hover:opacity-90 active:scale-95 mb-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isBooking ? 'Placing Booking...' : 'Place Booking'}
          </button>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#7A1CA9] border-gray-300 rounded focus:ring-[#7A1CA9]"
            />
            <label htmlFor="terms-checkbox" className="text-xs text-gray-600 leading-tight">
              I agree to the rental terms and conditions, cancellation policy, and late return policy
            </label>
          </div>

          <button
            className="w-full bg-white border text-sm border-gray-300 text-gray-900 py-2 
  rounded-full font-medium transition-all duration-300 ease-in-out 
  hover:bg-gray-50 active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
