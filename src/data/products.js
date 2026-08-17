import api from "../api/client";
import { DEFAULT_PER_PAGE } from "../config/constants";

export async function getProducts(filters = {}) {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.category) params.category = filters.category;
  if (filters.subcategory) params.subcategory = filters.subcategory;
  params.page = filters.page || 1;
  params.per_page = filters.per_page || DEFAULT_PER_PAGE;

  const { data } = await api.get("/products", { params });
  return {
    products: data.data,
    meta: {
      currentPage: data.current_page,
      lastPage: data.last_page,
      total: data.total,
    },
  };
}

export async function getProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data.data;
}
