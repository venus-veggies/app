import { useState, useEffect } from "react";
import { DEBOUNCE_DELAY } from "../config/constants";

export default function useDebouncedValue(value, delay = DEBOUNCE_DELAY) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
