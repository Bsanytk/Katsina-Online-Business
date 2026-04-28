import React, { useState, useEffect } from "react";
import { doc, updateDoc, increment } from "firebase/firestore"; // Add this
import { db } from "../firebase/firebase"; // Ensure this points to your firebase config file
import { useParams } from "react-router-dom";
import { Card, Button, Alert } from "../components/ui";
import BackButton from "../components/BackButton";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import WhatsAppContactButton from "../components/marketplace/WhatsAppContactButton";
import { getProductById } from "../services/products";
import { calculateAverageRating } from "../services/reviews";
import { getProductReviews } from "../services/reviews";
import { useAuth } from "../firebase/auth";
import SellerRating from "../components/SellerRating";

export default function ProductDetail() {
  const { productId } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [reviewloading, setReviewloading] = useState(false);

  // 1. Function din Review (Yana wajen useEffect - DAI-DAI)
  const handleAddReview = async (reviewData) => {
    try {
      const { addReview } = await import("../services/reviews");
      await addReview(reviewData);

      const updatedReviews = await getProductReviews(productId);
      setReviews(updatedReviews);
      setAverageRating(calculateAverageRating(updatedReviews));
    } catch (err) {
      console.error("Review error:", err);
      throw new Error(err.message);
    } finally {
      setReviewloading(false);
    }
  };

  // 2. useEffect don dauko bayanan kaya
  useEffect(() => {
    const loadData = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        // Dauko Product
        const productData = await getProductById(productId);
        if (!productData) {
          setError("Product not found");
          return;
        }
        setProduct(productData);

        // Record View (idan ba mai shago ba ne)
        if (user && user.uid !== productData.ownerUid) {
          try {
            const productRef = doc(db, "products", productId);
            await updateDoc(productRef, { views: increment(1) });
          } catch (e) {
            console.error("View count error:", e);
          }
        }

        // Dauko Reviews
        const reviewsData = await getProductReviews(productId);
        setReviews(reviewsData);
        setAverageRating(
          reviewsData.length > 0 ? calculateAverageRating(reviewsData) : 0
        );
      } catch (err) {
        console.error("General error:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, user?.uid]);

  // ANAN KUMA RETURN JSX DINKA ZAI FARA...
  if (loading)
    return (
      <div className="container py-12 text-center text-gray-600">
        Loading product details...
      </div>
    );

  if (error || !product) {
    return (
      <main className="min-h-screen bg-kob-light">
        <div className="container py-4">
          <BackButton />
        </div>
        <div className="container py-8">
          <Alert
            type="error"
            title="Error"
            message={error || "Product not found"}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-kob-light">
      <div className="container py-4">
        <BackButton />
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-8">
            <Card
              variant="elevated"
              className="p-6 rounded-lg relative overflow-hidden"
            >
              {/* KOB ID Badge */}
              {(product?.isVerified || product?.sellerVerified) && (
                <div className="absolute top-4 right-4 bg-kob-dark text-white px-4 py-1 rounded-full text-xs font-bold shadow-md z-10">
                  🆔 {product.sellerIDNumber}✔ Verified
                </div>
              )}

              {/* Improved Image Display */}
              <div className="mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={
                    product.imageUrl ||
                    product.images?.[0]?.url ||
                    (typeof product.images?.[0] === "string"
                      ? product.images[0]
                      : null) ||
                    "https://via.placeholder.com/800x600?text=No+Image+Available"
                  }
                  alt={product.title}
                  className="w-full h-96 object-contain md:object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x600?text=Image+Error";
                  }}
                />
              </div>

              <h1 className="text-4xl font-bold text-kob-dark mb-2">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-kob-primary">
                  ₦{product.price?.toLocaleString()}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.ceil(averageRating)
                          ? "text-yellow-400 text-xl"
                          : "text-gray-300 text-xl"
                      }
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              {/* Delivery CTA Section */}
              {product.deliveryOption === "KOB Express Delivery" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-green-800 font-bold flex items-center gap-2">
                      🚚 KOB Express Delivery Available
                    </p>
                    <p className="text-xs text-green-600">
                      Get your items delivered safely through KOB Express.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 border-none shadow-lg text-white"
                    onClick={() => window.open(product.deliveryLink, "_blank")}
                  >
                    Fill Delivery Form
                  </Button>
                </div>
              )}

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <div className="flex gap-2">
                {product.category && (
                  <span className="px-3 py-1 bg-kob-light text-kob-primary rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                )}
                {product.location && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                    📍 {product.location}
                  </span>
                )}
              </div>
            </Card>

            {/* Tabs for Info and Reviews */}
            <div className="flex gap-4 border-b-2 border-gray-200">
              {["details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-semibold capitalize ${
                    activeTab === tab
                      ? "text-kob-primary border-b-4 border-kob-primary"
                      : "text-gray-500"
                  }`}
                >
                  {tab === "reviews"
                    ? `⭐ Reviews (${reviews.length})`
                    : "📋 Product Details"}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <Card variant="outlined" className="p-6 rounded-lg">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2 sm:border-none">
                    <dt className="text-gray-500">KOB ID</dt>
                    <dd className="font-bold text-kob-dark">
                      {product.sellerIDNumber || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b pb-2 sm:border-none">
                    <dt className="text-gray-500">Location</dt>
                    <dd className="font-bold text-kob-dark">
                      {product.location || "Katsina"}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b pb-2 sm:border-none">
                    <dt className="text-gray-500">Delivery</dt>
                    <dd className="font-bold text-green-600">
                      {product.deliveryOption}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b pb-2 sm:border-none">
                    <dt className="text-gray-500">Posted Date</dt>
                    <dd className="font-bold text-kob-dark">
                      {product.createdAt
                        ? new Date(
                            product.createdAt?.toDate?.() || product.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </dd>
                  </div>
                </dl>
              </Card>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                {/* Review components remain the same */}
                <ReviewsList
                  reviews={reviews}
                  averageRating={averageRating}
                  productTitle={product.title}
                />
                {user && user.uid !== product.ownerUid ? (
                  <ReviewForm
                    productId={productId}
                    sellerId={product.ownerUid}
                    onSubmit={handleAddReview}
                    loading={reviewloading}
                  />
                ) : (
                  <div className="p-4 bg-kob-light text-kob-primary-dark rounded-lg text-center text-sm italic">
                    You cannot add review to your product!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (Seller Info) */}
          <div className="space-y-6">
            <Card variant="elevated" className="p-6 rounded-lg">
              <h3 className="font-bold text-lg text-kob-dark mb-4">
                👤 Seller Info
              </h3>
              <p className="font-bold text-kob-primary text-xl mb-1">
                {product.sellerName || "KOB Merchant"}
              </p>

              {(product?.isVerified || product?.sellerVerified) && (
                <p className="text-green-600 text-sm font-semibold flex items-center gap-1">
                  ✔ Verified Seller
                </p>
              )}

              <SellerRating sellerId={product.ownerUid} compact={false} />

              <div className="mt-6 space-y-3">
                {/* Dynamic WhatsApp Link using the product's WhatsApp number */}

                <WhatsAppContactButton
                  product={product}
                  sellerUid={product.ownerUid}
                  user={user}
                />

                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => alert("Order feature linked to dashboard")}
                >
                  🛒 Buy Now
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
