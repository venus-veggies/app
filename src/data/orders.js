import api from "../api/client";

export async function getOrders() {
  const { data } = await api.get("/orders");

  // Laravel resource collections often wrap in { data: [...] }
  return Array.isArray(data) ? data : (data.data ?? []);
}
