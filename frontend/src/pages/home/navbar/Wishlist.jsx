import React, { useEffect, useState } from "react";
import { MapPin, Calendar, ShoppingCart } from "lucide-react";
import Footer from "../../../components/layouts/Footer";
import Sidebar from "../../../components/layouts/Sidebar";
import SortDropdown from "../../../components/filters/SortDropdown";
import emptyWishlist from "../../../assets/empty-wishlist.png";
import emptyItems from "../../../assets/empty-listings.png";
import mockListings from "../../../data/mockData";
import { getFakeUser, generateFakeToken } from "../../../utils/fakeAuth";
import { Base64 } from "js-base64";

const WishlistPage = () => {
    const [wishlistIds, setWishlistIds] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);

    const categories = [
        "All",
        "Gadgets",
        "Clothes",
        "Electronics",
        "Vehicles",
        "Cameras",
        "Furniture",
        "Musical Instruments",
        "Tools",
        "Books",
        "Appliances",
        "Sports",
        "Outdoors",
    ];

    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");

    useEffect(() => {
        let filtered = mockListings.filter((item) =>
            wishlistIds.includes(item.id)
        );

        // CATEGORY FILTER
        if (filter !== "All") {
            filtered = filtered.filter((item) => item.category === filter);
        }

        // SORTING
        filtered.sort((a, b) => {
            const dateA = new Date(a.availableFrom);
            const dateB = new Date(b.availableFrom);

            return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
        });

        setWishlistItems(filtered);
    }, [wishlistIds, filter, sortOrder]);


    // Load user wishlist
    useEffect(() => {
        let user = getFakeUser();

        if (!user) {
            const token = generateFakeToken();
            localStorage.setItem("fakeToken", token);
            user = getFakeUser();
        }

        setWishlistIds(user.wishlist || []);
    }, []);

    // Pull data from mockListings
    useEffect(() => {
        const filtered = mockListings.filter((item) =>
            wishlistIds.includes(item.id)
        );
        setWishlistItems(filtered);
    }, [wishlistIds]);

    // Remove item
    const removeFromWishlist = (id) => {
        const updated = wishlistIds.filter((itemId) => itemId !== id);
        setWishlistIds(updated);

        const user = getFakeUser();
        const updatedUser = { ...user, wishlist: updated };
        const base64Payload = Base64.encode(JSON.stringify(updatedUser));
        const newToken = `fakeHeader.${base64Payload}.fakeSignature`;
        localStorage.setItem("fakeToken", newToken);
    };

    const hasWishlistItems = wishlistIds.length > 0;
    const hasFilteredItems = wishlistItems.length > 0;


    return (
        <div className="flex flex-col min-h-screen bg-[#fbfbfb]">
            <div className="flex flex-1">
                {/* LEFT SIDEBAR */}
                <Sidebar />

                {/* MAIN CONTENT */}
                <div className="cart-scale flex-1 mb-10">
                    <div className="max-w-8xl mx-auto pt-12">
                        <div>
                            <h1 className="text-[20px] font-bold">Your Wishlist</h1>
                            <p className="text-[15px] text-gray-500 mb-6">All Saved Items</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4 items-center">

                            {/* CATEGORY BUTTONS */}
                            <div className="flex gap-1.5 flex-wrap">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilter(cat)}
                                        className={`px-2 py-1 rounded-lg text-sm ${filter === cat
                                            ? "bg-[#7A1CA9] text-white"
                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {cat === "All"
                                            ? `All Items (${wishlistIds.length})`
                                            : `${cat}`
                                        }
                                    </button>
                                ))}
                            </div>

                            {/* SORT DROPDOWN */}
                            <div className="ml-auto">
                                <SortDropdown
                                    options={["Latest", "Oldest"]}
                                    onSortChange={(value) => setSortOrder(value.toLowerCase())}
                                />
                            </div>
                        </div>


                        <div className="flex flex-col md:flex-row gap-1">

                            {!hasFilteredItems ? (
                                hasWishlistItems ? (

                                    <div className="flex flex-col items-center justify-center h-[40vh] w-full">
                                        <img src={emptyItems} className="w-92 h-64 mt-32" />
                                        <p className="text-gray-500 text-center max-w-sm">
                                            No items found in this category.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
                                        <img src={emptyWishlist} className="w-92 h-64 mb-3" />
                                        <h2 className="text-[22px] font-bold">Your Wishlist is Empty</h2>
                                        <p className="text-gray-500 text-center max-w-sm mb-4">
                                            Looks like you haven’t saved any items yet.
                                        </p>

                                        <button
                                            onClick={() => (window.location.href = "/browse")}
                                            className="bg-white border border-[#7A1CA9] text-[#7A1CA9] px-3 py-1.5 text-sm rounded-lg shadow hover:bg-gray-50 transition"
                                        >
                                            Browse Items ➔
                                        </button>
                                    </div>
                                )
                            ) : (


                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 place-items-center">
                                    {wishlistItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl shadow-sm hover:shadow-lg p-5 transition-all bg-white w-full max-w-[350px] mx-auto"

                                        >
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 px-3 py-1 text-sm font-medium border border-red-300 rounded-lg bg-red-50 z-20"
                                            >
                                                Remove
                                            </button>

                                            <div className="relative w-full h-56 mx-auto rounded-xl flex items-center justify-center overflow-hidden bg-white">

                                                <img
                                                    src={item.image}
                                                    className="max-h-full max-w-full object-contain transition-all duration-300 hover:scale-105"
                                                />
                                                {item.featured && (
                                                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                                                        Featured
                                                    </div>
                                                )}
                                                {item.sale && (
                                                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                                                        Sale
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-[16px] mb-1">{item.name}</h3>
                                                <p className="text-sm text-gray-500 mb-2">by {item.owner}</p>

                                                <div className="flex items-center gap-1 text-gray-600 text-sm mb-1">
                                                    <MapPin size={15} />
                                                    {item.location}
                                                </div>

                                                <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
                                                    <Calendar size={15} />
                                                    {item.daysAvailable || item.days || item.availableDays} days available
                                                </div>

                                                <p className="text-[#7A1CA9] font-bold text-[18px] mb-4">
                                                    {item.price}{" "}
                                                    <span className="text-sm text-gray-600"></span>
                                                </p>

                                                <button className="w-full bg-[#7A1CA9] px-3 py-2 text-sm text-white border rounded-lg 
    hover:bg-purple-700 transition flex items-center justify-center gap-2">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </button>

                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default WishlistPage;
