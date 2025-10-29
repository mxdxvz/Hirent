import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../../assets/Onboarding.css";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { motion } from "framer-motion";

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
      const { road, neighbourhood, suburb, city, state, country } = data.address;
      return [road, neighbourhood, suburb, city, state, country]
        .filter(Boolean)
        .join(", ");
    }
  } catch (error) {
    console.error("Error fetching address:", error);
  }
  return "Address not found";
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

const Onboarding1 = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [openPurpose, setOpenPurpose] = useState(false);
  const [openIndustry, setOpenIndustry] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [industry, setIndustry] = useState("Clothes");
  const [formData, setFormData] = useState({
    purpose: "",
    location: "",
  });

  const handleNext = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate("/onboarding2");
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <motion.div
      className="flex flex-col relative onboarding-content-wrapper"
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="onboarding-inner flex flex-col items-center justify-center px-6 relative z-10">
        <div className="onboarding-content">

          <h2 className="text-[28px] font-bold text-gray-900 mt-6 mb-2 text-center">
            Welcome to Hirent!
          </h2>
          <p className="text-[15px] text-gray-600 mb-8 text-center whitespace-nowrap max-w-none">
            Let’s personalize your experience to help you rent or list items faster.
          </p>

          {/* input groups */}
          <div className="input-group w-full max-w-[600px] mb-5">
            <div className="purpose-box">
              <label className={formData.purpose ? "active" : ""}>
                What are you looking for today?
              </label>
              <div
                className="custom-select"
                onClick={() => setOpenPurpose(!openPurpose)}
                tabIndex={0}
                onBlur={() => setOpenPurpose(false)}
              >
                <span className="selected">
                  {formData.purpose || "Show me local deals"}
                </span>
                <span className="arrow"></span>
                {openPurpose && (
                  <ul className="options">
                    {[
                      "Show me local deals",
                      "Show me trending items",
                      "Browse nearby listings",
                      "Find something specific",
                      "Explore categories",
                      "Surprise me!",
                    ].map((option) => (
                      <li
                        key={option}
                        onClick={() => {
                          setFormData({ ...formData, purpose: option });
                          setOpenPurpose(false);
                        }}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="location-box">
              <label className={formData.location ? "active" : ""}>
                Where are you located?
              </label>

              <div
                className="custom-select location-select"
                onClick={() => setMapOpen(true)}
              >
                <div className="icon-wrapper">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="icon"
                  >
                    <circle cx="10" cy="10" r="7" />
                    <line x1="14" y1="14" x2="20" y2="20" />
                  </svg>
                </div>
                <span
                  className={`selected ${!formData.location ? "placeholder" : ""}`}
                >
                  {formData.location || "Select your location on the map"}
                </span>
              </div>
            </div>

            <div
              className="industry-box"
              style={{ display: openPurpose ? "none" : "block" }}
            >
              <label className={industry ? "active" : ""}>
                Which category are you most interested in?
              </label>
              <div
                className="custom-select"
                onClick={() => setOpenIndustry(!openIndustry)}
                tabIndex={0}
                onBlur={() => setOpenIndustry(false)}
              >
                <span className="selected">{industry}</span>
                <span className="arrow"></span>
                {openIndustry && (
                  <ul className="options">
                    {[
                      "Clothes",
                      "Electronics",
                      "Furniture",
                      "Vehicles",
                      "Instruments",
                      "Sports Equipment",
                      "Tools",
                      "Appliances",
                      "Event Items",
                      "Cameras",
                      "Books",
                      "Camping Gear",
                      "Toys",
                      "Office Supplies",
                      "Travel Essentials",
                    ].map((item) => (
                      <li
                        key={item}
                        onClick={() => {
                          setIndustry(item);
                          setOpenIndustry(false);
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={handleNext}
            className="relative w-[90%] mx-auto bg-[#7A1CA9] text-white py-3.5 text-[15px] font-medium rounded-md overflow-hidden group transition-all duration-300 hover:bg-[#65188a]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-600 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 ease-in-out"></span>
            <span className="absolute inset-0 bg-white opacity-20 rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] blur-sm transition-transform duration-700 ease-in-out"></span>
            <span className="relative z-10">Next</span>
          </button>
        </div>
      </div>

      {/* map popup */}
      {mapOpen && (
        <div className="map-popup-overlay" onClick={() => setMapOpen(false)}>
          <div className="map-popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMapOpen(false)}>
              Close Map
            </button>

            <MapContainer
              center={[12.8797, 121.774]} // Philippines
              zoom={6}
              minZoom={5}
              maxZoom={18}
              maxBounds={[
                [4.0, 116.0],
                [21.0, 131.0],
              ]}
              maxBoundsViscosity={1.0}
              className="leaflet-container"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapPicker
                setLocation={(loc) => setFormData({ ...formData, location: loc })}
              />
            </MapContainer>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Onboarding1;
