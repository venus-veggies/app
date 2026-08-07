import api from "../api/client";

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data;
}
