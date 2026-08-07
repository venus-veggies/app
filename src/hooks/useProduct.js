import { useState, useEffect } from "react";
import { getProductBySlug } from "../data/products";

export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;
    setLoading(true);

    getProductBySlug(slug)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setProduct(null);
          } else {
            setError(err.response?.data?.message || "Failed to load product");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}
