# Venus PWA — Architecture Overview

Venus PWA is a mobile-first Progressive Web App built with React 19, Vite, and React Router 7. State is managed with React Context, styling with Tailwind CSS v4, and the backend is a separate Laravel API.

---

## Core Files (read these first)

| File                                   | Purpose                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| `src/App.jsx`                          | Routing, providers, global error boundary                          |
| `src/config/navigation.js`             | Route paths, nav links, icons, path helpers                        |
| `src/config/constants.js`              | Delivery fee, threshold, debounce, pagination, currency formatting |
| `src/config/copy.js`                   | All user-facing text                                               |
| `src/content/brand.js`                 | Brand identity (locality, headline, tagline)                       |
| `src/api/client.js`                    | Axios instance, token attach, error toasts                         |
| `src/data/products.js`                 | Product and category API calls                                     |
| `src/data/orders.js`                   | Order API calls                                                    |
| `src/hooks/useAsyncData.js`            | Generic async hook (loading, error, cancellation)                  |
| `src/hooks/useProducts.js`             | Products list hook                                                 |
| `src/hooks/useProduct.js`              | Single product hook                                                |
| `src/context/AuthContext.jsx`          | Authentication state and actions                                   |
| `src/context/CartContext.jsx`          | Cart state, persistence, guest merge                               |
| `src/components/layout/MainLayout.jsx` | App shell (top nav, bottom nav, outlet)                            |

These files reveal 90% of the architecture. Everything else is a page or reusable UI component following the same patterns.

---

## Data Flow

1. **API Layer** — `api/client.js` is the only place that imports Axios. It adds the token and handles error toasts.
2. **Data Functions** — `data/products.js` and `data/orders.js` call the API and return normalized shapes.
3. **Hooks** — `useProducts`, `useProduct`, `useOrders`, `useOrder` use `useAsyncData` for loading/error/cancellation. Pages never call the data layer directly.
4. **Contexts** — `AuthContext` and `CartContext` manage global state and localStorage.
5. **UI** — Components consume hooks/contexts. Shared UI primitives live in `components/ui/`.

---

## Key Patterns

- **No state manager** — Context is enough.
- **Centralized config/copy** — routes, labels, fees, and brand live in one place.
- **Variant-aware cart** — cart items keyed by `slug_variantId`.
- **Guest cart merge** — handled in `utils/cartStorage.js`.
- **Environment-aware API base URL** — via `VITE_API_BASE_URL`.

---

## Routing

| Path             | Component       | Auth      | Notes                  |
| ---------------- | --------------- | --------- | ---------------------- |
| `/`              | `Products`      | Public    | Same as `/shop`        |
| `/shop`          | `Products`      | Public    | Storefront             |
| `/product/:slug` | `ProductDetail` | Public    | Variant selector       |
| `/login`         | `Login`         | Public    | Phone + password       |
| `/cart`          | `Cart`          | Protected | Checkout               |
| `/orders`        | `Orders`        | Protected | Order list             |
| `/orders/:id`    | `OrderDetail`   | Protected | Order detail + reorder |
| `/profile`       | `Profile`       | Protected | Account/address        |

All paths are defined in `config/navigation.js` and imported elsewhere.
