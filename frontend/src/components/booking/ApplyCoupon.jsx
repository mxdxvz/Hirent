import React, { useState } from 'react';
import { makeAPICall, ENDPOINTS } from '../../config/api';

const ApplyCoupon = ({ couponData, setCouponData }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a coupon code.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await makeAPICall(ENDPOINTS.COUPONS.VALIDATE, {
        method: 'POST',
        body: JSON.stringify({ couponCode: code }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.success) {
        setCouponData({
          applied: true,
          discount: response.coupon.discount,
          code: response.coupon.code,
          type: response.coupon.type,
        });
        setSuccess(response.message);
      } else {
        setError(response.message || 'Invalid coupon code.');
      }
    } catch (err) {
      setError('Failed to validate coupon. Please try again.');
    }
    setLoading(false);
  };

  const handleRemove = () => {
    setCouponData({ applied: false, discount: 0, code: '', type: '' });
    setCode('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="bg-white text-purple-900 rounded-lg shadow-sm p-6">
      <h2 className="text-[16px] text-purple-900 mb-4">Apply Coupon</h2>
      <div className="flex flex-col gap-2">
        <label className="text-[15px] text-black font-medium">Enter Code (Optional)</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            placeholder="e.g., SAVE10"
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2 border text-[15px] font-base border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={couponData.applied}
          />
          {!couponData.applied ? (
            <button
              onClick={handleApply}
              className="px-4 py-1 bg-[#7A1CA9] text-sm text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-gray-300"
              disabled={loading}
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          ) : (
            <button
              onClick={handleRemove}
              className="px-4 py-1 bg-red-500 text-sm text-white rounded-lg font-medium hover:bg-red-600 transition"
            >
              Remove
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default ApplyCoupon;
