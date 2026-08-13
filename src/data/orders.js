import api from "../api/client";

export async function getOrders() {
  const { data } = await api.get("/orders");

  // Laravel resource collections often wrap in { data: [...] }
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function placeOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data;
}

export async function getOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.data ?? data;
}
