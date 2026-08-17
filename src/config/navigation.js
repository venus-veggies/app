import {
  Sprout,
  ShoppingBasket,
  UserRound,
  Leaf,
  MapPin,
  Search,
  Package,
} from "lucide-react";

// All icons used in navigation are defined here.
// If you want to change an icon, change it once in this object.
export const NAV_ICONS = {
  shop: Sprout,
  cart: ShoppingBasket,
  orders: Package,
  profile: UserRound,
  logo: Leaf,
  location: MapPin,
  search: Search,
};

// Central route paths – change a URL once, updates everywhere.
export const ROUTES = {
  home: "/",
  shop: "/shop",
  product: "/product",
  cart: "/cart",
  orders: "/orders",
  profile: "/profile",
  login: "/login",
};

// Helper to build a product detail path
export function productPath(slug) {
  return `/product/${slug}`;
}

// All navigation links shared between BottomNav and TopNav.
// Uses ROUTES so a path change in ROUTES affects both navs instantly.
export const NAV_LINKS = [
  { key: "shop", label: "Shop", icon: "shop", path: ROUTES.shop, end: true },
  { key: "orders", label: "Orders", icon: "orders", path: ROUTES.orders },
  { key: "cart", label: "Cart", icon: "cart", path: ROUTES.cart, badge: true },
  { key: "profile", label: "Profile", icon: "profile", path: ROUTES.profile },
];
