import React, { useEffect, useState } from "react";
import { useAuth } from "../firebase/auth";
import Loading from "../components/Loading";
import { Card, Button, Alert } from "../components/ui";
import { getProducts, deleteProduct } from "../services/products";
import { calculateAverageRating } from "../services/reviews";
import BackButton from "../components/BackButton";
import OrdersTab from "../components/dashboard/OrdersTab";
import MessagesTab from "../components/dashboard/MessagesTab";
import SellerProfileEdit from "../components/dashboard/SellerProfileEdit";
import MobileSidebar from "../components/MobileSidebar";
import {
  LayoutGrid,
  ShoppingBag,
  MessageCircle,
  Store,
  User,
  BarChart2,
  Eye,
  Star,
  Plus,
  Pencil,
  Trash2,
  Link2,
  ExternalLink,
  Menu,
} from "lucide-react";

// ================================
// Stat Card — reusable
// ================================
function StatCard({ label, value, icon, accent = false }) {
  return (
    <div
      className={`
      rounded-2xl p-6 flex items-center gap-4
      border transition-all duration-200
      ${
        accent
          ? "bg-[#4B3621] border-[#4B3621] text-white"
          : "bg-white border-gray-100 shadow-sm"
      }
    `}
    >
      <div
        className={`
        w-12 h-12 rounded-xl flex items-center
        justify-center flex-shrink-0
        ${accent ? "bg-white/10" : "bg-[#4B3621]/5"}
      `}
      >
        <span className={accent ? "text-white" : "text-[#4B3621]"}>{icon}</span>
      </div>
      <div>
        <p
          className={`text-xs font-semibold uppercase
          tracking-widest mb-0.5
          ${accent ? "text-white/60" : "text-gray-400"}`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-bold
          ${accent ? "text-white" : "text-[#4B3621]"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ================================
// Tab Button — reusable
// ================================
function TabButton({ id, label, icon, activeTab, onClick }) {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`
        flex items-center gap-2 px-4 py-3
        text-xs font-semibold uppercase tracking-wider
        border-b-2 whitespace-nowrap transition-all duration-200
        ${
          isActive
            ? "text-[#4B3621] border-[#4B3621]"
            : "text-gray-400 border-transparent hover:text-[#4B3621]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// ================================
// BUYER DASHBOARD
// ================================
function BuyerDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("overview");

  const TABS = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 overflow-x-auto">
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            {...tab}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Welcome Banner */}
          <div
            className="relative overflow-hidden rounded-2xl
            bg-gradient-to-br from-[#4B3621] to-[#6B4C31]
            p-8 text-white"
          >
            {/* Decorative */}
            <div
              className="absolute -top-8 -right-8 w-40 h-40
              bg-[#D4AF37]/10 rounded-full blur-2xl"
            />
            <div
              className="absolute -bottom-8 -left-8 w-32 h-32
              bg-white/5 rounded-full blur-2xl"
            />

            <div className="relative z-10">
              <p
                className="text-xs font-semibold uppercase
                tracking-widest text-[#D4AF37] mb-2"
              >
                Welcome back
              </p>
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="text-sm text-white/60">
                Manage your orders and activity on KOB Marketplace.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Saved Products"
              value="0"
              icon={<ShoppingBag className="w-5 h-5" />}
            />
            <StatCard
              label="Active Orders"
              value="0"
              icon={<BarChart2 className="w-5 h-5" />}
            />
            <StatCard
              label="My Reviews"
              value="0"
              icon={<Star className="w-5 h-5" />}
            />
          </div>

          {/* CTA */}
          <div
            className="rounded-2xl border-2 border-dashed
            border-gray-200 p-8 text-center bg-white"
          >
            <ShoppingBag
              className="w-10 h-10 text-gray-300
              mx-auto mb-3"
            />
            <p className="font-semibold text-gray-600 mb-1">
              Discover products on KOB
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Browse thousands of listings from verified sellers
            </p>
            <button
              onClick={() => (window.location.href = "/marketplace")}
              className="px-6 py-2.5 bg-[#4B3621] text-white
                rounded-xl text-sm font-semibold
                hover:bg-[#362818] transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      )}

      {activeTab === "orders" && <OrdersTab />}
      {activeTab === "messages" && <MessagesTab />}
    </div>
  );
}

// ================================
// SELLER DASHBOARD
// ================================
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const totalViews = products.reduce((s, p) => s + (Number(p.views) || 0), 0);
  const ratedProducts = products.filter((p) => p.rating > 0);
  const avgRating =
    ratedProducts.length > 0 ? calculateAverageRating(ratedProducts) : "—";

  const TABS = [
    {
      id: "products",
      label: "Inventory",
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="w-3.5 h-3.5" />,
    },
    { id: "shop", label: "My Shop", icon: <Store className="w-3.5 h-3.5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
    {
      id: "sales",
      label: "Sales",
      icon: <BarChart2 className="w-3.5 h-3.5" />,
    },
  ];

  useEffect(() => {
    if (user?.role === "seller") fetchProducts();
  }, [user]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const items = await getProducts({
        pageSize: 10,
        ownerUid: user.uid,
      });
      setProducts(items || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(productId, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeleteLoading(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 4000);
    } catch (err) {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div
        className="flex gap-1 border-b border-gray-100
        overflow-x-auto"
      >
        {TABS.map((tab) => (
          <TabButton
            key={tab.id}
            {...tab}
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* ---- PRODUCTS TAB ---- */}
      {activeTab === "products" && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Active Listings"
              value={products.length}
              icon={<LayoutGrid className="w-5 h-5" />}
              accent
            />
            <StatCard
              label="Total Views"
              value={totalViews.toLocaleString()}
              icon={<Eye className="w-5 h-5" />}
            />
            <StatCard
              label="Avg Rating"
              value={avgRating}
              icon={<Star className="w-5 h-5" />}
            />
          </div>

          {/* Delete success alert */}
          {deleteSuccess && (
            <Alert
              type="success"
              autoDismiss={4000}
              onDismiss={() => setDeleteSuccess(false)}
            >
              Product removed from marketplace.
            </Alert>
          )}

          {/* Inventory Table */}
          <div
            className="bg-white rounded-2xl border
            border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Table Header */}
            <div
              className="flex items-center justify-between
              px-6 py-5 border-b border-gray-100"
            >
              <div>
                <h2
                  className="text-base font-semibold
                  text-[#4B3621]"
                >
                  Product Inventory
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {products.length} listing{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => (window.location.href = "/marketplace")}
                className="flex items-center gap-2 px-4 py-2
                  bg-[#4B3621] text-white rounded-xl
                  text-xs font-semibold hover:bg-[#362818]
                  transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Listing
              </button>
            </div>

            {/* Table Body */}
            {loadingProducts ? (
              <div className="py-16">
                <Loading size="sm" message="Loading inventory..." />
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag
                  className="w-10 h-10 text-gray-200
                  mx-auto mb-3"
                />
                <p className="text-sm font-medium text-gray-400">
                  No products yet
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Add your first listing to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className="text-[10px] font-semibold
                      uppercase tracking-widest text-gray-400
                      bg-gray-50/50"
                    >
                      <th className="text-left py-3 px-6">Product</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-right py-3 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50/50
                          transition-colors group"
                      >
                        {/* Product */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.imageUrl ||
                                p.images?.[0] ||
                                "/placeholder.png"
                              }
                              className="w-11 h-11 rounded-xl
                                object-cover border border-gray-100
                                shadow-sm flex-shrink-0"
                              alt=""
                            />
                            <div className="min-w-0">
                              <p
                                className="text-sm font-medium
                                text-[#4B3621] truncate max-w-[180px]"
                              >
                                {p.title}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {p.category || "Uncategorized"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <span
                            className="text-sm font-semibold
                            text-[#D4AF37]"
                          >
                            ₦{Number(p.price).toLocaleString()}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`
                            inline-flex items-center px-2.5 py-1
                            rounded-full text-[10px] font-semibold
                            uppercase tracking-wider
                            ${
                              p.isDraft
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }
                          `}
                          >
                            {p.isDraft ? "Draft" : "Live"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6">
                          <div
                            className="flex items-center
                            justify-end gap-2"
                          >
                            <button
                              onClick={() =>
                                (window.location.href = `/product/${p.id}`)
                              }
                              className="p-2 rounded-lg text-gray-400
                                hover:text-[#4B3621] hover:bg-gray-100
                                transition-all"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                (window.location.href = `/marketplace?edit=${p.id}`)
                              }
                              className="p-2 rounded-lg text-gray-400
                                hover:text-[#D4AF37] hover:bg-amber-50
                                transition-all"
                              title="Edit product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.title)}
                              disabled={deleteLoading === p.id}
                              className="p-2 rounded-lg text-gray-400
                                hover:text-red-500 hover:bg-red-50
                                transition-all disabled:opacity-50"
                              title="Delete product"
                            >
                              {deleteLoading === p.id ? (
                                <span className="text-xs">...</span>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "messages" && <MessagesTab />}
      {activeTab === "sales" && <OrdersTab />}
      {activeTab === "profile" && <SellerProfileEdit />}

      {/* ---- SHOP TAB ---- */}
      {activeTab === "shop" && (
        <div className="animate-fade-in">
          <div
            className="bg-white rounded-2xl border
            border-gray-100 shadow-sm p-8 text-center"
          >
            {/* Shop Icon */}
            <div
              className="w-16 h-16 bg-[#4B3621]/5
              rounded-2xl flex items-center justify-center
              mx-auto mb-4"
            >
              <Store className="w-8 h-8 text-[#4B3621]" />
            </div>

            <h2
              className="text-lg font-semibold
              text-[#4B3621] mb-1"
            >
              Your Public Storefront
            </h2>
            <p
              className="text-sm text-gray-400 max-w-sm
              mx-auto mb-8 leading-relaxed"
            >
              Share your shop link with customers to showcase all your active
              listings in one place.
            </p>

            {/* Shop URL Preview */}
            <div
              className="flex items-center gap-3 p-3
              bg-gray-50 rounded-xl border border-gray-100
              mb-6 max-w-sm mx-auto text-left"
            >
              <Link2
                className="w-4 h-4 text-gray-400
                flex-shrink-0"
              />
              <p className="text-xs text-gray-500 truncate flex-1">
                {window.location.origin}/shop/{user.uid}
              </p>
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3
              justify-center"
            >
              <button
                onClick={() => window.open(`/shop/${user.uid}`, "_blank")}
                className="flex items-center justify-center
                  gap-2 px-6 py-3 bg-[#4B3621] text-white
                  rounded-xl text-sm font-semibold
                  hover:bg-[#362818] transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View My Shop
              </button>

              <button
                onClick={() => {
                  const url = `${window.location.origin}/shop/${user.uid}`;
                  navigator.clipboard.writeText(url);
                  alert("Shop link copied!");
                }}
                className="flex items-center justify-center
                  gap-2 px-6 py-3 border-2 border-[#4B3621]
                  text-[#4B3621] rounded-xl text-sm font-semibold
                  hover:bg-[#4B3621] hover:text-white
                  transition-all"
              >
                <Link2 className="w-4 h-4" />
                Copy Shop Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================================
// MAIN DASHBOARD
// ================================
export default function Dashboard() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <Loading fullScreen message="Authenticating..." />;
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header
          className="lg:hidden sticky top-0 z-20
          flex items-center justify-between
          px-4 py-3 bg-white border-b border-gray-100"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl border border-gray-200
              text-[#4B3621] hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#4B3621]">
              KOB Dashboard
            </span>
          </div>

          <div className="w-9" />
        </header>

        {/* Content */}
        <div
          className="flex-1 p-5 lg:p-8 max-w-6xl
          mx-auto w-full"
        >
          <div className="mb-6">
            <BackButton />
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-[#4B3621]">
              {user.role === "seller" ? "Seller Dashboard" : "My Dashboard"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {user.displayName || user.email?.split("@")[0]} ·{" "}
              {user.role === "seller" ? "🏪 Seller" : "🛒 Buyer"} ·{" "}
              {user.kobNumber || ""}
            </p>
          </div>

          <div className="animate-fade-in">
            {user.role === "seller" ? (
              <SellerDashboard user={user} />
            ) : (
              <BuyerDashboard user={user} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
