import { useSyncExternalStore } from "react";

// The phone layout (bottom tab bar, bottom sheets), as in the stylesheets.
const phoneQuery = matchMedia("(max-width: 880px)");

const subscribe = (onChange: () => void) => {
  phoneQuery.addEventListener("change", onChange);
  return () => phoneQuery.removeEventListener("change", onChange);
};

export const usePhone = () => useSyncExternalStore(subscribe, () => phoneQuery.matches);
