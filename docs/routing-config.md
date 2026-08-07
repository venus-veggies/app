### `routing-config.md`

````markdown
# Routing & Configuration

Every route path, navigation link, icon, and application constant in Venus PWA lives in two files inside `src/config/`. Nothing is hardcoded inside a component.

---

## Routes (`config/navigation.js`)

```js
ROUTES = {
  home: "/",
  shop: "/shop",
  product: "/product",
  cart: "/cart",
  orders: "/orders",
  profile: "/profile",
  login: "/login",
};
```
````

`home` and `shop` both render the `Products` page — there is no separate landing page. A legacy `/products` path exists as a permanent redirect to `/shop`.

A small helper function builds product detail URLs:

```js
productPath(slug) → `/product/${slug}`
```

All route definitions in `App.jsx` use `ROUTES` — never a raw string. If `/shop` ever becomes `/browse`, one edit fixes every link in the application.

---

## Navigation links (`config/navigation.js`)

```js
NAV_LINKS = [
  { key: "shop", label: "Shop", icon: "shop", path: ROUTES.shop, end: true },
  { key: "cart", label: "Cart", icon: "cart", path: ROUTES.cart, badge: true },
  { key: "profile", label: "Profile", icon: "profile", path: ROUTES.profile },
];
```

This single array powers both `BottomNav` (mobile tab bar) and `TopNav` (desktop header links). Changing a label, path, or icon here updates both components automatically.

- `shop` has `end: true` to prevent partial matching with other routes starting with `/`.
- `cart` has `badge: true`. The corresponding nav components show a count badge when `CartContext.totalCount > 0`.

---

## Icons (`config/navigation.js`)

All icons come from `lucide-react` and are mapped once:

```js
NAV_ICONS = {
  shop: Sprout,
  cart: ShoppingBasket,
  profile: UserRound,
  logo: Leaf,
  location: MapPin,
  search: Search,
};
```

To change the cart icon across the entire app, change one entry here.

---

## Application constants (`config/constants.js`)

```js
DELIVERY_FEE = 20;
FREE_DELIVERY_THRESHOLD = 300;
DEBOUNCE_DELAY = 350; // ms, used by useDebouncedValue
DEFAULT_PER_PAGE = 50; // products fetched per page
```

These are the only magic numbers in the codebase. They are imported directly by:

- `OrderSummary.jsx` (delivery fee and threshold)
- `useDebouncedValue.js` (debounce delay, overridable)
- `useProducts.js` and `data/products.js` (default page size)

---

## How this affects development

- **Adding a new route**: add it to `ROUTES`, then register the `<Route>` in `App.jsx`. If it's a main navigation item, add it to `NAV_LINKS`.
- **Changing the delivery fee**: edit `DELIVERY_FEE` in `constants.js`. The cart summary updates automatically.
- **Renaming a route**: edit `ROUTES`. Every link, redirect, and `navigate()` call follows.

```

```
