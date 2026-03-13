import React, { useEffect, useState } from 'react'
import { useAuth } from '../firebase/auth'
import Loading from '../components/Loading'
import { Card, Button, Alert } from '../components/ui'
import { getProducts, deleteProduct } from '../services/products'
import BackButton from '../components/BackButton'
import OrdersTab from '../components/dashboard/OrdersTab'
import MessagesTab from '../components/dashboard/MessagesTab'
import SellerProfileEdit from '../components/dashboard/SellerProfileEdit'


// helper
const username = (email) => email?.split('@')[0] || 'User'


// ================= BUYER DASHBOARD =================

function BuyerDashboard({ user }) {

  const [savedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {

    async function loadData(){
      setLoading(false)
    }

    loadData()

  }, [])


  return (

    <div className="space-y-8">

      {/* Tabs */}

      <div className="flex gap-4 border-b overflow-x-auto">

        {[
          { id:'overview', label:'📊 Overview'},
          { id:'orders', label:'📦 Orders'},
          { id:'messages', label:'💬 Messages'}
        ].map(tab => (

          <button
            key={tab.id}
            onClick={()=>setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'text-kob-primary border-b-4 border-kob-primary'
                : 'text-gray-600 hover:text-kob-primary'
            }`}
          >
            {tab.label}
          </button>

        ))}

      </div>


      {/* Overview */}

      {activeTab === 'overview' && (

        <div className="space-y-8">

          <Card variant="elevated" className="p-10 rounded-2xl bg-gradient-to-r from-kob-primary to-kob-gold text-white">

            <h1 className="text-3xl font-bold mb-2">
              Welcome {username(user.email)} 👋
            </h1>

            <p className="opacity-90">
              Discover trusted products from verified sellers.
            </p>

          </Card>


          {/* stats */}

          <div className="grid md:grid-cols-3 gap-6">

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">❤️</div>
              <p className="text-sm text-gray-600">Saved Products</p>
              <p className="text-3xl font-bold text-kob-primary">{savedProducts.length}</p>

            </Card>

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm text-gray-600">Orders</p>
              <p className="text-3xl font-bold text-kob-primary">0</p>

            </Card>

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">⭐</div>
              <p className="text-sm text-gray-600">Reviews</p>
              <p className="text-3xl font-bold text-kob-primary">0</p>

            </Card>

          </div>


          {/* saved */}

          <Card className="p-8">

            <h2 className="text-2xl font-bold mb-6">
              ❤️ Saved Products
            </h2>

            {loading ? (

              <Loading message="Loading..." />

            ) : savedProducts.length === 0 ? (

              <div className="text-center py-12">

                <p className="text-gray-500 mb-4">
                  No saved products yet
                </p>

                <Button
                  onClick={()=>window.location.href='/marketplace'}
                  variant="primary"
                >
                  Browse Marketplace
                </Button>

              </div>

            ) : (

              <div />

            )}

          </Card>

        </div>

      )}

      {activeTab === 'orders' && <OrdersTab />}
      {activeTab === 'messages' && <MessagesTab />}

    </div>

  )

}



// ================= SELLER DASHBOARD =================

function SellerDashboard({ user }) {

  const [products,setProducts] = useState([])
  const [loadingProducts,setLoadingProducts] = useState(true)
  const [deleteLoading,setDeleteLoading] = useState(null)
  const [showDeleteSuccess,setShowDeleteSuccess] = useState(false)
  const [activeTab,setActiveTab] = useState('products')



  useEffect(()=>{

    fetchProducts()

  },[])



  async function fetchProducts(){

    setLoadingProducts(true)

    try{

      const items = await getProducts({ pageSize:20 })

      setProducts(items)

    }
    catch(err){

      if(import.meta.env.DEV) console.error(err)

    }
    finally{

      setLoadingProducts(false)

    }

  }



  async function handleDelete(id,title){

    if(!window.confirm(`Delete "${title}" ?`)) return

    setDeleteLoading(id)

    try{

      await deleteProduct(id)

      setShowDeleteSuccess(true)

      await fetchProducts()

      setTimeout(()=>setShowDeleteSuccess(false),4000)

    }
    catch(err){

      alert("Failed to delete")

    }
    finally{

      setDeleteLoading(null)

    }

  }



  return (

    <div className="space-y-8">


      {/* Tabs */}

      <div className="flex gap-4 border-b overflow-x-auto">

        {[
          {id:'products',label:'📦 Products'},
          {id:'sales',label:'💰 Sales'},
          {id:'messages',label:'💬 Messages'},
          {id:'profile',label:'👤 Profile'}
        ].map(tab=>(
          <button
            key={tab.id}
            onClick={()=>setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold whitespace-nowrap transition ${
              activeTab===tab.id
                ? 'text-kob-primary border-b-4 border-kob-primary'
                : 'text-gray-600 hover:text-kob-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}

      </div>



      {activeTab==='products' && (

        <div className="space-y-8">


          {/* Welcome */}

          <Card className="p-10 rounded-2xl bg-gradient-to-r from-kob-primary to-kob-gold text-white">

            <h1 className="text-3xl font-bold mb-2">
              Seller Dashboard
            </h1>

            <p className="opacity-90">
              Manage your products and reach more buyers.
            </p>

          </Card>



          {/* stats */}

          <div className="grid md:grid-cols-3 gap-6">

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">📦</div>

              <p className="text-sm text-gray-600">Products</p>

              <p className="text-3xl font-bold text-kob-primary">
                {products.length}
              </p>

            </Card>

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">👁️</div>

              <p className="text-sm text-gray-600">Views</p>

              <p className="text-3xl font-bold text-kob-primary">
                0
              </p>

            </Card>

            <Card className="p-6 text-center">

              <div className="text-4xl mb-2">⭐</div>

              <p className="text-sm text-gray-600">Rating</p>

              <p className="text-3xl font-bold text-kob-primary">
                —
              </p>

            </Card>

          </div>



          {showDeleteSuccess && (
            <Alert type="success" title="Deleted">
              Product deleted successfully
            </Alert>
          )}



          {/* products table */}

          <Card className="p-8">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                My Products
              </h2>

              <Button
                onClick={()=>window.location.href='/marketplace'}
                variant="primary"
              >
                + Add Product
              </Button>

            </div>


            {loadingProducts ? (

              <Loading message="Loading products..." />

            ) : products.length === 0 ? (

              <div className="text-center py-12">

                <p className="text-gray-500 mb-4">
                  No products yet
                </p>

                <Button
                  onClick={()=>window.location.href='/marketplace'}
                  variant="primary"
                >
                  Add First Product
                </Button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="border-b">

                    <tr>

                      <th className="text-left py-3">Title</th>
                      <th className="text-left py-3">Price</th>
                      <th className="text-left py-3">Description</th>
                      <th className="text-right py-3">Actions</th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map(p=>(
                      <tr key={p.id} className="border-b hover:bg-gray-50">

                        <td className="py-3 font-medium">
                          {p.title}
                        </td>

                        <td className="py-3 text-kob-primary font-bold">
                          ₦{p.price}
                        </td>

                        <td className="py-3 text-gray-500 text-sm truncate">
                          {p.description}
                        </td>

                        <td className="py-3 text-right space-x-2">

                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={()=>window.location.href=`/marketplace?edit=${p.id}`}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            disabled={deleteLoading===p.id}
                            onClick={()=>handleDelete(p.id,p.title)}
                          >
                            {deleteLoading===p.id ? '⏳' : 'Delete'}
                          </Button>

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

      {activeTab==='sales' && <OrdersTab />}
      {activeTab==='messages' && <MessagesTab />}
      {activeTab==='profile' && <SellerProfileEdit />}

    </div>

  )

}



// ================= MAIN DASHBOARD =================

export default function Dashboard(){

  const {user,loading} = useAuth()

  if(loading)
    return <Loading fullScreen message="Loading dashboard..." />


  if(!user){

    return(

      <div className="min-h-screen flex items-center justify-center">

        <Card className="p-8 text-center">

          <h1 className="text-xl font-bold mb-4">
            Sign in required
          </h1>

          <Button
            onClick={()=>window.location.href='/login'}
            variant="primary"
          >
            Login
          </Button>

        </Card>

      </div>

    )

  }


  return (

    <main className="min-h-screen bg-kob-light">

      <div className="container py-4">
        <BackButton/>
      </div>

      <div className="container py-8">

        {user.role === 'seller'
          ? <SellerDashboard user={user}/>
          : user.role === 'buyer'
          ? <BuyerDashboard user={user}/>
          : <SellerDashboard user={user}/>
        }

      </div>

    </main>

  )
}
