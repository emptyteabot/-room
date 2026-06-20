"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    const registerServiceWorker = () => {
      void navigator.serviceWorker.register("/focus-room/sw.js", { scope: "/focus-room/" });
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker);

    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  return null;
}
