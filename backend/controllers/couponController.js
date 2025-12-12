exports.validateCoupon = async (req, res) => {
  const { couponCode } = req.body;

  // In a real application, you would look up the coupon code in the database.
  // For this example, we'll use a hardcoded list of valid coupons.
  const validCoupons = {
    'HIRENT10': { discount: 10, type: 'percentage' },
    'WELCOME15': { discount: 15, type: 'percentage' },
    'SAVE50': { discount: 50, type: 'fixed' },
  };

  const coupon = validCoupons[couponCode.toUpperCase()];

  if (coupon) {
    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      coupon: {
        code: couponCode.toUpperCase(),
        ...coupon,
      },
    });
  } else {
    res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
  }
};
