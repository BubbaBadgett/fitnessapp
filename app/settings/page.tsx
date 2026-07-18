"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useStoresReady } from "@/hooks/useStoresReady";
import { useSettingsStore } from "@/store/useSettingsStore";
import { usePwaInstallStore } from "@/store/usePwaInstallStore";

const STORAGE_KEYS = ["ironpath-workouts", "ironpath-weight", "ironpath-settings"];

export default function SettingsPage() {
  const ready = useStoresReady();
  const name = useSettingsStore((s) => s.name);
  const setName = useSettingsStore((s) => s.setName);
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const setRemindersEnabled = useSettingsStore((s) => s.setRemindersEnabled);

  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const isInstalled = usePwaInstallStore((s) => s.isInstalled);
  const setDeferredPrompt = usePwaInstallStore((s) => s.setDeferredPrompt);

  const [notifStatus, setNotifStatus] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleToggleReminders() {
    if (remindersEnabled) {
      setRemindersEnabled(false);
      return;
    }
    if (notifStatus === "unsupported") return;
    const permission = await Notification.requestPermission();
    setNotifStatus(permission);
    if (permission === "granted") setRemindersEnabled(true);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function handleExport() {
    const data: Record<string, unknown> = {};
    for (const key of STORAGE_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) data[key] = JSON.parse(raw);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ironpath-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    for (const key of STORAGE_KEYS) localStorage.removeItem(key);
    window.location.reload();
  }

  if (!ready) {
    return <div className="animate-pulse text-muted">Loading…</div>;
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card className="flex flex-col gap-2">
        <label className="text-xs font-medium uppercase tracking-wide text-muted">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Bubba"
          className="w-full rounded-xl bg-surface-raised border border-border px-3 py-2.5 text-lg focus:outline-none focus:border-accent-strong"
        />
      </Card>

      {!isInstalled && deferredPrompt && (
        <Card className="flex flex-col gap-2">
          <p className="font-semibold">Install IronPath</p>
          <p className="text-sm text-muted">Add it to your home screen so it opens like a real app.</p>
          <Button onClick={handleInstall}>Install App</Button>
        </Card>
      )}

      <Card className="flex flex-col gap-2">
        <p className="font-semibold">Reminders</p>
        <p className="text-sm text-muted">
          Nudges you to log your weight in the morning and finish today&apos;s workout in the evening,
          while IronPath is open. Browser PWAs can&apos;t send push notifications when fully closed
          without a notification server — that&apos;s a good Phase 2 add if you want true always-on
          reminders.
        </p>
        <Button
          variant={remindersEnabled ? "secondary" : "primary"}
          onClick={handleToggleReminders}
          disabled={notifStatus === "unsupported" || notifStatus === "denied"}
        >
          {remindersEnabled ? "Reminders On" : "Enable Reminders"}
        </Button>
        {notifStatus === "denied" && (
          <p className="text-xs text-danger">Notifications are blocked in your browser settings.</p>
        )}
        {notifStatus === "unsupported" && (
          <p className="text-xs text-muted">Notifications aren&apos;t supported in this browser.</p>
        )}
      </Card>

      <Card className="flex flex-col gap-2">
        <p className="font-semibold">Your Data</p>
        <p className="text-sm text-muted">
          Everything is stored on this device only, for now. Export a backup, or move to a new phone by
          importing the file later.
        </p>
        <Button variant="secondary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="danger" onClick={handleReset}>
          {confirmReset ? "Tap again to confirm reset" : "Reset All Data"}
        </Button>
      </Card>
    </div>
  );
}
