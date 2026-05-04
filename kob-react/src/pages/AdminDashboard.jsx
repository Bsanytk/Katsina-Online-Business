import React, { useState, useEffect } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import CRMTable from "../components/admin/CRMTable";
import InventoryPanel from "../components/admin/InventoryPanel";
import BroadcastCenter from "../components/admin/BroadcastCenter";
import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import {
  getAllSellers,
  getAllBuyers,
  getAllOrders,
  getDashboardStats,
  updateOrderStatus,
} from "../services/admin";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";

// ================================
// Stat Card
// ================================
function StatCard({ label, value, icon, accent, alert }) {
  return (
    <div
      className={`
      rounded-2xl p-5 flex items-center gap-4
      border transition-all
      ${
        accent
          ? "bg-[#4B3621] border-[#4B3621]"
          : alert
          ? "bg-red-50 border-red-100"
          : "bg-white border-gray-100 shadow-sm"
      }
    `}
    >
      <div
        className={`
        w-11 h-11 rounded-xl flex items-center
        justify-center flex-shrink-0
        ${accent ? "bg-white/10" : alert ? "bg-red-100" : "bg-[#4B3621]/5"}
      `}
      >
        <span
          className={
            accent ? "text-white" : alert ? "text-red-600" : "text-[#4B3621]"
          }
        >
          {icon}
        </span>
      </div>
      <div>
        <p
          className={`text-xs font-semibold uppercase
          tracking-widest mb-0.5
          ${
            accent ? "text-white/60" : alert ? "text-red-400" : "text-gray-400"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-bold
          ${accent ? "text-white" : alert ? "text-red-600" : "text-[#4B3621]"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// ================================
// Overview Panel
// ================================
function OverviewPanel({ stats, sellers, orders, onRefreshOrders }) {
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const ORDER_STATUSES = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-amber-50 text-amber-700",
      icon: <Clock className="w-3 h-3" />,
    },
    processing: {
      label: "Processing",
      color: "bg-blue-50 text-blue-700",
      icon: <TrendingUp className="w-3 h-3" />,
    },
    shipped: {
      label: "Shipped",
      color: "bg-purple-50 text-purple-700",
      icon: <Truck className="w-3 h-3" />,
    },
    delivered: {
      label: "Delivered",
      color: "bg-emerald-50 text-emerald-700",
      icon: <CheckCircle className="w-3 h-3" />,
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-red-50 text-red-700",
      icon: <XCircle className="w-3 h-3" />,
    },
  };

  async function handleOrderStatus(orderId, status) {
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, status);
      onRefreshOrders();
    } finally {
      setUpdatingOrder(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3
        xl:grid-cols-6 gap-4"
      >
        <StatCard
          label="Sellers"
          value={stats?.totalSellers ?? "—"}
          icon={<Users className="w-5 h-5" />}
          accent
        />
        <StatCard
          label="Buyers"
          value={stats?.totalBuyers ?? "—"}
          icon={<Users className="w-5 h-5" />}
        />
        <StatCard
          label="Products"
          value={stats?.totalProducts ?? "—"}
          icon={<Package className="w-5 h-5" />}
        />
        <StatCard
          label="Orders"
          value={stats?.totalOrders ?? "—"}
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <StatCard
          label="Low Stock"
          value={stats?.lowStockCount ?? 0}
          icon={<AlertTriangle className="w-5 h-5" />}
          alert={stats?.lowStockCount > 0}
        />
        <StatCard
          label="Expiring"
          value={stats?.expiringSoon ?? 0}
          icon={<Clock className="w-5 h-5" />}
          alert={stats?.expiringSoon > 0}
        />
      </div>

      {/* Pending Sellers */}
      <div
        className="bg-white rounded-2xl border
        border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#2C1F0E]">
            Pending Verifications
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Sellers awaiting approval
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {sellers
            .filter((s) => !s.isVerified)
            .slice(0, 5)
            .map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between
                  px-5 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full
                    bg-[#4B3621] flex items-center
                    justify-center"
                  >
                    <span className="text-white text-xs font-bold">
                      {(s.displayName || s.email)?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">
                      {s.displayName || "No Name"}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {s.kobNumber || s.email}
                    </p>
                  </div>
                </div>
                <span
                  className="inline-flex px-2.5 py-1
                  bg-amber-50 text-amber-700 rounded-full
                  text-[10px] font-semibold"
                >
                  Pending ⏳
                </span>
              </div>
            ))}
          {sellers.filter((s) => !s.isVerified).length === 0 && (
            <div className="px-5 py-8 text-center">
              <CheckCircle
                className="w-8 h-8 text-emerald-300
                mx-auto mb-2"
              />
              <p className="text-xs text-gray-400">All sellers verified</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div
        className="bg-white rounded-2xl border
        border-gray-100 shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#2C1F0E]">
            Recent Orders
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="text-[10px] font-semibold
                uppercase tracking-widest text-gray-400
                bg-gray-50/50"
              >
                <th className="text-left py-3 px-5">Order ID</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-5">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 8).length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-xs text-gray-400"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                orders.slice(0, 8).map((o) => {
                  const config = statusConfig[o.status] || statusConfig.pending;
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <span
                          className="text-xs font-mono
                          text-gray-500"
                        >
                          #{o.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="text-xs font-semibold
                          text-[#D4AF37]"
                        >
                          ₦{Number(o.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center
                          gap-1 px-2.5 py-1 rounded-full
                          text-[10px] font-semibold ${config.color}`}
                        >
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <select
                          value={o.status || "pending"}
                          onChange={(e) =>
                            handleOrderStatus(o.id, e.target.value)
                          }
                          disabled={updatingOrder === o.id}
                          className="text-xs border border-gray-200
                            rounded-lg px-2 py-1 outline-none
                            cursor-pointer focus:border-[#4B3621]
                            disabled:opacity-50"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================================
// MAIN ADMIN DASHBOARD
// ================================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [s, b, o, st] = await Promise.all([
        getAllSellers(),
        getAllBuyers(),
        getAllOrders(),
        getDashboardStats(),
      ]);
      setSellers(s);
      setBuyers(b);
      setOrders(o);
      setStats(st);
    } catch (err) {
      console.error("Admin load error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshOrders() {
    const o = await getAllOrders();
    setOrders(o);
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab} stats={stats}>
      {loading ? (
        <div
          className="flex items-center justify-center
          py-20 text-xs text-gray-400"
        >
          <svg
            className="animate-spin w-5 h-5 mr-2 text-[#4B3621]"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading dashboard...
        </div>
      ) : (
        <>
          {activeTab === "overview" && (
            <OverviewPanel
              stats={stats}
              sellers={sellers}
              orders={orders}
              onRefreshOrders={refreshOrders}
            />
          )}
          {activeTab === "crm" && (
            <CRMTable sellers={sellers} buyers={buyers} onRefresh={loadAll} />
          )}
          {activeTab === "inventory" && <InventoryPanel />}
          {activeTab === "analytics" && <AnalyticsPanel />}
          {activeTab === "broadcast" && <BroadcastCenter />}
        </>
      )}
    </AdminLayout>
  );
}
