import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data — replace with real Firestore data
const USER_GROWTH = [
  { month: "Jan", sellers: 2, buyers: 8 },
  { month: "Feb", sellers: 5, buyers: 18 },
  { month: "Mar", sellers: 8, buyers: 30 },
  { month: "Apr", sellers: 14, buyers: 52 },
  { month: "May", sellers: 20, buyers: 80 },
  { month: "Jun", sellers: 28, buyers: 110 },
];

const SALES_DATA = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 82000 },
  { month: "Mar", revenue: 120000 },
  { month: "Apr", revenue: 95000 },
  { month: "May", revenue: 160000 },
  { month: "Jun", revenue: 210000 },
];

const CATEGORY_DATA = [
  { name: "Fashion", value: 35 },
  { name: "Electronics", value: 22 },
  { name: "Food", value: 18 },
  { name: "Health", value: 15 },
  { name: "Other", value: 10 },
];

function ChartCard({ title, children }) {
  return (
    <div
      className="bg-white rounded-2xl border
      border-gray-100 shadow-sm p-5"
    >
      <h3 className="text-sm font-semibold text-[#2C1F0E] mb-5">{title}</h3>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="bg-white border border-gray-100
      rounded-xl shadow-lg px-3 py-2"
    >
      <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}:{" "}
          {p.name === "revenue" ? `₦${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPanel() {
  return (
    <div className="space-y-5">
      {/* Note */}
      <div
        className="p-4 bg-amber-50 border border-amber-100
        rounded-xl"
      >
        <p className="text-xs text-amber-700">
          📊 Analytics are based on sample data. Connect to real Firestore data
          for live metrics.
        </p>
      </div>

      {/* User Growth Chart */}
      <ChartCard title="User Growth">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={USER_GROWTH}>
            <defs>
              <linearGradient id="sellers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4B3621" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4B3621" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="buyers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            <Area
              type="monotone"
              dataKey="sellers"
              stroke="#4B3621"
              fill="url(#sellers)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="buyers"
              stroke="#D4AF37"
              fill="url(#buyers)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Revenue Chart */}
      <ChartCard title="Monthly Revenue (₦)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SALES_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#4B3621" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Category Breakdown */}
      <ChartCard title="Top Categories">
        <div className="space-y-3">
          {CATEGORY_DATA.map((cat) => (
            <div key={cat.name}>
              <div
                className="flex items-center
                justify-between mb-1"
              >
                <p className="text-xs font-medium text-gray-600">{cat.name}</p>
                <p
                  className="text-xs font-semibold
                  text-[#4B3621]"
                >
                  {cat.value}%
                </p>
              </div>
              <div
                className="h-2 bg-gray-100 rounded-full
                overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r
                    from-[#4B3621] to-[#D4AF37] rounded-full"
                  style={{ width: `${cat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
