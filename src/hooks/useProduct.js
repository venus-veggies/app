import { useAsyncData } from "./useAsyncData";
import { getProductBySlug } from "../data/products";

export function useProduct(slug) {
  const { data, loading, error } = useAsyncData(
    (signal) => getProductBySlug(slug, signal),
    [slug],
    { initialData: null, enabled: !!slug },
  );

  // Treat 404 as "product not found" without showing an error
  const product = error?.response?.status === 404 ? null : data;
  const finalError = error?.response?.status === 404 ? null : error;

  return { product, loading, error: finalError };
}
