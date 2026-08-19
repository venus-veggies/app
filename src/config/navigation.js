import {
  Sprout,
  ShoppingBasket,
  UserRound,
  Leaf,
  MapPin,
  Search,
  Package,
} from "lucide-react";

export const NAV_ICONS = {
  shop: Sprout,
  cart: ShoppingBasket,
  orders: Package,
  profile: UserRound,
  logo: Leaf,
  location: MapPin,
  search: Search,
};

export const ROUTES = {
  home: "/",
  shop: "/shop",
  product: "/product",
  cart: "/cart",
  orders: "/orders",
  profile: "/profile",
  login: "/login",
};

export function productPath(slug) {
  return `${ROUTES.product}/${slug}`;
}

export function orderPath(id) {
  return `${ROUTES.orders}/${id}`;
}

export const NAV_LINKS = [
  { key: "shop", label: "Shop", icon: "shop", path: ROUTES.shop, end: true },
  {
    key: "orders",
    label: "Orders",
    icon: "orders",
    path: ROUTES.orders,
    end: true,
  },
  { key: "cart", label: "Cart", icon: "cart", path: ROUTES.cart, badge: true },
  { key: "profile", label: "Profile", icon: "profile", path: ROUTES.profile },
];
