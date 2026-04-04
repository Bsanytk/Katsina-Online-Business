import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/products";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../firebase/auth";
import { uploadImage } from "../services/cloudinary";
import ProductList from "../components/marketplace/ProductList";
import ProductFilter from "../components/marketplace/ProductFilter";
import ProductForm from "../components/marketplace/ProductForm";
import { Card, Alert } from "../components/ui";
import BackButton from "../components/BackButton";
import { getUserProfile } from "../services/users"; // Ka tabbatar ka kara wannan

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formError, setFormError] = useState(null);
  const [userData, setUserData] = useState(null); // Sabon state don profile

  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // --- Logic: Load Product for Editing ---
  const loadProductForEdit = useCallback(
    (productId) => {
      const product = products.find((p) => p.id === productId);
      if (product && product.ownerUid === user?.uid) {
        setEditingProduct(product);
        setShowForm(true);
        setSearchParams({}); // Clear URL params after loading
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

  async function fetchProducts() {
    setLoading(true);
    try {
      const items = await getProducts({ pageSize: 50 });
      setProducts(items);
      setFilteredProducts(items);
      setError(null);
    } catch (err) {
      setError("Failed to load products. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  // Kara wannan kusa da inda kake da sauran useEffects
  useEffect(() => {
    async function getProfile() {
      if (user?.uid) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserData(profile);
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    }
    getProfile();
  }, [user, showForm]); // Mun kara 'showForm' domin ya sake dubawa duk lokacin da aka bude form

  // --- 1. COPY & PASTE WANNAN SABON FUNCTION DIN A NAN ---
  async function handleProductSubmit(formData) {
    if (!user) {
      setFormError("You must be logged in to perform this action.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      let finalImages = [];
      setUploadingImage(true);

      // Uploading logic
      for (const img of formData.images) {
        if (img.file) {
          const uploadedUrl = await uploadImage(img.file);
          finalImages.push(uploadedUrl);
        } else if (img.isExisting || typeof img === "string") {
          const existingUrl = typeof img === "string" ? img : img.preview;
          finalImages.push(existingUrl);
        }
      }
      setUploadingImage(false);

      const firstImageUrl = finalImages[0] || "";

      // GINA PAYLOAD DA DATA DAGA PROFILE (userData)
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,

        // Idan babu a form, dauko daga Profile
        whatsappNumber:
          formData.whatsappNumber || userData?.whatsappNumber || "",
        cleanWhatsapp: (
          formData.whatsappNumber ||
          userData?.whatsappNumber ||
          ""
        ).replace(/\D/g, ""),
        location: formData.location || userData?.location || "",
        sellerIDNumber: formData.sellerIDNumber || userData?.kobNumber || "",

        deliveryOption: formData.deliveryOption,
        deliveryLink:
          formData.deliveryOption === "KOB Express Delivery"
            ? "https://docs.google.com/forms/d/e/1FAIpQLSc5Ml7GWZNeNzKhbiqwfULxtFiQUQ0Cgt9eAM2is4JKou3F1Q/viewform"
            : null,

        isDraft: formData.isDraft ?? false,
        ownerUid: user.uid,
        imageUrl: firstImageUrl,
        mainImage: firstImageUrl,
        images: finalImages,

        // Kare Stats (Views/Sales)
        views: editingProduct?.views || 0,
        salesCount: editingProduct?.salesCount || 0,
        updatedAt: new Date(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct({
          ...payload,
          createdAt: new Date(),
        });
      }

      setShowForm(false);
      setEditingProduct(null);
      await fetchProducts(); // Wannan 'await' din yana da muhimmanci

      return true;
    } catch (err) {
      console.error("Submission error:", err);
      setFormError(
        err.message || "An error occurred while saving the product."
      );
      throw err;
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  }

  // --- 2. HANDLE EDIT & DELETE ---
  function handleEdit(product) {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ... (Sauran return statement dinka na kasa duka yana nan daram)

  async function handleDelete(product) {
    if (!window.confirm(`Are you sure you want to delete "${product.title}"?`))
      return;
    try {
      await deleteProduct(product.id);
      fetchProducts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>

      {/* Hero Header */}
      <header className="bg-gradient-to-r from-kob-primary to-kob-gold text-white py-12 shadow-inner">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">
            KOB Marketplace
          </h1>
          <p className="text-lg opacity-90 max-w-xl">
            The heart of business in Katsina. Sell faster, reach further.
          </p>
        </div>
      </header>

      <div className="container pb-20 pt-10">
        {error && (
          <Alert type="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Seller Section */}
        {user && (
          <section className="mb-12">
            {!showForm ? (
              <Card
                variant="outlined"
                hover
                className="p-8 text-center border-dashed border-2 border-kob-primary/40 bg-white/50 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold text-kob-dark mb-2">
                  Have something to sell?
                </h3>
                <p className="text-gray-500 mb-6">
                  List your items today and reach buyers across the state.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-10 py-3 bg-kob-primary text-white rounded-full font-bold shadow-kob-primary/20 shadow-lg hover:scale-105 transition-transform"
                >
                  ➕ Create New Listing
                </button>
              </Card>
            ) : (
              <ProductForm
                onSubmit={handleProductSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                initialData={editingProduct}
                userData={userData} // MUN KARA WANNAN LAYIN A NAN
                loading={submitting}
                error={formError}
                uploadingImage={uploadingImage}
              />
            )}
          </section>
        )}

        {/* Filters & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilter
                products={products}
                onFilter={setFilteredProducts}
              />
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <Loading size="lg" />
                <p className="mt-4 text-gray-400 animate-pulse">
                  Fetching latest listings...
                </p>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                itemsPerPage={12}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
