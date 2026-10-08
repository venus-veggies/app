const GUEST_KEY = "cart_guest";

export function getUserCartKey(userId) {
  return `cart_${userId}`;
}

export function getGuestCartKey() {
  return GUEST_KEY;
}

export function getCartKey(user) {
  return user ? getUserCartKey(user.id) : GUEST_KEY;
}

export function loadCart(storageKey) {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore corrupted JSON
  }
  return {};
}

export function saveCart(storageKey, items) {
  if (Object.keys(items).length === 0) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }
}

export function mergeItems(baseItems, guestItems) {
  const merged = { ...baseItems };

  for (const [key, guestEntry] of Object.entries(guestItems)) {
    if (merged[key]) {
      merged[key].qty += guestEntry.qty;
    } else {
      merged[key] = guestEntry;
    }
  }

  return merged;
}

export function loadAndMergeGuestCart(storageKey, user) {
  let baseItems = loadCart(storageKey);

  if (user) {
    const guestItems = loadCart(getGuestCartKey());
    if (Object.keys(guestItems).length > 0) {
      baseItems = mergeItems(baseItems, guestItems);
      localStorage.removeItem(getGuestCartKey());
    }
  }

  return baseItems;
}
