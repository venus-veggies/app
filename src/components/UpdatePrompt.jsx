import { useState, useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import api from "../api/client";

const POLL_INTERVAL = 5 * 60 * 1000;

export function UpdatePrompt() {
  const isDev = import.meta.env.DEV;

  const [dismissed, setDismissed] = useState(false);
  const [serverVersion, setServerVersion] = useState(null);

  const localVersion = import.meta.env.VITE_APP_VERSION;

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (registration) {
        setInterval(() => registration.update(), POLL_INTERVAL);
      }
    },
  });

  useEffect(() => {
    // In development, there is no real deployed version to compare against.
    if (isDev) return;

    let cancelled = false;

    const checkVersion = async () => {
      try {
        const { data } = await api.get("/app-version");
        if (!cancelled) setServerVersion(data);
      } catch {
        // ignore
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [isDev]);

  const versionMismatch =
    !isDev && serverVersion && serverVersion.version !== localVersion;

  useEffect(() => {
    if (needRefresh && serverVersion?.critical && !isDev) {
      updateServiceWorker(true);
    }
  }, [needRefresh, serverVersion, updateServiceWorker, isDev]);

  useEffect(() => {
    if (needRefresh || versionMismatch) setDismissed(false);
  }, [needRefresh, versionMismatch]);

  const handleUpdate = async () => {
    if (needRefresh) {
      try {
        await updateServiceWorker(true);
        setTimeout(() => window.location.reload(), 300);
      } catch (err) {
        console.error("SW activation failed, forcing reload", err);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  const showBanner = !isDev && (needRefresh || versionMismatch) && !dismissed;

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-ink text-white rounded-card shadow-lg p-4 flex items-center gap-3">
      <div className="flex-1">
        <p className="text-sm font-medium">New version available</p>
        <p className="text-xs text-white/70 mt-0.5">
          Download to get the latest updates
        </p>
      </div>
      <button
        onClick={handleUpdate}
        className="shrink-0 px-3 py-1.5 rounded-btn bg-leaf-500 text-white text-sm font-semibold hover:bg-leaf-600 transition"
      >
        Update
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
