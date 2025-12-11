import React, { useState, useEffect, useContext } from "react";
import "../../assets/Auth.css";
import logo from "../../assets/logo.png";
import bg from "../../assets/auth-owner-bg.jpg";
import Footer from "../../components/layouts/Footer";
import Stepper from "../../components/Stepper";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const OwnerSetup = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [agree, setAgree] = useState(false);
  const [contactFocused, setContactFocused] = useState(false);
  const [step, setStep] = useState(1);

  // --------------------------
  // FORM STATES
  // --------------------------
  const [formData, setFormData] = useState({
    sellerType: "individual",
    businessName: "",
    contact: "",
    ownerAddress: "",
    pickupAddress: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
  });

  const [isSaved, setIsSaved] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("ownerFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      setIsSaved(true);
    }
  }, []);

  // Load Regions (only Step 1)
  useEffect(() => {
    if (step === 1) {
      regions().then(setRegionList);
    }
  }, [step]);

  const handleSave = async () => {
    const form = document.getElementById("ownerForm");

    if (!form.reportValidity()) {
      return; // stop if form is invalid
    }

    try {
      console.log("[OwnerSetup] Saving data with token:", token ? "present" : "missing");
      
      // Save to backend
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sellerType: formData.sellerType,
          phone: formData.contact,
          ownerAddress: formData.ownerAddress,
          pickupAddress: formData.pickupAddress,
          region: formData.region,
          regionName: formData.regionName,
          province: formData.province,
          provinceName: formData.provinceName,
          city: formData.city,
          cityName: formData.cityName,
          barangay: formData.barangay,
          postalCode: formData.postalCode,
        }),
      });

      console.log("[OwnerSetup] Response status:", response.status);
      const data = await response.json();
      console.log("[OwnerSetup] Response data:", data);

      if (data.success) {
        // Also save to localStorage as backup
        localStorage.setItem("ownerFormData", JSON.stringify(formData));
        setIsSaved(true);
        console.log("[OwnerSetup] Data saved successfully");
      } else {
        console.error("Failed to save:", data.message);
        alert("Failed to save: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving data: " + err.message);
    }
  };

  const handleNext = () => {
    const form = document.getElementById("ownerForm");

    if (!form.reportValidity()) {
      return;
    }
    setStep(2);
  };

  const updateAutoAddress = (updatedForm) => {
    const { barangay, cityName, provinceName, regionName, postalCode } =
      updatedForm;

    // must require only city, province, region
    if (cityName && provinceName && regionName) {
      let parts = [];

      if (barangay) parts.push(barangay);
      parts.push(cityName);
      parts.push(provinceName);
      parts.push(regionName);
      if (postalCode) parts.push(postalCode);

      const fullAddress = parts.join(", ");

      setFormData((prev) => ({
        ...prev,
        ownerAddress: fullAddress,
        pickupAddress: fullAddress,
      }));
    }
  };

  const handleRegionChange = async (e) => {
    const selected = regionList.find((r) => r.region_code === e.target.value);

    const updated = {
      ...formData,
      region: selected?.region_code || "",
      regionName: selected?.region_name || "",
      province: "",
      provinceName: "",
      city: "",
      cityName: "",
      barangay: "",
    };

    setFormData(updated);
    setProvinceList(await provinces(updated.region));
    setCityList([]);
    setBarangayList([]);

    updateAutoAddress(updated);
  };

  // Province change
  const handleProvinceChange = async (e) => {
    const selected = provinceList.find(
      (p) => p.province_code === e.target.value
    );

    const updated = {
      ...formData,
      province: selected?.province_code || "",
      provinceName: selected?.province_name || "",
      city: "",
      cityName: "",
      barangay: "",
    };

    setFormData(updated);
    setCityList(await cities(updated.province));
    setBarangayList([]);

    updateAutoAddress(updated);
  };

  // City change
  const handleCityChange = async (e) => {
    const selected = cityList.find((c) => c.city_code === e.target.value);

    const updated = {
      ...formData,
      city: selected?.city_code || "",
      cityName: selected?.city_name || "",
      barangay: "",
    };

    setFormData(updated);
    setBarangayList(await barangays(updated.city));

    updateAutoAddress(updated);
  };

  // Barangay change
  const handleBarangayChange = (e) => {
    const updated = { ...formData, barangay: e.target.value };
    setFormData(updated);

    updateAutoAddress(updated);
  };

  // Generic Input Handler
  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormData(updated);
    if (e.target.name === "postalCode") {
      updateAutoAddress(updated);
    }
  };

  const isStep1Valid = () => {
    return (
      formData.businessName.trim() !== "" &&
      formData.contact.trim() !== "" &&
      formData.ownerAddress.trim() !== "" &&
      formData.pickupAddress.trim() !== "" &&
      formData.region !== "" &&
      formData.province !== "" &&
      formData.city !== ""
      // barangay optional
      // postal optional
    );
  };

  // --------------------------------------------------
  // PAGE CONTENT SWITCHER
  // --------------------------------------------------
  const renderContent = () => {
    // ------------------- SUBMISSION PAGE -------------------
    if (step === 3) {
      const handleCompleteSetup = async () => {
        try {
          // Check if token exists
          if (!token) {
            console.error("[OwnerSetup] No token found");
            alert("Authentication error. Please login again.");
            navigate("/ownerlogin");
            return;
          }

          console.log("[OwnerSetup] Starting setup completion with token...");

          // Mark setup as completed in backend with all form data
          const response = await fetch("http://localhost:5000/api/auth/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              // Owner setup data
              sellerType: formData.sellerType,
              businessName: formData.businessName,
              phone: formData.contact,
              ownerAddress: formData.ownerAddress,
              pickupAddress: formData.pickupAddress,
              region: formData.region,
              regionName: formData.regionName,
              province: formData.province,
              provinceName: formData.provinceName,
              city: formData.city,
              cityName: formData.cityName,
              barangay: formData.barangay,
              postalCode: formData.postalCode,
              // Mark setup as completed
              ownerSetupCompleted: true,
            }),
          });

          console.log("[OwnerSetup] Profile update response status:", response.status);

          if (!response.ok) {
            const errorData = await response.json();
            console.error("[OwnerSetup] Profile update failed:", errorData);
            alert("Failed to complete setup: " + (errorData.message || "Unknown error"));
            return;
          }

          const data = await response.json();
          console.log("[OwnerSetup] Profile update success:", data);

          if (data.success) {
            // Clear localStorage setup data
            localStorage.removeItem("ownerFormData");
            
            // Send verification email
            try {
              const emailResponse = await fetch("http://localhost:5000/api/auth/send-verification-email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              
              const emailData = await emailResponse.json();
              console.log("[OwnerSetup] Email verification sent:", emailData);
            } catch (emailErr) {
              console.error("[OwnerSetup] Error sending verification email:", emailErr);
              // Continue even if email fails
            }
            
            // Redirect to add item page
            navigate("/owner/add-item");
          } else {
            console.error("Failed to complete setup:", data.message);
            alert("Failed to complete setup: " + (data.message || "Unknown error"));
          }
        } catch (err) {
          console.error("Setup completion error:", err);
          alert("Error completing setup: " + err.message);
        }
      };

      return (
        <div className="flex flex-col items-center mt-2">
          <CheckCircleIcon className="w-44 h-44 text-[#4CE976] mb-6 mt-6" />

          <h1 className="text-[24px] font-bold  text-gray-900  mb-1 text-center">
            Submitted Successfully!
          </h1>

          <p className="text-gray-600 text-[15px] text-center mb-8">
            Now you can proceed to list your first item.
          </p>

          <div className="flex flex-col items-center gap-2">
            <button
              className="w-80 bg-[#7A1CA9] text-white rounded-md py-2 hover:bg-purple-600 transition text-[15px] font-medium"
              onClick={handleCompleteSetup}
            >
              List Your Item
            </button>
          </div>
        </div>
      );
    }

    // ------------------- TERMS & CONDITIONS PAGE -------------------
    if (step === 2) {
      return (
        <div className="flex flex-col h-full">
          {/* Scrollable Terms Section */}
          <div className="p-10 overflow-y-auto max-h-[400px]">
            <h1 className="text-[18px] font-bold  text-gray-900  mb-4">
              Terms & Conditions
            </h1>

            <p className="text-gray-700 mb-4 text-[14px] leading-relaxed">
              Welcome to Hirent! Before becoming a rental item owner, please
              review the following Terms & Conditions. By agreeing below, you
              confirm that you understand and accept these policies.
            </p>

            {/* Section 1 */}
            <h2 className="font-semibold  text-gray-900  text-[16px] mt-4">
              1. Item Responsibility
            </h2>
            <p className="text-gray-700 text-[14px] mb-3">
              You are responsible for ensuring each item is in good condition
              before and after rental. Undisclosed damage or defects may result
              in penalties.
            </p>

            {/* Section 2 */}
            <h2 className="font-semibold  text-gray-900  text-[16px] mt-4">
              2. Accurate Listings
            </h2>
            <p className="text-gray-700 text-[14px] mb-3">
              All listing details must be accurate, including condition,
              pricing, availability, and pickup instructions.
            </p>

            {/* Section 3 */}
            <h2 className="font-semibold  text-gray-900  text-[16px] mt-4">
              3. Security Deposits
            </h2>
            <p className="text-gray-700 text-[14px] mb-3">
              Owners may require security deposits. Deposit rules must be
              clearly stated and returned unless damage is proven.
            </p>

            {/* Section 4 */}
            <h2 className="font-semibold  text-gray-900  text-[16px] mt-4">
              4. Damage Disputes
            </h2>
            <p className="text-gray-700 text-[14px] mb-3">
              Hirent may review photos, pickup notes, and chat logs to resolve
              disputes.
            </p>

            {/* Section 5 */}
            <h2 className="font-semibold  text-gray-900  text-[16px] mt-4">
              5. Platform Compliance
            </h2>
            <p className="text-gray-700 text-[14px] mb-8">
              Owners must follow all platform policies. Listings violating rules
              may be removed without notice.
            </p>

            {/* Checkbox */}
            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-5 h-5 accent-[#7A1CA9]"
              />
              <label
                htmlFor="agree"
                className="text-purple-900 font-medium text-[15px]"
              >
                I have read and agree to the Terms & Conditions.
              </label>
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="mt-auto px-10 py-6 bg-white  flex justify-end gap-3">
            <button
              onClick={() => setStep(1)}
              className="border border-gray-400 text-gray-700 rounded-md px-8 py-2 text-[14px]"
            >
              Back
            </button>

            <button
              disabled={!agree}
              onClick={() => setStep(3)}
              className={`px-8 py-2 rounded-md text-[14px] transition ${
                agree
                  ? "bg-[#7A1CA9] text-white hover:bg-purple-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      );
    }

    // ------------------- SETUP PAGE -------------------
    return (
      <form
        id="ownerForm"
        className="space-y-3 max-w-[700px] mx-auto"
        onSubmit={handleNext}
      >
        {/* Seller Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seller Type
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-[15px] text-purple-900">
              <input
                type="radio"
                name="sellerType"
                value="individual"
                checked={formData.sellerType === "individual"}
                onChange={handleChange}
                className="accent-[#7A1CA9] w-4 h-4"
              />
              Individual
            </label>

            <label className="flex items-center gap-2 text-[15px] text-purple-900">
              <input
                type="radio"
                name="sellerType"
                value="business"
                checked={formData.sellerType === "business"}
                onChange={handleChange}
                className="accent-[#7A1CA9] w-4 h-4"
              />
              Business
            </label>
          </div>
        </div>

        {/* Name + Contact Number in one line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              name="businessName"
              required
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Your Business Name"
              className="w-full bg-gray-100 rounded-md px-3 py-2 text-[14px] focus:outline-[#7A1CA9]"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              {/* +63 inside input, only visible on focus or if value exists */}
              {(contactFocused || formData.contact.length > 0) && (
                <span className="absolute left-0 top-0 h-full flex items-center font-medium text-[14px] px-2 text-[#7A1CA9]">
                  +63 |
                </span>
              )}

              <input
                name="contact"
                required
                type="text"
                value={formData.contact}
                onFocus={() => setContactFocused(true)}
                onBlur={() => setContactFocused(false)}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.startsWith("0")) val = val.substring(1);
                  if (val.length > 10) val = val.slice(0, 10);
                  setFormData({ ...formData, contact: val });
                }}
                placeholder="9XXXXXXXXX"
                className={`w-full bg-gray-100 rounded-md py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7A1CA9] ${
                  contactFocused || formData.contact.length > 0
                    ? "pl-14"
                    : "pl-3"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Owner Address (Completely Separate) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner Address <span className="text-red-500">*</span>
          </label>

          {/* Region / Province / City / Barangay / Postal */}
          <div className="grid grid-cols-5 gap-2 mb-2 mt-2">
            {/* Region */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[13px] mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.region}
                onChange={handleRegionChange}
                className={`w-full bg-gray-100 rounded-md px-2 py-2 text-[14px] focus:outline-[#7A1CA9] ${
                  formData.region === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled hidden>
                  Select Region
                </option>
                {regionList.map((r) => (
                  <option key={r.psgc_code} value={r.region_code}>
                    {r.region_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Province */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[13px] mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.province}
                onChange={handleProvinceChange}
                className={`w-full bg-gray-100 rounded-md px-2 py-2 text-[14px] focus:outline-[#7A1CA9] ${
                  formData.province === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled hidden>
                  Select Province
                </option>
                {provinceList.map((p) => (
                  <option key={p.psgc_code} value={p.province_code}>
                    {p.province_name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[13px] mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={handleCityChange}
                className={`w-full bg-gray-100 rounded-md px-2 py-2 text-[14px] focus:outline-[#7A1CA9] ${
                  formData.city === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled hidden>
                  Select City
                </option>
                {cityList.map((c) => (
                  <option key={c.city_code} value={c.city_code}>
                    {c.city_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Barangay */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[13px] mb-1">Barangay</label>
              <select
                value={formData.barangay}
                onChange={handleBarangayChange}
                className={`w-full bg-gray-100 rounded-md px-2 py-2 text-[14px] leading-normal focus:outline-[#7A1CA9] ${
                  formData.barangay === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled hidden>
                  Select Brgy.
                </option>
                {barangayList.map((b) => (
                  <option key={b.brgy_code} value={b.brgy_name}>
                    {b.brgy_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Postal */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[13px] mb-1">Postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal"
                className="w-full bg-gray-100 rounded-md px-3 py-2 text-[14px] focus:outline-[#7A1CA9]"
              />
            </div>
          </div>

          <input
            name="ownerAddress"
            required
            type="text"
            value={formData.ownerAddress}
            onChange={handleChange}
            placeholder="Full Owner Address"
            className="w-full bg-gray-100 rounded-md px-3 py-2 text-[14px] focus:outline-[#7A1CA9]"
          />
        </div>

        {/* Pickup Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pickup Address <span className="text-red-500">*</span>
          </label>
          <p className="text-gray-500 text-[12px] mb-1 -mt-1">
            You can change this later.
          </p>
          <input
            name="pickupAddress"
            required
            type="text"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="Where renters will pick up items"
            className="w-full bg-gray-100 rounded-md px-3 py-2 text-[14px] focus:outline-[#7A1CA9]"
          />
        </div>

        {/* Save & Next Buttons */}
        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={handleSave}
            className={`border rounded-md px-6 py-2 text-[14px] transition ${
              isSaved
                ? "bg-green-100 border-green-500 text-green-600"
                : "border border-gray-400 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isSaved ? (
              <span className="flex items-center gap-2">
                Saved <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </span>
            ) : (
              "Save"
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className={`rounded-md px-10 py-2 text-[14px] transition ${
              isStep1Valid()
                ? "bg-[#7A1CA9] text-white hover:bg-purple-600"
                : "bg-[#7A1CA9] text-white hover:bg-purple-600"
            }`}
          >
            Next
          </button>
        </div>
      </form>
    );
  };

  // ---------------------------
  // LAYOUT WRAPPER
  // ---------------------------
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-6 left-6">
          <img src={logo} alt="Hirent Logo" className="w-8 h-auto" />
        </div>

        <div className=" relative z-10 bg-white  w-100 md:w-[600px] lg:w-[800px] min-h-[500px] rounded-lg shadow-lg p-15 flex flex-col">
          <div
            className={`w-full flex flex-col items-center justify-center 
    ${step === 2 ? "mb-0" : "mb-8"}`}
          >
            <Stepper currentStep={step} />
          </div>

          {renderContent()}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OwnerSetup;
