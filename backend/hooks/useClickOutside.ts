import { useEffect, RefObject } from "react";

/**
 * Hook that triggers a callback when user clicks outside of the referenced element
 * @param ref - React ref object pointing to the element to detect clicks outside of
 * @param handler - Callback function to execute when click outside is detected
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}
