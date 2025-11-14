import React, { useEffect, useState } from "react";
import { Heart, MapPin, Star, ShoppingCart, Check } from "lucide-react";
import SortDropdown from "../../components/SortDropdown";
import FilterSidebar from "../../components/FilterSidebar";
import Navbar from "../../components/MainNav";
import banner from "../../assets/banner.png";
import Footer from "../../components/Footer";
import dayjs from "dayjs";
import mockListings from "../../data/mockData";

const BrowseRentals = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        location: "",
        priceRange: [100, 1000],
        fromDate: null,
        toDate: null,
        rating: null,
    });
    const [sortOption, setSortOption] = useState("Popular");
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    const handleAddToCart = (itemId) => {
        if (!cartItems.includes(itemId)) {
            setCartItems((prev) => [...prev, itemId]);

            setTimeout(() => {
                setCartItems((prev) => prev.filter((id) => id !== itemId));
            }, 2000);
        }
    };

    // wishlist
    const toggleWishlist = (id) => {
        setWishlist((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    // fetch rental listings
    useEffect(() => {
        setLoading(true);
        try {
            setListings(mockListings);
            setFilteredListings(mockListings);
        } catch (error) {
            console.error("Error fetching listings:", error);
        } finally {
            setLoading(false);
        }
    }, []);


    // filtering + sorting
    useEffect(() => {
        let filtered = [...listings];

        // category filter
        if (filters.category) {
            filtered = filtered.filter(
                (item) =>
                    item.category.toLowerCase().trim() ===
                    filters.category.toLowerCase().trim()
            );
        }

        // Location filter
        if (filters.location) {
            filtered = filtered.filter((item) =>
                item.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        // Price range filter
        if (filters.priceRange && Array.isArray(filters.priceRange)) {
            const [min, max] = filters.priceRange;
            filtered = filtered.filter((item) => {
                const numericPrice = parseFloat(
                    String(item.price).replace(/[^0-9.]/g, "")
                );
                return numericPrice >= min && numericPrice <= max;
            });
        }

        // rating filter 
        if (filters.rating) {
            const min = filters.rating;
            const max = filters.rating + 0.9;

            filtered = filtered.filter((item) => {
                const rating = Number(item.rating);
                return rating >= min && rating <= max;
            });
        }

        // availability dates filter 
        if (
            filters.fromDate &&
            filters.toDate &&
            (!dayjs(filters.fromDate).isSame(dayjs(), "day") ||
                !dayjs(filters.toDate).isSame(dayjs(), "day"))
        ) {
            filtered = filtered.filter((item) => {
                const availableFrom = dayjs(item.availableFrom);
                const availableTo = dayjs(item.availableTo);
                const filterStart = dayjs(filters.fromDate).startOf("day");
                const filterEnd = dayjs(filters.toDate).endOf("day");

                const overlaps =
                    (availableFrom.isSame(filterStart, "day") &&
                        availableTo.isSame(filterEnd, "day")) ||
                    (availableFrom.isBefore(filterEnd, "day") &&
                        availableTo.isAfter(filterStart, "day")) ||
                    (availableFrom.isSame(filterStart, "day") &&
                        availableTo.isAfter(filterStart, "day")) ||
                    (availableFrom.isBefore(filterEnd, "day") &&
                        availableTo.isSame(filterEnd, "day"));

                return overlaps;
            });
        }

        // sorting logic
        if (sortOption === "Lowest Price") {
            filtered.sort(
                (a, b) =>
                    parseFloat(a.price.replace(/[^0-9.]/g, "")) -
                    parseFloat(b.price.replace(/[^0-9.]/g, ""))
            );
        } else if (sortOption === "Highest Price") {
            filtered.sort(
                (a, b) =>
                    parseFloat(b.price.replace(/[^0-9.]/g, "")) -
                    parseFloat(a.price.replace(/[^0-9.]/g, ""))
            );
        } else if (sortOption === "Newest") {
            filtered.sort(
                (a, b) => new Date(b.availableFrom) - new Date(a.availableFrom)
            );
        } else if (sortOption === "Popular") {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        setFilteredListings(filtered);
    }, [filters, listings, searchQuery, sortOption]);

    // apply filters
    const handleApplyFilters = (filterData) => {
        setFilters(filterData);
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Navbar */}
            <Navbar onSearch={(query) => setSearchQuery(query)} />

            {/* Banner */}
            <div className="w-full">
                <img
                    src={banner}
                    alt="Browse Rentals Banner"
                    className="w-full h-auto object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden px-6 py-6 gap-6 bg-white">

                {/* Filter Sidebar */}
                <FilterSidebar onApplyFilters={handleApplyFilters} />

                {/* Listings Section */}
                <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-medium text-gray-800 flex items-center gap-1">
                            <span className="inline-block w-3 h-6 bg-[#7A1CA9] rounded mr-2"></span>
                            {filters.category || "All Rentals"}{" "}
                            <span className="text-[#9129c5] font-normal ml-1">
                                ({filteredListings.length})
                            </span>
                        </h2>
                        <SortDropdown onSortChange={setSortOption} />
                    </div>

                    {/* Loading or No Results */}
                    {loading ? (
                        <div className="text-center text-gray-500 py-20">
                            Loading listings...
                        </div>
                    ) : filteredListings.length === 0 ? (
                        <div className="text-center text-gray-500 py-20">
                            No items found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4">
                            {filteredListings.map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl shadow-sm hover:shadow-lg transition-all bg-white p-3"
                                >
                                    <div className="relative bg-gray-100 aspect-square rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                                        <div className="absolute top-3 right-3 flex gap-1 z-50">
                                            <button
                                                onClick={() => toggleWishlist(item.id)}
                                                className="bg-white rounded-full shadow p-1 hover:bg-gray-200 transition"
                                            >
                                                <Heart
                                                    size={18}
                                                    strokeWidth={1.5}
                                                    className={`transition ${wishlist.includes(item.id)
                                                        ? "fill-[#ec0b0b] stroke-[#ec0b0b]"
                                                        : "stroke-[#af50df]"
                                                        }`}
                                                />
                                            </button>

                                            <button className="bg-white rounded-full shadow p-1 hover:bg-gray-200 transition">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5 text-gray-600"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Product Image */}
                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="absolute w-[95%] h-[95%] object-contain transition-transform duration-300 hover:scale-110"
                                            />
                                        </div>

                                        {/* Add to Cart / Book Buttons */}
                                        <div className="flex w-full rounded-b-2xl overflow-hidden">
                                            <button className="flex-[0.9] bg-[#7A1CA9] hover:bg-[#681690] text-white text-[12.5px] font-medium py-3 flex justify-center items-center transition">
                                                Book Item
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(item.id)}
                                                className={`flex-[1] border border-[#7A1CA9] rounded-br-2xl font-medium py-3 flex justify-center items-center gap-1 transition-all duration-300 text-[12.5px] ${cartItems.includes(item.id)
                                                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                                                    : "text-[#7A1CA9] hover:bg-purple-100"
                                                    }`}
                                            >
                                                {cartItems.includes(item.id) ? (
                                                    <>
                                                        <Check size={16} className="text-white" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={16} className="text-[#7A1CA9]" />
                                                        Add To Cart
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                    </div>

                                    {/* Product Info */}
                                    <div className="text-left mt-3">
                                        <div className="flex justify-between items-center">
                                            <p className="text-gray-800 font-semibold text-sm mt-2 mb-1">
                                                {item.name}
                                            </p>

                                            {/* Rating */}
                                            <div className="flex items-center text-yellow-500 text-xs">
                                                {Array.from({ length: 5 }).map((_, index) => {
                                                    const starValue = index + 1;
                                                    const isFull = item.rating >= starValue;
                                                    const isHalf =
                                                        !isFull && item.rating >= starValue - 0.5;
                                                    const uniqueId = `half-${item.id}-${index}`;

                                                    if (isFull) {
                                                        return (
                                                            <Star
                                                                key={index}
                                                                size={14}
                                                                fill="#facc15"
                                                                stroke="#facc15"
                                                                className="mr-[2px]"
                                                            />
                                                        );
                                                    } else if (isHalf) {
                                                        return (
                                                            <svg
                                                                key={index}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                                width="14"
                                                                height="14"
                                                                className="mr-[2px]"
                                                            >
                                                                <defs>
                                                                    <linearGradient id={uniqueId}>
                                                                        <stop offset="50%" stopColor="#facc15" />
                                                                        <stop
                                                                            offset="50%"
                                                                            stopColor="transparent"
                                                                        />
                                                                    </linearGradient>
                                                                </defs>
                                                                <path
                                                                    fill={`url(#${uniqueId})`}
                                                                    stroke="#facc15"
                                                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
                                  9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                                                />
                                                            </svg>
                                                        );
                                                    } else {
                                                        return (
                                                            <Star
                                                                key={index}
                                                                size={14}
                                                                fill="none"
                                                                stroke="#facc15"
                                                                className="mr-[2px]"
                                                            />
                                                        );
                                                    }
                                                })}
                                                <span className="text-gray-600 font-medium ml-1">
                                                    {item.rating}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-[#7A1CA9] font-bold text-sm mb-1">
                                            {item.price}
                                        </p>

                                        <div className="flex items-center text-gray-500 text-xs gap-1">
                                            <MapPin size={13} className="text-gray-500" />
                                            <span>{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default BrowseRentals;
