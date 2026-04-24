import React, { useState, useEffect } from "react";
import { Card } from "./ui"; // Tabbatar wannan path din daidai ne a gidanka
import { getSellerReviews, calculateSellerRating } from "../services/reviews";

export default function SellerRating({ sellerId, compact = false }) {
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sellerId) return;

    async function loadRating() {
      setLoading(true);
      try {
        const reviews = await getSellerReviews(sellerId);
        const avgRating = calculateSellerRating(reviews);
        setRating(avgRating);
        setReviewCount(reviews.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching seller reviews:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadRating();
  }, [sellerId]);

  if (loading)
    return <div className="text-sm text-gray-500 p-2">Loading...</div>;
  if (error)
    return <div className="text-xs text-red-600">Error loading rating</div>;
  if (reviewCount === 0)
    return (
      <div className="text-xs text-gray-400 italic p-2">No reviews yet</div>
    );

  const displayRating = Number(rating).toFixed(1);

  // 1. Yanayin nuni na takaitacce (Compact) - Don Product Cards
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded border border-yellow-200">
        <span className="text-yellow-500 text-xs">⭐</span>
        <span className="font-bold text-yellow-800 text-xs">
          {displayRating}
        </span>
        <span className="text-[10px] text-yellow-700">({reviewCount})</span>
      </div>
    );
  }

  // 2. Yanayin nuni na gaba-daya (Full) - Don Product Details
  return (
    <Card
      variant="elevated"
      className="p-6 rounded-lg bg-gradient-to-br from-yellow-50 to-white border-yellow-100"
    >
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-inner">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-800">
              {displayRating}
            </div>
            <div className="text-[10px] text-yellow-600 font-bold uppercase tracking-tighter">
              Rating
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Seller Trust Score
          </h3>
          <div className="flex gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={
                  i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Based on{" "}
            <span className="font-bold text-gray-800">{reviewCount}</span>{" "}
            verified reviews
          </p>
        </div>
      </div>
    </Card>
  );
}
