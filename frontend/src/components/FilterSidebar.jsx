import React, { useState, useRef } from "react";
import BasicDateRangePicker from "./DateRangePicker";
import PriceRangeSlider from "./PriceRange";
import dayjs from "dayjs";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const getAddressFromLatLng = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data?.address) {
            const {
                city,
                town,
                municipality,
                county,
                province,
                state,
                region,
                country,
            } = data.address;

            const location =
                city ||
                town ||
                municipality ||
                county ||
                province ||
                state ||
                region ||
                country;

            return location || "Location not found";
        }
    } catch (error) {
        console.error("Error fetching address:", error);
    }
    return "Location not found";
};


const MapPicker = ({ setLocation }) => {
    const [position, setPosition] = useState(null);
    useMapEvents({
        async click(e) {
            const { lat, lng } = e.latlng;
            setPosition(e.latlng);
            const address = await getAddressFromLatLng(lat, lng);
            setLocation(address);
        },
    });
    return position ? <Marker position={position} /> : null;
};

const FilterSidebar = ({ onApplyFilters }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedRange, setSelectedRange] = useState("");
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [mapOpen, setMapOpen] = useState(false);
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState([100, 5000]);
    const [priceRangeKey, setPriceRangeKey] = useState(0);
    const [rating, setRating] = useState(null);
    const [resetTrigger, setResetTrigger] = useState(0);

    const categories = [
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
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeft.current = scrollRef.current.scrollLeft;
    };
    const handleMouseLeave = () => (isDragging.current = false);
    const handleMouseUp = () => (isDragging.current = false);
    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleDateRange = (range) => {
        const today = dayjs();
        setSelectedRange(range);
        if (range === "Today") {
            setFromDate(today);
            setToDate(today);
        } else if (range === "This Week") {
            setFromDate(today.startOf("week"));
            setToDate(today.endOf("week"));
        } else if (range === "This Month") {
            setFromDate(today.startOf("month"));
            setToDate(today.endOf("month"));
        }
    };

    const handleClearAll = () => {
        setSelectedCategory("");
        setSelectedRange("");
        setFromDate(dayjs());
        setToDate(dayjs());
        setLocation("");
        setPriceRangeKey((prev) => prev + 1);
        setResetTrigger((prev) => prev + 1);
        setRating(null);
        onApplyFilters({
            category: "",
            fromDate: null,
            toDate: null,
            location: "",
            price: null,
            rating: null,
        });
    };

    const handleApply = () => {
        onApplyFilters({
            category: selectedCategory,
            fromDate,
            toDate,
            location,
            priceRange,
            rating
        });
    };
    return (
        <>
            <aside className="w-80 bg-white shadow-md border border-gray-200 rounded-2xl h-[830px] flex flex-col">
                <div className="flex-1 overflow-y-auto px-6 pt-4 space-y-3 pb-0">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
                        <button
                            onClick={handleClearAll}
                            className="text-[#7A1CA9] text-[13px] font-medium hover:text-purple-400 transition mt-1"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Category */}
                    <div>
                        <p className="font-light text-[14px] text-gray-700 mb-2">Category</p>
                        <div
                            ref={scrollRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar cursor-grab active:cursor-grabbing"
                        >
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-1.5 text-[13px] rounded-full whitespace-nowrap border transition ${selectedCategory === cat
                                        ? "bg-[#7A1CA9] text-white border-[#7A1CA9]"
                                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-light text-[14px] text-gray-700">Location</p>
                            <button
                                onClick={() => setLocation(null)}
                                className="text-[#9129c5] text-[13px] hover:text-purple-400 transition"
                            >
                                Reset
                            </button>
                        </div>
                        <div
                            className={`w-full border border-gray-400 rounded-lg px-3 py-2 mb-5 text-[14px] cursor-pointer hover:bg-purple-50 transition ${location ? "text-gray-700" : "text-gray-400 opacity-70"
                                }`}
                            onClick={() => setMapOpen(true)}
                        >
                            {location || "Select location on map"}
                        </div>
                    </div>


                    {/* Date Range */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-light text-[14px] text-gray-700 mb-3">
                                Availability Dates
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedRange("");
                                    setFromDate(dayjs());
                                    setToDate(dayjs());
                                    setResetTrigger((prev) => prev + 1);
                                }}
                                className="text-[#9129c5] text-[13px] mb-3 hover:text-purple-400 transition"
                            >
                                Reset
                            </button>
                        </div>

                        <BasicDateRangePicker
                            fromDate={fromDate}
                            toDate={toDate}
                            setFromDate={(val) => {
                                setSelectedRange("");
                                setFromDate(val);
                            }}
                            setToDate={(val) => {
                                setSelectedRange("");
                                setToDate(val);
                            }}
                            disabled={selectedRange !== ""}
                            resetTrigger={resetTrigger}
                        />

                        <div className="flex flex-nowrap justify-between mt-3 mb-6 space-x-2">
                            {["Today", "This Week", "This Month"].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => handleDateRange(range)}
                                    className={`flex-1 text-xs px-4 py-2 rounded-lg border transition whitespace-nowrap ${selectedRange === range
                                        ? "bg-[#7A1CA9] text-white border-[#7A1CA9]"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-200"
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="pb-3">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-light text-[14px] text-gray-700">Price Range (per day)</p>
                            <button
                                onClick={() => setPriceRangeKey((prev) => prev + 1)}
                                className="text-[#9129c5] text-[13px] hover:text-purple-400 transition"
                            >
                                Reset
                            </button>
                        </div>
                        <div className="[&>*]:mb-0 [&>*]:pb-0">
                            <PriceRangeSlider
                                key={priceRangeKey}
                                onPriceChange={(value) => setPriceRange(value)} // store price separately
                            />
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="pb-3">
                        <div className="flex justify-between items-center mb-3">
                            <p className="font-light text-[14px] text-gray-700">Rating</p>
                            <button
                                onClick={() => setRating(null)}
                                className="text-[#9129c5] text-[13px] hover:text-purple-400 transition"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="flex flex-col space-y-2 pointer-events-auto">
                            {[5, 4, 3, 2, 1].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRating(r)}
                                    className={`flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-100 transition text-sm cursor-pointer ${rating === r ? "border-[#7A1CA9] bg-purple-50" : "border-gray-300"
                                        }`}
                                >
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <span
                                                key={index}
                                                className={`text-[16px] ${index < r ? "text-yellow-400" : "text-gray-300"
                                                    }`}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[13px] text-gray-600">
                                        {r === 5 ? "5.0 only" : `${r}.0 – ${r}.9`}
                                    </span>

                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Apply Button */}
                <div className="px-6 pb-5 mb-3">
                    <button
                        onClick={handleApply}
                        className="w-full bg-[#7A1CA9] hover:bg-[#681690] text-white rounded-lg py-2 text-[13px] font-normal transition"
                    >
                        Apply Filter
                    </button>
                </div>
            </aside>

            {/* Map Modal */}
            {mapOpen && (
                <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-4 w-[90%] max-w-md relative">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            Select Location
                        </h3>
                        <button
                            onClick={() => setMapOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>
                        <MapContainer
                            center={[12.8797, 121.774]}
                            zoom={6}
                            minZoom={5}
                            maxZoom={18}
                            style={{ height: "300px", width: "100%" }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                            />
                            <MapPicker
                                setLocation={(address) => {
                                    setLocation(address);
                                    setMapOpen(false);
                                }}
                            />
                        </MapContainer>
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterSidebar;
