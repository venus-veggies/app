import { useAsyncData } from "./useAsyncData";
import { getProducts } from "../data/products";
import useDebouncedValue from "./useDebouncedValue";
import { DEFAULT_PER_PAGE } from "../config/constants";

export function useProducts({
  search = "",
  category = "",
  subcategory = "",
  perPage = DEFAULT_PER_PAGE,
} = {}) {
  const debouncedSearch = useDebouncedValue(search);

  const { data, loading, error } = useAsyncData(
    (signal) =>
      getProducts(
        {
          search: debouncedSearch.trim(),
          category,
          subcategory,
          perPage,
          page: 1,
        },
        signal,
      ),
    [debouncedSearch, category, subcategory, perPage],
    { initialData: { products: [], meta: null } },
  );

  return {
    products: data?.products ?? [],
    meta: data?.meta ?? null,
    loading,
    error,
  };
}
