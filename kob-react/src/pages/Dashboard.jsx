import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'
import BackButton from '../components/BackButton'
import OrdersTab from '../components/dashboard/OrdersTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import SellerProfileEdit from '../components/dashboard/SellerProfileEdit'
import { LayoutDashboard, Package, MessageSquare, User, TrendingUp, Plus } from 'lucide-react'

// Seller Dashboard View
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  const brandColor = "#4B3621";

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoadingProducts(true)
    try {
      const items = await getProducts({ pageSize: 20 })
      setProducts(items)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Pills - Modern Classic Style */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit overflow-x-auto no-scrollbar">
        {[
          { id: 'products', label: 'Inventory', icon: <Package size={18}/> },
          { id: 'sales', label: 'Sales', icon: <TrendingUp size={18}/> },
          { id: 'messages', label: 'Messages', icon: <MessageSquare size={18}/> },
          { id: 'profile', label: 'My Brand', icon: <User size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm uppercase tracking-widest ${
              activeTab === tab.id
                ? 'bg-[#4B3621] text-white shadow-lg'
                : 'text-gray-500 hover:text-[#4B3621]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Welcome Card - High Impact */}
          <div className="relative overflow-hidden bg-[#4B3621] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.4em] opacity-60">Verified Merchant</span>
              <h1 className="text-4xl md:text-5xl font-black mt-2 tracking-tighter italic">
                Sannu, {user.displayName || user.email.split('@')[0]}!
              </h1>
              <p className="mt-4 text-white/80 max-w-md font-medium leading-relaxed">
                Manage your **B-SANI** inventory and connect with customers across Katsina State.
              </p>
            </div>
            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          {/* Clean Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Active Items', value: products.length, icon: '📦' },
              { label: 'Shop Views', value: '0', icon: '👁️' },
              { label: 'Rating', value: 'New', icon: '⭐' },
            ].map((stat, i) => (
              <Card key={i} className="p-6 rounded-3xl border-b-4 border-gray-100 hover:border-[#4B3621] transition-all group">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-[#4B3621] mt-1">{stat.value}</p>
                  </div>
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Inventory Management */}
          <Card className="p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-xl font-black text-[#4B3621] uppercase tracking-tighter">Inventory List</h2>
              <Button
                onClick={() => window.location.href = '/marketplace'}
                className="bg-[#4B3621] hover:scale-105 rounded-2xl px-8 py-3 font-black uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <Plus size={16}/> New Product
              </Button>
            </div>

            {loadingProducts ? (
              <div className="py-20 text-center"><Loading message="Syncing Inventory..." /></div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden font-black text-[10px] flex items-center justify-center text-gray-400">IMG</div>
                      <div>
                        <p className="font-black text-[#4B3621] uppercase text-sm">{product.title}</p>
                        <p className="text-xs text-[#4B3621] font-bold">₦{product.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => window.location.href = `/marketplace?edit=${product.id}`} className="p-2 hover:bg-[#4B3621]/10 text-[#4B3621] rounded-lg font-bold text-xs uppercase">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No products listed yet.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab Switcher Logic */}
      {activeTab === 'sales' && <div className="animate-fade-in"><OrdersTab /></div>}
      {activeTab === 'messages' && <div className="animate-fade-in"><MessagesTab /></div>}
      {activeTab === 'profile' && <div className="animate-fade-in"><SellerProfileEdit /></div>}
    </div>
  )
}

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen message="Accessing KOB Dashboard..." />

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
        <Card className="text-center p-12 max-w-sm rounded-[3rem] shadow-2xl border-b-[12px] border-[#4B3621]">
          <h1 className="text-2xl font-black text-[#4B3621] uppercase mb-4">Access Denied</h1>
          <Button onClick={() => window.location.href = '/login'} className="w-full bg-[#4B3621] rounded-2xl py-4 font-black">LOGIN</Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-20">
      <div className="container py-8 max-w-5xl mx-auto">
        <SellerDashboard user={user} />
      </div>
    </main>
  )
}
            
