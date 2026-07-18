import { create } from "zustand";

// BeforeInstallPromptEvent isn't in the standard TS DOM lib yet.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaInstallState = {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstalled: boolean;
  setDeferredPrompt: (e: BeforeInstallPromptEvent | null) => void;
  setInstalled: (v: boolean) => void;
};

export const usePwaInstallStore = create<PwaInstallState>((set) => ({
  deferredPrompt: null,
  isInstalled: false,
  setDeferredPrompt: (e) => set({ deferredPrompt: e }),
  setInstalled: (v) => set({ isInstalled: v }),
}));
