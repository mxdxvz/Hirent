import React, { useState, useContext, useEffect } from "react";
import {
  User,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import PersonalInformation from "../../../components/profilepage/Personal";
import { AddressesComponent } from "../../../components/profilepage/Addresses";
import { PaymentMethodsComponent } from "../../../components/profilepage/PaymentMethods";
import SettingsComponent from "../../../components/profilepage/Settings";

export default function RenterProfilePage() {
  const { logout, user, isLoggedIn, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  const [activeItem, setActiveItem] = useState("personal");

  const navItems = [
    { id: "personal", label: "Personal Information", icon: <User size={20} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={20} /> },
    { id: "payment", label: "Payment Method", icon: <CreditCard size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    { id: "signout", label: "Sign Out", icon: <LogOut size={20} /> },
  ];

  // Initialize form from real user data (no defaults)
  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    birthday: user?.birthday || "",
    address: user?.address || "",
    gender: user?.gender || "",
    bio: user?.bio || "",
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user?.name?.split(" ")[0] || "",
        lastName: user?.name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        phone: user?.phone || "",
        birthday: user?.birthday || "",
        address: user?.address || "",
        gender: user?.gender || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  // -----------------------------
  // REAL API DATA STATES
  // -----------------------------
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [addresses, setAddresses] = useState([]);

  // -----------------------------
  // FETCH ADDRESSES + PAYMENTS FROM API
  // -----------------------------
  useEffect(() => {
    async function fetchProfileExtras() {
      try {
        const token = localStorage.getItem("token");

        // Fetch Addresses
        const addrRes = await fetch("https://hirent-3.onrender.com/api/users/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (addrRes.ok) {
          const addrData = await addrRes.json();
          setAddresses(addrData?.addresses || []);
        }

        // Fetch Payment Methods
        const payRes = await fetch("https://hirent-3.onrender.com/api/users/payment-methods", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (payRes.ok) {
          const payData = await payRes.json();
          setPaymentMethods(payData?.paymentMethods || []);
        }
      } catch (err) {
        console.error("Error fetching profile extras:", err);
      }
    }

    fetchProfileExtras();
  }, []);

  // -----------------------------
  // SIGN OUT HANDLER
  // -----------------------------
  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      navigate("/login");
    }
  };

  // -----------------------------
  // SAVE PROFILE CHANGES
  // -----------------------------
  async function handleSave(updatedForm) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await fetch("https://hirent-3.onrender.com/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: `${updatedForm.firstName} ${updatedForm.lastName}`,
          phone: updatedForm.phone,
          address: updatedForm.address,
          gender: updatedForm.gender,
          birthday: updatedForm.birthday,
          bio: updatedForm.bio,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        updateUser(data.user);
        alert("✓ Profile updated successfully!");
      } else if (data.errors && Array.isArray(data.errors)) {
        // Handle validation errors from backend
        const errorMessages = data.errors.map(err => `${err.param}: ${err.msg}`).join("\n");
        alert("Validation error:\n" + errorMessages);
      } else {
        alert("Error: " + (data.message || "Failed to update profile"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Network error. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex justify-center">
      <div className="flex flex-1 ml-5">
        <main className="w-full max-w-[1800px] mx-auto pl-24 py-10 grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)]">
          {/* LEFT SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="bg-white collection-scale rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 text-center border-b">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-40 h-40 rounded-full mx-auto mb-5 object-cover"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full mx-auto mb-5 bg-purple-100 flex items-center justify-center">
                    <UserCircle size={80} className="text-purple-600" />
                  </div>
                )}

                <h3 className="text-[20px] font-semibold">{user?.name || ""}</h3>
                <div className="text-[15px] text-gray-500">
                  {user?.email || ""}
                </div>
                {user?.role && ( <div className="text-[12px] text-purple-500 mt-2 uppercase font-medium"> {user.role} </div> )}
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li
                      key={item.id}
                      onClick={() =>
                        item.id === "signout"
                          ? handleSignOut()
                          : setActiveItem(item.id)
                      }
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                        activeItem === item.id
                          ? "bg-purple-50 border-l-4 border-[#7A1CA9] text-[#7A1CA9]"
                          : "hover:bg-purple-100"
                      }`}
                    >
                      {item.icon}
                      <span className="text-[15px] font-medium">{item.label}</span>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="col-span-1">
            {activeItem === "personal" && (
              <PersonalInformation form={form} setForm={setForm} handleSave={handleSave} />
            )}

            {activeItem === "addresses" && (
              <AddressesComponent addresses={addresses} setAddresses={setAddresses} />
            )}

            {activeItem === "payment" && (
              <PaymentMethodsComponent
                paymentMethods={paymentMethods}
                setPaymentMethods={setPaymentMethods}
              />
            )}

            {activeItem === "settings" && <SettingsComponent />}
          </section>
        </main>
      </div>
    </div>
  );
}
