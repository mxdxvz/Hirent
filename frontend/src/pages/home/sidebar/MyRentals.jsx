import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Footer from "../../../components/Footer";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Eye, MessageCircle, CircleOff, CircleCheckBig, ClockFading } from "lucide-react";
import mockListings from "../../../data/mockData";
import sampleUserCart from "../../../data/sampleUserCart";
import { getFakeUser, generateFakeToken } from "../../../utils/fakeAuth";

const MyRentalsPage = () => {
    const navigate = useNavigate();

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

        limited.push(...approved, ...pending, ...cancelled);

        setRentals(limited);

    }, []);

    const handleCancel = (id) => {
        setRentals((prev) =>
            prev.map((r) =>
                r.id === id ? { ...r, status: "cancelled" } : r
            )
        );
        alert("Booking cancelled successfully.");
    };

    const filtered = rentals.filter((r) => {
        if (filter === "approved") return r.status === "approved";
        if (filter === "pending") return r.status === "pending";
        if (filter === "cancelled") return r.status === "cancelled";

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
                <div className="cart-scale flex-1 px-10 pt-12 pb-20">
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
                                : "bg-gray-100"
                                }`}>
                            Approved (
                            {rentals.filter((r) => r.status === "approved").length}
                            )
                        </button>

                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "pending"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100"
                                }`}>
                            Pending (
                            {rentals.filter((r) => r.status === "pending").length}
                            )
                        </button>

                        <button
                            onClick={() => setFilter("cancelled")}
                            className={`px-3 py-1 rounded-lg text-sm ${filter === "cancelled"
                                ? "bg-[#7A1CA9] text-white"
                                : "bg-gray-100"
                                }`}>
                            Cancelled ({rentals.filter((r) => r.status === "cancelled").length})
                        </button>


                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="ml-auto px-3 py-2 text-sm border rounded-lg bg-white">
                            <option value="latest">Newest</option>
                            <option value="oldest">Oldest</option>
                        </select>
                    </div>

                    {/* EMPTY STATE */}
                    {sorted.length === 0 && (
                        <div className="text-center mt-20 text-gray-500">
                            <p>No rentals found.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {sorted.map((item) => (
                            <div
                                key={item.id}
                                className="relative bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
                            >
                                <span
                                    className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${item.status === "approved"
                                        ? "bg-purple-100 text-purple-700"
                                        : item.status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {item.status === "approved" && <CircleCheckBig className="w-3 h-3" />}
                                    {item.status === "pending" && <ClockFading className="w-3 h-3" />}
                                    {item.status === "cancelled" && <CircleOff className="w-3 h-3" />}

                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>


                                <div className="flex gap-6">
                                    <img
                                        src={item.image}
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover"
                                        alt={item.name}
                                    />

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h2 className="font-semibold text-[18px]">{item.name}</h2>
                                            <span className="text-xs px-1 bg-gray-200 text-gray-700 rounded-md border">
                                                {item.category}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500">Listed by {item.owner}</p>


                                        <div className="mt-3 mb-3 flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {item.bookedFrom} – {item.bookedTo}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {item.location || "Unknown"}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-10">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Rent per day</p>
                                                <p className="font-bold text-[17px] text-gray-800">₱{item.price}</p>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Total amount</p>
                                                <p className="font-bold text-[17px] text-gray-800">₱{item.totalAmount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="flex justify-end items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/rental/${item.id}`)}
                                        className="px-3 py-1.5 text-sm border rounded-lg flex items-center gap-1 hover:bg-gray-50"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>

                                    <button className="px-3 py-1.5 text-sm border rounded-lg flex items-center gap-1 hover:bg-gray-50">
                                        <MessageCircle className="w-4 h-4" />
                                        Message Owner
                                    </button>

                                    {item.status === "pending" && (
                                        <button
                                            onClick={() => handleCancel(item.id)}
                                            className="px-3 py-1.5 text-sm border rounded-lg text-red-500 border-red-300 bg-red-50 hover:bg-red-100"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyRentalsPage;
