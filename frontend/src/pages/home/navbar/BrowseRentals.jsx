import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ShoppingCart, Check, Eye } from "lucide-react";
import SortDropdown from "../../../components/filters/SortDropdown";
import FilterSidebar from "../../../components/filters/FilterSidebar";
import Navbar from "../../../components/layouts/MainNav";
import BannerCarousel from "../../../components/carousels/BannerCarousel";
import Footer from "../../../components/layouts/Footer";
import emptyListingsVector from "../../../assets/empty-listings.png";
import dayjs from "dayjs";
import mockListings from "../../../data/mockData";
import { Base64 } from 'js-base64';
import { getFakeUser, generateFakeToken } from '../../../utils/fakeAuth';

const BrowseRentals = () => {
    const navigate = useNavigate();
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



    useEffect(() => {
        let user = getFakeUser();
        if (!user) {
            const token = generateFakeToken();
            localStorage.setItem("fakeToken", token);
            user = getFakeUser();
        }

        // Load user's cart from token
        setCartItems(user.cart || []);
    }, []);
    const [wishlist, setWishlist] = useState([]);
    const [justAdded, setJustAdded] = useState([]);


    const handleAddToCart = (item) => {
        const existingCart = cartItems || [];

        if (!existingCart.find((i) => i.id === item.id)) {
            const newCartItem = {
                ...item,
                days: 1,
                userEnteredCoupon: "",
                couponMessage: "",
                adjustedSubtotal: parseFloat(item.price.replace("₱", "").replace("/day", "")),
                addedAt: new Date().toISOString(),
            };

            const newCart = [...existingCart, newCartItem];
            setCartItems(newCart);

            // Update localStorage
            localStorage.setItem("cartItems", JSON.stringify(newCart));

            // Update fake user token
            const user = getFakeUser();
            const updatedUser = { ...user, cart: newCart };
            const base64Payload = Base64.encode(JSON.stringify(updatedUser));
            const newToken = `fakeHeader.${base64Payload}.fakeSignature`;
            localStorage.setItem("fakeToken", newToken);

            // Show temporary "Added" state
            setJustAdded((prev) => [...prev, item.id]);
            setTimeout(() => {
                setJustAdded((prev) => prev.filter((id) => id !== item.id));
            }, 2000); // 2 seconds
        }
    };

    // wishlist
    const toggleWishlist = (id) => {
        let updatedWishlist = [];

        setWishlist((prev) => {
            updatedWishlist = prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id];
            return updatedWishlist;
        });

        const user = getFakeUser();
        const updatedUser = { ...user, wishlist: updatedWishlist };
        const base64Payload = Base64.encode(JSON.stringify(updatedUser));
        const newToken = `fakeHeader.${base64Payload}.fakeSignature`;

        localStorage.setItem("fakeToken", newToken);
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

    useEffect(() => {
        const user = getFakeUser();
        if (user && user.wishlist) {
            setWishlist(user.wishlist);
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
            <BannerCarousel />

            <div className="mt-32"></div>

            {/* Content */}
            <div className=" flex flex-1 overflow-hidden px-6 py-6 gap-6 bg-[#fbfbfb]">

                {/* Filter Sidebar */}
                <FilterSidebar onApplyFilters={handleApplyFilters} />

                {/* Listings Section */}
                <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[18px] font-medium text-gray-800 flex items-center gap-1">
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
                        <div className="flex flex-col items-center justify-center py-10">
                            {/* Empty image */}
                            <img
                                src={emptyListingsVector}
                                alt="No Listings"
                                className="w-72 h-72 mb-4 object-contain"
                            />

                            {/* Heading */}
                            <h2 className="text-[20px] font-bold text-gray-600 mb-2">
                                No Rentals Found
                            </h2>

                            {/* Description */}
                            <p className="text-[14px] text-gray-400 mb-6 text-center max-w-sm">
                                Sorry! We couldn't find any rentals matching your search or filters. Try adjusting your filters or search query.
                            </p>
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

                                            <button
                                                onClick={() => window.location.href = `/product/${item.id}`}
                                                className="bg-white rounded-full shadow p-1 hover:bg-gray-200 transition"
                                            >
                                                <Eye className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
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
                                            <button
                                                onClick={() => navigate(`/booking/${item.id}`)}
                                                className="flex-[0.9] bg-[#7A1CA9] hover:bg-[#681690] text-white text-[12.5px] font-medium py-2.5 flex justify-center items-center transition"
                                            >
                                                Book Item
                                            </button>

                                            <button
                                                onClick={() => handleAddToCart(item)}
                                                className={`flex-[1] border border-[#7A1CA9] rounded-br-2xl font-medium py-2.5 flex justify-center items-center gap-1 transition-all duration-300 text-[12.5px] ${justAdded.includes(item.id)
                                                    ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                                                    : "text-[#7A1CA9] hover:bg-purple-100"
                                                    }`}
                                            >
                                                {justAdded.includes(item.id) ? (
                                                    <>
                                                        <Check size={16} className="text-white" /> Added!
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={16} className="text-[#7A1CA9]" /> Add To Cart
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
