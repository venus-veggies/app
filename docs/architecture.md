

### `architecture.md`

```markdown
# Architecture

Venus PWA is a mobile‑first Progressive Web App built with **React 19**, **Vite**, and **React Router 7**. All state is handled through the React Context API — no external state management library is used. Styling is done with **Tailwind CSS v4**, driven by a custom design‑token system defined in `src/index.css`. The app talks to a separate Laravel backend via a single Axios client.

---

## Source tree
```

src/
├── api/
│ └── client.js Axios instance (base URL, auth header, error toasts)
├── components/
│ ├── auth/
│ │ └── ProtectedRoute.jsx
│ ├── cart/
│ │ ├── CartLineItem.jsx
│ │ └── OrderSummary.jsx
│ ├── hero/
│ │ └── Hero.jsx
│ ├── layout/
│ │ ├── BottomNav.jsx
│ │ ├── MainLayout.jsx
│ │ └── TopNav.jsx
│ ├── product/
│ │ ├── ProductCard.jsx
│ │ └── ProduceBadge.jsx
│ ├── ui/
│ │ ├── Button.jsx
│ │ └── QuantityStepper.jsx
│ ├── ErrorBoundary.jsx
│ └── ScrollToTop.jsx
├── config/
│ ├── constants.js Delivery fee, thresholds, debounce, pagination
│ ├── copy.js Every user‑facing string
│ └── navigation.js Route paths, nav links, icon map
├── content/
│ └── brand.js Locality, headline, tagline, delivery promise
├── context/
│ ├── AuthContext.jsx Token, user, rehydration, login/logout
│ └── CartContext.jsx Cart state, persistence, guest‑merge
├── data/
│ ├── categories.js getCategories()
│ └── products.js getProducts(), getProductBySlug()
├── hooks/
│ ├── useAddToCart.js
│ ├── useDebouncedValue.js
│ ├── useDocumentTitle.js
│ ├── usePrevious.js (reserved for future use)
│ ├── useProduct.js
│ └── useProducts.js
├── pages/
│ ├── Cart.jsx
│ ├── Login.jsx
│ ├── NotFound.jsx
│ ├── Orders.jsx (placeholder)
│ ├── ProductDetail.jsx
│ ├── Products.jsx
│ └── Profile.jsx
├── App.jsx Root component: providers, routes, error boundary
├── index.css Tailwind import + design tokens + typography
└── main.jsx Entry point





## Application shell

`main.jsx` mounts `<App />` into the DOM. `App.jsx` is the sole orchestration point:

1. Wraps everything in `<AuthProvider>` and `<CartProvider>`.
2. Adds a global `<ErrorBoundary>` and a `<Toaster>` (react-hot-toast).
3. Defines all routes inside `<BrowserRouter>` and `<MainLayout>`.

`MainLayout` provides the persistent shell:
- `<TopNav />` — sticky header (desktop) / search bar + delivery info (mobile).
- `<Outlet />` — the currently active page.
- `<BottomNav />` — fixed mobile tab bar.
`<ScrollToTop>` component resets scroll position on every route change.

---

## Data flow

### 1. Auth & cart
`AuthContext` holds the current user, a JWT token in `localStorage`, and a `loading` flag for rehydration. `CartContext` depends on `AuthContext`; it scopes cart data to `cart_guest` (before login) or `cart_{userId}` (after login). On successful login, guest items are merged automatically and the guest key is removed.

All sensitive routes (`/cart`, `/orders`, `/profile`) are wrapped in `<ProtectedRoute>`. That component checks `AuthContext` and redirects to `/login` only *after* rehydration is complete, preventing a flash of the login page on refresh.

### 2. Products & categories
- `data/products.js` and `data/categories.js` make raw HTTP requests through `api/client.js`.
- `hooks/useProducts.js` and `hooks/useProduct.js` wrap those calls with loading, error, debounced search, and request cancellation.
- Page components (`Products.jsx`, `ProductDetail.jsx`) **never** call the data layer directly. They consume the hooks.

### 3. Cart actions
`hooks/useAddToCart.js` combines `CartContext.addItem` with a toast notification. Both `ProductCard` and `ProductDetail` use this single hook rather than duplicating add‑to‑cart logic.

### 4. Configuration
Every route, nav link, icon, constant, and user‑facing string is stored in `src/config/` and `src/content/`. Components import these directly — there is no prop‑drilling of configuration.

---

## Routing table

| Path | Component | Auth | Notes |
|------|-----------|------|-------|
| `/` | `Products` | Public | Same as `/shop` |
| `/shop` | `Products` | Public | Primary storefront |
| `/product/:slug` | `ProductDetail` | Public | Variant selector, add‑to‑cart |
| `/login` | `Login` | Public | Phone + password |
| `/cart` | `Cart` | Protected | Line items, order summary |
| `/orders` | `Orders` | Protected | Placeholder page |
| `/profile` | `Profile` | Protected | Menu, logout |
| `/products` | Redirect → `/shop` | Public | Backwards compatibility |
| `*` | `NotFound` | Public | Friendly 404 |

All paths are defined once in `config/navigation.js` under the `ROUTES` object and referenced by that key everywhere else.

---

## Key design decisions

- **No global state manager** — at this scale, React Context is sufficient and avoids adding dependencies.
- **Feature‑based component grouping** — components live in folders named after their domain (`cart/`, `product/`, `hero/`). Shared primitives go in `ui/`.
- **Centralized copy and config** — changing a label, a route, or a fee means editing one file, not searching through components.
- **Real API from day one** — the app never shipped with mock data. All product and category information comes from the Laravel backend via the API client.
- **Honest UI** — placeholder pages and features that aren't wired up tell the user so directly rather than pretending they work.
```


