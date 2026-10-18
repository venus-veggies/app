import { useState, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import api from "../api/client";

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

export function UpdatePrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [serverVersion, setServerVersion] = useState(null);

  const localVersion = import.meta.env.VITE_APP_VERSION;

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        // Poll for a new SW every 5 minutes
        setInterval(() => registration.update(), POLL_INTERVAL);
      }
    },
  });

  // Poll the version endpoint to detect deploys even when the SW check was skipped
  useEffect(() => {
    let cancelled = false;

    const checkVersion = async () => {
      try {
        const { data } = await api.get("/app-version");
        if (!cancelled) setServerVersion(data);
      } catch {
        // Network error — ignore, will retry next interval
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const versionMismatch =
    serverVersion && serverVersion.version !== localVersion;

  // CRITICAL UPDATE: activate the new SW automatically without asking
  useEffect(() => {
    if (needRefresh && serverVersion?.critical) {
      updateServiceWorker(true);
    }
  }, [needRefresh, serverVersion, updateServiceWorker]);

  // Reset dismissal whenever a new update is detected
  useEffect(() => {
    if (needRefresh || versionMismatch) setDismissed(false);
  }, [needRefresh, versionMismatch]);

  const showBanner = (needRefresh || versionMismatch) && !dismissed;

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-ink text-white rounded-card shadow-lg p-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium">New version available</p>
        <p className="text-xs text-white/70 mt-0.5">
          Refresh to get the latest updates
        </p>
      </div>
      <button
        onClick={() => updateServiceWorker(true)}
        className="shrink-0 px-3 py-1.5 rounded-btn bg-leaf-500 text-white text-sm font-semibold hover:bg-leaf-600 transition"
      >
        Refresh
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-white/60 hover:text-white text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
