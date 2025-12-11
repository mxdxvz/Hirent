import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import emptycollection from "../../../assets/empty-collection.png";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import SortDropdown from "../../../components/dropdown/SortDropdown";
import CancelConfirmationModal from "../../../components/modals/CancelModal";

import CollectionCard from "../../../components/cards/CollectionItemCard";
import CollectionSummary from "../../../components/cards/CollectionSummary";

import { ENDPOINTS, makeAPICall } from "../../../config/api";

const CollectionPage = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const [collectionItems, setCollectionItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");

  // Fetch collection items from API
  useEffect(() => {
    document.title = "Hirent — Collection";
    return () => {
      document.title = "Hirent";
    };
  }, []);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await makeAPICall(ENDPOINTS.CART.GET); // Assuming CART.GET returns user's collection
        if (data && Array.isArray(data.items)) {
          setCollectionItems(data.items);
        }
      } catch (error) {
        console.error("Failed to fetch collection:", error);
      }
    };
    fetchCollection();
  }, []);

  const handleRemoveItem = async (id) => {
    try {
      await makeAPICall(ENDPOINTS.CART.REMOVE(id), { method: "DELETE" });
      setCollectionItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const calculateItemTotal = (item) => {
    const pricePerDay = item.price || 0;
    let daysCount = item.days || 1;

    if (item.bookedFrom && item.bookedTo) {
      const from = new Date(item.bookedFrom);
      const to = new Date(item.bookedTo);
      const msPerDay = 1000 * 60 * 60 * 24;
      const diff = Math.floor((to - from) / msPerDay) + 1;
      daysCount = diff > 0 ? diff : daysCount;
    }

    const shippingFee = typeof item.shipping === "number" ? item.shipping : 0;
    const subtotal = pricePerDay * daysCount;
    const discountAmount = item.couponDiscount || 0;
    const total = subtotal + shippingFee - discountAmount;

    return { subtotal, discountAmount, shippingFee, total, daysCount, pricePerDay };
  };

  const openCancelModal = (id) => {
    setSelectedCancelId(id);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await makeAPICall(ENDPOINTS.BOOKINGS.CANCEL(selectedCancelId), { method: "POST" });

      setCollectionItems((prev) =>
        prev.map((item) =>
          item.id === selectedCancelId
            ? { ...item, status: "not booked", bookedFrom: null, bookedTo: null }
            : item
        )
      );

      setShowCancelModal(false);
      setSelectedCancelId(null);
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    }
  };

  const filteredItems = collectionItems.filter((item) => {
    if (filter === "all") return true;
    if (filter === "approved") return item.status === "approved";
    if (filter === "pending") return item.status === "pending";
    if (filter === "notBooked") return item.status !== "booked";
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aDate = new Date(a.addedAt || a.bookedFrom || Date.now());
    const bDate = new Date(b.addedAt || b.bookedFrom || Date.now());
    return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
  });

  const notBookedItems = collectionItems.filter((item) => item.status !== "booked");
  const approvedItems = collectionItems.filter((item) => item.status === "approved");

  const approvedTotals = approvedItems.reduce(
    (acc, item) => {
      const itemTotals = calculateItemTotal(item);
      acc.subtotal += itemTotals.subtotal;
      acc.shipping += itemTotals.shippingFee;
      acc.discount += itemTotals.discountAmount;
      return acc;
    },
    { subtotal: 0, shipping: 0, discount: 0 }
  );

  const approvedSecurityDepositTotal = approvedItems.reduce(
    (acc, item) => acc + (item.securityDeposit || 0),
    0
  );

  const approvedGrandTotal = approvedTotals.subtotal + approvedTotals.shipping - approvedTotals.discount;
  const approvedGrandTotalWithDeposit = approvedGrandTotal + approvedSecurityDepositTotal;
  const waitingCount = collectionItems.filter((item) => item.status === "pending").length;

  return (
    <div className="flex min-h-screen px-4 md:px-6 lg:px-8">
      {/* LEFT PANEL */}
      <div className="w-[520px] pl-16 flex-shrink-0 sticky top-10 self-start min-h-screen bg-gray-50 border-r border-gray-200">
        <div className="mb-3 mt-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#7A1CA9] text-sm font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go back
          </button>
        </div>

        <div className="flex items-center justify-between mb-5 mr-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200">
              <ShoppingBag className="w-8 h-8 text-[#a12fda]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-900 mt-1">Your Collection</h1>
              <p className="text-gray-500 text-sm">Items you gathered for booking</p>
            </div>
          </div>
          <SortDropdown options={["Latest", "Oldest"]} onSortChange={(value) => setSortOrder(value.toLowerCase())} />
        </div>

        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setFilter("all")}
            className={`px-2 py-1 rounded-lg text-[13px] transition ${
              filter === "all" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#7A1CA9]/10"
            }`}
          >
            All Items ({collectionItems.length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-2 py-1 rounded-lg text-[13px] transition ${
              filter === "approved" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#7A1CA9]/10"
            }`}
          >
            Approved ({approvedItems.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-2 py-1 rounded-lg text-[13px] transition ${
              filter === "pending" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#7A1CA9]/10"
            }`}
          >
            Pending ({waitingCount})
          </button>
          <button
            onClick={() => setFilter("notBooked")}
            className={`px-2 py-1 rounded-lg text-[13px] transition ${
              filter === "notBooked" ? "bg-[#7A1CA9] text-white" : "bg-gray-100 text-gray-700 hover:bg-[#7A1CA9]/10"
            }`}
          >
            Not Booked Yet ({notBookedItems.length})
          </button>
        </div>

        <hr className="border-t border-gray-200 mb-4" />
        <CollectionSummary
          navigate={navigate}
          collectionItems={collectionItems}
          approvedItems={approvedItems}
          waitingCount={waitingCount}
          approvedTotals={approvedTotals}
          approvedSecurityDepositTotal={approvedSecurityDepositTotal}
          approvedGrandTotalWithDeposit={approvedGrandTotalWithDeposit}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 pl-6 pt-8 pb-12">
        {collectionItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[90vh] w-full">
            <img src={emptycollection} className="w-64 h-64 mb-3" />
            <h2 className="text-[22px] font-bold text-gray-700">No Items in Collection</h2>
            <p className="text-gray-400 text-center max-w-sm mb-4">
              Looks like you haven’t added any items yet.
            </p>
            <button
              onClick={() => navigate("/browse")}
              className="bg-white border border-[#7A1CA9]/20 text-[#7A1CA9] px-3 py-1.5 text-sm rounded-lg shadow hover:bg-gray-50"
            >
              Go to Shop ➔
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedItems.map((item) => (
              <CollectionCard
                key={item.id}
                item={item}
                calculateItemTotal={calculateItemTotal}
                openCancelModal={openCancelModal}
                handleRemoveItem={handleRemoveItem}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancelBooking}
      />
    </div>
  );
};

export default CollectionPage;
