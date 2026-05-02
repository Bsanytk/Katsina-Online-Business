import React, { useState, useEffect } from "react";
import { Alert } from "../ui";
import Loading from "../Loading";
import { useAuth } from "../../firebase/auth";
import { getUserProfile } from "../../services/users";
import { uploadImage } from "../../services/cloudinary";
import { Upload, X, ImagePlus, Truck, FileText } from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports",
  "Food & Beverages",
  "Health & Beauty",
  "Books",
  "Toys & Games",
  "Automotive",
  "Other",
];

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform?usp=header";

export default function ProductForm({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = null,
  userData = null,
  loading = false,
  error = null,
  uploadingImage = false,
}) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    whatsappNumber: "",
    location: "",
    sellerIDNumber: "",
    deliveryOption: "KOB Express Delivery",
    isDraft: true,
  });

  const [images, setImages] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const isEditMode = initialData !== null;

  // ================================
  // Check verification status
  // ================================
  useEffect(() => {
    async function checkSellerStatus() {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setIsVerified(profile?.isVerified === true);
        } catch (err) {
          console.error("Error fetching user status:", err);
        }
      }
      setCheckingStatus(false);
    }
    checkSellerStatus();
  }, [user]);

  // ================================
  // Populate form from initialData or userData
  // ================================
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        category: initialData.category || "",
        location:
          userData?.fullAddress ||
          userData?.location ||
          initialData.location ||
          "",
        whatsappNumber:
          userData?.whatsappNumber ||
          userData?.phoneNumber ||
          initialData.whatsappNumber ||
          "",
        sellerIDNumber: userData?.kobNumber || initialData.sellerIDNumber || "",
        deliveryOption: initialData.deliveryOption || "KOB Express Delivery",
        isDraft: initialData.isDraft ?? true,
      });

      if (initialData.images && Array.isArray(initialData.images)) {
        setImages(
          initialData.images.map((img, idx) => ({
            id: img.id || `existing-${idx}`,
            preview:
              typeof img === "string"
                ? img
                : img.url || img.secure_url || img.preview,
            isExisting: true,
          }))
        );
      }
    } else if (userData) {
      setFormData((prev) => ({
        ...prev,
        sellerIDNumber: userData.kobNumber || "",
        location: userData.fullAddress || userData.location || "",
        whatsappNumber: userData.whatsappNumber || userData.phoneNumber || "",
      }));
    }
  }, [initialData, userData]);

  // ================================
  // Validation
  // ================================
  function validateForm() {
    const e = {};
    if (!formData.title.trim()) e.title = "Product title is required";
    if (!formData.description.trim() || formData.description.length < 10)
      e.description = "Description must be at least 10 characters";
    const price = Number(formData.price);
    if (!formData.price || isNaN(price) || price <= 0)
      e.price = "Enter a valid price";
    if (!formData.category) e.category = "Please select a category";
    if (!formData.whatsappNumber?.trim())
      e.whatsappNumber = "WhatsApp number is required";
    if (!formData.location?.trim()) e.location = "Location is required";
    if (!formData.sellerIDNumber?.trim())
      e.sellerIDNumber = "KOB ID is required";
    setValidationErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  // ================================
  // Submit
  // ================================
  async function handleSubmit(e) {
    e.preventDefault();
    if (!user?.uid) {
      alert("You must be logged in.");
      return;
    }
    if (!validateForm()) return;

    const finalData = {
      ...formData,
      location:
        userData?.fullAddress || userData?.location || formData.location,
      sellerIDNumber: userData?.kobNumber || formData.sellerIDNumber,
      whatsappNumber:
        userData?.whatsappNumber ||
        userData?.phoneNumber ||
        formData.whatsappNumber,
    };

    try {
      const uploadedUrls = [];

      for (const imgObj of images) {
        if (imgObj.file) {
          const url = await uploadImage(imgObj.file);
          uploadedUrls.push(url);
        } else if (imgObj.isExisting) {
          uploadedUrls.push(imgObj.preview);
        }
      }

      if (uploadedUrls.length === 0 && !formData.isDraft) {
        alert("Please upload at least one image for a live listing.");
        return;
      }

      const submissionData = {
        ...finalData,
        ownerUid: user.uid,
        // ✅ FIX: userData ne — ba profileData ba
        sellerName: userData?.businessName || userData?.displayName || "",
        price: parseFloat(formData.price),
        images: uploadedUrls,
        imageUrl: uploadedUrls[0] || "",
        mainImage: uploadedUrls[0] || "",
        deliveryLink:
          formData.deliveryOption === "KOB Express Delivery"
            ? GOOGLE_FORM_URL
            : null,
        views: initialData?.views || 0,
        salesCount: initialData?.salesCount || 0,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await onSubmit(submissionData);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  }

  // ================================
  // Image handlers
  // ================================
  function handleImageAdd(e) {
    const files = Array.from(e.target.files);
    const availableSlots = 5 - images.length;
    const newImages = files.slice(0, availableSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
      id: `img-${Date.now()}-${Math.random()}`,
    }));
    setImages((prev) => [...prev, ...newImages]);
    // Reset input so same file can be re-added
    e.target.value = "";
  }

  function handleImageRemove(img) {
    if (img.isNew) URL.revokeObjectURL(img.preview);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  // ================================
  // Loading state
  // ================================
  if (checkingStatus) {
    return (
      <div className="py-16">
        <Loading size="sm" message="Checking account status..." />
      </div>
    );
  }

  // ================================
  // Verification lock screen
  // ================================
  if (!isVerified && !isEditMode) {
    return (
      <div
        className="bg-amber-50 border border-amber-200
        rounded-2xl p-8 text-center"
      >
        <div
          className="w-14 h-14 bg-amber-100 rounded-2xl
          flex items-center justify-center mx-auto mb-4"
        >
          <svg
            className="w-7 h-7 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54
                0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464
                0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-amber-900 mb-1">
          Account Not Verified
        </h2>
        <p className="text-sm text-amber-700 mb-6 max-w-sm mx-auto">
          Only verified sellers can post products on KOB Marketplace. Contact
          admin to get verified.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-3
          justify-center"
        >
          <a
            href="https://wa.me/2347089454544"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2
              px-6 py-2.5 bg-green-600 text-white rounded-xl
              text-sm font-semibold hover:bg-green-700
              transition-colors"
          >
            Chat with Admin
          </a>
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSfFfwnt78a-GnE7g8HTpY8MrcFz2K_WjPjLhPCQPAWoUi6muA/viewform"
              )
            }
            className="flex items-center justify-center gap-2
              px-6 py-2.5 bg-[#4B3621] text-white rounded-xl
              text-sm font-semibold hover:bg-[#362818]
              transition-colors"
          >
            Verification Form
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // Main Form
  // ================================
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100
      shadow-sm overflow-hidden"
    >
      {/* Form Header */}
      <div
        className="flex items-center justify-between
        px-6 py-5 border-b border-gray-100"
      >
        <div>
          <h2 className="text-base font-semibold text-[#4B3621]">
            {isEditMode ? "Edit Product" : "New Listing"}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {isEditMode
              ? "Update your product details"
              : "Fill in the details to post your product"}
          </p>
        </div>

        {/* Draft/Live Toggle */}
        <button
          type="button"
          onClick={() => setFormData((p) => ({ ...p, isDraft: !p.isDraft }))}
          className={`
            flex items-center gap-2 px-4 py-2
            rounded-xl text-xs font-semibold
            border-2 transition-all duration-200
            ${
              formData.isDraft
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }
          `}
        >
          {formData.isDraft ? (
            <>
              <FileText className="w-3.5 h-3.5" />
              Draft
            </>
          ) : (
            <>
              <span
                className="w-2 h-2 rounded-full
                bg-emerald-500 animate-pulse"
              />
              Live
            </>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-6 pt-4">
          <Alert type="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* ---- Row 1: Title + KOB ID ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              Product Title
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Quality Roba Shoes"
              className={`
                w-full px-4 py-2.5 rounded-xl border-2
                text-sm outline-none transition-all
                ${
                  validationErrors.title
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus:border-[#4B3621]"
                }
              `}
            />
            {validationErrors.title && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* KOB ID — Read only */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              KOB ID
            </label>
            <div
              className="flex items-center gap-2 px-4 py-2.5
              bg-gray-50 rounded-xl border-2 border-dashed
              border-gray-200"
            >
              <span className="text-sm">🆔</span>
              <span className="text-sm font-semibold text-[#4B3621]">
                {formData.sellerIDNumber || userData?.kobNumber || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* ---- Description ---- */}
        <div>
          <label
            className="block text-xs font-semibold
            uppercase tracking-widest text-gray-500 mb-1.5"
          >
            Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe size, color, quality, condition..."
            className={`
              w-full px-4 py-3 rounded-xl border-2
              text-sm outline-none transition-all resize-none
              ${
                validationErrors.description
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 focus:border-[#4B3621]"
              }
            `}
          />
          <div className="flex items-center justify-between mt-1">
            {validationErrors.description ? (
              <p className="text-xs text-red-500">
                {validationErrors.description}
              </p>
            ) : (
              <span />
            )}
            <p
              className={`text-xs ${
                formData.description.length >= 400
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* ---- Row 2: Price + Location ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              Price (₦)
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className={`
                w-full px-4 py-2.5 rounded-xl border-2
                text-sm outline-none transition-all
                ${
                  validationErrors.price
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus:border-[#4B3621]"
                }
              `}
            />
            {validationErrors.price && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.price}
              </p>
            )}
          </div>

          {/* Location — Read only */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              Business Address 📍
            </label>
            <div
              className="px-4 py-2.5 bg-gray-50 rounded-xl
              border-2 border-dashed border-gray-200"
            >
              <p className="text-sm text-gray-500 truncate">
                {userData?.fullAddress ||
                  formData.location ||
                  "Set in your profile"}
              </p>
            </div>
          </div>
        </div>

        {/* ---- Row 3: WhatsApp + Category ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* WhatsApp — Read only */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              WhatsApp Number
            </label>
            <div
              className="px-4 py-2.5 bg-gray-50 rounded-xl
              border-2 border-dashed border-gray-200"
            >
              <p className="text-sm text-gray-500">
                {userData?.whatsappNumber ||
                  userData?.phoneNumber ||
                  "Set in your profile"}
              </p>
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-500 mb-1.5"
            >
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`
                w-full px-4 py-2.5 rounded-xl border-2
                text-sm outline-none transition-all
                appearance-none cursor-pointer bg-white
                ${
                  validationErrors.category
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 focus:border-[#4B3621]"
                }
              `}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {validationErrors.category && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors.category}
              </p>
            )}
          </div>
        </div>

        {/* ---- Delivery Method ---- */}
        <div>
          <label
            className="block text-xs font-semibold
            uppercase tracking-widest text-gray-500 mb-2"
          >
            Delivery Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: "KOB Express Delivery",
                label: "KOB Express",
                desc: "Fast & tracked",
                icon: "🚚",
                color: "emerald",
              },
              {
                value: "Others",
                label: "Other Method",
                desc: "Own arrangement",
                icon: "📦",
                color: "gray",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`
                  flex items-center gap-3 p-4
                  rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${
                    formData.deliveryOption === opt.value
                      ? opt.color === "emerald"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-[#4B3621] bg-[#4B3621]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <input
                  type="radio"
                  name="deliveryOption"
                  value={opt.value}
                  checked={formData.deliveryOption === opt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-xl">{opt.icon}</span>
                <div>
                  <p
                    className={`text-xs font-semibold
                    ${
                      formData.deliveryOption === opt.value
                        ? opt.color === "emerald"
                          ? "text-emerald-700"
                          : "text-[#4B3621]"
                        : "text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-gray-400">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ---- Images ---- */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-xs font-semibold
              uppercase tracking-widest text-gray-500"
            >
              Product Images
            </label>
            <span className="text-xs text-gray-400">{images.length}/5</span>
          </div>

          {/* Upload Zone */}
          {images.length < 5 && (
            <label
              className="flex flex-col items-center
              justify-center gap-2 p-6 border-2 border-dashed
              border-gray-200 rounded-xl bg-gray-50
              hover:border-[#4B3621] hover:bg-[#4B3621]/5
              cursor-pointer transition-all duration-200"
            >
              <ImagePlus className="w-8 h-8 text-gray-300" />
              <p className="text-xs font-medium text-gray-400">
                Click to upload images
              </p>
              <p className="text-[10px] text-gray-300">
                Max 5 images — JPG, PNG, WEBP
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageAdd}
                className="sr-only"
              />
            </label>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div
              className="grid grid-cols-3 md:grid-cols-5
              gap-3 mt-3"
            >
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square group">
                  <img
                    src={img.preview}
                    alt="Product"
                    className="w-full h-full object-cover
                      rounded-xl border border-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(img)}
                    className="absolute -top-2 -right-2
                      w-6 h-6 bg-red-500 text-white
                      rounded-full flex items-center
                      justify-center shadow-md
                      opacity-0 group-hover:opacity-100
                      transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* First image badge */}
                  {img === images[0] && (
                    <div
                      className="absolute bottom-1 left-1
                      px-1.5 py-0.5 bg-[#4B3621] text-white
                      text-[9px] font-bold rounded-md"
                    >
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Submit Buttons ---- */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className={`
              flex-1 flex items-center justify-center gap-2
              py-3 rounded-xl text-sm font-semibold
              transition-all duration-200
              ${
                loading || uploadingImage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#4B3621] text-white hover:bg-[#362818] shadow-sm"
              }
            `}
          >
            {loading || uploadingImage ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0
                      5.373 0 12h4z"
                  />
                </svg>
                {uploadingImage ? "Uploading images..." : "Processing..."}
              </>
            ) : formData.isDraft ? (
              "Save as Draft"
            ) : (
              "Publish Listing"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-200
              text-gray-500 rounded-xl text-sm font-semibold
              hover:border-gray-300 hover:text-gray-700
              transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
