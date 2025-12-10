import { MoreVertical } from "lucide-react";

export default function ItemActionsMenu({
  item,
  menuOpen,
  setMenuOpen,
  onEdit,
  onDuplicate,
  onViewPage,
  onHistory,
  onToggleStatus,
  onDelete,
}) {
  return (
    <div className="relative text-right">
      <button
        className="p-2 hover:bg-gray-200 rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen(menuOpen === item._id ? null : item._id);
        }}
      >
        <MoreVertical size={18} />
      </button>

      {menuOpen === item._id && (
        <div
          className="absolute right-0 mt-2 bg-white border shadow-xl rounded-lg w-48 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="menu-btn" onClick={() => onEdit(item)}>
            Edit Item
          </button>

          <button className="menu-btn" onClick={() => onDuplicate(item)}>
            Duplicate Item
          </button>

          <button className="menu-btn" onClick={() => onViewPage(item)}>
            View Item Page
          </button>

          <button className="menu-btn" onClick={() => onHistory(item)}>
            View Rental History
          </button>

          <button className="menu-btn" onClick={() => onToggleStatus(item)}>
            {item.status === "Active" ? "Disable Listing" : "Enable Listing"}
          </button>

          <button
            className="menu-btn text-red-600 bg-red-50 hover:bg-red-100"
            onClick={() => onDelete(item)}
          >
            Delete Item
          </button>
        </div>
      )}

      <style>{`
        .menu-btn {
          width: 100%;
          text-align: left;
          padding: 10px 14px;
          font-size: 14px;
          border-radius: 6px;
        }
        .menu-btn:hover {
          background: #f3f3f3;
        }
      `}</style>
    </div>
  );
}
