"use client";

import { useEffect } from "react";
import { usePwaInstallStore } from "@/store/usePwaInstallStore";

export function PwaRegister() {
  const setDeferredPrompt = usePwaInstallStore((s) => s.setDeferredPrompt);
  const setInstalled = usePwaInstallStore((s) => s.setInstalled);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline support is best-effort; a failed registration shouldn't block the app.
      });
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as never);
    }
    function onAppInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [setDeferredPrompt, setInstalled]);

  return null;
}
