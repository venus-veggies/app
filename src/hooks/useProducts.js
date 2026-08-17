import { useState, useEffect, useRef } from "react";
import { getProducts } from "../data/products";
import useDebouncedValue from "./useDebouncedValue";
import { DEFAULT_PER_PAGE } from "../config/constants";

export function useProducts({
  search = "",
  category = "",
  subcategory = "",
  perPage = DEFAULT_PER_PAGE,
} = {}) {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debouncedSearch = useDebouncedValue(search);
  const abortRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (category) params.category = category;
    if (subcategory) params.subcategory = subcategory;
    params.per_page = perPage;
    params.page = 1;

    setLoading(true);
    getProducts(params, controller.signal)
      .then((result) => {
        setProducts(result.products);
        setMeta(result.meta);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError" && err.code !== "ERR_CANCELED") {
          setError(err.response?.data?.message || "Failed to load products");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedSearch, category, subcategory, perPage]);

  return { products, meta, loading, error };
}
