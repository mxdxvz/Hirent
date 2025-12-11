import React, { useState } from "react";
import { Calendar, Plus, X } from "lucide-react";
import { API_URL, ENDPOINTS } from "../../config/api";

/* -------------------------
   SMALL UI COMPONENTS
------------------------- */

function SectionHeader({ title }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-5 bg-purple-600 rounded"></div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="border-b border-gray-200"></div>
    </div>
  );
}

function Input({ label, required, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        {...props}
        className={`w-full bg-gray-50/50 px-3 py-2 border rounded-md text-sm 
          focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${
            error ? "border-red-500" : "border-gray-200"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Textarea({ label, required, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        {...props}
        className={`w-full bg-gray-50/50 px-3 py-2 border rounded-md text-sm resize-none 
        focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      ></textarea>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, options, required, error, ...props }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`w-full px-3 py-2 border rounded-md text-sm 
          focus:ring-2 focus:ring-purple-500 transition ${
            error ? "border-red-500" : "border-gray-300"
          }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm transition
        ${
          selected
            ? "bg-purple-600 text-white border-purple-600 shadow-sm"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
    >
      {label}
    </button>
  );
}

/* -------------------------
   MAIN FORM
------------------------- */

export default function AddNewItemForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    pricePerDay: "",
    securityDeposit: "",
    condition: "",
    category: "",
    location: "",
    zone: "",
    postalCode: "",
    province: "",

    // Delivery
    deliveryAvailable: false,
    deliveryFee: "",

    // Availability type
    availabilityType: "always", // always, specific-dates
    unavailableDates: [],
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    advanceNoticeDays: 1,

    color: "",
    customColor: "",
    itemOptions: [],
    customItem: "",

    // Booking preferences
    instantBooking: false,
    requireApproval: true,
    identificationRequired: true,
    insuranceRequired: false,
    cancellationPolicy: "flexible",
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [unavailableDate, setUnavailableDate] = useState({
    start: "",
    end: "",
  });

  /* OPTIONAL ITEMS */
  const OPTIONAL_ITEMS = [
    "Waterproof",
    "Extra Battery",
    "High Resolution",
    "Charger Included",
    "Tripod Included",
    "Bag/Case",
    "SD Card",
    "USB Cable",
    "Garment Bag",
  ];

  /* COLOR SWATCHES */
  const COLOR_SWATCHES = [
    { name: "Black", hex: "#111" },
    { name: "White", hex: "#fff", border: true },
    { name: "Red", hex: "#dc2626" },
    { name: "Blue", hex: "#2563eb" },
    { name: "Green", hex: "#059669" },
    { name: "Yellow", hex: "#eab308" },
  ];

  /* CANCELLATION POLICIES */
  const CANCELLATION_POLICIES = [
    { value: "flexible", label: "Flexible - Full refund 2 day before" },
    { value: "moderate", label: "Moderate - Full refund 5 days before" },
    { value: "strict", label: "Strict - 50% refund 7 days before" },
  ];

  /* STATE FUNCTIONS */
  const toggleOption = (opt) => {
    setFormData((prev) => ({
      ...prev,
      itemOptions: prev.itemOptions.includes(opt)
        ? prev.itemOptions.filter((x) => x !== opt)
        : [...prev.itemOptions, opt],
    }));
  };

  const handleImageChange = (e) => {
    const previews = Array.from(e.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setImagePreviews(previews);
  };

  const addCustomItem = () => {
    if (!formData.customItem.trim()) return;

    setFormData((prev) => ({
      ...prev,
      itemOptions: [...prev.itemOptions, prev.customItem.trim()],
      customItem: "",
    }));
  };

  const addUnavailableDate = () => {
    if (unavailableDate.start && unavailableDate.end) {
      if (new Date(unavailableDate.start) > new Date(unavailableDate.end)) {
        alert("End date must be after start date");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        unavailableDates: [...prev.unavailableDates, { ...unavailableDate }],
      }));
      setUnavailableDate({ start: "", end: "" });
    }
  };

  const removeUnavailableDate = (index) => {
    setFormData((prev) => ({
      ...prev,
      unavailableDates: prev.unavailableDates.filter((_, i) => i !== index),
    }));
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  /* CLEAR ALL LOGIC */
  const isFormDirty =
    Object.values(formData).some((v) => v !== "" && v.length !== 0) ||
    imagePreviews.length > 0;

  const clearAllFields = () => {
    setFormData({
      itemName: "",
      description: "",
      pricePerDay: "",
      securityDeposit: "",
      condition: "",
      category: "",
      location: "",
      zone: "",
      postalCode: "",
      province: "",
      deliveryAvailable: false,
      deliveryFee: "",
      availabilityType: "always",
      unavailableDates: [],
      minimumRentalDays: 1,
      maximumRentalDays: 30,
      advanceNoticeDays: 1,
      color: "",
      customColor: "",
      itemOptions: [],
      customItem: "",
      instantBooking: false,
      requireApproval: true,
      identificationRequired: true,
      insuranceRequired: false,
      cancellationPolicy: "flexible",
    });

    setImagePreviews([]);
    setErrors({});
    setUnavailableDate({ start: "", end: "" });
  };

  /* VALIDATION */
  const validateFields = () => {
    let temp = {};

    if (!formData.itemName) temp.itemName = "Item name required";
    if (!formData.description) temp.description = "Description required";
    if (!formData.pricePerDay) temp.price = "Price required";
    if (!formData.condition) temp.condition = "Condition required";
    if (!formData.category) temp.category = "Category required";
    if (!formData.location) temp.location = "Location required";
    if (document.getElementById("uploadImg")?.files?.length === 0) temp.photo = "At least 1 photo required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const submitForm = async () => {
    // 1️⃣ Validate required fields
    if (!validateFields()) return;

    try {
      // 2️⃣ Prepare FormData for multipart request
      const form = new FormData();

      // Append all form fields except temporary ones
      for (const key in formData) {
        if (key !== "customItem" && key !== "customColor") {
          const value = formData[key];
          // Map itemName to title for backend
          const fieldName = key === "itemName" ? "title" : key;
          
          if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
            form.append(fieldName, JSON.stringify(value));
          } else {
            form.append(fieldName, value);
          }
        }
      }

      // Append images if any
      const input = document.getElementById("uploadImg");
      if (input?.files?.length) {
        Array.from(input.files).forEach((file) => form.append("images", file));
      }

      // 3️⃣ Send request to backend
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}${ENDPOINTS.ITEMS.CREATE}`, {
        method: "POST",
        body: form,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      const data = await response.json();

      // 4️⃣ Handle response
      if (response.ok || data._id || data.success) {
        alert("Item added successfully!");
        clearAllFields();
        // Call onSuccess callback to navigate
        if (onSuccess) {
          onSuccess();
        }
      } else {
        alert(data.message || data.msg || "Failed to add item.");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  /* -------------------------
        UI COMPONENT
  ------------------------- */
  return (
    <div className="flex-1 p-8 space-y-4">
      {/* HEADER + CLEAR ALL */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Item</h1>
          <p className="text-gray-500">Please fill in the required details.</p>
        </div>

        <button
          onClick={clearAllFields}
          disabled={!isFormDirty}
          className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100
            transition disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-95"
        >
          Clear All
        </button>
      </div>

      {/* GENERAL INFORMATION */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200">
        <SectionHeader title="General Information" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Item Name"
            required
            value={formData.itemName}
            error={errors.itemName}
            onChange={(e) =>
              setFormData({ ...formData, itemName: e.target.value })
            }
          />

          <Select
            label="Category"
            required
            options={["Camera", "Dress", "Electronics", "Tools", "Outdoor"]}
            value={formData.category}
            error={errors.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />
        </div>

        <Textarea
          label="Description"
          required
          rows={4}
          value={formData.description}
          error={errors.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* PRICING */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200">
        <SectionHeader title="Pricing & Deposit" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Price per Day"
            type="number"
            required
            value={formData.pricePerDay}
            error={errors.price}
            onChange={(e) =>
              setFormData({ ...formData, pricePerDay: e.target.value })
            }
          />

          <Input
            label="Security Deposit"
            type="number"
            required
            value={formData.securityDeposit}
            error={errors.deposit}
            onChange={(e) =>
              setFormData({ ...formData, securityDeposit: e.target.value })
            }
          />

          <Select
            label="Condition"
            required
            options={["Brand New", "Like New", "Good", "Fair"]}
            value={formData.condition}
            error={errors.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          />
        </div>
      </div>

      {/* LOCATION & DELIVERY */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200">
        <SectionHeader title="Location & Delivery" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="City / Municipality"
            required
            value={formData.location}
            error={errors.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />

          <Input
            label="Zone / Barangay"
            required
            value={formData.zone}
            error={errors.zone}
            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
          <Input
            label="Postal Code"
            required
            value={formData.postalCode}
            error={errors.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />

          <Input
            label="Province / Region"
            value={formData.province}
            onChange={(e) =>
              setFormData({ ...formData, province: e.target.value })
            }
          />
        </div>

        {/* Delivery Available Checkbox */}
        <div className="mt-4 flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
          <input
            type="checkbox"
            id="deliveryAvailable"
            checked={formData.deliveryAvailable}
            onChange={(e) =>
              setFormData({ ...formData, deliveryAvailable: e.target.checked })
            }
            className="w-5 h-5 text-purple-600 accent-purple-700 rounded focus:ring-purple-500"
          />
          <label
            htmlFor="deliveryAvailable"
            className="text-sm font-medium text-gray-800 cursor-pointer"
          >
            I offer delivery service for this item
          </label>
        </div>

        {/* Delivery Fee (appears when delivery is enabled) */}
        {formData.deliveryAvailable && (
          <div className="mt-4 pl-4 border-l-4 rounded-l-lg border-purple-100">
            <Input
              label="Delivery Fee (₱)"
              type="number"
              required
              placeholder="Fee will vary depending on location"
              value={formData.deliveryFee}
              error={errors.deliveryFee}
              onChange={(e) =>
                setFormData({ ...formData, deliveryFee: e.target.value })
              }
            />
            <p className="text-[13px] text-gray-500 mt-2">
              💡 You can adjust the delivery charge based on the renter's
              location during booking.
            </p>
          </div>
        )}
      </div>

      {/* AVAILABILITY RULES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200">
        <SectionHeader title="Availability Rules" />

        <div className="space-y-4">
          {/* Availability Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition ${
                formData.availabilityType === "always"
                  ? "border-purple-700 bg-purple-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="availabilityType"
                  value="always"
                  checked={formData.availabilityType === "always"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availabilityType: e.target.value,
                    })
                  }
                  className="text-purple-600 accent-purple-700 focus:ring-purple-500"
                />
                <span className="font-semibold text-sm text-gray-900">
                  Always available
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-7">
                Bookings allowed on any date unless manually blocked.
              </span>
            </label>

            <label
              className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition ${
                formData.availabilityType === "specific-dates"
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="availabilityType"
                  value="specific-dates"
                  checked={formData.availabilityType === "specific-dates"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      availabilityType: e.target.value,
                    })
                  }
                  className="text-purple-600 accent-purple-700 focus:ring-purple-500"
                />
                <span className="font-semibold text-sm text-gray-900">
                  Block specific dates
                </span>
              </div>
              <span className="text-xs text-gray-500 ml-7">
                Mark dates when the item is not available.
              </span>
            </label>
          </div>

          {/* Blocked Date Range */}
          {formData.availabilityType === "specific-dates" && (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    Start date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={unavailableDate.start}
                      onChange={(e) =>
                        setUnavailableDate((prev) => ({
                          ...prev,
                          start: e.target.value,
                        }))
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    End date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={unavailableDate.end}
                      onChange={(e) =>
                        setUnavailableDate((prev) => ({
                          ...prev,
                          end: e.target.value,
                        }))
                      }
                      min={
                        unavailableDate.start ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addUnavailableDate}
                    disabled={!unavailableDate.start || !unavailableDate.end}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-600 text-white shadow hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    title="Add blocked period"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {formData.unavailableDates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">
                    Blocked periods:
                  </p>
                  {formData.unavailableDates.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatDate(d.start)} – {formatDate(d.end)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUnavailableDate(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Rental Duration Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input
              label="Minimum rental days"
              type="number"
              min="1"
              value={formData.minimumRentalDays}
              onChange={(e) =>
                setFormData({ ...formData, minimumRentalDays: e.target.value })
              }
            />

            <Input
              label="Maximum rental days"
              type="number"
              min="1"
              value={formData.maximumRentalDays}
              onChange={(e) =>
                setFormData({ ...formData, maximumRentalDays: e.target.value })
              }
            />

            <Input
              label="Advance notice (days)"
              type="number"
              min="0"
              value={formData.advanceNoticeDays}
              onChange={(e) =>
                setFormData({ ...formData, advanceNoticeDays: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* OPTIONAL DETAILS */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200 space-y-6">
        <SectionHeader title="Optional Details" />

        {/* COLOR SWATCHES */}
        <p className="text-sm text-gray-600 mb-2">Color (Optional)</p>

        <div className="flex items-center gap-4 flex-wrap mb-4">
          {COLOR_SWATCHES.map((c) => (
            <div key={c.name} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    color: c.name,
                    customColor: "",
                  })
                }
                className={`h-10 w-10 rounded-full border 
                ${c.border ? "border-gray-300" : "border-transparent"} 
                flex items-center justify-center 
                ${formData.color === c.name ? "ring-2 ring-purple-600" : ""}`}
                style={{ backgroundColor: c.hex }}
              >
                {formData.color === c.name && (
                  <span className="text-white font-bold text-sm">✓</span>
                )}
              </button>
              <p className="text-xs text-gray-700 mt-1">{c.name}</p>
            </div>
          ))}

          {/* Custom Color Swatch */}
          {formData.customColor && (
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, color: formData.customColor })
                }
                className={`h-10 w-10 rounded-full border flex items-center justify-center
                ${
                  formData.color === formData.customColor
                    ? "ring-2 ring-purple-600"
                    : ""
                }`}
                style={{
                  backgroundColor: formData.customColor || "#ccc",
                }}
              >
                {formData.color === formData.customColor && (
                  <span className="text-white font-bold text-sm">✓</span>
                )}
              </button>
              <p className="text-xs capitalize text-gray-700 mt-1">
                {formData.customColor}
              </p>
            </div>
          )}
        </div>

        {/* Custom Color Input */}
        <input
          type="text"
          placeholder="Type custom color (e.g., Olive, Teal)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm 
            focus:ring-2 focus:ring-purple-500"
          value={formData.customColor}
          onChange={(e) =>
            setFormData({
              ...formData,
              customColor: e.target.value.trim(),
              color: e.target.value.trim() || formData.color,
            })
          }
        />

        {/* ITEM OPTIONS */}
        <p className="text-sm text-gray-600 mb-1">
          Additional Item Options (Optional)
        </p>

        <div className="flex flex-wrap gap-2">
          {OPTIONAL_ITEMS.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={formData.itemOptions.includes(opt)}
              onClick={() => toggleOption(opt)}
            />
          ))}

          {/* Custom user-added chip options */}
          {formData.itemOptions
            .filter((opt) => !OPTIONAL_ITEMS.includes(opt))
            .map((customOpt) => (
              <Chip
                key={customOpt}
                label={customOpt}
                selected={true}
                onClick={() => toggleOption(customOpt)}
              />
            ))}
        </div>

        {/* Custom Option Input */}
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            placeholder="Add custom item option..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm 
              focus:ring-2 focus:ring-purple-500"
            value={formData.customItem}
            onChange={(e) =>
              setFormData({ ...formData, customItem: e.target.value })
            }
          />

          <button
            type="button"
            onClick={addCustomItem}
            disabled={!formData.customItem.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm 
              hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* RENTAL POLICIES & BOOKING PREFERENCES */}
      <div className="bg-white rounded-xl shadow-sm border-purple-100 p-6">
        <SectionHeader title="Rental Policies & Booking Preferences" />

        <div className="space-y-5">
          {/* Cancellation Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cancellation Policy
            </label>
            <div className="space-y-2">
              {CANCELLATION_POLICIES.map((p) => (
                <label
                  key={p.value}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer text-sm transition ${
                    formData.cancellationPolicy === p.value
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancellationPolicy"
                    value={p.value}
                    checked={formData.cancellationPolicy === p.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cancellationPolicy: e.target.value,
                      })
                    }
                    className="text-purple-600 accent-purple-700 focus:ring-purple-500"
                  />
                  <span className="text-gray-800">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Booking Toggles with Color */}
          <div className="space-y-3">
            <div
              className={`flex items-center justify-between p-3 rounded-lg border text-sm transition ${
                formData.instantBooking
                  ? "bg-purple-50 border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">
                  Allow instant booking
                </p>
                <p className="text-xs text-gray-500">
                  Renters can confirm without waiting for your approval.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.instantBooking}
                onChange={(e) =>
                  setFormData({ ...formData, instantBooking: e.target.checked })
                }
                className="w-5 h-5 text-purple-600 accent-purple-700 rounded focus:ring-purple-500"
              />
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border text-sm transition ${
                formData.requireApproval
                  ? "bg-purple-50 border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">
                  Require manual approval
                </p>
                <p className="text-xs text-gray-500">
                  Review each booking request before it is confirmed.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.requireApproval}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requireApproval: e.target.checked,
                  })
                }
                className="w-5 h-5 text-purple-600 accent-purple-700 rounded focus:ring-purple-500"
              />
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border text-sm transition ${
                formData.identificationRequired
                  ? "bg-purple-50 border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">
                  Require government ID
                </p>
                <p className="text-xs text-gray-500">
                  Renter must upload valid identification before pickup.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.identificationRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    identificationRequired: e.target.checked,
                  })
                }
                className="w-5 h-5 text-purple-600 accent-purple-700 rounded focus:ring-purple-500"
              />
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border text-sm transition ${
                formData.insuranceRequired
                  ? "bg-purple-50 border-purple-600"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">
                  Require rental insurance
                </p>
                <p className="text-xs text-gray-500">
                  Renter must have insurance that covers this item.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.insuranceRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    insuranceRequired: e.target.checked,
                  })
                }
                className="w-5 h-5 text-purple-600 accent-purple-700 rounded focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* UPLOAD IMAGES */}
      <div className="bg-white p-6 rounded-xl shadow-sm border-gray-200">
        <SectionHeader title="Upload Images" />

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center 
          hover:border-purple-500 transition cursor-pointer"
        >
          <input
            type="file"
            id="uploadImg"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />

          <label
            htmlFor="uploadImg"
            className="cursor-pointer flex flex-col items-center"
          >
            <img
              src="/assets/icons/upload.png"
              alt="Upload Icon"
              className="w-14 h-14 opacity-80 mb-3"
            />
            <p className="text-purple-600 font-medium">
              Click to upload images
            </p>
          </label>
        </div>

        {errors.photo && (
          <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
        )}

        {/* IMAGE PREVIEWS WITH DELETE BUTTON */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.url}
                  alt=""
                  className="rounded-lg border h-32 w-full object-cover shadow-sm"
                />

                <button
                  type="button"
                  onClick={() =>
                    setImagePreviews((prev) =>
                      prev.filter((_, index) => index !== i)
                    )
                  }
                  className="absolute top-2 right-2 bg-purple-600 text-white 
                    w-7 h-7 rounded-full flex items-center justify-center 
                    text-sm opacity-90 hover:bg-purple-700 transition shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={submitForm}
          className="flex-1 bg-purple-700 text-white py-2 rounded-md font-medium 
            hover:bg-purple-700 transition"
        >
          List Item
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white border py-2 rounded-md text-gray-700 font-medium 
            hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
