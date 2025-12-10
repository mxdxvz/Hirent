import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import OwnerSidebar from "../../components/layouts/OwnerSidebar";
import { makeAPICall, ENDPOINTS } from "../../config/api";

import { Search, Plus, Package } from "lucide-react";

import RentalHistoryPanel from "../../components/listings/RentalHistoryPanel";
import EditItemModal from "../../components/listings/EditItemModal";
import DeleteConfirmModal from "../../components/listings/DeleteConfirmModal";
import ItemPageModal from "../../components/listings/ItemPageModal";
import ItemActionsMenu from "../../components/listings/ItemActionsMenu";

// Fetch owner listings from backend
const MyListings = () => {
  const { user } = React.useContext(require("../../context/AuthContext").AuthContext);
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  // Function to fetch listings
  const fetchListings = React.useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      // Fetch only items owned by the logged-in user
      const data = await makeAPICall(ENDPOINTS.ITEMS.BY_OWNER(user.id));
      setListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings");
    } finally {
      setLoading(false);
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

  return (
    <div className="flex min-h-screen">
      <OwnerSidebar />
      <div className="flex-1 p-8 ml-60">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Listings</h1>
            <p className="text-gray-500">Manage your rental items</p>
          </div>
          <Link to="/owner/add-item" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-32">
            <p className="text-gray-500">Loading listings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-32">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-xl">
              No listings yet.
            </p>
            <p className="text-gray-400 text-md">
              Start by adding your first rental item.
            </p>
          </div>
        )}

        {/* Listings Table */}
        {!loading && listings.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || "https://via.placeholder.com/40"}
                          alt={item.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-gray-600">
                      ₱{item.pricePerDay?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {item.totalBookings || 0}
                    </td>
                    <td className="px-6 py-4">
                      <ItemActionsMenu
                        item={item}
                        menuOpen={menuOpen}
                        setMenuOpen={setMenuOpen}
                        onEdit={() => setEditModal(item)}
                        onDelete={() => setDeleteModal(item)}
                        onViewPage={() => setViewPageModal(item)}
                        onHistory={() => setHistoryPanel(item)}
                        onDuplicate={() => {}}
                        onToggleStatus={() => {}}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
