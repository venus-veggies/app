import { useState, useEffect, useRef } from "react";

/**
 * Generic hook for async data fetching.
 *
 * @param {Function} fetcher - async function that receives a signal and returns data
 * @param {Array} deps - dependencies that trigger refetch
 * @param {Object} options
 * @param {any} options.initialData - initial value for data
 * @param {boolean} options.enabled - set false to skip fetching
 * @param {boolean} options.resetOnFetch - if true, sets data to initialData before each fetch
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export function useAsyncData(
  fetcher,
  deps = [],
  { initialData = null, enabled = true, resetOnFetch = true } = {},
) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const abortRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    if (resetOnFetch) {
      setData(initialData);
    }

    fetcherRef
      .current(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
