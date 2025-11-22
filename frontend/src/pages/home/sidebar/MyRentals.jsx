import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import Footer from "../../../components/layouts/Footer";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarPlus, MapPin, Eye, MessageCircle, CircleOff, BadgeCheck, CircleCheckBig, ClockFading } from "lucide-react";
import mockListings from "../../../data/mockData";
import sampleUserCart from "../../../data/sampleUserCart";
import CancelConfirmationModal from "../../../components/modals/CancelModal";
import { ViewDetailsModal } from "../../../components/modals/ViewDetailsModal";
import SortDropdown from "../../../components/filters/SortDropdown";
import { getFakeUser, generateFakeToken } from "../../../utils/fakeAuth";

const MyRentalsPage = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedRentalId, setSelectedRentalId] = useState(null);


    const [rentals, setRentals] = useState([]);
    const [filter, setFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("latest");

    useEffect(() => {
        let user = getFakeUser();

        if (!user) {
            const token = generateFakeToken();
            localStorage.setItem("fakeToken", token);
            user = getFakeUser();
        }

        const cartData = user.cart?.length ? user.cart : sampleUserCart;

        const merged = cartData
            .map(r => {
                const product = mockListings.find(p => p.id === r.id);
                if (!product) return null;

                const parsedPrice = parseFloat(
                    (product.price || "0").toString().replace(/[^0-9.]/g, "")
                );

                return {
                    ...product,
                    ...r,
                    price: parsedPrice,
                    totalAmount: parsedPrice * (r.days || 1),
                    status:
                        r.status && r.status.trim() !== ""
                            ? r.status
                            : (!r.bookedFrom || !r.bookedTo)
                                ? "cancelled"
                                : "pending",
                };
            })
            .filter(Boolean);

        const limited = [];

        const approved = merged.filter(r => r.status === "approved").slice(0, 1);
        const pending = merged.filter(r => r.status === "pending").slice(0, 2);
        const cancelled = merged.filter(r => r.status === "cancelled").slice(0, 1);
        const completed = merged.filter(r => r.status === "completed").slice(0, 1);

        limited.push(...approved, ...pending, ...cancelled, ...completed);

        setRentals(limited);
    }, []);


    const handleCancel = (id) => {
        setRentals(prev =>
            prev.map(item =>
                item.id === id ? { ...item, status: "cancelled" } : item
            )
        );
    };

    const confirmCancel = () => {
        handleCancel(selectedId);
        setShowModal(false);
        setSelectedId(null);
    };


    const filtered = rentals.filter((r) => {
        if (filter === "approved") return r.status === "approved";
        if (filter === "pending") return r.status === "pending";
        if (filter === "cancelled") return r.status === "cancelled";
        if (filter === "completed") return r.status === "completed";

        return true; // all
    });

    const sorted = [...filtered].sort((a, b) => {
        const aDate = new Date(a.bookedFrom || a.addedAt || Date.now());
        const bDate = new Date(b.bookedFrom || b.addedAt || Date.now());
        return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#fbfbfb]">
            {/* MAIN FLEX */}
            <div className="flex flex-1">
                <Sidebar />

                {/* MAIN CONTENT */}
                <div className="cart-scale flex-1 pt-12 mb-15">
                    <h1 className="text-[20px] font-bold">My Rentals</h1>
                    <p className="text-gray-500 mb-8 text-[15px]">
                        View and manage the items you have booked.
                    </p>

                    {/* FILTER + SORT */}
                    <div className="flex items-center mb-4 gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "all"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100"
                                }`}>
                            All ({rentals.length})
                        </button>

                        <button
                            onClick={() => setFilter("approved")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "approved"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                            Approved (
                            {rentals.filter((r) => r.status === "approved").length}
                            )
                        </button>

                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "pending"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                            Pending (
                            {rentals.filter((r) => r.status === "pending").length}
                            )
                        </button>

                        <button
                            onClick={() => setFilter("cancelled")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "cancelled"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                            Cancelled ({rentals.filter((r) => r.status === "cancelled").length})
                        </button>

                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "completed"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100 text-gray-800"
                                }`}>
                            Completed ({rentals.filter((r) => r.status === "completed").length})
                        </button>


                        {/* SORT DROPDOWN */}
                        <div className="ml-auto">
                            <SortDropdown
                                options={["Latest", "Oldest"]}
                                onSortChange={(value) => setSortOrder(value.toLowerCase())}
                            />
                        </div>
                    </div>

                    {/* EMPTY STATE */}
                    {sorted.length === 0 && (
                        <div className="text-center mt-20 text-gray-500">
                            <p>No rentals found.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {sorted.map((item) => (
                            <div
                                key={item.id}
                                className="relative bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                <span
                                    className={`absolute top-4 right-4 px-2 py-1 rounded-full text-[12.5px] font-medium flex items-center gap-1 ${item.status === "approved"
                                        ? "bg-purple-100 text-purple-700"
                                        : item.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : item.status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {item.status === "approved" && <BadgeCheck className="w-4 h-4" />}
                                    {item.status === "pending" && <ClockFading className="w-4 h-4" />}
                                    {item.status === "cancelled" && <CircleOff className="w-4 h-4" />}
                                    {item.status === "completed" && <CircleCheckBig className="w-4 h-4" />}

                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>

                                <div className="flex gap-5">
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <img
                                            src={item.image}
                                            className="w-28 h-28 rounded-6xl object-cover"
                                            alt={item.name}
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h2 className="font-semibold text-[18px]">{item.name}</h2>
                                            <span className="text-xs px-1 bg-gray-200 text-gray-700 rounded-md border">
                                                {item.category}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600">Listed by {item.owner}</p>

                                        <div className="mt-3 mb-3 flex items-center gap-20 text-sm text-gray-800">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 mr-1 opacity-60" />
                                                    {item.bookedFrom
                                                        ? new Date(item.bookedFrom).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })
                                                        : "-"}{" "}
                                                    –{" "}
                                                    {item.bookedTo
                                                        ? new Date(item.bookedTo).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        })
                                                        : "-"}
                                                </div>

                                                {item.bookedFrom && item.bookedTo && (
                                                    <div className="flex items-center gap-1 text-gray-600">
                                                        <ClockFading className="w-4 h-4 mr-1 opacity-65" />
                                                        {(() => {
                                                            let daysCount = item.days || 1;
                                                            if (item.bookedFrom && item.bookedTo) {
                                                                const from = new Date(item.bookedFrom);
                                                                const to = new Date(item.bookedTo);
                                                                const msPerDay = 1000 * 60 * 60 * 24;
                                                                const diff = Math.floor((to - from) / msPerDay) + 1;
                                                                daysCount = diff > 0 ? diff : daysCount;
                                                            }
                                                            return `${daysCount} day${daysCount > 1 ? "s" : ""}`;
                                                        })()}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4 mr-1 opacity-60" />
                                                {mockListings.find(l => l.id === item.id)?.location || "Unknown"}
                                            </div>
                                        </div>

                                        {/* PRICE INFO */}
                                        <div className="mt-5 flex items-center justify-between">
                                            <div className="flex items-center gap-12">
                                                <div>
                                                    <p className="text-sm text-gray-500">Rent per day</p>
                                                    <p className="font-medium text-[18px] text-gray-800">₱{item.price}</p>
                                                </div>

                                                {item.status !== "cancelled" && (
                                                    <div>
                                                        <p className="text-sm text-gray-500">Total amount</p>
                                                        <p className="font-semibold text-[18px] text-[#7A1CA9]">
                                                            {(() => {
                                                                const listing = mockListings.find(l => l.id === item.id);
                                                                const pricePerDay = listing
                                                                    ? Number((listing.price || "₱0").toString().replace(/[^\d.]/g, ""))
                                                                    : 0;
                                                                let daysCount = item.days || 1;
                                                                if (item.bookedFrom && item.bookedTo) {
                                                                    const from = new Date(item.bookedFrom);
                                                                    const to = new Date(item.bookedTo);
                                                                    const msPerDay = 1000 * 60 * 60 * 24;
                                                                    const diff = Math.floor((to - from) / msPerDay) + 1;
                                                                    daysCount = diff > 0 ? diff : daysCount;
                                                                }
                                                                const shippingFee = typeof item.shipping === "number"
                                                                    ? item.shipping
                                                                    : listing?.shipping || 0;
                                                                const discountPercent =
                                                                    typeof item.couponDiscount === "number"
                                                                        ? item.couponDiscount
                                                                        : listing?.couponDiscount || 0;
                                                                const securityDeposit = item.securityDeposit || 0;
                                                                const subtotal = pricePerDay * daysCount;
                                                                const discountAmount = (subtotal * discountPercent) / 100;
                                                                const total = subtotal - discountAmount + shippingFee + securityDeposit;

                                                                return `₱${total.toFixed(2)}`;
                                                            })()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex items-center gap-2 justify-end w-full mt-3">
                                    {(item.status === "approved" || item.status === "pending") && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedRentalId(item.id);
                                                    setDetailsModalOpen(true);
                                                }}
                                                className="px-3 py-1.5 text-sm border rounded-lg font-medium flex items-center gap-1 hover:bg-gray-50"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View More Details
                                            </button>

                                            <button className="px-3 py-1.5 text-sm border rounded-lg font-medium flex items-center gap-1 hover:bg-gray-50">
                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                Message Owner
                                            </button>
                                        </>
                                    )}

                                    {item.status === "cancelled" && (
                                        <button
                                            onClick={() => setRentals(prev => prev.filter(r => r.id !== item.id))}
                                            className="px-3 py-1.5 text-sm border rounded-lg text-red-500 border-red-300 bg-red-50 hover:bg-red-100"
                                        >
                                            Remove
                                        </button>
                                    )}

                                    {item.status === "completed" && (
                                        <>
                                            <button
                                                onClick={() => alert(`Re-renting ${item.name}`)}
                                                className="px-3 py-1.5 text-sm border rounded-lg font-medium flex items-center gap-1 hover:bg-gray-50"
                                            >
                                                <CalendarPlus className="w-4 h-4 mr-1" />
                                                Book Again
                                            </button>

                                            <button className="px-3 py-1.5 text-sm border rounded-lg font-medium flex items-center gap-1 hover:bg-gray-50">
                                                <MessageCircle className="w-4 h-4 mr-1" />
                                                Message Owner
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            </div>
            <CancelConfirmationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmCancel}
            />
            <ViewDetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                rentalData={rentals}
                itemId={selectedRentalId}
            />
            <Footer />
        </div>
    );
};

export default MyRentalsPage;
