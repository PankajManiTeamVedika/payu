import { useEffect, useRef } from "react";

const VERSION_URL = "/version.json";
const CHECK_INTERVAL_MS = 60 * 1000; // 60s

/**
 * Polls /version.json (generated fresh on every build/start, see
 * scripts/generate-version.js) and hard-reloads the page as soon as it
 * changes from what this tab first loaded. This makes a new deploy
 * (e.g. flipping the site into/out of maintenance mode) reach devices
 * that already had the site open, instead of them being stuck on a
 * cached old bundle.
 *
 * Note: this only helps from the deploy that introduces it onward — a
 * tab currently running a build that predates this hook has no way to
 * know it should check, so it needs one manual refresh to pick this up
 * for the first time.
 */
export default function useVersionCheck() {
  const currentVersionRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchVersion = async () => {
      try {
        const res = await fetch(`${VERSION_URL}?_=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.version ?? null;
      } catch {
        return null;
      }
    };

    const checkForUpdate = async () => {
      const latest = await fetchVersion();
      if (
        !cancelled &&
        latest &&
        currentVersionRef.current &&
        latest !== currentVersionRef.current
      ) {
        window.location.reload();
      }
    };

    (async () => {
      const version = await fetchVersion();
      if (!cancelled) currentVersionRef.current = version;
    })();

    const intervalId = setInterval(checkForUpdate, CHECK_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") checkForUpdate();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("focus", checkForUpdate);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", checkForUpdate);
    };
  }, []);
}
