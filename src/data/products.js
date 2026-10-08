import api from "../api/client";
import { DEFAULT_PER_PAGE } from "../config/constants";

export async function getCategories() {
  const { data } = await api.get("/categories");
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getProducts(filters = {}, signal = undefined) {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.subcategory) params.subcategory = filters.subcategory;
  params.page = filters.page || 1;
  params.per_page = filters.per_page || DEFAULT_PER_PAGE;

  const { data } = await api.get("/products", { params, signal });
  return {
    products: data.data,
    meta: {
      currentPage: data.current_page,
      lastPage: data.last_page,
      total: data.total,
    },
  };
}

export async function getProductBySlug(slug, signal = undefined) {
  const { data } = await api.get(`/products/${slug}`, { signal });
  return data.data;
}

export async function validatePrices(variantIds) {
  const { data } = await api.post("/products/validate-prices", {
    variant_ids: variantIds,
  });
  return data.data ?? [];
}
