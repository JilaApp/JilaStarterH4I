import { ReactNode, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useModalOverflow } from "@/hooks/useModalOverflow";

interface BaseSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
  footer?: ReactNode;
  headerRight?: ReactNode;
}

export default function BaseSideModal({
  isOpen,
  onClose,
  title,
  children,
  width = "w-[47.55%]",
  footer,
  headerRight,
}: BaseSideModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);
  useModalOverflow(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        ref={modalRef}
        className={`${width} h-full bg-white shadow-[-4px_0px_80px_0px_rgba(109,15,0,0.1)] flex flex-col overflow-y-auto rounded-tl-[15px] rounded-bl-[15px]`}
      >
        <div className="flex items-center justify-between px-[25px] pt-[25px] pb-[15px] border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-[10px]">
            <button onClick={onClose} className="cursor-pointer">
              <X size={24} className="text-type-400" />
            </button>
            <h2 className="font-bold text-[20px] text-type-400">{title}</h2>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <div className="sticky bottom-0 w-full bg-white border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
