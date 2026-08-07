### `data-layer.md`

````markdown
# Data Layer

Venus PWA communicates with a Laravel backend through a single Axios client. All data fetching is centralized through dedicated service functions and custom hooks — pages never call the API directly, and no mock data remains in the project.

---

## API client (`src/api/client.js`)

A single Axios instance is created with:

- `baseURL: "/api/v1"`
- `Accept: application/json`

Two interceptors are attached:

**Request interceptor** — reads a token from `localStorage.getItem("token")` and attaches it as `Authorization: Bearer <token>` if present.

**Response interceptor** — on any error response except 401, shows a toast via `react-hot-toast` using the server's `message` field (falls back to "Something went wrong"). 401 errors are deliberately ignored here — token expiry is handled by `AuthContext`, which clears the stored token and redirects to `/login`.

This instance is the only point of contact with the backend. No other file imports axios directly.

---

## Product data (`src/data/products.js`)

Two exported async functions:

**`getProducts(filters)`**

- Calls `GET /api/v1/products` with optional query params: `search`, `category`, `page`, `per_page` (default 50 from `DEFAULT_PER_PAGE` in `constants.js`).
- Returns a normalized object:
  ```js
  {
    products: data.data,
    meta: { currentPage, lastPage, total }
  }
  ```
````

**`getProductBySlug(slug)`**

- Calls `GET /api/v1/products/${slug}`
- Returns the product object directly from `data.data`

The backend returns products with nested `category`, `tags`, and `variants`. Only variants with `status: "active"` are used in the UI — inactive variants are filtered out at the component level.

---

## Category data (`src/data/categories.js`)

**`getCategories()`**

- Calls `GET /api/v1/categories`
- Returns an array of `{ id, name, slug }` objects directly (no wrapper object).

---

## Hooks that wrap the data layer

Pages never call `data/products.js` or `data/categories.js` directly. They use these hooks:

**`useProducts({ search, category, perPage })`**

- Calls `getProducts` with debounced search input (via `useDebouncedValue`).
- Provides `{ products, meta, loading, error }`.
- Cancels in-flight requests when filters change (using `AbortController`).

**`useProduct(slug)`**

- Calls `getProductBySlug` for the current URL slug.
- Provides `{ product, loading, error }`.
- Returns `product: null` on 404 (not treated as an error — the page shows a "not found" message).

---

## Cart persistence (`src/context/CartContext.js`)

Cart state is stored in `localStorage` and keyed by user identity:

- `cart_guest` — used before login.
- `cart_{userId}` — used after login.

On mount, the cart is rehydrated from the appropriate key. When a user logs in, any existing `cart_guest` items are merged into the user's cart (quantities added together for matching products), and the guest key is removed.

The cart holds items keyed by product `slug`. Each item stores:

```js
{
  product: {
    slug, name, image_url, price, variant
  },
  qty
}
```

The context provides `addItem`, `setQty`, `removeItem`, and `clearCart`, all of which update state and persist to `localStorage` automatically.

---

## Cart actions hook (`src/hooks/useAddToCart.js`)

Wraps `CartContext.addItem` with a toast notification using the `tpl()` helper from `copy.js`. Both `ProductCard` and `ProductDetail` use this hook rather than touching `CartContext` directly.

---

## No mock data

All mock files (`mockProducts.js`, `promos.js`) have been removed. The application exclusively uses the real Laravel API. If offline or demo fallback is ever needed, it should be implemented at the `data/` layer, not by reintroducing mock files.

```

---


```
