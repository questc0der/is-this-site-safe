"use client";

import { useState } from "react";

export function PushOptIn() {
  const [status, setStatus] = useState<string>("");

  const enablePush = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setStatus("Push not supported in this browser.");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setStatus(
        "Notifications enabled. Configure service worker + push provider to send alerts.",
      );
      // Production: register service worker and subscribe to push provider here.
    } else if (permission === "denied") {
      setStatus(
        "Notifications blocked. You can change this in browser settings.",
      );
    } else {
      setStatus("Permission dismissed. Try again when ready.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Optional push alerts
          </p>
          <p className="text-xs text-slate-600">
            User-initiated only. Great for reminders on risky domains.
          </p>
        </div>
        <button
          type="button"
          onClick={enablePush}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Enable notifications
        </button>
      </div>
      {status && <p className="mt-2 text-xs text-slate-600">{status}</p>}
    </div>
  );
}
