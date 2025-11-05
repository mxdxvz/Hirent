import React, { useState, useRef, useEffect } from 'react';
import { Heart, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductInfo = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(2);
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 9, 21),
    end: new Date(2025, 9, 26)
  });
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startMonth, setStartMonth] = useState(new Date(2025, 9));
  const [endMonth, setEndMonth] = useState(new Date(2025, 9));
  const [selectingFor, setSelectingFor] = useState('start');
  const startCalendarRef = useRef(null);
  const endCalendarRef = useRef(null);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target)) {
        setShowEndCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const totalPrice = product.price * quantity;

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateSelect = (day, currentMonth) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (selectingFor === 'start') {
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

    if (period === 'Today') {
      start = today;
      end = today;
    } else if (period === 'This Week') {
      const dayOfWeek = today.getDay();
      start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);
      end = new Date(today);
      end.setDate(today.getDate() + (6 - dayOfWeek));
    } else if (period === 'This Month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    setDateRange({ start, end });
  };

  const renderCalendar = (currentMonth) => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = 
        (dateRange.start && date.getTime() === dateRange.start.getTime()) ||
        (dateRange.end && date.getTime() === dateRange.end.getTime());
      const isInRange = 
        dateRange.start && dateRange.end &&
        date > dateRange.start && date < dateRange.end;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day, currentMonth)}
          className={`p-1.5 text-xs font-medium rounded-full transition-all hover:bg-purple-100 ${
            isSelected
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : isInRange
              ? 'bg-purple-100 text-purple-700'
              : isToday
              ? 'bg-purple-50 text-purple-600 font-bold'
              : 'text-gray-700'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const startMonthName = startMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const endMonthName = endMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-sm space-y-4">
      {/* Product Title */}
      <h1 className="text-lg font-bold text-gray-900 truncate">{product.name}</h1>

      {/* Rating Row */}
      <div className="flex items-center gap-1">
        <div className="flex items-center shrink-0">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${
                i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600 text-xs shrink-0">{`(${product.reviews} Reviews)`}</span>
        <span className="text-gray-300 text-xs shrink-0">|</span>
        <span className="text-green-500 font-medium text-xs shrink-0">In Stock</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-purple-600 shrink-0">₱ {product.price.toFixed(2)}</span>
        <span className="text-gray-400 line-through text-sm shrink-0">₱ {product.originalPrice}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-xs leading-relaxed border-b pb-3">
        {product.description}
      </p>

      {/* Colors */}
      <div className="flex items-center gap-3">
        <span className="text-gray-900 font-medium text-xs shrink-0">Colors:</span>
        <div className="flex gap-2">
          {product.colors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColor(index)}
              className={`w-5 h-5 rounded-full border-2 transition-all shrink-0 ${
                selectedColor === index
                  ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="flex items-center gap-3">
        <span className="text-gray-900 font-medium text-xs shrink-0">Size:</span>
        <div className="flex gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-8 h-8 rounded border-2 font-medium text-xs transition-all shrink-0 ${
                selectedSize === size
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-900 border-gray-300 hover:border-purple-600'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-900 font-medium text-xs shrink-0">Date Range</span>
          <button 
            onClick={() => setDateRange({ start: null, end: null })}
            className="text-purple-600 text-xs font-medium hover:text-purple-700 transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* START DATE */}
          <div ref={startCalendarRef} className="relative">
            <label className="text-gray-500 text-xs block mb-1">From</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(dateRange.start)}
                readOnly
                onClick={() => {
                  setSelectingFor('start');
                  setShowStartCalendar(!showStartCalendar);
                  setShowEndCalendar(false);
                }}
                className="w-full px-2 py-2 border border-purple-300 rounded text-xs bg-white text-gray-900 cursor-pointer hover:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Select start date"
              />
              <button
                onClick={() => {
                  setSelectingFor('start');
                  setShowStartCalendar(!showStartCalendar);
                  setShowEndCalendar(false);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 transition-colors mt-1"
              >
                <Calendar className="w-4 h-4" />
              </button>
              
              {showStartCalendar && (
                <div className="absolute top-16 left-0 bg-white border-2 border-purple-200 rounded-lg shadow-2xl p-3 z-50 w-64">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() - 1))}
                      className="p-1 hover:bg-purple-50 rounded-full text-purple-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-purple-900">{startMonthName}</span>
                    <button
                      onClick={() => setStartMonth(new Date(startMonth.getFullYear(), startMonth.getMonth() + 1))}
                      className="p-1 hover:bg-purple-50 rounded-full text-purple-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs font-bold text-center mb-2 text-purple-700">
                    <div>S</div>
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendar(startMonth)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* END DATE */}
          <div ref={endCalendarRef} className="relative">
            <label className="text-gray-500 text-xs block mb-1">To</label>
            <div className="relative">
              <input
                type="text"
                value={formatDate(dateRange.end)}
                readOnly
                onClick={() => {
                  setSelectingFor('end');
                  setShowEndCalendar(!showEndCalendar);
                  setShowStartCalendar(false);
                }}
                className="w-full px-2 py-2 border border-purple-300 rounded text-xs bg-white text-gray-900 cursor-pointer hover:border-purple-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Select end date"
              />
              <button
                onClick={() => {
                  setSelectingFor('end');
                  setShowEndCalendar(!showEndCalendar);
                  setShowStartCalendar(false);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-700 transition-colors mt-1"
              >
                <Calendar className="w-4 h-4" />
              </button>
              
              {showEndCalendar && (
                <div className="absolute top-16 left-0 bg-white border-2 border-purple-200 rounded-lg shadow-2xl p-3 z-50 w-64">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setEndMonth(new Date(endMonth.getFullYear(), endMonth.getMonth() - 1))}
                      className="p-1 hover:bg-purple-50 rounded-full text-purple-600 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-purple-900">{endMonthName}</span>
                    <button
                      onClick={() => setEndMonth(new Date(endMonth.getFullYear(), endMonth.getMonth() + 1))}
                      className="p-1 hover:bg-purple-50 rounded-full text-purple-600 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-xs font-bold text-center mb-2 text-purple-700">
                    <div>S</div>
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendar(endMonth)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Period Buttons */}
        <div className="flex gap-2">
          {['Today', 'This Week', 'This Month'].map((period) => (
            <button
              key={period}
              onClick={() => handleQuickDate(period)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all border shrink-0 ${
                selectedPeriod === period
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        <div className="flex items-center border border-gray-300 rounded shrink-0">
          <button
            onClick={decrementQuantity}
            className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            −
          </button>
          <span className="px-4 py-1 font-bold bg-purple-600 text-white border-l border-r border-gray-300 min-w-[45px] text-center text-sm">
            {quantity}
          </span>
          <button
            onClick={incrementQuantity}
            className="px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            +
          </button>
        </div>

        <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded font-semibold text-xs hover:bg-purple-700 transition-colors">
          Add to Cart
        </button>

        <button className="p-2 border border-gray-300 rounded hover:border-purple-600 hover:bg-purple-50 transition-all">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-gray-900 font-medium text-xs shrink-0">Total:</span>
        <span className="text-2xl font-bold text-purple-600 shrink-0">₱ {totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ProductInfo;
