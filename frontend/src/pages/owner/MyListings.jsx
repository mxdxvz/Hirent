import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OwnerSidebar from "../../components/layouts/OwnerSidebar";
import { makeAPICall, ENDPOINTS } from "../../config/api";

import {
  Search,
  TrendingUp,
  Clock,
  Plus,
  Package,
  Hash,
  Eye,
  MapPin,
  CalendarDays,
} from "lucide-react";

import RentalHistoryPanel from "../../components/listings/RentalHistoryPanel";
import EditItemModal from "../../components/listings/EditItemModal";
import DeleteConfirmModal from "../../components/listings/DeleteConfirmModal";
import ItemPageModal from "../../components/listings/ItemPageModal";
import ItemActionsMenu from "../../components/listings/ItemActionsMenu";

// Fetch owner listings from backend
const MyListings = () => {
  const { user } = React.useContext(
    require("../../context/AuthContext").AuthContext
  );
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Function to fetch listings
  const fetchListings = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch only items owned by the logged-in user
      const data = await makeAPICall(ENDPOINTS.ITEMS.BY_OWNER(user.id));
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  }, [user?.id]);

  // Fetch owner items from backend - refetch when location changes
  useEffect(() => {
    fetchListings();
  }, [user?.id, location, fetchListings]);

  // State for modals
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [viewPageModal, setViewPageModal] = useState(null);
  const [historyPanel, setHistoryPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Handle duplicate
  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.status === "active" ? "inactive" : "active";
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/items/${item._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchListings(); // Refetch to show the updated status
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDuplicate = async (item) => {
    try {
      const { _id, owner, createdAt, updatedAt, __v, ...itemData } = item;
      itemData.title = `${item.title} (Copy)`;

      const formData = new FormData();
      for (const key in itemData) {
        const value = itemData[key];
        if (value !== null && value !== undefined && value !== 'null') {
          if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000${ENDPOINTS.ITEMS.CREATE}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      if (response.ok) {
        fetchListings(); // Refetch to show the new item
      } else {
        console.error("Failed to duplicate item");
      }
    } catch (err) {
      console.error("Error duplicating item:", err);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await makeAPICall(ENDPOINTS.ITEMS.DELETE(id), { method: "DELETE" });
      setListings((prev) => prev.filter((item) => item._id !== id));
      setDeleteModal(null);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // Filter and search
  const filtered = listings.filter((item) => {
    const itemStatus = item.status === "active" ? "Active" : "Inactive";
    if (filterStatus !== "All" && itemStatus !== filterStatus) return false;
    if (
      searchTerm &&
      !item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });
  // BADGE COLORS
  const availabilityBadge = {
    Available: "bg-green-100 text-green-700 border border-green-300",
    Unavailable: "bg-red-100 text-red-700 border border-red-300",
    Rented: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  };

  // AVAILABILITY BADGE RENDERER
  const badge = (label, className) => (
    <span className={`px-3 py-1 text-xs rounded-full font-medium ${className}`}>
      {label}
    </span>
  );

  // STATUS INDICATOR
  const statusIndicator = (status) => {
    const color =
      status === "active"
        ? "bg-green-500"
        : status === "inactive"
        ? "bg-gray-400"
        : "bg-yellow-500";

    const textColor =
      status === "active"
        ? "text-green-600"
        : status === "inactive"
        ? "text-gray-600"
        : "text-yellow-600";

    return (
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${color}`}></span>
        <span className={`text-[13px] capitalize font-medium ${textColor}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <OwnerSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8 ml-60">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Listings</h1>
            <p className="text-gray-500">Manage all your rental items</p>
          </div>

          <Link
            to="/owner/add-item"
            className="flex items-center gap-2 px-4 py-2 bg-[#7A1CA9] text-white rounded-xl text-sm font-medium hover:bg-[#6a1894] transition"
          >
            <Plus size={16} />
            Add New Item
          </Link>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-8 h-8 text-[#7A1CA9]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listings.length}
                </p>
                <p className="text-xs text-gray-500">Total Listings</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listings.filter((l) => l.status === "active").length}
                </p>
                <p className="text-xs text-gray-500">Active Items</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {listings.filter((l) => l.totalBookings > 0).length}
                </p>
                <p className="text-xs text-gray-500">Currently Rented</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  ₱
                  {listings
                    .reduce((sum, i) => sum + (i.totalRevenue || 0), 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex gap-3 mb-3">
            {/* SEARCH */}
            <div className="flex items-center border bg-white rounded-lg px-3 py-2 flex-1">
              <Search size={16} className="text-gray-400" />
              <input
                className="ml-2 w-full text-sm outline-none"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* STATUS DROPDOWN */}
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* RESULTS COUNT */}
        <p className="text-sm text-gray-500 mb-2">
          Showing {filtered.length} of {listings.length} listings
        </p>

        {/* TABLE */}
        <div className="bg-white rounded-xl border shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[13px] text-gray-600">
                <th className="py-2 px-4 font-semibold">Item</th>
                <th className="py-2 px-12 font-semibold">Price</th>
                <th className="py-2 px-12 font-semibold">Performance</th>
                <th className="py-2 px-12 font-semibold">Availability</th>
                <th className="py-2 px-12 font-semibold">Status</th>
                <th className="py-2 px-12 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 text-sm">No listings found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <React.Fragment key={item._id}>
                    {/* MAIN ROW */}
                    <tr
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        setExpanded(expanded === item._id ? null : item._id)
                      }
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.images?.[0] ||
                              "https://via.placeholder.com/40"
                            }
                            alt={item.title}
                            className="w-14 h-14 object-cover rounded-lg border"
                          />
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Hash size={12} />
                              {item._id.slice(0, 6)} • {item.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-12 text-gray-700 font-medium">
                        ₱{item.pricePerDay?.toLocaleString()}/day
                      </td>

                      {/* PERFORMANCE */}
                      <td className="py-3 px-12">
                        <div className="text-xs space-y-1">
                          <p className="flex items-center gap-1 text-gray-600">
                            <Eye size={12} />
                            {item.views || 0} views
                          </p>
                          <p className="flex items-center gap-1 text-gray-600">
                            <Package size={12} />
                            {item.totalBookings || 0} bookings
                          </p>
                          <p className="text-green-600 font-medium">
                            ₱{(item.totalRevenue || 0).toLocaleString()} earned
                          </p>
                        </div>
                      </td>

                      {/* AVAILABILITY */}
                      <td className="py-3 px-12">
                        {badge(
                          item.availability || "Available",
                          availabilityBadge[item.availability || "Available"]
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-3 px-12">
                        {statusIndicator(item.status)}
                      </td>

                      {/* ACTIONS */}
                      <td
                        className="py-3 px-12 text-right relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ItemActionsMenu
                          item={item}
                          menuOpen={menuOpen}
                          setMenuOpen={setMenuOpen}
                          onEdit={() => setEditModal(item)}
                          onDelete={() => setDeleteModal(item)}
                          onViewPage={() => setViewPageModal(item)}
                          onHistory={() => setHistoryPanel(item)}
                          onDuplicate={() => handleDuplicate(item)}
                          onToggleStatus={() => handleToggleStatus(item)}
                        />
                      </td>
                    </tr>

                    {/* EXPANDED ROW */}
                    {expanded === item._id && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="p-4">
                          <div className="grid grid-cols-3 gap-6">
                            {/* LOCATION */}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Location
                              </p>
                              <p className="text-sm font-medium flex items-center gap-1">
                                <MapPin size={14} />
                                {item.location || "No location set"}
                              </p>
                            </div>

                            {/* DATE ADDED */}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Added On
                              </p>
                              <p className="text-sm font-medium flex items-center gap-1">
                                <CalendarDays size={14} />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            {/* LAST UPDATED */}
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Last Updated
                              </p>
                              <p className="text-sm font-medium">
                                {item.updatedAt
                                  ? new Date(
                                      item.updatedAt
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EditItemModal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        item={editModal}
        onSave={fetchListings}
      />
      <DeleteConfirmModal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onDelete={() => handleDelete(deleteModal._id)}
        item={deleteModal}
      />
      <ItemPageModal
        open={!!viewPageModal}
        onClose={() => setViewPageModal(null)}
        item={viewPageModal}
      />
      <RentalHistoryPanel
        open={!!historyPanel}
        onClose={() => setHistoryPanel(null)}
        item={historyPanel}
      />
    </div>
  );
};

export default MyListings;
