/**
 * Marketplace.jsx — KOB Marketplace
 *
 * REFACTORED:
 * ✅ useProfile() replaces getUserProfile() Firestore call
 * ✅ Removed: userData state, getProfile useEffect
 * ✅ profile passed directly to ProductForm
 * ✅ payload uses profile fields directly
 * ✅ Zero extra Firestore reads
 */

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products";
import Loading from "../components/Loading";
import { useAuth } from "../firebase/auth";
import { useProfile } from "../contexts/ProfileContext";
import { uploadImage } from "../services/cloudinary";
import ProductList from "../components/marketplace/ProductList";
import ProductFilter from "../components/marketplace/ProductFilter";
import ProductForm from "../components/marketplace/ProductForm";
import ProductCard from "../components/ProductCard";
import { Alert } from "../components/ui";
import BackButton from "../components/BackButton";
import { ShoppingBag, SlidersHorizontal, X, Plus } from "lucide-react";

export default function Marketplace() {
  const { user } = useAuth();

  // ✅ ProfileContext — replaces getUserProfile() useEffect
  // Zero extra Firestore reads
  const { profile } = useProfile();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formError, setFormError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  // ================================
  // Load product for editing
  // ================================
  const loadProductForEdit = useCallback(
    (productId) => {
      const product = products.find((p) => p.id === productId);
      if (product && product.ownerUid === user?.uid) {
        setEditingProduct(product);
        setShowForm(true);
        setSearchParams({});
      }
    },
    [products, user?.uid, setSearchParams]
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && user?.uid && products.length > 0) {
      loadProductForEdit(editId);
    }
  }, [searchParams, user?.uid, products, loadProductForEdit]);

  // ✅ REMOVED: getUserProfile useEffect — ProfileContext handles it

  // ================================
  // Fetch products
  // ================================
  async function fetchProducts() {
    setLoading(true);
    try {
      const items = await getProducts({ pageSize: 50 });
      setProducts(items);
      setFilteredProducts(items);
      setError(null);
    } catch {
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // ================================
  // Submit product
  // ✅ Uses profile directly — no userData state
  // ================================
  async function handleProductSubmit(formData) {
    if (!user) {
      setFormError("You must be logged in.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      // Upload images
      let finalImages = [];
      setUploadingImage(true);

      for (const img of formData.images) {
        if (img.file) {
          const url = await uploadImage(img.file);
          finalImages.push(url);
        } else if (img.isExisting || typeof img === "string") {
          finalImages.push(typeof img === "string" ? img : img.preview);
        }
      }
      setUploadingImage(false);

      const firstImage = finalImages[0] || "";

      // ✅ All seller fields from ProfileContext
      // No getUserProfile call needed
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,

        // ✅ From ProfileContext — safe optional chaining
        sellerName: profile?.businessName || profile?.displayName || "",

        whatsappNumber:
          formData.whatsappNumber ||
          profile?.whatsappNumber ||
          profile?.phoneNumber ||
          "",

        cleanWhatsapp: (
          formData.whatsappNumber ||
          profile?.whatsappNumber ||
          profile?.phoneNumber ||
          ""
        ).replace(/\D/g, ""),

        location:
          formData.location || profile?.fullAddress || profile?.location || "",

        sellerIDNumber: formData.sellerIDNumber || profile?.kobNumber || "",

        deliveryOption: formData.deliveryOption,
        deliveryLink:
          formData.deliveryOption === "KOB Express Delivery"
            ? "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform"
            : null,

        isDraft: formData.isDraft ?? false,
        ownerUid: user.uid,
        imageUrl: firstImage,
        mainImage: firstImage,
        images: finalImages,
        views: editingProduct?.views || 0,
        salesCount: editingProduct?.salesCount || 0,
        updatedAt: new Date(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct({ ...payload, createdAt: new Date() });
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts();
      return true;
    } catch (err) {
      console.error("Submission error:", err);
      setFormError(err.message || "An error occurred while saving.");
      throw err;
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`))
      return;
    try {
      await deleteProduct(product.id);
      fetchProducts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      {/* Back Button */}
      <div className="container pt-4">
        <BackButton />
      </div>

      {/* ================================ */}
      {/* HERO HEADER                      */}
      {/* ================================ */}
      <header
        className="relative overflow-hidden
        bg-[#4B3621] text-white py-14"
      >
        <div
          className="absolute -top-16 -right-16 w-72 h-72
          bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"
        />
        <div
          className="absolute -bottom-16 -left-16 w-72 h-72
          bg-white/5 rounded-full blur-3xl pointer-events-none"
        />

        <div className="container relative z-10">
          <p
            className="text-xs font-semibold uppercase
            tracking-widest text-[#D4AF37] mb-3"
          >
            Katsina Online Business
          </p>
          <h1
            className="text-3xl md:text-5xl font-bold
            text-white mb-3 tracking-tight"
          >
            KOB Marketplace
          </h1>
          <p className="text-sm text-white/60 max-w-md">
            Discover authentic products from verified sellers across Katsina
            State.
          </p>
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-sm text-white/70">
                <span className="font-semibold text-white">
                  {products.length}
                </span>{" "}
                listings
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <span className="text-sm text-white/50">Updated daily</span>
          </div>
        </div>
      </header>

      {/* ================================ */}
      {/* SELLER CTA / FORM                */}
      {/* ================================ */}
      {user && (
        <div className="container pt-8">
          {!showForm ? (
            <div
              className="flex items-center justify-between
              p-5 bg-white rounded-2xl border border-gray-100
              shadow-sm"
            >
              <div>
                <p className="text-sm font-semibold text-[#4B3621]">
                  Have something to sell?
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Reach buyers across Katsina State
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-5 py-2.5
                  bg-[#4B3621] text-white rounded-xl text-sm
                  font-semibold hover:bg-[#362818]
                  transition-colors shadow-sm flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                New Listing
              </button>
            </div>
          ) : (
            // ✅ Pass profile instead of userData
            <ProductForm
              onSubmit={handleProductSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              initialData={editingProduct}
              profile={profile}
              loading={submitting}
              error={formError}
              uploadingImage={uploadingImage}
            />
          )}
        </div>
      )}

      {/* ================================ */}
      {/* MAIN CONTENT                     */}
      {/* ================================ */}
      <div className="container py-8 pb-20">
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Mobile filter toggle */}
        <div
          className="flex items-center justify-between
          mb-6 lg:hidden"
        >
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-[#4B3621]">
              {filteredProducts.length}
            </span>{" "}
            products found
          </p>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2
              border border-gray-200 rounded-xl text-sm
              font-medium text-gray-600 bg-white
              hover:border-[#4B3621] transition-colors"
          >
            {showFilter ? (
              <X className="w-4 h-4" />
            ) : (
              <SlidersHorizontal className="w-4 h-4" />
            )}
            {showFilter ? "Hide" : "Filter"}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`
            w-64 flex-shrink-0 lg:block
            ${showFilter ? "block" : "hidden"}
          `}
          >
            <div className="sticky top-24">
              <ProductFilter
                products={products}
                onFilter={setFilteredProducts}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            <div
              className="hidden lg:flex items-center
              justify-between mb-5"
            >
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-semibold text-[#4B3621]">
                  {filteredProducts.length}
                </span>{" "}
                of {products.length} products
              </p>
            </div>

            {loading ? (
              <div className="py-20">
                <Loading size="md" message="Fetching listings..." />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div
                className="py-20 text-center bg-white
                rounded-2xl border border-gray-100"
              >
                <ShoppingBag
                  className="w-12 h-12 text-gray-200
                  mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-400">
                  No products found
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 md:grid-cols-2
                lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5"
              >
                {filteredProducts.map((product) => (
                  <div key={product.id} className="animate-fade-in">
                    <ProductCardWrapper
                      product={product}
                      user={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ================================
// Product Card Wrapper
// ================================
function ProductCardWrapper({ product, user, onEdit, onDelete }) {
  const canManage = user && product.ownerUid === user.uid;
  return (
    <ProductCard
      product={product}
      onEdit={canManage ? onEdit : undefined}
      onDelete={canManage ? onDelete : undefined}
    />
  );
}
