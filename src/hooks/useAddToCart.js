import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { COPY, tpl } from "../config/copy";

export function useAddToCart() {
  const { addItem } = useCart();

  const addToCart = (product, qty = 1) => {
    addItem(product, qty);
    const label = qty > 1 ? `${qty} × ${product.name}` : product.name;
    toast.success(tpl(COPY.addToCartToast, { label }));
  };

  return addToCart;
}
