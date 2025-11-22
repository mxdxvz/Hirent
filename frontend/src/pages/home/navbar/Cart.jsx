import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layouts/Sidebar";
import Footer from "../../../components/layouts/Footer";
import emptyCart from "../../../assets/empty-cart.png";
import { User, Calendar, Truck, CircleCheckBig, Clock, Package, MessageCircle, Pencil, CalendarPlus, ShieldAlert } from "lucide-react";
import sampleUserCart from "../../../data/sampleUserCart";
import SortDropdown from "../../../components/filters/SortDropdown";
import CancelConfirmationModal from "../../../components/modals/CancelModal";
import mockListings from "../../../data/mockData";
import { getFakeUser, generateFakeToken } from "../../../utils/fakeAuth";

const CartPage = () => {
    const navigate = useNavigate();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedCancelId, setSelectedCancelId] = useState(null);


    // Load cart from fake user token
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        let user = getFakeUser();

        if (!user) {
            const token = generateFakeToken();
            localStorage.setItem("fakeToken", token);
            user = getFakeUser();
        }

        // Merge user's cart with product data
        const merged = (user.cart || []).map(cartItem => {
            const product = mockListings.find(p => p.id === cartItem.id);
            if (!product) return null;

            const rawPrice = product.price ? product.price.toString() : "0";
            const price = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0;

            const defaultCartItem = sampleUserCart.find(i => i.id === cartItem.id) || {};

            return {
                ...product,
                ...defaultCartItem,
                ...cartItem,
                price,
                days: cartItem.days || defaultCartItem.days || 1,
                shipping: cartItem.shipping ?? defaultCartItem.shipping ?? 0,
                status: cartItem.status || defaultCartItem.status || "pending",
                bookedFrom: cartItem.bookedFrom || defaultCartItem.bookedFrom || "",
                bookedTo: cartItem.bookedTo || defaultCartItem.bookedTo || "",
                couponDiscount: cartItem.couponDiscount ?? defaultCartItem.couponDiscount ?? 0,
                adjustedSubtotal: price * (cartItem.days || defaultCartItem.days || 1),
            };


        }).filter(Boolean);

        setCartItems(merged);
    }, []);

    // Helper: Update fake user cart token
    const updateFakeUserCart = (newCart) => {
        const user = getFakeUser();
        if (!user) return;
        const updatedUser = { ...user, cart: newCart };
        const base64Payload = btoa(JSON.stringify(updatedUser));
        const newToken = `fakeHeader.${base64Payload}.fakeSignature`;
        localStorage.setItem("fakeToken", newToken);
    };

    // Remove item from cart
    const handleRemoveItem = (id) => {
        const newCart = cartItems.filter(item => item.id !== id);
        setCartItems(newCart);
        updateFakeUserCart(newCart);
    };

    // Cart summary
    const subtotal = cartItems.reduce((acc, item) => acc + item.adjustedSubtotal, 0);
    const totalShipping = cartItems.reduce((acc, item) => acc + item.shipping, 0);
    const total = subtotal + totalShipping;

    // Cart summary with discount + shipping + duration
    const calculateItemTotal = (item) => {
        const pricePerDay = item.price || 0;

        // Determine rental duration
        let daysCount = item.days || 1;
        if (item.bookedFrom && item.bookedTo) {
            const from = new Date(item.bookedFrom);
            const to = new Date(item.bookedTo);
            const msPerDay = 1000 * 60 * 60 * 24;
            const diff = Math.floor((to - from) / msPerDay) + 1;
            daysCount = diff > 0 ? diff : daysCount;
        }

        // Shipping fee
        const shippingFee = typeof item.shipping === "number" ? item.shipping : 0;

        // Fetch discount from sampleUserCart based on item id
        const sampleItem = sampleUserCart.find(si => si.id === item.id);
        const discountPercent = sampleItem ? sampleItem.couponDiscount : 0;

        // Subtotal before discount
        const subtotal = pricePerDay * daysCount;

        // Discount amount
        const discountAmount = (subtotal * discountPercent) / 100;

        // Total after shipping and discount
        const total = subtotal + shippingFee - discountAmount;

        return { subtotal, discountAmount, shippingFee, total, daysCount, pricePerDay };
    };

    // Overall cart totals
    const cartTotals = cartItems.reduce(
        (acc, item) => {
            const itemTotals = calculateItemTotal(item);
            acc.subtotal += itemTotals.subtotal;
            acc.shipping += itemTotals.shippingFee;
            acc.discount += itemTotals.discountAmount;
            acc.total += itemTotals.total;
            return acc;
        },
        { subtotal: 0, shipping: 0, discount: 0, total: 0 }
    );

    const [filter, setFilter] = useState("all"); // "all", "approved", "pending"

    // Cancel booking for approved/pending items
    const openCancelModal = (id) => {
        setSelectedCancelId(id);
        setShowCancelModal(true);
    };

    const confirmCancelBooking = () => {
        const updatedCart = cartItems.map(item => {
            if (item.id === selectedCancelId) {
                return {
                    ...item,
                    status: "not booked",
                    bookedFrom: null,
                    bookedTo: null,
                };
            }
            return item;
        });

        setCartItems(updatedCart);
        updateFakeUserCart(updatedCart);
        setShowCancelModal(false);
        setSelectedCancelId(null);
        alert("Booking canceled successfully.");
    };

    // Filtered items based on selected tab
    const filteredItems = cartItems.filter(item => {
        if (filter === "all") return true;
        if (filter === "approved") return item.status === "approved";
        if (filter === "pending") return item.status === "pending";
        return true;
    });

    // Count of waiting items (pending)
    const waitingCount = cartItems.filter(item => item.status === "pending").length;

    // STATE
    const [sortOrder, setSortOrder] = useState("latest"); // "latest" or "oldest"

    // FILTERED + SORTED ITEMS
    const sortedItems = [...filteredItems].sort((a, b) => {
        const aDate = new Date(a.addedAt || a.bookedFrom || Date.now());
        const bDate = new Date(b.addedAt || b.bookedFrom || Date.now());
        return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
    });

    // Approved items only
    const approvedItems = cartItems.filter(item => item.status === "approved");

    // Rental Summary totals for approved items including discount
    const approvedTotals = approvedItems.reduce(
        (acc, item) => {
            const itemTotals = calculateItemTotal(item);
            acc.subtotal += itemTotals.subtotal;
            acc.shipping += itemTotals.shippingFee;
            acc.discount += itemTotals.discountAmount;
            return acc;
        },
        { subtotal: 0, shipping: 0, discount: 0 }
    );

    // Final total including discount
    const approvedGrandTotal = approvedTotals.subtotal + approvedTotals.shipping - approvedTotals.discount;
    const approvedSecurityDepositTotal = approvedItems.reduce(
        (acc, item) => acc + (item.securityDeposit || 0),
        0
    );

    const approvedGrandTotalWithDeposit = approvedGrandTotal + approvedSecurityDepositTotal;

    return (
        <div className="flex flex-col min-h-screen bg-[#fbfbfb]">
            <div className="flex flex-1">
                <Sidebar />
                <div className="cart-scale flex-1 mb-15">
                    <div className="max-w-8xl mx-auto pt-12">
                        <div>
                            <h1 className="text-[20px] font-bold">Your Cart</h1>
                            <p className="text-[15px] text-gray-500 mb-6">All Bookings</p>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4 items-center">
                            {/* Category Buttons */}
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setFilter("all")}
                                    className={`px-2 py-1 rounded-lg text-sm ${filter === "all" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-800"}`}
                                >
                                    All Items ({cartItems.length})
                                </button>
                                <button
                                    onClick={() => setFilter("approved")}
                                    className={`px-2 py-1 rounded-lg text-sm ${filter === "approved" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-800"}`}
                                >
                                    Approved ({cartItems.filter(item => item.status === "approved").length})
                                </button>
                                <button
                                    onClick={() => setFilter("pending")}
                                    className={`px-2 py-1 rounded-lg text-sm ${filter === "pending" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-800"}`}
                                >
                                    Pending ({waitingCount})
                                </button>
                            </div>

                            <div className="ml-auto">
                                <SortDropdown
                                    options={["Latest", "Oldest"]}
                                    onSortChange={(value) => setSortOrder(value.toLowerCase())}
                                />
                            </div>

                        </div>

                        <div className="flex flex-col md:flex-row gap-5">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[60vh] w-full">
                                    <img src={emptyCart} className="w-64 h-64 mb-3" />
                                    <h2 className="text-[22px] font-bold">Your Cart is Empty</h2>
                                    <p className="text-gray-500 text-center max-w-sm mb-4">
                                        Looks like you haven’t added any items yet.
                                    </p>
                                    <button
                                        onClick={() => navigate("/browse")}
                                        className="bg-white border border-[#7A1CA9] text-[#7A1CA9] px-3 py-1.5 text-sm rounded-lg shadow hover:bg-gray-50"
                                    >
                                        Go to Shop ➔
                                    </button>
                                </div>
                            ) : (
                                <>

                                    {/* LEFT — CART ITEMS */}
                                    <div className="flex-1 space-y-3">

                                        {waitingCount > 0 && filter !== "approved" && (
                                            <div className="bg-yellow-50 text-yellow-900 border border-yellow-200 px-4 py-4 rounded-lg mb-3 text-sm">
                                                {waitingCount} item{waitingCount > 1 ? "s" : ""} are waiting for owner approval before you can proceed to booking.
                                            </div>
                                        )}
                                        {sortedItems.map(item => (
                                            <div key={item.id} className="relative bg-white p-4 border rounded-xl shadow-sm hover:shadow-md">
                                                {item.status === "approved" || item.status === "pending" ? (
                                                    <button
                                                        onClick={() => openCancelModal(item.id)}
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 px-3 py-1 text-sm font-medium border border-red-300 rounded-lg bg-red-50"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 px-3 py-1 text-sm font-medium border border-red-300 rounded-lg bg-red-50"
                                                    >
                                                        Remove to cart
                                                    </button>
                                                )}


                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    <img src={item.image} className="w-40 h-40 object-contain rounded" />
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <h2 className="font-semibold text-[16px]">{item.name}</h2>

                                                        {/* Owner + Labels */}
                                                        <div className="flex flex-col text-[14px]">
                                                            <div className="flex items-center gap-1 text-gray-500">
                                                                <User className="w-4 h-4" />
                                                                <span>Listed by {item.owner}</span>
                                                            </div>

                                                            <div
                                                                className={`mt-2 inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full w-fit ${item.status === "approved"
                                                                    ? "bg-green-200 text-green-800"
                                                                    : item.status === "pending"
                                                                        ? "bg-yellow-200 text-yellow-800"
                                                                        : !item.bookedFrom && !item.bookedTo
                                                                            ? "bg-gray-200 text-gray-800"
                                                                            : "bg-yellow-200 text-yellow-800"
                                                                    }`}
                                                            >


                                                                {item.status === "approved" && <CircleCheckBig className="w-3 h-3" />}
                                                                {item.status === "pending" && <Clock className="w-3 h-3" />}
                                                                <span>
                                                                    {item.status === "approved"
                                                                        ? "Approved"
                                                                        : item.status === "pending"
                                                                            ? "Waiting for Approval"
                                                                            : !item.bookedFrom && !item.bookedTo
                                                                                ? "Not Booked Yet"
                                                                                : "Pending"}
                                                                </span>
                                                            </div>

                                                            {/* Days Available (only for Not Booked Yet items) */}
                                                            {(!item.bookedFrom && !item.bookedTo && item.status !== "approved" && item.status !== "pending") && (
                                                                <div className="flex items-center gap-4 mt-2 text-gray-600 text-[13px]">
                                                                    <Calendar className="w-4 h-4" />

                                                                    <span>
                                                                        {item.daysAvailable || item.days || item.availableDays || 0} days available
                                                                    </span>
                                                                </div>
                                                            )}


                                                            {item.status !== "not-booked" && item.bookedFrom && item.bookedTo ? (
                                                                <div className="flex items-center gap-6 mt-2 text-gray-600 text-[13px]">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="w-4 h-4" />
                                                                        <span>{item.bookedFrom} - {item.bookedTo}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Truck className="w-4 h-4" />
                                                                        <span>{item.shipping > 0 ? `Delivery (₱${Math.round(item.shipping)})` : "Delivery (Free)"}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <ShieldAlert className="w-4 h-4" />
                                                                        <span>Security Deposit (₱{item.securityDeposit ?? 0})</span>
                                                                    </div>
                                                                </div>
                                                            ) : null}


                                                        </div>

                                                        <div className="mt-0">
                                                            <hr className="my-2" />
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-gray-800 text-[17px] font-bold mt-1.5">₱{item.price.toFixed(2)}/day</p>

                                                                {(item.status === "approved" || item.status === "pending") && (() => {
                                                                    const itemTotals = calculateItemTotal(item);
                                                                    const totalWithDeposit = itemTotals.total + (item.securityDeposit || 0);

                                                                    return (
                                                                        <div className="flex justify-between mt-2 mr-28 text-[14px]">
                                                                            <span className="mr-6">Subtotal: ₱{itemTotals.subtotal.toFixed(2)}</span>
                                                                            <span className="text-[15px] font-semibold">
                                                                                Total: ₱{totalWithDeposit.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })()}



                                                                {item.status === "approved" ? (
                                                                    <button
                                                                        onClick={() => alert(`Contacting owner: ${item.owner}`)}
                                                                        className="px-3 py-1.5 mt-2 text-sm border rounded-lg flex items-center gap-1 hover:bg-gray-50"
                                                                    >
                                                                        <MessageCircle className="w-4 h-4 mr-0.5" />
                                                                        Message Owner
                                                                    </button>
                                                                ) : item.status === "pending" ? (
                                                                    <button
                                                                        onClick={() => navigate(`/edit-booking/${item.id}`)}
                                                                        className="px-3 py-1.5 mt-2  text-sm border rounded-lg flex items-center gap-1 hover:bg-gray-50"
                                                                    >
                                                                        <Pencil className="w-4 h-4 mr-0.5" />
                                                                        Edit Booking Details
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => navigate(`/booking/${item.id}`)}
                                                                        className="px-3 py-1.5 mt-2  text-sm border rounded-lg flex items-center gap-1 hover:bg-gray-50"
                                                                    >
                                                                        <CalendarPlus className="w-4 h-4 mr-0.5" />
                                                                        Continue to Booking
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* RIGHT — RENTAL SUMMARY */}
                                    <div className="w-full md:w-1/3">
                                        <div className="sticky top-20 space-y-3">
                                            <div className="bg-white p-4 rounded-lg border shadow-sm space-y-2">
                                                <h2 className="font-semibold text-[16px]">Rental Summary</h2>

                                                <div className="flex items-center text-gray-600 gap-1.5">
                                                    <Package className="w-4 h-4" />
                                                    <p className="text-sm text-gray-600">{cartItems.length} item{cartItems.length > 1 ? "s" : ""} in cart</p>
                                                </div>

                                                {/* Approved / Waiting Counts */}
                                                <div className="flex flex-col gap-1 mt-3  ml-4 text-sm">
                                                    {cartItems.filter(item => item.status === "approved").length > 0 && (
                                                        <div className="flex items-center gap-1.5 text-green-700">
                                                            <CircleCheckBig className="w-3 h-3" />
                                                            <span>{cartItems.filter(item => item.status === "approved").length} approved</span>
                                                        </div>
                                                    )}
                                                    {waitingCount > 0 && (
                                                        <div className="flex items-center mb-2 gap-1.5 text-yellow-700">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{waitingCount} waiting for approval</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <hr className="my-2" />

                                                {/* Approved Items List */}
                                                {cartItems.filter(item => item.status === "approved").length > 0 && (
                                                    <div className="text-sm space-y-2">
                                                        <p className="font-semibold mb-3">Approved Items</p>
                                                        {cartItems.filter(item => item.status === "approved").map(item => (
                                                            <div key={item.id} className="flex justify-between">
                                                                <span>{item.name}</span>
                                                                <span>₱{item.price.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <hr className="my-2" />

                                                {/* Subtotal / Shipping / Discount / Total for approved items */}
                                                <div className="text-sm space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Subtotal</span>
                                                        <span>₱{approvedTotals.subtotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Shipping</span>
                                                        <span>{approvedTotals.shipping === 0 ? "Free" : `₱${approvedTotals.shipping.toFixed(2)}`}</span>
                                                    </div>
                                                    {approvedTotals.discount > 0 && (
                                                        <div className="flex justify-between text-green-700">
                                                            <span>Discount</span>
                                                            <span>-₱{approvedTotals.discount.toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span>Security Deposit</span>
                                                        <span>₱{approvedSecurityDepositTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold text-lg">
                                                        <span>Total</span>
                                                        <span className="text-gray-900">₱{approvedGrandTotalWithDeposit.toFixed(2)}</span>
                                                    </div>

                                                </div>


                                                {/* Info box */}
                                                <div className="flex flex-col space-y-3">
                                                    {cartItems.filter(item => item.status === "approved").length > 0 && (
                                                        <div className="bg-blue-50 text-blue-700 border border-blue-200 p-4 rounded-md text-sm">
                                                            Continue to booking for each approved item to finalize your rental dates and complete payment.
                                                        </div>
                                                    )}

                                                    {waitingCount > 0 && (
                                                        <div className="bg-yellow-50 text-yellow-900 border border-yellow-200 p-4 rounded-md text-sm">
                                                            {waitingCount} item{waitingCount > 1 ? "s" : ""} are waiting for owner approval. You'll be notified once approved.
                                                        </div>
                                                    )}
                                                </div>



                                            </div>
                                            <div className="bg-gray-100 p-4 rounded-lg text-gray-700 text-sm"> <ul className="space-y-1"> <li>✓ Secure checkout</li> <li>✓ Fast approval process</li> <li>✓ Owner verification guarantee</li> </ul> </div>
                                        </div>
                                    </div>

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <CancelConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={confirmCancelBooking}
            />

            <Footer />
        </div>
    );
};

export default CartPage;
