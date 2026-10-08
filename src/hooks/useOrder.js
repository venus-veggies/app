import { useAsyncData } from "./useAsyncData";
import { getOrderById } from "../data/orders";

export function useOrder(id) {
  const { data, loading, error } = useAsyncData(
    (signal) => getOrderById(id, signal),
    [id],
    { initialData: null, enabled: !!id },
  );

  return { order: data, loading, error };
}
