import React, { useState, useRef, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layouts/Navbar";
import Sidebar from "../components/layouts/Sidebar";
import Footer from "../components/layouts/Footer";
import ImageGallery from "../components/product/ImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import RelatedItems from "../components/product/RelatedItems";
import { makeAPICall, ENDPOINTS } from "../config/api";
import { AuthContext } from "../context/AuthContext";
import {
  Flag,
  X,
  AlertTriangle,
  Star,
  MessageCircle,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  ExternalLink,
  Clock,
  BadgeCheck,
} from "lucide-react";


// -------------------------
// REPORT MODAL COMPONENT
// -------------------------
const ReportModal = ({ isOpen, onClose, reportType }) => {
  const modalRef = useRef(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const productReasons = [
    { id: "misleading", label: "Misleading or inaccurate listing" },
    { id: "prohibited", label: "Prohibited or illegal item" },
    { id: "counterfeit", label: "Counterfeit or fake product" },
    { id: "inappropriate", label: "Inappropriate content or images" },
    { id: "scam", label: "Suspected scam or fraud" },
    { id: "wrong-category", label: "Wrong category placement" },
    { id: "other", label: "Other reason" },
  ];

  const ownerReasons = [
    { id: "harassment", label: "Harassment or abusive behavior" },
    { id: "fraud", label: "Fraudulent activity" },
    { id: "no-show", label: "Repeated no-shows" },
    { id: "fake-profile", label: "Fake or misleading profile" },
    { id: "unsafe", label: "Unsafe transaction practices" },
    { id: "impersonation", label: "Impersonation of another person" },
    { id: "other", label: "Other reason" },
  ];

  const reasons = reportType === "product" ? productReasons : ownerReasons;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      modalRef.current?.focus();

      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl pointer-events-auto animate-modalSlideIn max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
            <h2 className="text-lg font-bold text-gray-900">
              Report {reportType === "product" ? "Product" : "Owner"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="text-gray-500" size={18} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            {isSubmitted ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                  <CheckCircle2 className="text-emerald-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Report Submitted
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  We'll review your report within 24-48 hours.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-[#7A1CA9] text-white rounded-xl font-medium hover:bg-[#6A189A] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl mb-5">
                  <AlertTriangle
                    className="text-amber-500 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-xs text-amber-700">
                    Please only submit reports for genuine concerns. False
                    reports may result in account restrictions.
                  </p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Why are you reporting this {reportType}?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {reasons.map((reason) => (
                      <label
                        key={reason.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedReason === reason.id
                            ? "border-[#7A1CA9] bg-purple-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="report-reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={(e) => setSelectedReason(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedReason === reason.id
                              ? "border-[#7A1CA9] bg-[#7A1CA9]"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedReason === reason.id && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-gray-700">
                          {reason.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Additional details{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide any additional information..."
                    className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#7A1CA9]/20 focus:border-[#7A1CA9] outline-none transition-all resize-none h-24 text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedReason || isSubmitting}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 ${
                      !selectedReason || isSubmitting
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-[#7A1CA9] text-white hover:bg-[#6A189A]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// -------------------------
// COMPACT OWNER SECTION
// -------------------------
const OwnerSection = ({ owner, onReport }) => {
  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 py-6">
      <div className="px-4 sm:px-6 lg:pl-36">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            {/* Owner Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={owner.avatar || '/assets/default-avatar.png'}
                  alt={owner.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = "/assets/default-avatar.png";
                  }}
                />
                {owner.online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-gray-900 truncate">
                    {owner.name}
                  </h4>
                  {owner.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                      <BadgeCheck size={12} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="text-amber-400 fill-amber-400" size={12} />
                    <span className="font-medium text-gray-900">N/A</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span className="truncate">{owner.city || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats - Compact */}
            <div className="flex items-center gap-4 md:gap-6 py-3 md:py-0 md:px-6 md:border-l border-gray-100">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">N/A</p>
                <p className="text-xs text-gray-500">Listings</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">N/A</p>
                <p className="text-xs text-gray-500">Rentals</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-600">N/A</p>
                <p className="text-xs text-gray-500">Response</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:pl-6 md:border-l border-gray-100">
              <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#7A1CA9] text-white rounded-xl font-medium hover:bg-[#6A189A] transition-colors flex items-center justify-center gap-2 text-sm">
                <MessageCircle size={16} />
                Message
              </button>
              <button className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                <ExternalLink size={16} />
              </button>
              <button
                onClick={onReport}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                title="Report user"
              >
                <Flag size={16} />
              </button>
            </div>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} />
              <span>Joined {owner.createdAt ? formatJoinDate(owner.createdAt) : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>Response time: N/A</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-1.5">
                <Shield size={12} className="text-emerald-500" />
                <span>Secure payments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>Verified listing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const ProductDetails = () => {
  const { id } = useParams();
  const { wishlist, toggleWishlist, addToCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("product");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await makeAPICall(ENDPOINTS.ITEMS.GET_ONE(id));
        setProduct(data.item);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleReportProduct = () => {
    setReportType("product");
    setShowReportModal(true);
  };

  const handleReportOwner = () => {
    setReportType("owner");
    setShowReportModal(true);
  };

    const handleToggleWishlist = (itemId) => {
    toggleWishlist(itemId);
  };

  const handleAddToCollection = (item) => {
    addToCart(item, 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:ml-16 mt-10">
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : !product ? (
          <div className="text-center py-20">Product not found.</div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="px-4 sm:px-6 lg:pl-32 lg:pr-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm">
                  <a href="/" className="text-gray-400 hover:text-[#7A1CA9] transition">Home</a>
                  <span className="text-gray-300">/</span>
                  <a href="/browse" className="text-gray-400 hover:text-[#7A1CA9] transition">Browse</a>
                  <span className="text-gray-300">/</span>
                  <a href={`/browse?category=${product.category}`} className="text-gray-400 hover:text-[#7A1CA9] transition">{product.category}</a>
                  <span className="text-gray-300">/</span>
                  <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                    {product.title}
                  </span>
                </div>
                <button
                  onClick={handleReportProduct}
                  className="flex items-center gap-2 mr-8 px-3 py-2 bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-all text-sm"
                >
                  <Flag size={14} />
                  <span className="font-medium">Report</span>
                </button>
              </div>
            </div>

            {/* Product Section */}
            <div className="px-4 sm:px-6 lg:pl-32 lg:pr-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                <ImageGallery images={product.images} />
                <ProductInfo product={product} handleAddToCollection={handleAddToCollection} handleToggleWishlist={handleToggleWishlist} wishlist={wishlist.map(i => i._id)} />
              </div>
            </div>

            {/* Compact Owner Section */}
            {product.owner && <OwnerSection owner={product.owner} onReport={handleReportOwner} />}

            <Footer />
          </>
        )}
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportType={reportType}
      />

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-modalSlideIn {
          animation: modalSlideIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
