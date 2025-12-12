import React, { useEffect, useState, useRef, useContext } from "react";
import { MapPin, Calendar, Star, ShoppingBag } from "lucide-react";
import SortDropdown from "../../../components/dropdown/SortDropdown";
import WishlistItemCard from "../../../components/cards/WishlistItemCard";
import { AuthContext } from "../../../context/AuthContext";

import emptyWishlist from "../../../assets/empty-wishlist.png";
import emptyItems from "../../../assets/empty-listings.png";
import { ENDPOINTS, makeAPICall } from "../../../config/api";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, addToCart, isInitialized } = useContext(AuthContext);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("latest");

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

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    document.title = "Hirent — Wishlist";
    return () => {
      document.title = "Hirent";
    };
  }, []);

  // Filter & sort items using centralized wishlist state
  const displayedItems = wishlist
    .filter((item) => filter === "All" || item.category === filter)
    .sort((a, b) => {
      const dateA = new Date(a.availableFrom);
      const dateB = new Date(b.availableFrom);
      return sortOrder === "latest" ? dateB - dateA : dateA - dateB;
    });

  const handleAddToCollection = async (item) => {
    await addToCart(item, 1);
  };

  const hasWishlistItems = wishlist.length > 0;
  const hasFilteredItems = displayedItems.length > 0;

  return (
    <div className="flex flex-col min-h-screen pt-2 px-4 ml-4 pb-20 bg-gray-50">
      <div className="flex flex-1 ml-16">
        <div className="flex-1 mb-10">
          <div className="max-w-8xl mx-auto pt-8">
            <div className="p-1">
              <div className="flex items-start gap-5">
                <div className="flex items-start mr-4 gap-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
                    <Star className="w-8 h-8 text-[#a12fda]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-purple-900 mt-1">
                      Your Wishlist
                    </h1>
                    <p className="text-gray-500 text-sm">
                      Items you saved for later
                    </p>
                  </div>
                </div>

                <div className="w-full max-w-[950px] overflow-hidden">
                  <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex space-x-2 mt-5 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`flex-shrink-0 px-3 py-1 rounded-lg transition text-[13px] ${
                          filter === cat
                            ? "bg-[#7A1CA9] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-[#7A1CA9]/10"
                        }`}
                      >
                        {cat === "All"
                          ? `All Items (${wishlist.length})`
                          : `${cat}`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 items-center">
                  <div className="ml-auto mt-4">
                    <SortDropdown
                      options={["Latest", "Oldest"]}
                      onSortChange={(value) => setSortOrder(value.toLowerCase())}
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-200 mb-6" />

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
                    <h2 className="text-[22px] font-bold text-gray-700">
                      Your Wishlist is Empty
                    </h2>
                    <p className="text-gray-400 text-center max-w-sm mb-4">
                      Looks like you haven’t saved any items yet.
                    </p>

                    <button
                      onClick={() => (window.location.href = "/browse")}
                      className="bg-white border border-[#7A1CA9]/20  text-[#7A1CA9] px-3 py-1.5 text-sm rounded-lg shadow hover:bg-gray-50 transition"
                    >
                      Browse Items ➔
                    </button>
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-3 gap-y-4 place-items-center">
                  {displayedItems.map((item) => (
                    <WishlistItemCard
                      key={item._id}
                      item={item}
                      removeFromWishlist={toggleWishlist}
                      onAddToCollection={handleAddToCollection}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
