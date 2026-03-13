import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'
import BackButton from '../components/BackButton'
import OrdersTab from '../components/dashboard/OrdersTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import SellerProfileEdit from '../components/dashboard/SellerProfileEdit'
import { Package, TrendingUp, MessageSquare, User, Plus, Trash2, Edit3, ShieldCheck } from 'lucide-react'

// Seller Dashboard View
function SellerDashboard({ user }) {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('products')

  // KOB BRAND COLORS
  const KOB_BROWN = "#4B3621"
  const KOB_GOLD = "#D4AF37"

  useEffect(() => {
    fetchProducts()
  }, [user.uid])

  async function fetchProducts() {
    setLoadingProducts(true)
    try {
      // Filtering by sellerId ensures the merchant only sees their own stock
      const items = await getProducts({ 
        pageSize: 50,
        sellerId: user.uid 
      })
      setProducts(items)
    } catch (err) {
      console.error('Error fetching inventory:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  async function handleDelete(productId, productTitle) {
    if (!window.confirm(`Permanently remove ${productTitle}?`)) return
    setDeleteLoading(productId)
    try {
      await deleteProduct(productId)
      setShowDeleteSuccess(true)
      await fetchProducts()
      setTimeout(() => setShowDeleteSuccess(false), 5000)
    } catch (err) {
      alert('Delete failed. Check permissions.')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in px-4">
      
      {/* NAVIGATION - Modern Pill Style */}
      <div className="flex bg-white shadow-sm p-1.5 rounded-2xl w-fit overflow-x-auto no-scrollbar border border-gray-100">
        {[
          { id: 'products', label: 'Inventory', icon: <Package size={18}/> },
          { id: 'sales', label: 'Sales', icon: <TrendingUp size={18}/> },
          { id: 'messages', label: 'Messages', icon: <MessageSquare size={18}/> },
          { id: 'profile', label: 'Identity', icon: <User size={18}/> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
              activeTab === tab.id
                ? 'bg-[#4B3621] text-white shadow-lg scale-105'
                : 'text-gray-400 hover:text-[#4B3621]'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="min-h-[60vh]">
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* HERO BANNER - KOB BRANDING */}
            <div className={`relative overflow-hidden bg-[#4B3621] rounded-[3rem] p-10 md:p-16 text-white shadow-2xl border-b-[12px] border-[#D4AF37]`}>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Verified Merchant</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
                  Welcome, {user.displayName || 'Seller'}
                </h1>
                <p className="mt-6 text-white/70 max-w-sm font-medium text-sm leading-relaxed uppercase tracking-widest">
                  Katsina Online Business • Global Standards
                </p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Your Listings', value: products.length, icon: '📦' },
                { label: 'Sales Status', value: 'Live', icon: '💰' },
                { label: 'Brand Power', value: 'High', icon: '⚡' },
              ].map((stat, i) => (
                <Card key={i} className="p-8 rounded-[2rem] border-b-4 border-transparent hover:border-[#D4AF37] bg-white shadow-sm transition-all group">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                      <p className={`text-4xl font-black text-[#4B3621] mt-2`}>{stat.value}</p>
                    </div>
                    <span className="text-4xl opacity-20 group-hover:opacity-100 transition-all">{stat.icon}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* PRODUCT LIST */}
            <Card className="p-8 md:p-12 rounded-[3rem] shadow-xl bg-white border border-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
                <div>
                  <h2 className="text-2xl font-black text-[#4B3621] uppercase tracking-tighter">My Inventory</h2>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Private Seller View</p>
                </div>
                <Button
                  onClick={() => window.location.href = '/marketplace'}
                  className="bg-[#4B3621] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  <Plus size={18} /> Add Product
                </Button>
              </div>

              {loadingProducts ? (
                <div className="py-20 flex justify-center"><div className="w-10 h-10 border-4 border-[#4B3621] border-t-transparent rounded-full animate-spin"></div></div>
              ) : products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-[10px] text-gray-300 border border-gray-100 shadow-inner overflow-hidden uppercase">
                          {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : 'KOB'}
                        </div>
                        <div>
                          <h4 className="font-black text-[#4B3621] uppercase text-sm">{product.title}</h4>
                          <p className="text-lg font-black text-[#D4AF37]">₦{product.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => window.location.href = `/marketplace?edit=${product.id}`} className="p-3 bg-white rounded-xl shadow-sm text-[#4B3621] hover:bg-[#4B3621] hover:text-white transition-all"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(product.id, product.title)} className="p-3 bg-white rounded-xl shadow-sm text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No items found in your inventory</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'sales' && <div className="animate-fade-in"><OrdersTab /></div>}
        {activeTab === 'messages' && <div className="animate-fade-in"><MessagesTab /></div>}
        {activeTab === 'profile' && <div className="animate-fade-in"><SellerProfileEdit /></div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) return <Loading fullScreen message="Accessing KOB Portal..." />

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] p-6">
        <Card className="p-12 text-center rounded-[3rem] shadow-2xl bg-white border-b-[12px] border-[#4B3621] max-w-sm">
          <h2 className="text-2xl font-black text-[#4B3621] uppercase mb-6 tracking-tighter">Login Required</h2>
          <Button onClick={() => window.location.href = '/login'} className="w-full bg-[#4B3621] py-5 rounded-2xl font-black uppercase tracking-widest">SIGN IN</Button>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F9F9F9] pb-20 pt-10">
      <div className="container mx-auto">
        <div className="mb-8 px-4"><BackButton /></div>
        <SellerDashboard user={user} />
      </div>
    </main>
  ) 
}
            
