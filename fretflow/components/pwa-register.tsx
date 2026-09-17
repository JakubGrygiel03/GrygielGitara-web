"use client";

import { useEffect } from "react";

/** Registers the PWA service worker once on the client. */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Install still works without SW on some browsers; ignore register failures.
    });
  }, []);

  return null;
}
