import { Calendar } from "lucide-react";
import React, { useRef, useState } from "react";

const RentalPeriod = ({ rentalData, setRentalData }) => {
  const [errors, setErrors] = useState({});
  const startRef = useRef(null);
  const endRef = useRef(null);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate) || endDate <= startDate) return 1;
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
  };

  const autoComputeEndDate = (startDate, value, type) => {
    if (!startDate) return;
    const start = new Date(startDate);
    const end = new Date(start);

    const numValue = Number(value);
    if (isNaN(numValue)) return;

    if (type === "days") end.setDate(start.getDate() + numValue);
    if (type === "weeks") end.setDate(start.getDate() + numValue * 7);
    if (type === "months") end.setMonth(start.getMonth() + numValue);

    const newEndDate = end.toISOString().split("T")[0];
    setRentalData((prev) => ({
      ...prev,
      endDate: newEndDate,
      days: calculateDays(startDate, newEndDate),
    }));
  };

  const computeDurationFromDates = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end <= start) {
      setRentalData((prev) => ({ ...prev, days: 1, durationValue: 1, durationType: "days" }));
      return;
    }
    const days = calculateDays(start, end);
    setRentalData((prev) => ({ ...prev, days, durationValue: days, durationType: "days" }));
  };

  const handleStartDateChange = (e) => {
    const start = e.target.value;
    const today = new Date();
    const startDate = new Date(start);
    today.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    if (startDate < dayAfterTomorrow) {
      setErrors((prev) => ({ ...prev, startDate: "Start date must be at least 2 days from now." }));
    } else {
      setErrors((prev) => ({ ...prev, startDate: "" }));
    }

    setRentalData((prev) => ({ ...prev, startDate: start }));

    if (rentalData.durationValue > 0) {
      autoComputeEndDate(start, rentalData.durationValue, rentalData.durationType);
    }
  };

  const handleEndDateChange = (e) => {
    const end = e.target.value;
    const startDate = new Date(rentalData.startDate);
    const endDate = new Date(end);

    if (rentalData.startDate && endDate <= startDate) {
      setErrors((prev) => ({ ...prev, endDate: "End date must be after the start date." }));
    } else {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }

    setRentalData((prev) => ({ ...prev, endDate: end }));

    if (rentalData.startDate && end) {
      computeDurationFromDates(rentalData.startDate, end);
    }
  };

  const handleDurationNumberChange = (e) => {
    let value = parseInt(e.target.value) || 1;
    if (rentalData.durationType === "months") value = 1;
    if (rentalData.durationType === "weeks") value = Math.min(value, 4);
    setRentalData((prev) => ({ ...prev, durationValue: value }));
    if (rentalData.startDate) {
      autoComputeEndDate(rentalData.startDate, value, rentalData.durationType);
    }
  };

  const handleDurationTypeChange = (e) => {
    const type = e.target.value;
    let adjustedValue = rentalData.durationValue;
    if (type === "months") adjustedValue = 1;
    if (type === "weeks") adjustedValue = Math.min(adjustedValue, 4);
    setRentalData((prev) => ({ ...prev, durationType: type, durationValue: adjustedValue }));
    if (rentalData.startDate) {
      autoComputeEndDate(rentalData.startDate, adjustedValue, type);
    }
  };

  const openPicker = (ref) => {
    try {
      ref.current.showPicker();
    } catch (e) {
      ref.current.focus();
    }
  };

  return (
    <div className="bg-white text-purple-900 rounded-lg shadow-sm p-6">
      <h2 className="text-[16px] text-purple-900">Rental Period</h2>
      <p className="text-[15px] text-gray-600 mb-6">Start date must be scheduled 1–2 days after booking.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[15px] font-medium text-black mb-2">Start Date</label>
          <div className="relative">
            <input
              ref={startRef}
              type="date"
              value={rentalData.startDate}
              onChange={handleStartDateChange}
              className="w-full px-4 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <Calendar onClick={() => openPicker(startRef)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-900 cursor-pointer" />
          </div>
          {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
        </div>
        <div>
          <label className="block text-[15px] font-medium text-black mb-2">End Date</label>
          <div className="relative">
            <input
              ref={endRef}
              type="date"
              value={rentalData.endDate}
              onChange={handleEndDateChange}
              className="w-full px-4 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <Calendar onClick={() => openPicker(endRef)} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-900 cursor-pointer" />
          </div>
          {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
        </div>
        <div>
          <label className="block text-[15px] font-medium text-black mb-2">Rental Duration</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={rentalData.durationValue}
              onChange={handleDurationNumberChange}
              className="w-20 px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
            />
            <select
              value={rentalData.durationType}
              onChange={handleDurationTypeChange}
              className="px-3 py-2 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalPeriod;
