import React, { useState, useEffect, useContext } from "react";
import { Star, MapPin, Heart, Check, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RentalItemCard = ({ item, justAdded, handleAddToCollection }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isLoggedIn } = useContext(AuthContext);

  // Derived state: Check if the item is in the wishlist on every render.
  const isFavorited = wishlist.some((w) => w && w._id === item._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // The context now handles optimistic updates and rollbacks.
    toggleWishlist(item);
  };

  const handleActionClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  return (
    <Link
      to={`/product/${item._id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all text-purple-900 p-3 flex flex-col"
    >
      {/* IMAGE SECTION */}
      <div className="relative bg-gray-100 aspect-square rounded-2xl overflow-hidden mb-3">
        {/* Wishlist + Eye Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 z-20">
          <button
            onClick={handleFavoriteClick}
            className="bg-white text-purple-900 rounded-full shadow p-1.5 hover:bg-gray-200 transition"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={`transition ${
                isFavorited
                  ? "fill-[#fd2c48] stroke-[#fd2c48]"
                  : "stroke-[#565656]"
              }`}
            />
          </button>
          <button
            onClick={(e) =>
              handleActionClick(e, () => navigate(`/product/${item._id}`))
            }
            className="bg-white text-[#565656] rounded-full shadow p-1.5 hover:bg-gray-200 transition"
          >
            <Eye size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={item.images?.[0] || "/placeholder.png"}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* BUTTONS INSIDE IMAGE */}
        <div className="absolute bottom-0 left-0 w-full flex z-20">
          <button
            onClick={(e) =>
              handleActionClick(e, () => navigate(`/booking/${item._id}`))
            }
            className="w-[100px] bg-[#7A1CA9] hover:bg-[#681690] text-white text-[13px] font-medium py-2 transition rounded-bl-2xl"
          >
            Book Item
          </button>

          <button
            onClick={(e) =>
              handleActionClick(e, () => handleAddToCollection(item))
            }
            className={`flex-1 border border-[#7A1CA9] text-[13px] font-medium py-2 transition-all duration-300 rounded-br-2xl ${
              justAdded.includes(item._id)
                ? "bg-green-500 border-green-500 text-white"
                : "bg-white text-[#7A1CA9] hover:bg-purple-50"
            }`}
          >
            {justAdded.includes(item._id) ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check size={14} /> Added
              </span>
            ) : (
              "Add To Collection"
            )}
          </button>
        </div>
      </div>

      {/* TITLE + RATING */}
      <div className="flex justify-between items-center">
        <p className="text-gray-900 font-semibold text-[15px] mb-0.5">
          {item.title}
        </p>

        <div className="flex items-center text-yellow-500 text-xs">
          <Star size={14} fill="#facc15" stroke="#facc15" className="mr-1" />
          <span className="text-gray-600 font-medium">
            {item.rating || "0.0"}
          </span>
        </div>
      </div>

      {/* PRICE */}
      <p className="text-[#7A1CA9] font-bold text-[16px] mb-1">
        ₱{item.pricePerDay}/day
      </p>

      {/* LOCATION */}
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={14} className="text-gray-400" />
        <span className="text-[13px] text-gray-600 truncate">
          {item.location}, {item.province}
        </span>
      </div>
    </Link>
  );
};

export default RentalItemCard;
