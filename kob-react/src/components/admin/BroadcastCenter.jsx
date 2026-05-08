import React, { useState } from "react";
import { saveBroadcast } from "../../services/admin";
import { Bell, Send, CheckCircle, Zap } from "lucide-react";

const TEMPLATES = [
  {
    title: "Platform Update",
    body: "KOB Marketplace has been updated with new features. Check them out now!",
  },
  {
    title: "Safety Reminder",
    body: "Always verify seller credentials before making a purchase on KOB Marketplace.",
  },
  {
    title: "New Sellers",
    body: "New verified sellers have joined KOB. Discover fresh products today!",
  },
  {
    title: "KOB Express",
    body: "KOB Express Delivery is now available in more areas across Katsina State.",
  },
];

export default function BroadcastCenter() {
  const [form, setForm] = useState({
    title: "",
    body: "",
    url: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  function applyTemplate(t) {
    setForm({ title: t.title, body: t.body, url: "/" });
    setError(null);
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
      await saveBroadcast({
        title: form.title,
        body: form.body,
        url: form.url || "/",
        type: "broadcast",
        createdAt: new Date().toISOString(), // wannan zai gyara matsalar lokaci a Firestore
        sentAt: new Date().toISOString(), //dan tabbatarwa
      });
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
      {/* Header banner */}
      <div
        className="relative overflow-hidden flex
        items-center gap-4 p-5 bg-[#4B3621]
        rounded-2xl text-white"
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32
          bg-[#D4AF37]/10 rounded-full blur-2xl
          pointer-events-none"
        />
        <div
          className="w-11 h-11 bg-white/10 rounded-xl
          flex items-center justify-center flex-shrink-0"
        >
          <Bell className="w-5 h-5" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-semibold">Broadcast Center</p>
          <p className="text-xs text-white/60">
            Send push notifications to all KOB users
          </p>
        </div>
      </div>

      {/* FCM setup note */}
      <div
        className="p-4 bg-blue-50 border border-blue-100
        rounded-xl"
      >
        <p
          className="text-xs text-blue-700 font-medium
          leading-relaxed"
        >
          ℹ️ Broadcasts are saved to Firestore. To send actual push
          notifications, enable Firebase Cloud Messaging in your Firebase
          Console and add a Cloud Function trigger on the
          <code
            className="mx-1 px-1.5 py-0.5 bg-blue-100
            rounded font-mono text-[10px]"
          >
            broadcasts
          </code>
          collection.
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
              key={t.title}
              onClick={() => applyTemplate(t)}
              className="text-left p-3.5 bg-white rounded-xl
                border border-gray-100 hover:border-[#4B3621]/30
                hover:bg-[#4B3621]/5 transition-all group
                shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap
                  className="w-3 h-3 text-[#D4AF37]
                  flex-shrink-0"
                />
                <p
                  className="text-xs font-semibold
                  text-gray-700 group-hover:text-[#4B3621]"
                >
                  {t.title}
                </p>
              </div>
              <p
                className="text-[10px] text-gray-400
                line-clamp-2 pl-5"
              >
                {t.body}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Compose */}
      <div
        className="bg-white rounded-2xl border
        border-gray-100 shadow-sm p-5"
      >
        <h3
          className="text-sm font-semibold
          text-[#2C1F0E] mb-5"
        >
          Compose Notification
        </h3>

        {sent && (
          <div
            className="flex items-center gap-2 p-3
            bg-emerald-50 border border-emerald-100
            rounded-xl mb-4"
          >
            <CheckCircle
              className="w-4 h-4 text-emerald-600
              flex-shrink-0"
            />
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
          {/* Title */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-400 mb-1.5"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Notification title..."
              maxLength={60}
              className="w-full px-4 py-2.5 border-2
                border-gray-200 rounded-xl text-sm
                outline-none focus:border-[#4B3621]
                transition-colors"
            />
            <p
              className="text-[10px] text-gray-400
              mt-1 text-right"
            >
              {form.title.length}/60
            </p>
          </div>

          {/* Message */}
          <div>
            <label
              className="block text-xs font-semibold
              uppercase tracking-widest text-gray-400 mb-1.5"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              placeholder="Message to all users..."
              maxLength={200}
              rows={3}
              className="w-full px-4 py-3 border-2
                border-gray-200 rounded-xl text-sm
                outline-none resize-none
                focus:border-[#4B3621] transition-colors"
            />
            <p
              className="text-[10px] text-gray-400
              mt-1 text-right"
            >
              {form.body.length}/200
            </p>
          </div>

          {/* URL */}
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
              className="w-full px-4 py-2.5 border-2
                border-gray-200 rounded-xl text-sm
                outline-none focus:border-[#4B3621]
                transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending || !form.title.trim() || !form.body.trim()}
            className="w-full flex items-center
              justify-center gap-2 py-3 bg-[#4B3621]
              text-white rounded-xl text-sm font-semibold
              hover:bg-[#362818] transition-colors shadow-sm
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
