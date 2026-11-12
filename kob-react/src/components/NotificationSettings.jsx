import React, { useState, useEffect } from "react";
import { useAuth } from "../firebase/auth";
import { requestPermissionAndRegister } from "../services/fcm";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Helper to check for Notification API support
const isNotificationSupported = () =>
  typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;

export default function NotificationSettings() {
  const { user } = useAuth();
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  // 1. Check for API support and initial permission status on mount
  useEffect(() => {
    if (isNotificationSupported()) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  // 2. Listen to Firestore for the user's notification preference
  useEffect(() => {
    if (!user?.uid) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists() && doc.data().notificationsEnabled === true) {
        setIsRegistered(true);
      } else {
        setIsRegistered(false);
      }
    });

    return () => unsub();
  }, [user?.uid]);


  const handleEnableNotifications = async () => {
    if (!user?.uid || !isSupported) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await requestPermissionAndRegister(user.uid);

      if (result.success) {
        // The onSnapshot listener will update isRegistered automatically
        console.log("Notification registration successful.");
      } else {
        // Update permission state in case it was denied
        setPermission(Notification.permission);
        if (Notification.permission === 'denied') {
            setError("Permission denied. Please enable notifications in your browser settings.");
        } else {
            setError(result.error || "An unknown error occurred.");
        }
      }
    } catch (err) {
      setError(err.message || "Failed to request permission.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderContent = () => {
    if (!isSupported) {
      return (
        <p className="text-sm text-gray-500">
          This browser does not support push notifications.
        </p>
      );
    }

    if (permission === 'granted' && isRegistered) {
      return (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 text-green-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800">Notifications Enabled</p>
            <p className="text-sm text-gray-500">
              You are set to receive updates from KOB Marketplace.
            </p>
          </div>
        </div>
      );
    }

    if (permission === 'denied') {
        return (
            <div>
              <p className="font-semibold text-red-700">Notifications Blocked</p>
              <p className="text-sm text-gray-600 mt-1">
                You have blocked notifications. To receive updates, please enable them for this site in your browser settings.
              </p>
            </div>
          );
    }

    // Default state: permission is 'default' or not yet granted/registered
    return (
        <div>
            <h3 className="font-bold text-gray-800">Enable Notifications</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">
                Click the button to receive important updates and alerts.
            </p>
            <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="btn-primary w-full sm:w-auto"
            >
                {isLoading ? "Enabling..." : "Enable Notifications"}
            </button>
            {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
    );
  }

  return (
    <div className="card-outline p-6">
      {renderContent()}
    </div>
  );
}
