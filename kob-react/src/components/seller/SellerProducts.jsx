/**
 * SellerProducts.jsx — KOB Product Grid
 * Mobile-first, premium, low-bandwidth optimized
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ================================
// Icons
// ================================
const SearchIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg
    className="w-14 h-14"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

// ================================
// Product Skeleton
// ================================
function ProductSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl border
      border-gray-100 overflow-hidden animate-pulse"
    >
      <div className="h-40 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

// ================================
// Single Product Card
// ================================
function ProductCard({ product, onWhatsApp }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const image =
    !imgErr && (product.imageUrl || product.images?.[0])
      ? product.imageUrl || product.images?.[0]
      : null;

  const price = product.price
    ? `₦${Number(product.price).toLocaleString()}`
    : "Price on request";

  return (
    <div
      className="bg-white rounded-2xl border
      border-gray-100 shadow-sm overflow-hidden
      hover:shadow-md transition-shadow duration-200 group"
    >
      {/* Image */}
      <div
        className="relative h-40 bg-gray-100 overflow-hidden
          cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover
              group-hover:scale-105 transition-transform
              duration-300"
            onError={() => setImgErr(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center
            justify-center text-gray-300"
          >
            <EmptyIcon />
          </div>
        )}

        {/* Draft badge safety — shouldn't render, but guard */}
        {product.isDraft && (
          <div
            className="absolute top-2 left-2 px-2 py-1
            bg-amber-500 text-white text-[9px] font-bold
            rounded-lg"
          >
            Draft
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p
          className="text-xs font-semibold text-[#2C1F0E]
          leading-snug line-clamp-2 mb-1 min-h-[32px]"
        >
          {product.title || "Untitled Product"}
        </p>

        {product.category && (
          <p
            className="text-[9px] text-gray-400 mb-1.5
            uppercase tracking-wider"
          >
            {product.category}
          </p>
        )}

        <p className="text-sm font-bold text-[#D4AF37] mb-3">{price}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex-1 py-2 bg-[#4B3621] text-white
              rounded-xl text-[10px] font-bold
              hover:bg-[#362818] transition-colors
              active:scale-[0.97]"
          >
            View Details
          </button>

          {onWhatsApp && (
            <button
              onClick={() => onWhatsApp(product)}
              className="w-9 h-9 bg-[#25D366] text-white
                rounded-xl flex items-center justify-center
                hover:bg-[#1ebc5c] transition-colors
                flex-shrink-0 active:scale-[0.97]"
              title="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94
                1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198
                0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077
                4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================================
// SellerProducts Grid
// ================================
export default function SellerProducts({
  products = [],
  loading = false,
  onWhatsApp,
  shopName = "this seller",
}) {
  const [search, setSearch] = useState("");

  // Client-side filter — no extra reads
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          !search ||
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  return (
    <div className="px-4 md:px-6 py-5">
      {/* Section header + search */}
      <div
        className="flex flex-col md:flex-row
        md:items-center justify-between gap-3 mb-5"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 bg-[#4B3621]/5 rounded-xl
            flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 text-[#4B3621]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0
                01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2
                2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4
                16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2
                2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2
                2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2C1F0E]">Products</h2>
            <p className="text-[10px] text-gray-400">
              {loading
                ? "Loading..."
                : `${filtered.length} item${filtered.length !== 1 ? "s" : ""}${
                    search ? ` matching "${search}"` : ""
                  }`}
            </p>
          </div>
        </div>

        {/* Search */}
        {!loading && products.length > 3 && (
          <div className="relative max-w-xs w-full">
            <span
              className="absolute left-3 top-1/2
              -translate-y-1/2 text-gray-400 pointer-events-none"
            >
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white
                border border-gray-200 rounded-xl text-sm
                outline-none placeholder:text-gray-300
                focus:border-[#4B3621] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2
                  -translate-y-1/2 text-gray-400
                  hover:text-gray-600"
              >
                <XIcon />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Skeletons */}
      {loading && (
        <div
          className="grid grid-cols-2 md:grid-cols-3
          lg:grid-cols-4 gap-3 md:gap-4"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div
          className="py-20 text-center bg-white
          rounded-2xl border border-gray-100"
        >
          <div className="text-gray-200 mx-auto mb-3 w-fit">
            <EmptyIcon />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-1">
            {search
              ? `No products match "${search}"`
              : `${shopName} has no products yet`}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-[#4B3621]
                hover:underline mt-1"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && filtered.length > 0 && (
        <div
          className="grid grid-cols-2 md:grid-cols-3
          lg:grid-cols-4 gap-3 md:gap-4"
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onWhatsApp={onWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  );
}
