import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  PackageX,
  Trash2,
  Upload,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
  Eye,
  X,
  Search,
} from "lucide-react";
import OwnerSidebar from "../../components/layouts/OwnerSidebar";

const statusMap = {
  "not-returned": {
    label: "Not Returned",
    color: "text-orange-600",
    pill: "bg-orange-100/80",
    icon: Clock,
    bgGradient: "from-orange-500/10 to-orange-600/5",
  },
  returned: {
    label: "Returned",
    color: "text-emerald-600",
    pill: "bg-emerald-100/80",
    icon: CheckCircle,
    bgGradient: "from-emerald-500/10 to-emerald-600/5",
  },
  overdue: {
    label: "Overdue",
    color: "text-red-600",
    pill: "bg-red-100/50",
    icon: AlertTriangle,
    bgGradient: "from-red-500/10 to-red-600/5",
  },
  damaged: {
    label: "Damaged",
    color: "text-amber-600",
    pill: "bg-amber-100/80",
    icon: AlertCircle,
    bgGradient: "from-amber-500/10 to-amber-600/5",
  },
  lost: {
    label: "Lost",
    color: "text-slate-600",
    pill: "bg-slate-200/80",
    icon: PackageX,
    bgGradient: "from-slate-500/10 to-slate-600/5",
  },
};

// -------------------------
// REUSABLE MODAL COMPONENT
// -------------------------
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";

      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 w-full ${sizeClasses[size]} shadow-2xl border border-white/20 animate-modalSlideIn`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} className="text-gray-500" />
        </button>
        <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

// -------------------------
// IMAGE PREVIEW COMPONENT
// -------------------------
const ImagePreview = ({ images, onRemove, showRemove = true }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-3">
      {images.map((img, i) => (
        <div key={i} className="relative group">
          <img
            src={typeof img === "string" ? img : URL.createObjectURL(img)}
            alt={`Preview ${i + 1}`}
            className="w-20 h-20 rounded-xl object-cover shadow-md border border-gray-200 transition-transform group-hover:scale-105"
          />
          {showRemove && onRemove && (
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              aria-label={`Remove image ${i + 1}`}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// -------------------------
// STATS CARDS COMPONENT
// -------------------------
const StatsCards = ({ items }) => {
  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: RefreshCw,
      color: "bg-purple-500",
    },
    {
      label: "Returned",
      value: items.filter((i) => i.status === "returned").length,
      icon: CheckCircle,
      color: "bg-emerald-500",
    },
    {
      label: "Pending",
      value: items.filter((i) => i.status === "not-returned").length,
      icon: Clock,
      color: "bg-orange-500",
    },
    {
      label: "Overdue",
      value: items.filter((i) => i.status === "overdue").length,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 ${stat.color} rounded-xl`}>
              <stat.icon className="text-white" size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// -------------------------
