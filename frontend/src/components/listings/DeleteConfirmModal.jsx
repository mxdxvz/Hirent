import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function DeleteConfirmModal({ open, onClose, onDelete, item }) {
  if (!item) return null;

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
            className="w-[380px] bg-white rounded-xl p-6 shadow-xl"
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delete Item?</h2>
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={onClose}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-gray-700">
              Are you sure you want to delete "<b>{item.title}</b>"?  
              This action cannot be undone.
            </p>

            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
