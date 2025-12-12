import React, { useState, useRef, useEffect } from "react";
import { Heart, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const ProductInfo = ({ product, handleAddToCollection, handleToggleWishlist, wishlist }) => {
  const [quantity, setQuantity] = useState(1);

  const [damageWaiver, setDamageWaiver] = useState(false);
  const DAMAGE_FEE = 150;
  const DEPOSIT_FEE = 300;

  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 9, 21),
    end: new Date(2025, 9, 26),
  });

  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date(2025, 9));
  const [endMonth, setEndMonth] = useState(new Date(2025, 9));
  const [selectingFor, setSelectingFor] = useState("start");

  const startCalendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
        setShowEndCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const incrementQuantity = () =>
    quantity < product.quantity && setQuantity(quantity + 1);

  const rentalTotal = product.pricePerDay * quantity;
  const totalDamageFee = damageWaiver ? DAMAGE_FEE : 0;
  const totalPrice = rentalTotal + DEPOSIT_FEE + totalDamageFee;

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const formatDate = (date) => {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}-${m}-${date.getFullYear()}`;
  };

  const handleDateSelect = (day, currentMonth) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (selectingFor === "start") {
      setDateRange({ ...dateRange, start: selectedDate });
      setShowStartCalendar(false);
    } else {
      setDateRange({ ...dateRange, end: selectedDate });
      setShowEndCalendar(false);
    }
  };

  const handleQuickDate = (period) => {
    setSelectedPeriod(period);
    const today = new Date();
    let start = new Date(today);
    let end = new Date(today);

    if (period === "Today") {
      start = today;
      end = today;
    } else if (period === "This Week") {
      const dayOfWeek = today.getDay();
      start.setDate(today.getDate() - dayOfWeek);
      end.setDate(today.getDate() + (6 - dayOfWeek));
    } else if (period === "This Month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    setDateRange({ start, end });
  };

  const renderCalendar = (currentMonth) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      date.setHours(0, 0, 0, 0);

      const isToday = date.getTime() === today.getTime();
      const isSelected =
        (dateRange.start && date.getTime() === dateRange.start.getTime()) ||
        (dateRange.end && date.getTime() === dateRange.end.getTime());
      const isInRange =
        dateRange.start &&
        dateRange.end &&
        date > dateRange.start &&
        date < dateRange.end;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day, currentMonth)}
          className={`p-1.5 text-[10px] rounded-full transition-all font-medium
            ${
              isSelected
                ? "bg-[#7A1CA9] text-white shadow"
                : isInRange
                ? "bg-purple-100 text-[#7A1CA9]"
                : isToday
                ? "bg-purple-50 text-[#7A1CA9] font-bold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const startMonthName = startMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const endMonthName = endMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-[400px] space-y-3">

      {/* TITLE */}
      <h1 className="text-lg font-semibold  text-gray-900  tracking-tight">
        {product.title}
      </h1>

      {/* RATINGS */}
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <span className="text-gray-600 text-[10px]">
          ({product.reviews || 0} Reviews)
        </span>

        <span className="text-gray-300 text-[10px]">•</span>

        <span className="text-green-600 text-[10px] font-medium">
          {product.status === 'active' ? 'In Stock' : 'Unavailable'}
        </span>
      </div>

      {/* PRICE */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">
          ₱{product.pricePerDay || 0}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 text-xs leading-relaxed border-b pb-3">
        {product.description || "No description available"}
      </p>

      {/* PRODUCT ATTRIBUTES */}
      <div className="space-y-1 text-xs text-gray-700 border-b pb-3">
        <p><strong>Condition:</strong> {product.condition || "Not specified"}</p>
        <p><strong>Platform Compatibility:</strong> {product.platformCompatibility || "Not specified"}</p>
        <p><strong>Connectivity:</strong> {product.connectivity || "Not specified"}</p>
        <p><strong>Included Accessories:</strong> {product.includedAccessories || "None"}</p>
      </div>

      {/* FEES */}
      <div className="border-b pb-3 space-y-3 text-xs text-gray-700">
        <div className="flex justify-between items-center">
          <span>Refundable Deposit:</span>
          <span className="font-semibold  text-gray-900 ">₱{DEPOSIT_FEE}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Damage Waiver (optional):</span>

          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={damageWaiver}
                onChange={() => setDamageWaiver(!damageWaiver)}
                className="sr-only peer"
              />

              <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-all" />
              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white  text-purple-900   rounded-full transition-all peer-checked:translate-x-5 shadow" />
            </label>

            <span className="font-semibold  text-gray-900  text-xs">+₱{DAMAGE_FEE}</span>
          </div>
        </div>
      </div>

      {/* DATE RANGE */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className=" text-gray-900  font-medium text-[11px]">Date Range</span>
          <button
            onClick={() => setDateRange({ start: null, end: null })}
            className="text-purple-600 text-[11px] hover:text-[#7A1CA9]"
          >
            Reset
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 mb-3">

          {/* START DATE */}
          <div ref={startCalendarRef} className="relative">
            <label className="text-gray-500 text-[10px] block mb-1">From</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(dateRange.start)}
                readOnly
                onClick={() => {
                  setSelectingFor("start");
                  setShowStartCalendar(!showStartCalendar);
                  setShowEndCalendar(false);
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-[11px] cursor-pointer hover:border-purple-400 transition"
              />
              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A1CA9] w-4 h-4" />

              {showStartCalendar && (
                <div className="absolute top-14 left-0 w-60 bg-white  text-purple-900   border shadow-xl rounded-xl p-3 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() =>
                        setStartMonth(
                          new Date(startMonth.getFullYear(), startMonth.getMonth() - 1)
                        )
                      }
                      className="p-1 rounded hover:bg-purple-50 text-[#7A1CA9]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-semibold">{startMonthName}</span>

                    <button
                      onClick={() =>
                        setStartMonth(
                          new Date(startMonth.getFullYear(), startMonth.getMonth() + 1)
                        )
                      }
                      className="p-1 rounded hover:bg-purple-50 text-[#7A1CA9]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-[#7A1CA9] text-center">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-1">
                    {renderCalendar(startMonth)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* END DATE */}
          <div ref={endCalendarRef} className="relative">
            <label className="text-gray-500 text-[10px] block mb-1">To</label>

            <div className="relative">
              <input
                type="text"
                value={formatDate(dateRange.end)}
                readOnly
                onClick={() => {
                  setSelectingFor("end");
                  setShowEndCalendar(!showEndCalendar);
                  setShowStartCalendar(false);
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-[11px] cursor-pointer hover:border-purple-400 transition"
              />

              <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7A1CA9] w-4 h-4" />

              {showEndCalendar && (
                <div className="absolute top-14 left-0 w-60 bg-white  text-purple-900   border shadow-xl rounded-xl p-3 z-50">
                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() =>
                        setEndMonth(
                          new Date(endMonth.getFullYear(), endMonth.getMonth() - 1)
                        )
                      }
                      className="p-1 rounded hover:bg-purple-50 text-[#7A1CA9]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="text-xs font-semibold">{endMonthName}</span>

                    <button
                      onClick={() =>
                        setEndMonth(
                          new Date(endMonth.getFullYear(), endMonth.getMonth() + 1)
                        )
                      }
                      className="p-1 rounded hover:bg-purple-50 text-[#7A1CA9]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-[#7A1CA9] text-center">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mt-1">
                    {renderCalendar(endMonth)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QUICK SELECT */}
        <div className="flex gap-2">
          {["Today", "This Week", "This Month"].map((period) => (
            <button
              key={period}
              onClick={() => handleQuickDate(period)}
              className={`px-3 py-1.5 text-[11px] border rounded-lg font-medium transition-all
                ${
                  selectedPeriod === period
                    ? "bg-[#7A1CA9] text-white border-[#7A1CA9]  shadow"
                    : "bg-white  text-purple-900   text-gray-700 border-gray-300 hover:border-purple-400"
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* QUANTITY + BOOK */}
      <div className="flex items-center gap-2 pt-3">

        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={decrementQuantity}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-semibold text-sm"
          >
            −
          </button>

          <span className="px-4 py-1 bg-[#7A1CA9] text-white font-bold min-w-[40px] text-center text-sm">
            {quantity}
          </span>

          <button
            onClick={incrementQuantity}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-semibold text-sm"
          >
            +
          </button>
        </div>

        <button onClick={() => handleAddToCollection(product)} className="flex-1 bg-[#7A1CA9] text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-md hover:bg-purple-800 transition">
          Add to Collection
        </button>

        <button onClick={() => handleToggleWishlist(product._id)} className={`p-2 border rounded-lg transition-colors ${wishlist.some((w) => w._id === product._id) ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 hover:border-purple-600 hover:bg-purple-50'}`}>
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* TOTAL */}
      <div className="flex items-center justify-between pt-4 border-t">
        <span className=" text-gray-900  font-medium text-xs">Total:</span>
        <span className="text-2xl font-bold text-[#7A1CA9]">
          ₱ {totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