// ITEM CARD COMPONENT
// -------------------------
const ItemCard = ({ item, onAction }) => {
  const StatusIcon = statusMap[item.status].icon;
  const [showProofModal, setShowProofModal] = useState(false);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <div
        className={`bg-white ${statusMap[item.status].bgGradient} backdrop-blur-xl rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
      >
        {/* Item card content remains unchanged */}
        <div className="flex gap-5">
          <div className="bg-gray-100 rounded-xl w-28 h-28 shadow-inner flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => (e.target.src = "/assets/placeholder.png")}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
              <div
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[13px] font-medium ${statusMap[item.status].pill} ${statusMap[item.status].color}`}
              >
                <StatusIcon size={14} />
                {statusMap[item.status].label}
              </div>
            </div>

            {/* Dates, renter, deposit */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User size={14} className="text-gray-400" />
                <span>{item.renter}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} className="text-gray-400" />
                <span>Due: {formatDate(item.dueDate)}</span>
                {item.status === "overdue" && (
                  <span className="text-red-500 font-medium">({getDaysOverdue(item.dueDate)} days overdue)</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={14} className="text-gray-400" />
                <span>Deposit: ₱{item.deposit?.toLocaleString()}</span>
              </div>
            </div>

            {/* Proof modal */}
            {item.status === "returned" && item.proof?.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowProofModal(true)}
                  className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  <Eye size={14} />
                  View Return Proof ({item.proof.length} images)
                </button>
              </div>
            )}

            {/* Action buttons */}
            {item.status !== "returned" && item.status !== "lost" && (
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onAction(item, "return")}
                  className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg text-[13px] font-medium transition-all"
                >
                  Confirm Return
                </button>
                {item.status !== "damaged" && (
                  <button
                    onClick={() => onAction(item, "damage")}
                    className="px-3 py-2 bg-amber-50 border border-amber-300 text-amber-700 rounded-xl text-[13px] font-medium hover:bg-amber-100 transition-colors"
                  >
                    Report Damage
                  </button>
                )}
                <button
                  onClick={() => onAction(item, "lost")}
                  className="px-3 py-2 bg-red-50 border border-red-300 text-red-700 rounded-xl text-[13px] font-medium hover:bg-gray-200 transition-colors"
                >
                  Mark Lost
                </button>
                <button
                  onClick={() => onAction(item, "deposit")}
                  className="px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[13px] font-medium hover:bg-gray-50 transition-colors"
                >
                  Manage Deposit
                </button>
              </div>
            )}

            {item.status === "lost" && (
              <div className="mt-4">
                <button
                  onClick={() => onAction(item, "deposit")}
                  className="px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  Process Deposit Claim
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={showProofModal} onClose={() => setShowProofModal(false)} title="Return Proof" size="lg">
        <p className="text-gray-600 text-sm mb-4">
          Photos submitted as proof of return for {item.name}
        </p>
        <div className="grid grid-cols-2 gap-4">
          {item.proof?.map((img, i) => (
            <img key={i} src={img} alt={`Return proof ${i + 1}`} className="w-full h-48 object-cover rounded-xl shadow-md" />
          ))}
        </div>
        <button
          onClick={() => setShowProofModal(false)}
          className="mt-6 w-full py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          Close
        </button>
      </Modal>
    </>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
export default function OwnerReturns({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState("All");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setItems((prev) =>
      prev.map((item) => {
        if (item.status === "not-returned") {
          const due = new Date(item.dueDate);
          due.setHours(0, 0, 0, 0);
          if (due < today) return { ...item, status: "overdue" };
        }
        return item;
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.renter?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      filters === "All" || statusMap[item.status].label === filters;

    return matchSearch && matchCategory;
  });

  const filterCategories = [
    { label: "All", count: items.length },
    ...Object.keys(statusMap).map((key) => ({
      label: statusMap[key].label,
      count: items.filter((i) => i.status === key).length,
    })),
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-100">
      <OwnerSidebar />
      <div className="flex-1 p-8 ml-60">
        {notification && (
          <div
            className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl animate-slideIn ${
              notification.type === "success"
                ? "bg-emerald-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === "success" && <CheckCircle size={20} />}
              {notification.type === "error" && <AlertCircle size={20} />}
              {notification.type === "warning" && <AlertTriangle size={20} />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Return Management</h1>
          <p className="text-gray-500">
            Track returns, verify proofs, and manage item conditions efficiently
          </p>
        </div>

        {/* STATS */}
        <StatsCards items={items} />

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex items-center bg-white text-gray-600 px-4 py-2 rounded-lg shadow-sm border max-w-sm w-full">
            <Search size={18} />
            <input
              className="ml-2 w-full bg-transparent focus:outline-none text-sm text-gray-700"
              placeholder="Search items or renters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setFilters(cat.label)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  filters === cat.label
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/80 backdrop-blur-lg text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {cat.label}
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    filters === cat.label ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* NO ITEMS */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <PackageX className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">No items found</h3>
            <p className="text-gray-500 mt-2">
              {search ? "Try adjusting your search terms" : "No items match the selected filter"}
            </p>
          </div>
        )}

        {/* ITEM CARDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onAction={(i, type) => console.log(i, type)} />
          ))}
        </div>
      </div>
    </div>
  );
}