import React from "react";
import { MapPin, Calendar, ShoppingBag } from "lucide-react";

const WishlistItemCard = ({ item, removeFromWishlist, onAddToCollection }) => {
  if (!item) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-3 w-full max-w-[220px]">
      <div className="relative mb-2">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <img src={item.images?.[0] || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <button 
          onClick={() => removeFromWishlist(item._id)}
          className="absolute top-2 right-2 text-xs bg-white text-red-500 border border-red-200 rounded-full px-2 py-0.5 hover:bg-red-50 transition"
        >
          Remove
        </button>
      </div>
      <p className="text-sm font-semibold text-gray-800 truncate mb-1">{item.title}</p>
      <p className="text-xs text-gray-500 mb-1">by {item.owner.name || 'Unknown'}</p>
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={14} className="text-gray-400" />
        <span className="text-xs text-gray-600">{item.location}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-gray-400" />
        <span className="text-xs text-gray-600">{item.availabilityType === 'always' ? 'Always available' : 'Specific dates'}</span>
      </div>
      <button 
        onClick={() => onAddToCollection(item)}
        className="w-full bg-[#7A1CA9] text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#6a1894] transition"
      >
        <ShoppingBag size={16} />
        Add to collection
      </button>
    </div>
  );
};

export default WishlistItemCard;
