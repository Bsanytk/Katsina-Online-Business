import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Card, Button } from "../components/ui";
import {
  Search,
  MapPin,
  Verified,
  Share2,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import SellerRating from "../components/SellerRating";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { updatePageMeta } from "../services/seo";

export default function SellerShop() {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  // 1. DOLE ne a bayyana wadannan state din a cikin function
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchShopData() {
      try {
        // 1. Fetch Seller Data
        const sellerSnap = await getDoc(doc(db, "users", sellerId));

        if (sellerSnap.exists()) {
          const sellerData = sellerSnap.data();
          setSeller(sellerData);

          // 2. SEO Update - Runs only if seller exists
          // This prevents the code from breaking if sellerData is undefined
          const shopName =
            sellerData.businessName || sellerData.displayName || "KOB Seller";

          updatePageMeta({
            title: `${shopName} | KOB Marketplace`,
            description: `Shop authentic products from ${shopName} on Katsina Online Business Marketplace.`,
            keywords: `KOB, Katsina, ${shopName}, Online Business, KOBMarketplace, Kasuwa, Nigeria`,
            ogImage:
              sellerData.photoURL ||
              "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/default_kob.png",
            ogType: "website",
          });
        }

        // 3. Fetch Products
        const q = query(
          collection(db, "products"),
          where("ownerUid", "==", sellerId)
        );
        const pSnap = await getDocs(q);
        setProducts(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("SEO/Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShopData();
  }, [sellerId]);

  // FIX: Changed p.name to p.title to match your Firestore structure
  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B3621]"></div>
        <p className="mt-4 text-[#4B3621] font-bold animate-pulse">
          BUDE KOB SHOP...
        </p>
      </div>
    );

  const shopName =
    seller?.displayName ||
    seller?.businessName ||
    `ID-${seller?.kobNumber || "OFFICIAL"}`;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans">
      {/* 1. Hero/Header Section with Core HD View */}
      <div className="relative h-64 md:h-80 bg-[#4B3621] overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#D4AF37] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Seller Profile Card (Floating) */}
      <div className="container relative z-20 -mt-32 md:-mt-40">
        <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-sm">
          <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with Gold Ring */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white shadow-2xl overflow-hidden bg-gray-100">
                <img
                  src={
                    seller?.photoURL ||
                    "https://res.cloudinary.com/dn5crslee/image/upload/v1773415750/20260313_161322_oo9ocx.png"
                  }
                  alt={shopName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white">
                <Verified className="w-5 h-5" />
              </div>
            </div>

            {/* Seller Details */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-[#4B3621] uppercase tracking-tighter">
                  {shopName}
                </h1>
                <span className="hidden md:inline-flex px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black rounded-md border border-yellow-200">
                  KOB VERIFIED
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />{" "}
                  {seller?.location || "Katsina State"}
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />{" "}
                  {products.length} Products
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button className="bg-[#4B3621] hover:bg-[#362718] text-white px-8 rounded-xl font-bold flex gap-2">
                  <MessageCircle className="w-4 h-4" /> Message Seller
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 px-6"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Rating Section */}
            <div className="hidden lg:block border-l pl-8 border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Seller Performance
              </p>
              <SellerRating sellerId={sellerId} />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Products Grid Section */}
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl font-black text-[#4B3621] tracking-tight uppercase">
              Catalog
            </h2>
            <div className="h-1 w-12 bg-[#D4AF37] rounded-full mt-1"></div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in this shop..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium italic">
              No products found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* 4. WhatsApp Floating Button (KOB Special) */}
      <a
        href={`https://wa.me/${seller?.phoneNumber || "234..."}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        <span className="absolute -top-2 -right-2 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
}
