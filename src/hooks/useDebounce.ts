/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

// useDebounce is a custom hook that allow us to call use effect with some delay
export const useDebounce = (
  effect: () => void,
  deps: (string | (() => void))[],
  delay: number
) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
  }, [...deps || [], delay]);
};