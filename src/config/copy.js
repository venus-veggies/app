// All user‑facing text that isn't brand identity (which lives in content/brand.js).
// Everything is in one place – labels, placeholders, button texts, messages.

export const COPY = {
  // ---------- Login ----------
  loginTab: "Log in",
  signupTab: "Sign up",
  fullNamePlaceholder: "Full name",
  fullNameAria: "Full name",
  phonePlaceholder: "Phone number",
  phoneAria: "Phone number",
  passwordPlaceholder: "Password",
  passwordAria: "Password",
  showPasswordAria: "Show password",
  hidePasswordAria: "Hide password",
  continueGuest: "Continue as guest",
  loginFailed: "Login failed. Please try again.",
  appName: "Venus Veggies",
  appTagline: "Farm-fresh, delivered to your door.",

  // ---------- Products list ----------
  searchPlaceholder: "Search vegetables…",
  categoryAll: "All",
  noProductsMatch: 'No veggies match "{{query}}"',
  noProductsHint: "Try a different search or category.",
  productsLoadingError: "Failed to load products",

  // ---------- Cart ----------
  cartEmptyTitle: "Your basket is empty",
  cartEmptyHint: "Add some fresh veggies to get started.",
  cartStartShopping: "Start shopping",
  cartTitle: "Your basket",
  cartCheckout: "Proceed to checkout",
  cartClear: "Clear cart",

  // ---------- Order summary ----------
  orderSummaryTitle: "Order summary",
  subtotalLabel: "Subtotal",
  deliveryLabel: "Delivery",
  deliveryFree: "Free",
  deliveryUpsell: "Add ₹{{amount}} more for free delivery.",
  totalLabel: "Total",

  // ---------- Product detail ----------
  productNotFound: "We couldn't find that product.",
  backToShop: "Back to shop",
  quantityLabel: "Quantity",
  farmFresh: "Farm fresh",
  handPicked: "Hand-picked",
  sameDayDelivery: "Same-day delivery",
  goBackAria: "Go back",
  addToCartToast: "{{label}} added to cart",

  // ---------- Profile ----------
  editProfileAria: "Edit profile",
  notSignedIn: "Not signed in",
  menuItems: [
    { label: "My Orders", key: "orders" },
    { label: "Saved Addresses", key: "addresses" },
    { label: "Payment Methods", key: "payment" },
    { label: "Notifications", key: "notifications" },
    { label: "Help & Support", key: "help" },
  ],
  menuNotWired: "{{label}} isn't wired up yet.",
  logoutLabel: "Log out",

  // ---------- Misc ----------
  notFoundTitle: "Page not found",
  notFoundDescription: "The page you’re looking for doesn’t exist.",
  errorBoundaryTitle: "Something went wrong",
  errorBoundaryDescription: "We’re sorry — an unexpected error occurred.",
  reloadPage: "Reload page",
  quantityDecreaseAria: "Decrease quantity",
  quantityIncreaseAria: "Increase quantity",
  heroStartShopping: "Start shopping",
  heroSeeTodaysRate: "See today's rate",

  addressTitle: "Default Address",
  addressLine1Placeholder: "House no, street, area",
  addressLine2Placeholder: "Colony, sector (optional)",
  landmarkPlaceholder: "Landmark (optional)",
  pincodePlaceholder: "Pincode",
  saveAddress: "Save Address",
  editAddress: "Edit",
};

export function tpl(str, replacements) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] ?? "");
}
