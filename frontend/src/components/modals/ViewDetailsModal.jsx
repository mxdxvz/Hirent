import { useEffect, useState } from "react";
import { CalendarCheck, CalendarClock, MapPin, CreditCard, Package, Truck, DollarSign, CheckCircle2, Clock, Tag, Percent, ShieldAlert } from "lucide-react";
import TruckIcon from "../../assets/delivery.png";
import DeliveryTrackingModal from "./DeliveryTrackingModal";
import CancelConfirmationModal from "./CancelModal";
import mockListings from "../../data/mockData";

const deliverySteps = [
    { key: "pending", label: "Order Confirmed", icon: CheckCircle2 },
    { key: "preparing", label: "Preparing Item", icon: Package },
    { key: "in-transit", label: "In Transit", icon: Truck },
    { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const pickupSteps = [
    { key: "pending", label: "Order Confirmed", icon: CheckCircle2 },
    { key: "preparing", label: "Preparing Item", icon: Package },
    { key: "ready-pickup", label: "Ready for Pickup", icon: CheckCircle2 },
];

function ImageWithFallback({ src, alt, className }) {
    const [error, setError] = useState(false);
    return (
        <img
            src={error ? "https://via.placeholder.com/150" : src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
}

export function ViewDetailsModal({ isOpen, onClose, itemId, rentalData }) {

    const [iconAnimated, setIconAnimated] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIconAnimated(true);
        } else {
            setIconAnimated(false);
        }
    }, [isOpen]);

    const [rental, setRental] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);



    useEffect(() => {
        if (isOpen && itemId && rentalData) {
            const found = rentalData.find(r => r.id === itemId);
            setRental(found || null);
        }
    }, [isOpen, itemId, rentalData]);

    const getCurrentStepIndex = (current, steps) => steps.findIndex(s => s.key === current);

    if (!isOpen || !rental) return null;

    // Determine steps
    const steps = rental.delivery?.deliveryType === "shipping" ? deliverySteps : pickupSteps;
    const currentStepIndex = rental.status === "approved" ? getCurrentStepIndex(rental.delivery?.current, steps) : -1;

    const trackingData = rental.delivery ? {
        currentStep: currentStepIndex,
        currentLocation: rental.delivery.currentLocation || "Processing",
        estimatedDate: rental.delivery.estimatedDate,
        courier: rental.delivery.courier || "Courier Info N/A",
        steps,
        confirmedAt: rental.delivery.confirmedAt,
        preparingAt: rental.delivery.preparingAt,
    } : null;

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
            <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20">
                <div className="bg-white cart-scale rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b rounded-t-2xl border-gray-200 px-6 py-4 z-20 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <ImageWithFallback src={rental.image} alt={rental.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-gray-900 font-medium truncate text-[16px]">{rental.name}</h2>
                                <p className="text-gray-500 text-[14px]">{rental.category}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 p-6 space-y-6">
                        {/* Rental Details */}
                        <div className="space-y-2">
                            <h3 className="text-gray-900 text-[15px]">Rental Details</h3>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                {/* Date Booked */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CalendarCheck className="w-5 h-5 text-[#7A1CA9]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[13px] mb-0.5">Date booked by you</p>
                                        <p className="text-gray-900 text-sm mb-0.5">
                                            {rental.dateBooked
                                                ? new Date(rental.dateBooked).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                : "-"}
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-t border-gray-200" />

                                {/* Rental Period */}
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CalendarClock className="w-5 h-5 text-[#7A1CA9]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[13px] mb-0.5">Rental Period</p>
                                        <p className="text-gray-900 text-sm mb-0.5">
                                            {new Date(rental.bookedFrom).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} - {" "}
                                            {new Date(rental.bookedTo).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                        <p className="text-gray-500 text-xs">
                                            {(() => {
                                                if (!rental.bookedFrom || !rental.bookedTo) return `${rental.days} days`;

                                                const from = new Date(rental.bookedFrom);
                                                const to = new Date(rental.bookedTo);

                                                const msPerDay = 1000 * 60 * 60 * 24;
                                                const diff = Math.floor((to - from) / msPerDay) + 1;

                                                return `${diff} days`;
                                            })()}
                                        </p>

                                    </div>
                                </div>

                                <hr className="border-t border-gray-200" />

                                {/* Shipping / Pickup */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-[#7A1CA9]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[13px] mb-0.5">
                                            {rental.delivery?.deliveryType === "shipping" ? "Shipping / Pickup Address" : "Pickup Location"}
                                        </p>
                                        <p className="text-gray-900 text-sm flex items-center gap-1">
                                            {/* Original item location */}
                                            {mockListings.find(l => l.id === rental.id)?.location || "Unknown"}

                                            {/* Truck icon */}
                                            <img
                                                src={TruckIcon}
                                                alt="truck"
                                                className={`w-4 h-4 mx-1 transform transition-transform duration-500 ease-out ${iconAnimated ? "translate-x-0 opacity-75" : "-translate-x-4 opacity-0"
                                                    }`}
                                            />

                                            {/* Destination: user location from rentalData */}
                                            {rental.location || "Unknown"}
                                        </p>
                                    </div>
                                </div>

                                <hr className="border-t border-gray-200" />

                                {/* Payment */}
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-5 h-5 text-[#7A1CA9]" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[13px] mb-0.5">Payment Method</p>
                                        <p className="text-gray-900 text-sm">{rental.paymentMethod || "Not Provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="space-y-2">
                            <h3 className="text-gray-900 text-[15px]">Price Summary</h3>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                {(() => {
                                    const listing = mockListings.find(l => l.id === rental.id);

                                    const pricePerDay = listing
                                        ? Number((listing.price || "₱0").toString().replace(/[^\d.]/g, ""))
                                        : 0;

                                    let daysCount = rental.days || 1;
                                    if (rental.bookedFrom && rental.bookedTo) {
                                        const from = new Date(rental.bookedFrom);
                                        const to = new Date(rental.bookedTo);
                                        const msPerDay = 1000 * 60 * 60 * 24;
                                        const diff = Math.floor((to - from) / msPerDay) + 1;
                                        daysCount = diff > 0 ? diff : daysCount;
                                    }

                                    const shippingFee = typeof rental.shipping === "number"
                                        ? rental.shipping
                                        : listing?.shipping || 0;

                                    const discountPercent =
                                        typeof rental.couponDiscount === "number"
                                            ? rental.couponDiscount
                                            : listing?.couponDiscount || 0;

                                    const securityDeposit = rental.securityDeposit || 0;
                                    const subtotal = pricePerDay * daysCount;
                                    const discountAmount = (subtotal * discountPercent) / 100;
                                    const total = subtotal - discountAmount + shippingFee + securityDeposit;


                                    return (
                                        <>
                                            {/* Subtotal */}
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-gray-500" />
                                                        Subtotal ({daysCount} days × ₱{pricePerDay})
                                                    </div>
                                                </span>
                                                <span className="text-gray-900">
                                                    ₱{subtotal.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Discount */}
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">

                                                    <div className="flex items-center gap-2 text-green-500">
                                                        <Percent className="w-4 h-4 text-green-500" />
                                                        <span>Discount ({discountPercent}%)</span>
                                                    </div>

                                                    {discountPercent > 0 && (
                                                        <span className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded-lg bg-purple-100 text-purple-700">
                                                            <Tag className="w-3 h-3 text-[#7A1CA9]" />
                                                            Coupon Applied
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Discount Amount */}
                                                <span className={discountPercent > 0 ? "text-green-600" : "text-gray-900"}>
                                                    -₱{discountAmount.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Shipping*/}
                                            <div className="flex justify-between text-sm items-center">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-500">Shipping Fee</span>
                                                </div>

                                                {shippingFee > 0 ? (
                                                    <span className="text-gray-900">+₱{shippingFee.toFixed(2)}</span>
                                                ) : (
                                                    <span className="text-gray-900">Free</span>
                                                )}
                                            </div>

                                            {/* Security Deposit */}
                                            {securityDeposit > 0 && (
                                                <div className="flex justify-between text-sm items-center">
                                                    <div className="flex items-center gap-2">
                                                        <ShieldAlert className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-500">Security Deposit</span>
                                                    </div>
                                                    <span className="text-yellow-600">₱{securityDeposit.toFixed(2)}</span>
                                                </div>
                                            )}

                                            <hr className="border-t border-gray-200" />

                                            {/* Total */}
                                            <div className="flex justify-between font-semibold text-[#7A1CA9] text-sm">
                                                <span>Total</span>
                                                <span>₱{total.toFixed(2)}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>


                        {/* Delivery Status for Approved & Pending */}
                        {(rental.status === "approved" || rental.status === "pending") && rental.delivery && (
                            <div className="space-y-2">
                                <h3 className="text-gray-900 text-[15px]">Delivery Status</h3>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    {steps.map((step, index) => {
                                        const isCompleted = rental.status === "approved" && index < currentStepIndex;
                                        const isCurrent = rental.status === "approved" && index === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <div key={step.key} className="relative flex items-center text-[14px] gap-4 pb-6 last:pb-0">
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={`absolute w-0.5 ${isCompleted ? "bg-[#7A1CA9]" : "bg-gray-300"}`}
                                                        style={{ left: "1.05rem", top: "50%", height: "45%" }}
                                                    />
                                                )}
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-[#7A1CA9] text-white" : "bg-gray-200 text-gray-400"} ${isCurrent ? "ring-4 ring-purple-100" : ""}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`${isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"}`}>{step.label}</p>

                                                    {/* Pending items note */}
                                                    {rental.status === "pending" && step.key === "pending" && (
                                                        <p className="text-orange-800 opacity-70 text-xs">Waiting for owner's approval.</p>
                                                    )}
                                                    {isCurrent && rental.delivery.estimatedDate && (
                                                        <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                                                            <Clock className="w-3 h-3 opacity-65" />
                                                            <span>Est. {rental.delivery.estimatedDate}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}


                                    {rental.delivery.trackingNumber && rental.delivery.deliveryType === "shipping" && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-900">
                                            <span className="text-gray-500 block mb-1">Tracking Number</span>
                                            <span className="block">{rental.delivery.trackingNumber}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-4">
                            {rental.status === "approved" && rental.delivery?.deliveryType === "shipping" && (
                                <button
                                    onClick={() => setIsTrackingOpen(true)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#7A1CA9] font-medium text-[13px] text-white py-1.5 rounded-lg"
                                >
                                    <Package className="w-4 h-4" />
                                    Track Item
                                </button>
                            )}

                            {/* Only show Cancel if NOT approved */}
                            {rental.status !== "cancelled" && rental.status !== "approved" && (
                                <button
                                    onClick={() => {
                                        setSelectedId(rental.id);
                                        setShowCancelModal(true);
                                    }}
                                    className="flex-1 border border-red-300 text-red-600 font-medium text-[13px] py-1.5 rounded-lg"
                                >
                                    Cancel Booking
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="flex-1 border border-gray-300 font-medium text-[13px] py-1.5 rounded-lg"
                            >
                                Close
                            </button>

                            {/* Cancel Modal */}
                            <CancelConfirmationModal
                                isOpen={showCancelModal}
                                onClose={() => setShowCancelModal(false)}
                                onConfirm={() => {
                                    if (rental.id === selectedId) {
                                        rental.status = "cancelled";
                                    }
                                    setShowCancelModal(false);
                                    onClose();
                                }}
                            />
                        </div>


                    </div>
                </div>
            </div>

            <DeliveryTrackingModal
                isOpen={isTrackingOpen}
                onClose={() => setIsTrackingOpen(false)}
                trackingData={trackingData}
            />
        </>
    );
}
