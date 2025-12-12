import React from "react";
import { MapPin, Calendar, ShoppingBag } from "lucide-react";

const WishlistItemCard = ({
  item,
  removeFromWishlist,
  handleAddToCollection,
  justAdded,
}) => {
  if (!item) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 w-full max-w-[500px]">
      <div className="relative mb-2">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={item.images?.[0] || "/placeholder.png"}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <button
          onClick={() => removeFromWishlist(item._id)}
          className="absolute top-2 right-2 text-[13px] font-medium bg-red-50 text-red-500 border border-red-200 rounded-full px-3 py-1 hover:bg-red-100 transition"
        >
          Remove
        </button>
      </div>

      <p className="font-semibold text-gray-800 truncate">{item.title}</p>

      <p className="text-[13px] text-gray-500 mb-1">
        by {item.owner?.name || "Unknown"}
      </p>

      <div className="flex items-center gap-2 mb-1">
        <MapPin size={14} className="text-gray-600" />
        <span className="text-[13px] text-gray-600 truncate">
          {item.zone}, {item.location}, {item.province}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-gray-600" />
        <span className="text-[13px] text-gray-600">
          {item.availabilityType === "always"
            ? "Always available"
            : "Specific dates"}
        </span>
      </div>

      <button
        onClick={() => handleAddToCollection(item)}
        className={`w-full text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 transition
    ${
      justAdded.includes(item._id)
        ? "bg-green-600"
        : "bg-[#7A1CA9] hover:bg-[#6a1894]"
    }
  `}
      >
        <ShoppingBag size={16} />
        {justAdded.includes(item._id) ? "Added!" : "Add to Collection"}
      </button>
    </div>
  );
};

export default WishlistItemCard;
