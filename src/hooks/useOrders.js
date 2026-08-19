import { useAsyncData } from "./useAsyncData";
import { getOrders } from "../data/orders";

export function useOrders() {
  const { data, loading, error } = useAsyncData(
    (signal) => getOrders(signal),
    [],
    { initialData: [] },
  );

  return { orders: data ?? [], loading, error };
}
