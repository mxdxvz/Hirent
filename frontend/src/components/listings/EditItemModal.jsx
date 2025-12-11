import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../../config/api";

export default function EditItemModal({ open, onClose, item, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerDay: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        pricePerDay: item.pricePerDay || "",
        category: item.category || "",
      });
    }
  }, [item]);

  if (!item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000${ENDPOINTS.ITEMS.UPDATE(item._id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Item updated successfully!");
        if (onSave) onSave();
        onClose();
      } else {
        alert("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-[420px] bg-white rounded-xl shadow-xl p-6"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Item</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price Per Day (₱)</label>
                <input
                  type="number"
                  name="pricePerDay"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  className="w-full border rounded-lg px-3 py-2 h-24 mt-1"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  className="w-full border rounded-lg px-3 py-2 mt-1"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
