import { useEffect } from "react";

export function useModalOverflow(isOpen: boolean) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
}
