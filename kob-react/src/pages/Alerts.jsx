import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

function formatDate(timestamp) {
  if (!timestamp) return "";

  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Alerts() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const uid = user?.uid;

    if (!uid) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const notificationsRef = collection(
      db,
      "users",
      uid,
      "notifications"
    );

    const notificationsQuery = query(
      notificationsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const items = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setAlerts(items);
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error("[KOB Alerts] Firestore listener error:", err);

        setError(
          err.code === "permission-denied"
            ? "You do not have permission to access these notifications. Please check Firestore rules."
            : "Unable to load notifications. Please try again."
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  async function markAsRead(alertId) {
    const uid = user?.uid;

    if (!uid || !alertId) return;

    setUpdatingId(alertId);

    try {
      const notificationRef = doc(
        db,
        "users",
        uid,
        "notifications",
        alertId
      );

      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("[KOB Alerts] Failed to mark as read:", err);

      setError("Could not mark this notification as read.");
    } finally {
      setUpdatingId(null);
    }
  }

  const unreadCount = alerts.filter(
    (alert) => alert.read !== true
  ).length;

  return (
    <main className="min-h-screen bg-[#F9F9F7] pb-24">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#F9F9F7]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
          >
            Back
          </button>

          <div className="flex-1">
            <h1 className="text-base font-bold text-[#2D1E17]">
              Alerts
            </h1>

            <p className="text-xs text-gray-500">
              {loading
                ? "Loading notifications..."
                : `${alerts.length} notification(s) · ${unreadCount} unread`}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-xl space-y-3 px-4 py-6">
        {!user?.uid && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Please log in to view your notifications.
          </div>
        )}

        {loading && (
          <div className="rounded-xl bg-white p-5 text-sm text-gray-500 shadow-sm">
            Loading alerts...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && user?.uid && alerts.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm">
            <div className="mb-3 text-3xl">🔔</div>

            <h2 className="font-semibold text-[#2D1E17]">
              No alerts yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Important KOB updates and notifications will appear here.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          alerts.map((alert) => {
            const unread = alert.read !== true;

            return (
              <article
                key={alert.id}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${
                  unread
                    ? "border-[#D4AF37] bg-amber-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4B3621] text-white">
                    🔔
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-sm font-semibold text-[#2D1E17]">
                        {alert.title || "KOB Notification"}
                      </h2>

                      {unread && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-800">
                          UNREAD
                        </span>
                      )}
                    </div>

                    {alert.body && (
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                        {alert.body}
                      </p>
                    )}

                    <p className="mt-3 text-[11px] text-gray-400">
                      {formatDate(alert.createdAt)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {alert.url && (
                        <button
                          type="button"
                          onClick={() => {
                            if (alert.url.startsWith("http")) {
                              window.open(
                                alert.url,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            } else {
                              navigate(alert.url);
                            }
                          }}
                          className="text-xs font-semibold text-[#4B3621] underline"
                        >
                          Open notification
                        </button>
                      )}

                      {unread && (
                        <button
                          type="button"
                          disabled={updatingId === alert.id}
                          onClick={() => markAsRead(alert.id)}
                          className="rounded-lg bg-[#4B3621] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {updatingId === alert.id
                            ? "Updating..."
                            : "Mark as read"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
      </section>
    </main>
  );
}
