import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ROUTES } from "./config/navigation";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#3D362E",
                  color: "#FFFFFF",
                  fontSize: "0.875rem",
                },
              }}
            />
            <Routes>
              <Route path={ROUTES.login} element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path={ROUTES.home} element={<Products />} />
                <Route path={ROUTES.shop.substring(1)} element={<Products />} />
                <Route
                  path={`${ROUTES.product.substring(1)}/:slug`}
                  element={<ProductDetail />}
                />
                <Route
                  path="products"
                  element={<Navigate to={ROUTES.shop} replace />}
                />

                <Route element={<ProtectedRoute />}>
                  <Route path={ROUTES.cart.substring(1)} element={<Cart />} />
                  <Route
                    path={ROUTES.orders.substring(1)}
                    element={<Orders />}
                  />
                  <Route
                    path={`${ROUTES.orders.substring(1)}/:id`}
                    element={<OrderDetail />}
                  />
                  <Route
                    path={ROUTES.profile.substring(1)}
                    element={<Profile />}
                  />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
