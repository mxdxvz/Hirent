import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SortDropdown from "../../../components/dropdown/SortDropdown";
import FilterSidebar from "../../../components/filters/FilterSidebar";
import Navbar from "../../../components/layouts/MainNav";
import BannerCarousel from "../../../components/carousels/BannerCarousel";
import emptyListingsVector from "../../../assets/empty-listings.png";
import dayjs from "dayjs";
import RentalItemCard from "../../../components/cards/RentalItemCard";
import { makeAPICall, ENDPOINTS } from "../../../config/api";

const BrowseRentals = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceRange: [0, 99999],
    fromDate: null,
    toDate: null,
    rating: null,
  });

  const [sortOption, setSortOption] = useState("Popular");
  const [wishlist, setWishlist] = useState([]);
  const [justAdded, setJustAdded] = useState([]);

  useEffect(() => {
    document.title = "Hirent — Browse";
    return () => (document.title = "Hirent");
  }, []);

  // -----------------------------
  // 🔥 FETCH ITEMS FROM API
  // -----------------------------
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await makeAPICall(ENDPOINTS.ITEMS.GET_ALL);
        setListings(data.items || []);
        setFilteredListings(data.items || []);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  // -----------------------------
  // 🔥 FETCH USER WISHLIST
  // -----------------------------
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await makeAPICall(ENDPOINTS.WISHLIST.GET);
        setWishlist(data.wishlist || []);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    loadWishlist();
  }, []);

  // -----------------------------
  // 🔥 ADD/REMOVE WISHLIST
  // -----------------------------
  const toggleWishlist = async (itemId) => {
    try {
      if (wishlist.includes(itemId)) {
        await makeAPICall(ENDPOINTS.WISHLIST.REMOVE(itemId), { method: "DELETE" });
        setWishlist((prev) => prev.filter((id) => id !== itemId));
      } else {
        await makeAPICall(ENDPOINTS.WISHLIST.ADD, {
          method: "POST",
          body: JSON.stringify({ itemId }),
        });
        setWishlist((prev) => [...prev, itemId]);
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

  // -----------------------------
  // 🔥 ADD TO COLLECTION (CART)
  // -----------------------------
  const handleAddToCollection = async (item) => {
    try {
      await makeAPICall(ENDPOINTS.CART.ADD, {
        method: "POST",
        body: JSON.stringify({ itemId: item._id, quantity: 1 }),
        headers: { "Content-Type": "application/json" },
      });

      // Show "added" animation
      setJustAdded((prev) => [...prev, item._id]);
      setTimeout(() => {
        setJustAdded((prev) => prev.filter((id) => id !== item._id));
      }, 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  // -----------------------------
  // 🔥 FILTER + SORT LOGIC
  // -----------------------------
  useEffect(() => {
    let filtered = [...listings];

    if (filters.category) {
      filtered = filtered.filter(
        (item) =>
          item.category?.toLowerCase().trim() ===
          filters.category.toLowerCase().trim()
      );
    }

    if (filters.location) {
      filtered = filtered.filter((item) =>
        item.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter((item) => {
        const price = Number(item.pricePerDay);
        return price >= min && price <= max;
      });
    }

    if (filters.fromDate && filters.toDate) {
      const start = dayjs(filters.fromDate);
      const end = dayjs(filters.toDate);

      filtered = filtered.filter((item) => {
        if (item.availabilityType === 'always' || item.availabilityType === 'specific-dates') {
          const isUnavailable = item.unavailableDates.some(range => {
            const unavailableStart = dayjs(range.start);
            const unavailableEnd = dayjs(range.end);
            return start.isBefore(unavailableEnd) && end.isAfter(unavailableStart);
          });
          return !isUnavailable;
        }
        return true;
      });
    }

    // Sorting
    if (sortOption === "Lowest Price") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortOption === "Highest Price") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortOption === "Newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "Popular") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredListings(filtered);
  }, [filters, listings, searchQuery, sortOption]);

  const handleApplyFilters = (data) => setFilters(data);

  return (
    <div className="flex flex-col ml-16 min-h-screen bg-white text-purple-900">
      <Navbar onSearch={setSearchQuery} />
      <BannerCarousel />
      <div className="mt-36"></div>

      <div className="flex flex-1 overflow-hidden px-4 py-8 gap-4 bg-[#fbfbfb]">
        <FilterSidebar onApplyFilters={handleApplyFilters} />

        <main className="flex-1 overflow-y-auto p-2 md:p-5 lg:p-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[20px] text-gray-800 font-semibold flex items-center gap-1">
              <span className="inline-block w-3 h-6 bg-[#7A1CA9] rounded mr-2"></span>
              {filters.category || "All Rentals"}
              <span className="text-[#9129c5] ml-1">({filteredListings.length})</span>
            </h2>

            <SortDropdown onSortChange={setSortOption} />
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-20">Loading listings...</div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <img src={emptyListingsVector} alt="No Listings" className="w-52 h-72 mb-4" />
              <h2 className="text-[24px] font-bold text-gray-600 mb-1">No Rentals Found</h2>
              <p className="text-[16px] text-gray-400 mb-6 text-center max-w-sm">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-4">
              {filteredListings.map((item) => (
                <RentalItemCard
                  key={item._id}
                  item={item}
                  wishlist={wishlist.map(i => i._id)}
                  justAdded={justAdded}
                  toggleWishlist={toggleWishlist}
                  handleAddToCollection={handleAddToCollection}
                  navigate={navigate}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BrowseRentals;
