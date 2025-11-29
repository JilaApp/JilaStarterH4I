import React, { useRef, ReactNode } from "react";
import { X } from "lucide-react";
import Button from "../ui/Button";
import SubmitButton from "../ui/SubmitButton";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useModalOverflow } from "@/hooks/useModalOverflow";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showFooter?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  loadingText?: string;
  disableClickOutside?: boolean;
  className?: string;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  showFooter = false,
  cancelText = "Cancel",
  confirmText = "Save",
  onConfirm,
  isLoading = false,
  loadingText = "Saving...",
  disableClickOutside = false,
  className = "w-[49%] h-[90%]",
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, () => {
    if (!disableClickOutside && !isLoading) {
      onClose();
    }
  });

  useModalOverflow(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed y-40 inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div
        ref={modalRef}
        className={`relative flex flex-col bg-white rounded-[10px] p-[26.48px] overflow-y-auto ${className}`}
      >
        <div className="flex justify-between items-center mb-[20px]">
          <div className="components-text">{title}</div>
          <button onClick={onClose} className="cursor-pointer">
            <X className="w-[18.16px] h-[18.16px]" />
          </button>
        </div>

        {children}

        {showFooter && onConfirm && (
          <div className="flex gap-3 justify-end mt-[26px] gap-x-[26px]">
            <Button
              onClick={onClose}
              text={cancelText}
              defaultClassName="w-[141px] h-[60px] bg-gray-200 text-type-400 rounded-[10px] components-text"
              hoverClassName="hover:bg-gray-300"
            />
            <SubmitButton
              onClick={onConfirm}
              isLoading={isLoading}
              loadingText={loadingText}
              text={confirmText}
              defaultClassName="w-[141px] h-[60px] rounded-[10px] components-text"
            />
          </div>
        )}
      </div>
    </div>
  );
}
