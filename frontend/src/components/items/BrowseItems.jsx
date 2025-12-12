import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Check, MapPin } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ENDPOINTS, makeAPICall } from "../../config/api";

const BrowseItems = () => {
  const navigate = useNavigate();
  const { isLoggedIn, wishlist, toggleWishlist, addToCart, cart } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await makeAPICall(ENDPOINTS.ITEMS.GET_ALL);
        setItems(Array.isArray(data) ? data : (data?.items || []));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const itemsPerPage = 4;
  const maxIndex = Math.max(0, items.length - itemsPerPage);

  useEffect(() => {
    if (items.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [maxIndex, items.length]);

  const handleToggleWishlist = (itemId) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    toggleWishlist(itemId);
  };

  const handleAddToCollection = (item) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    addToCart(item, 1);
    if (!justAdded.includes(item._id)) {
      setJustAdded((prev) => [...prev, item._id]);
      setTimeout(() => setJustAdded((prev) => prev.filter((id) => id !== item._id)), 2000);
    }
  };

  return (
    <section className="py-5 pb-12 px-8 md:px-16 lg:px-36 bg-white  text-purple-900  ">

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold  text-gray-900  mt-5">Browse Items</h2>
          <p className="text-gray-500 text-[16px] mt-1">Browse through our popular items and find exactly what you need</p>
        </div>

        {/* Carousel container without overflow-hidden */}
        <div className="relative pb-10">
          <div className="flex gap-6 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}>
            {items.map((item, index) => {
              // Calculate center positions
              const centerStart = currentIndex;
              const centerEnd = currentIndex + itemsPerPage - 1;
              const isCenter = index >= centerStart && index <= centerEnd;

              return (
                <div
                  key={item._id}
                  className={`rounded-2xl shadow-md bg-white  text-purple-900   p-3 flex-shrink-0 transition-all duration-500 ${isCenter ? "scale-100 blur-0 opacity-100" : "scale-95 blur-sm opacity-50"}`}
                  style={{ width: `calc(25% - 18px)` }}
                >
                  <div className="relative bg-gray-100 aspect-square rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                    {item.badge && (
                      <span
                        className="absolute top-3 left-3 text-white text-xs font-medium px-2 py-1 rounded"
                        style={{ backgroundColor: item.badgeColor }}
                      >
                        {item.badge}
                      </span>
                    )}

                    <div className="absolute top-3 right-3 flex gap-1 z-50">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleToggleWishlist(item._id);
                        }} 
                        className="bg-white text-purple-900 rounded-full shadow p-1 hover:bg-gray-200 transition"
                      >
                        <Heart
                          size={18}
                          strokeWidth={1.5}
                          className={`transition-colors duration-200 ${wishlist.some((i) => i._id === item._id) ? "fill-[#ec0b0b] stroke-[#ec0b0b]" : "stroke-[#af50df]"}`}
                        />
                      </button>
                      <button className="bg-white text-purple-900 rounded-full shadow p-1 hover:bg-gray-200 transition">
                        <Eye className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => navigate(`/items/${item._id}`)}>
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="absolute w-[95%] h-[95%] object-contain transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    <div className="flex w-full rounded-b-2xl overflow-hidden mt-auto">
                      <button
                        onClick={() => navigate(`/booking/${item._id}`)}
                        className="flex-[0.9] bg-[#7A1CA9] hover:bg-[#681690] text-white text-[12.5px] font-medium py-2.5 flex justify-center items-center transition rounded-bl-2xl"
                      >
                        Book Item
                      </button>
                      <button
                        onClick={() => handleAddToCollection(item)}
                        className={`flex-[1] border border-[#7A1CA9]  rounded-br-2xl font-medium py-2.5 flex justify-center items-center gap-1 transition-all duration-300 text-[12.5px] ${justAdded.includes(item._id)
                            ? "bg-green-500 border-green-500 text-white hover:bg-green-600 hover:border-green-600"
                            : "text-[#7A1CA9] hover:bg-purple-100"
                          }`}
                      >
                        {justAdded.includes(item._id) ? (
                          <>
                            <Check size={16} className="text-white" /> Added!
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={16} className="text-[#7A1CA9]" /> Add To collection
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-left mt-3">
                    <p className="text-purple-900 font-semibold text-sm mt-2 mb-1">{item.title}</p>
                    <p className="text-[#7A1CA9] font-bold text-sm mb-1">{item.price}</p>

                    {item.rating && (
                      <div className="flex items-center text-yellow-500 text-sm mb-1">
                        {"★".repeat(item.rating)}
                        <span className="text-gray-500 ml-1">({item.reviews})</span>
                      </div>
                    )}

                    <div className="flex items-center text-gray-500 text-xs gap-1">
                      <MapPin size={13} className="text-gray-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Login or See More button */}
        <div className="flex justify-center">
          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 border-2 rounded-lg font-inter font-semibold text-sm inline-flex items-center gap-2 text-[#7A1CA9] border-[#7A1CA9] hover:bg-purple-50 transition-colors"
            >
              Login to see more
            </button>
          ) : (
            <button
              onClick={() => navigate("/browse")}
              className="px-6 py-2.5 border-2 rounded-lg font-inter font-semibold text-sm inline-flex items-center gap-2 text-[#7A1CA9] border-[#7A1CA9] hover:bg-purple-50 transition-colors"
            >
              See more
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrowseItems;
