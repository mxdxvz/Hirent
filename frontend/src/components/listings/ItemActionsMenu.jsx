import {
  MoreVertical,
  Pencil,
  Copy,
  Eye,
  History,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";

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
            <Pencil size={14} /> Edit Item
          </button>

          <button className="menu-btn" onClick={() => onDuplicate(item)}>
            <Copy size={14} /> Duplicate Item
          </button>

          <button className="menu-btn" onClick={() => onViewPage(item)}>
            <Eye size={14} /> View Item Page
          </button>

          <button className="menu-btn" onClick={() => onHistory(item)}>
            <History size={14} /> View Rental History
          </button>

          <button className="menu-btn" onClick={() => onToggleStatus(item)}>
            {item.status === "active" ? (
              <><ToggleLeft size={14} /> Disable Listing</>
            ) : (
              <><ToggleRight size={14} /> Enable Listing</>
            )}
          </button>

          <button
            className="menu-btn text-red-600 hover:bg-red-50"
            onClick={() => onDelete(item)}
          >
            <Trash2 size={14} /> Delete Item
          </button>
        </div>
      )}

      <style>{`
        .menu-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
          padding: 10px 12px;
          font-size: 14px;
          border-radius: 6px;
          transition: background-color 0.2s;
        }
        .menu-btn:hover {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
