import React, { useState, useEffect, useCallback } from "react";
import { Card } from "../ui";
// Import wannan function din da muka samar a reviews.js
import { getSellerReviews } from "../services/reviews";

export default function SellerRating({ sellerUid, showDetails = false }) {
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);

  const calculateStats = useCallback(async () => {
    try {
      setLoading(true);
      // Kira function daya kacal maimakon looping!
      const allReviews = await getSellerReviews(sellerUid);

      if (allReviews.length > 0) {
        const total = allReviews.reduce((sum, r) => sum + Number(r.rating), 0);
        const avgRating = (total / allReviews.length).toFixed(1);

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        allReviews.forEach((r) => {
          if (distribution[r.rating] !== undefined) {
            distribution[r.rating]++;
          }
        });

        setStats({
          averageRating: avgRating,
          totalReviews: allReviews.length,
          ratingDistribution: distribution,
        });
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [sellerUid]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  // renderStars da sauran JSX dinka su tsaya yadda suke...
  function renderStars(count) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={
              i <= Math.round(count) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Loading seller rating...
      </div>
    );
  }

  if (stats.totalReviews === 0) {
    return (
      <Card variant="outlined" className="p-4">
        <div className="text-center">
          <p className="text-gray-600">No ratings yet</p>
          <p className="text-xs text-gray-500">
            Be the first to review this seller!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-4xl font-bold text-kob-primary">
              {stats.averageRating}
            </p>
            <div className="mt-1">{renderStars(stats.averageRating)}</div>
          </div>
          <div>
            <p className="font-semibold text-gray-800">{stats.totalReviews}</p>
            <p className="text-sm text-gray-600">reviews</p>
          </div>
        </div>

        {/* Detailed Stats */}
        {showDetails && (
          <div className="space-y-2 border-t pt-4">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex gap-0.5 w-12">{renderStars(rating)}</div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{
                      width:
                        stats.totalReviews > 0
                          ? `${
                              (stats.ratingDistribution[rating] /
                                stats.totalReviews) *
                              100
                            }%`
                          : "0%",
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 w-8">
                  {stats.ratingDistribution[rating]}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badge */}
        {stats.averageRating >= 4 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm font-semibold text-green-700">
              ✓ Trusted Seller
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
