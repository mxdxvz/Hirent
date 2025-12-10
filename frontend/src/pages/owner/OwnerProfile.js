import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../../components/layouts/OwnerSidebar";
import { AuthContext } from "../../context/AuthContext";
import { makeAPICall, ENDPOINTS } from "../../config/api";
import { PH_BANKS, EWALLETS, PH_PROVINCES } from "../../constants/phData";

export default function OwnerProfile() {
  const { user, updateUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    businessName: "",
    businessType: "",
    taxId: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    ewalletProvider: "",
    ewalletNumber: "",
    ewalletName: "",
  });

  const [profileImage, setProfileImage] = useState("");

  // Load user data
  useEffect(() => {
    if (!user) return;

    // Split name into first and last
    const nameParts = user.name ? user.name.split(" ") : ["", ""];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setProfileData({
      firstName: firstName,
      lastName: lastName,
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || user.ownerAddress || "",
      city: user.city || user.cityName || "",
      zipCode: user.postalCode || user.zipCode || "",
      country: user.country || "",
      // Owner Setup Fields
      sellerType: user.sellerType || "",
      ownerAddress: user.ownerAddress || "",
      pickupAddress: user.pickupAddress || "",
      region: user.region || "",
      regionName: user.regionName || "",
      province: user.province || "",
      provinceName: user.provinceName || "",
      barangay: user.barangay || "",
      // Business Fields
      businessName: user.businessName || "",
      businessType: user.businessType || user.sellerType || "Individual",
      taxId: user.taxId || "",
      // Payment Fields
      bankName: user.bankName || "",
      accountNumber: user.accountNumber || "",
      accountName: user.accountName || "",
      ewalletProvider: user.ewalletProvider || "",
      ewalletNumber: user.ewalletNumber || "",
      ewalletName: user.ewalletName || "",
    });

    setProfileImage(user.avatar || "");
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Image upload
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const updatedUser = await makeAPICall(ENDPOINTS.AUTH.PROFILE, {
        method: "PUT",
        body: formData,
      });

      if (updatedUser) {
        updateUser(updatedUser);
        setProfileImage(updatedUser.avatar);
        alert("Profile image updated successfully!");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload profile image.");
    }
  };

  // Save changes
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in. Please login again.");
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`http://localhost:5000${ENDPOINTS.AUTH.PROFILE}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${profileData.firstName} ${profileData.lastName}`,
          phone: profileData.phone,
          address: profileData.address,
          gender: profileData.gender,
          birthday: profileData.birthday,
          bio: profileData.bio,
          // Owner Setup Fields
          sellerType: profileData.sellerType,
          ownerAddress: profileData.ownerAddress,
          pickupAddress: profileData.pickupAddress,
          region: profileData.region,
          regionName: profileData.regionName,
          province: profileData.province,
          provinceName: profileData.provinceName,
          barangay: profileData.barangay,
          postalCode: profileData.zipCode,
          // Business Fields
          businessName: profileData.businessName,
          businessType: profileData.businessType,
          taxId: profileData.taxId,
          // Payment Fields
          bankName: profileData.bankName,
          accountNumber: profileData.accountNumber,
          accountName: profileData.accountName,
          ewalletProvider: profileData.ewalletProvider,
          ewalletNumber: profileData.ewalletNumber,
          ewalletName: profileData.ewalletName,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        updateUser(data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        console.error("Update response:", data);
        alert(data.message || "Failed to save changes.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("An error occurred while saving profile.");
    }
  };

  const avatar =
    user?.avatar || "https://ui-avatars.com/api/?name=" + user?.name;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8 ml-60">
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Profile Settings
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your personal information and account settings
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#7A1CA9] text-white px-6 py-2.5 rounded-lg font-medium text-sm"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="bg-[#7A1CA9] text-white px-6 py-2.5 rounded-lg font-medium text-sm"
              >
                Save Changes
              </button>

              <button
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 px-6 py-2.5 rounded-lg text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="relative mx-auto">
                <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden mx-auto">
                  <img
                    src={profileImage || avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {isEditing && (
                  <label className="absolute bottom-0 right-10 bg-[#7A1CA9] text-white p-2 rounded-full cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    ✎
                  </label>
                )}
              </div>

              {/* REAL USER DATA */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <div>
                  <p className="font-bold text-xl text-gray-900">
                    {user?.name ||
                      `${profileData.firstName} ${profileData.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    {profileData.email}
                  </p>
                  <p className="text-sm text-purple-500">Owner</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* PERSONAL INFO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "firstName",
                  "lastName",
                  "email",
                  "phone",
                  "address",
                  "city",
                  "zipCode",
                ].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={
                        field === "firstName" || field === "lastName"
                          ? user?.name
                            ? field === "firstName"
                              ? user.name.split(" ")[0] || ""
                              : user.name.split(" ")[1] || ""
                            : profileData[field]
                          : profileData[field]
                      }
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-sm ${
                        isEditing
                          ? "border-gray-300 focus:ring-2 focus:ring-[#7A1CA9]"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* OWNER SETUP INFO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">
                Owner Setup Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seller Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Seller Type
                  </label>
                  <select
                    name="sellerType"
                    value={profileData.sellerType}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Individual">Individual</option>
                    <option value="Business">Business</option>
                  </select>
                </div>

                {/* Owner Address */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Owner Address
                  </label>
                  <input
                    type="text"
                    name="ownerAddress"
                    value={profileData.ownerAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    name="pickupAddress"
                    value={profileData.pickupAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Region
                  </label>
                  <input
                    type="text"
                    name="regionName"
                    value={profileData.regionName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Province
                  </label>
                  <select
                    name="provinceName"
                    value={profileData.provinceName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Province</option>
                    {PH_PROVINCES.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Barangay */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Barangay
                  </label>
                  <input
                    type="text"
                    name="barangay"
                    value={profileData.barangay}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* BUSINESS INFO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">
                Business Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Business Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={profileData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  />
                </div>

                {/* Business Type */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={profileData.businessType}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Sole Proprietorship">
                      Sole Proprietorship
                    </option>
                    <option value="Corporation">Corporation</option>
                    <option value="Partnership">Partnership</option>
                  </select>
                </div>

                {/* Tax ID */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Tax ID / TIN
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={profileData.taxId}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* BANK INFO */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Bank Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bank Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Bank Name
                  </label>
                  <select
                    name="bankName"
                    value={profileData.bankName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Bank</option>
                    {PH_BANKS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Number */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={profileData.accountNumber}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                {/* Account Name */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={profileData.accountName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* E-WALLET */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">
                E-Wallet Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Provider
                  </label>
                  <select
                    name="ewalletProvider"
                    value={profileData.ewalletProvider}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="">Select Provider</option>
                    {EWALLETS.map((wallet) => (
                      <option key={wallet} value={wallet}>
                        {wallet}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="ewalletNumber"
                    value={profileData.ewalletNumber}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="ewalletName"
                    value={profileData.ewalletName}
                    disabled={!isEditing}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
