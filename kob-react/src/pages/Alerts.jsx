import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase"; // Tabbatar wannan path din daidai yake
import { Bell, Calendar, ChevronRight, Inbox } from "lucide-react";

export default function Alerts() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Janyo sakonni daga rumbun "broadcasts"
    const q = query(collection(db, "broadcasts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching alerts:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F7] pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 px-6 py-8 rounded-b-[2rem] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#C5A059]/10 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#C5A059]" />
          </div>
          <h1 className="text-xl font-bold text-[#2D1E17]">Alerts Center</h1>
        </div>
        <p className="text-sm text-gray-500 ml-1">
          Latest updates and official news from KOB Marketplace.
        </p>
      </div>

      <div className="max-w-2xl mx-auto p-5 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C5A059] mb-4"></div>
            <p className="text-xs font-medium">Updating alerts...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-sm font-semibold text-gray-400">
              All caught up!
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Check back later for new updates.
            </p>
          </div>
        ) : (
          notifications.map((alert) => (
            <div
              key={alert.id}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059] bg-[#C5A059]/5 px-2 py-1 rounded-md">
                  {alert.type || "Official"}
                </span>
                <div className="flex items-center text-[10px] text-gray-400 font-medium">
                  <Calendar className="w-3 h-3 mr-1" />
                  {alert.createdAt
                    ? new Date(alert.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "Just now"}
                </div>
              </div>

              <h3 className="text-[15px] font-bold text-[#2D1E17] mb-1.5 leading-tight">
                {alert.title}
              </h3>

              <p className="text-[13px] text-gray-600 leading-relaxed mb-4">
                {alert.body}
              </p>

              {alert.url && (
                <div className="pt-3 border-t border-gray-50">
                  <a
                    href={alert.url}
                    className="flex items-center text-[#C5A059] text-[11px] font-bold group"
                  >
                    LEARN MORE
                    <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
