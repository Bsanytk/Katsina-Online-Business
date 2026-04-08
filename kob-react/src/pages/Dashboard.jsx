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

// Buyer Dashboard View
function BuyerDashboard({ user }) {
  const [savedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b-2 border-gray-200 overflow-x-auto">
        {[
          { id: "overview", label: "📊 Overview" },
          { id: "orders", label: "📦 Orders" },
          { id: "messages", label: "💬 Messages" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "text-[#4B3621] border-b-4 border-[#4B3621]"
                : "text-gray-600 hover:text-[#4B3621]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          <Card variant="elevated" className="bg-gradient-to-br from-[#4B3621] to-[#D4AF37] text-white p-8 rounded-2xl">
            <h1 className="text-3xl font-bold italic">Welcome, {user.email.split("@")[0]}!</h1>
            <p className="opacity-95 font-light">Manage your activities on Katsina Online Business Marketplace.</p>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-7 text-center rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Saved Products</p>
              <p className="text-4xl font-bold text-[#4B3621]">{savedProducts.length}</p>
            </Card>
            <Card className="p-7 text-center rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Active Orders</p>
              <p className="text-4xl font-bold text-[#4B3621]">0</p>
            </Card>
            <Card className="p-7 text-center rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">My Reviews</p>
              <p className="text-4xl font-bold text-[#4B3621]">0</p>
            </Card>
          </div>
        </div>
      )}
      {activeTab === "orders" && <OrdersTab />}
      {activeTab === "messages" && <MessagesTab />}
    </div>
  );
}

// Seller Dashboard View
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const totalViews = products.reduce((sum, p) => sum + (Number(p.views) || 0), 0);
  const ratedProducts = products.filter((p) => p.rating > 0);
  const avgRating = ratedProducts.length > 0 ? calculateAverageRating(ratedProducts) : "—";

  useEffect(() => {
    if (user?.role === "seller") fetchProducts();
  }, [user]);

  async function fetchProducts() {
    setLoadingProducts(true);
    try {
      const items = await getProducts({ pageSize: 10, ownerUid: user.uid });
      setProducts(items || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function handleDelete(productId, title) {
    if (!window.confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    setDeleteLoading(productId);
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 4000);
    } catch (err) {
      alert("Failed to delete product.");
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2 border-b-2 border-gray-100 overflow-x-auto">
        {["products", "sales", "messages", "profile"].map((id) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-4 font-black uppercase text-[10px] tracking-[0.2em] transition-all ${
              activeTab === id ? "text-[#4B3621] border-b-2 border-[#4B3621]" : "text-gray-400 hover:text-[#4B3621]"
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      {activeTab === "products" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-7 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Active Listings</p>
              <p className="text-4xl font-bold text-[#4B3621]">{products.length}</p>
            </Card>
            <Card className="p-7 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">views</p>
              <p className="text-4xl font-bold text-[#4B3621]">{totalViews}</p>
            </Card>
            <Card className="p-7 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Avg Rating</p>
              <p className="text-4xl font-bold text-[#4B3621]">{avgRating}</p>
            </Card>
          </div>

          {showDeleteSuccess && (
            <Alert type="success" onDismiss={() => setShowDeleteSuccess(false)}>
              Product successfully removed from marketplace.
            </Alert>
          )}

          <Card className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-[#4B3621] italic tracking-tight">Inventory</h2>
              <Button 
                variant="primary" 
                className="bg-[#4B3621] hover:bg-[#362818]"
                onClick={() => window.location.href = "/marketplace"}
              >
                + New Product
              </Button>
            </div>
            {loadingProducts ? <Loading /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-[#4B3621]">
                    <tr className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                      <th className="py-4 px-2">Preview</th>
                      <th>Product Title</th>
                      <th>Price</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <img src={p.imageUrl || p.images?.[0] || "/placeholder.png"} className="w-12 h-12 rounded-xl object-cover border shadow-sm" alt=""/>
                        </td>
                        <td className="font-bold text-[#4B3621]">{p.title}</td>
                        <td className="font-black text-[#D4AF37]">₦{Number(p.price).toLocaleString()}</td>
                        <td className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => window.location.href=`/product/${p.id}`}>Details</Button>
                            <Button size="sm" variant="danger" onClick={() => handleDelete(p.id, p.title)}>
                              {deleteLoading === p.id ? "..." : "Delete"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
      {activeTab === "sales" && <OrdersTab />}
      {activeTab === "messages" && <MessagesTab />}
      {activeTab === "profile" && <SellerProfileEdit />}
    </div>
  );
}

// MAIN DASHBOARD EXPORT
export default function Dashboard() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <Loading fullScreen message="Authenticating..." />;
  if (!user) return (window.location.href = "/login");

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <MobileSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#4B3621] text-2xl">☰</button>
          <div className="flex items-center gap-2">
            <span className="font-black italic text-xl text-[#4B3621]">KOBMarketplace</span>
          </div>
          <div className="w-8"></div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="mb-8"><BackButton /></div>
          <div className="animate-fade-in">
            {user.role === "seller" ? <SellerDashboard user={user} /> : <BuyerDashboard user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}