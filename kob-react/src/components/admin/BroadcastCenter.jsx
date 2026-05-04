import React, { useState } from "react";
import { saveBroadcast } from "../../services/admin";
import { Bell, Send, CheckCircle } from "lucide-react";

const TEMPLATES = [
  {
    title: "Platform Update",
    body: "KOB Marketplace has been updated with new features. Check them out now!",
    type: "update",
  },
  {
    title: "Safety Reminder",
    body: "Always verify seller credentials before making a purchase on KOB.",
    type: "safety",
  },
  {
    title: "New Sellers",
    body: "New verified sellers have joined KOB Marketplace. Discover fresh products today!",
    type: "sellers",
  },
  {
    title: "Delivery Update",
    body: "KOB Express Delivery is now available in more areas across Katsina State.",
    type: "delivery",
  },
];

export default function BroadcastCenter() {
  const [form, setForm] = useState({ title: "", body: "", url: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function applyTemplate(template) {
    setForm({
      title: template.title,
      body: template.body,
      url: "/",
    });
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setError("Title and message are required");
      return;
    }

    setSending(true);
    setError(null);

    try {
      // Save broadcast record to Firestore
      await saveBroadcast({
        title: form.title,
        body: form.body,
        url: form.url || "/",
        type: "broadcast",
      });

      // Note: Actual FCM send requires Cloud Functions
      // This saves the broadcast intent to Firestore
      // A Cloud Function trigger can pick this up

      setSent(true);
      setForm({ title: "", body: "", url: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError("Failed to send: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-5
        bg-[#4B3621] rounded-2xl text-white"
      >
        <div
          className="w-10 h-10 bg-white/10 rounded-xl
          flex items-center justify-center"
        >
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold">Broadcast Center</p>
          <p className="text-xs text-white/60">
            Send push notifications to all KOB users
          </p>
        </div>
      </div>

      {/* FCM Note */}
      <div
        className="p-4 bg-blue-50 border border-blue-100
        rounded-xl"
      >
        <p className="text-xs text-blue-700 font-medium">
          ℹ️ FCM Setup Required: Add your Firebase config to
          <code className="mx-1 px-1 bg-blue-100 rounded">
            public/firebase-messaging-sw.js
          </code>
          and enable Cloud Messaging in your Firebase Console. Broadcast records
          are saved to Firestore and can trigger Cloud Functions for delivery.
        </p>
      </div>

      {/* Templates */}
      <div>
        <p
          className="text-xs font-semibold uppercase
          tracking-widest text-gray-400 mb-3"
        >
          Quick Templates
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.type}
              onClick={() => applyTemplate(t)}
              className="text-left p-3 bg-white rounded-xl
                border border-gray-100 hover:border-[#4B3621]/30
                hover:bg-[#4B3621]/5 transition-all group"
            >
              <p
                className="text-xs font-semibold
                text-gray-700 group-hover:text-[#4B3621]
                mb-0.5"
              >
                {t.title}
              </p>
              <p
                className="text-[10px] text-gray-400
                line-clamp-2"
              >
                {t.body}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Compose Form */}
      <div
        className="bg-white rounded-2xl border
        border-gray-100 shadow-sm p-5"
      >
        <h3
          className="text-sm font-semibold text-[#2C1F0E]
          mb-4"
        >
          Compose Notification
        </h3>

        {sent && (
          <div
            className="flex items-center gap-2 p-3
            bg-emerald-50 border border-emerald-100
            rounded-xl mb-4"
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <p className="text-xs text-emerald-700 font-medium">
              Broadcast saved successfully!
            </p>
          </div>
        )}

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-100
            rounded-xl mb-4"
          >
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-400 mb-1.5"
            >
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Notification title..."
              maxLength={60}
              className="w-full px-4 py-2.5 border-2 border-gray-200
                rounded-xl text-sm outline-none
                focus:border-[#4B3621] transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {form.title.length}/60
            </p>
          </div>

          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-400 mb-1.5"
            >
              Message
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Your message to all users..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200
                rounded-xl text-sm outline-none resize-none
                focus:border-[#4B3621] transition-colors"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {form.body.length}/200
            </p>
          </div>

          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-400 mb-1.5"
            >
              Link URL (optional)
            </label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="/marketplace"
              className="w-full px-4 py-2.5 border-2 border-gray-200
                rounded-xl text-sm outline-none
                focus:border-[#4B3621] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !form.title || !form.body}
            className="w-full flex items-center justify-center
              gap-2 py-3 bg-[#4B3621] text-white rounded-xl
              text-sm font-semibold hover:bg-[#362818]
              transition-colors shadow-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
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
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Broadcast
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
