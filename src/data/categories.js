import api from "../api/client";

export async function getCategories() {
  const { data } = await api.get("/categories");

  // Backend returns { data: [...] } due to Laravel resource wrapping
  return Array.isArray(data) ? data : (data.data ?? []);
}
