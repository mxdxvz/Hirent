import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeAPICall, ENDPOINTS } from "../../../config/api";
import ApplyCoupon from "../../../components/booking/ApplyCoupon";
import DeliveryMethod from "../../../components/booking/DeliveryMethod";
import ItemSummary from "../../../components/booking/ItemSummary";
import OrderSummary from "../../../components/booking/OrderSummary";
import PaymentMethod from "../../../components/booking/PaymentMethod";
import RentalPeriod from "../../../components/booking/RentalPeriod";
import ReturnDetails from "../../../components/booking/ReturnDetails";
import CancellationPolicy from "../../../components/booking/CancellationPolicy";
import RentalTerms from "../../../components/booking/RentalTerms";
import LateReturnPolicy from "../../../components/booking/LateReturnPolicy";
import { ArrowLeft, CalendarCheck, CircleCheck } from "lucide-react";

const Booking = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();

  // Fetch item details from backend
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [rentalData, setRentalData] = useState({
    startDate: "",
    endDate: "",
    days: 1,
  });

  const [couponData, setCouponData] = useState({
    applied: false,
    discount: 0,
    code: "",
    type: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isBooking, setIsBooking] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (productData && productData.deliveryOptions) {
      const { offersDelivery, offersPickup } = productData.deliveryOptions;
      if (offersDelivery && !offersPickup) {
        setDeliveryMethod("delivery");
      } else if (!offersDelivery && offersPickup) {
        setDeliveryMethod("pickup");
      }
    }
  }, [productData]);

  // Fetch item details from backend
  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await makeAPICall(ENDPOINTS.ITEMS.GET_ONE(itemId));
        if (response && response.item) {
          setProductData(response.item);
        } else {
          setError("Item data not found in response.");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    }
  }, [itemId]);

  const calculatePricing = () => {
    if (!productData)
      return {
        subtotal: 0,
        discount: 0,
        shippingFee: 0,
        securityDeposit: 0,
        total: 0,
      };

    const price = productData.pricePerDay || 0;
    const subtotal = price * (rentalData.days || 1);
    let discountAmount = 0;
    if (couponData?.applied) {
      if (couponData.type === "percentage") {
        discountAmount = (subtotal * (couponData.discount || 0)) / 100;
      } else if (couponData.type === "fixed") {
        discountAmount = couponData.discount || 0;
      }
    }
    const shippingFee =
      deliveryMethod === "delivery"
        ? productData.deliveryOptions?.deliveryFee || 0
        : 0;
    const securityDeposit = productData.securityDeposit || 0;
    const total = subtotal - discountAmount + shippingFee + securityDeposit;

    return {
      subtotal,
      discount: discountAmount,
      shippingFee,
      securityDeposit,
      total,
    };
  };

  const pricing = calculatePricing();

  const handleBooking = async () => {
    // Validate rental dates
    if (!rentalData.startDate || !rentalData.endDate) {
      alert("Please select rental dates.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (!termsAccepted) {
      alert("Please accept the terms and conditions.");
      return;
    }

    setIsBooking(true);

    const bookingData = {
      itemId,
      startDate: rentalData.startDate,
      endDate: rentalData.endDate,
      totalAmount: pricing.total,
      subtotal: pricing.subtotal,
      shippingFee: pricing.shippingFee,
      securityDeposit: pricing.securityDeposit,
      discount: pricing.discount,
      deliveryMethod,
      couponCode: couponData?.applied ? couponData.code : null,
    };

    try {
      const response = await makeAPICall(ENDPOINTS.BOOKINGS.CREATE, {
        method: "POST",
        body: JSON.stringify(bookingData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.success) {
        // Instead of navigating, show the modal
        setBookingId(response.data._id);
        setShowConfirmation(true);
      } else {
        alert(
          response.message || "Failed to create booking. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  if (!productData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Item not found
      </div>
    );

  return (
    <>
      <div className="flex min-h-screen px-4 pl-24 bg-[#fbfbfb] pt-10 pb-20">
        {/* MAIN WRAPPER */}
        <div className="flex w-full gap-4">
          {/* LEFT COLUMN */}
          <div className="w-[430px] flex-shrink-0 sticky top-10 self-start">
            {/* Header */}
            <div className="bg-white p-5 rounded-xl shadow-sm mb-4">
              {/* Back Button */}
              <div className="mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-[#7A1CA9] text-sm font-medium hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Go back
                </button>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
                  <CalendarCheck className="w-10 h-10 text-[#a12fda]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-purple-900 mt-1">
                    Complete Your Booking
                  </h1>
                  <p className="text-gray-500 text-sm mt-0.5">
                    Finalize rental details and review before confirming your
                    booking.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="sticky top-36">
              <OrderSummary
                product={productData}
                pricing={pricing}
                rentalData={rentalData}
                handleBooking={handleBooking}
                isBooking={isBooking}
                deliveryMethod={deliveryMethod}
                termsAccepted={termsAccepted}
                setTermsAccepted={setTermsAccepted}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 space-y-4">
            <ItemSummary
              product={productData}
              days={rentalData.days}
              coupon={couponData}
            />

            <ApplyCoupon
              couponData={couponData}
              setCouponData={setCouponData}
            />

            <RentalPeriod
              rentalData={rentalData}
              setRentalData={setRentalData}
            />

            <LateReturnPolicy />

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            <DeliveryMethod
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
              deliveryOptions={productData.deliveryOptions}
            />

            <ReturnDetails deliveryMethod={deliveryMethod} />

            <CancellationPolicy />

            <RentalTerms />
          </div>
        </div>
      </div>

      {/* ===== CONFIRMATION MODAL ===== */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur background */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowConfirmation(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white py-16 px-10 rounded-xl shadow-xl z-10 w-96 text-center">
            {/* Icon */}
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-3 rounded-full bg-green-100">
              <CircleCheck className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-lg font-semibold text-green-600 mb-4">
              Booking Confirmed!
            </h1>
            <div className="flex flex-col items-center mb-4">
              <p className="text-gray-600 text-sm mb-1.5">Your booking ID</p>
              <p className="text-gray-800 font-semibold text-xl">{bookingId}</p>
            </div>

            <p className="text-gray-600 text-sm mb-8">
              You can view your booking details in your rentals page.
            </p>
            <button
              onClick={() => {
                setShowConfirmation(false);
                navigate("/my-rentals");
              }}
              className="px-5 py-3 bg-purple-800 text-white text-sm rounded-lg hover:bg-purple-700 transition"
            >
              Go to My Rentals
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Booking;
