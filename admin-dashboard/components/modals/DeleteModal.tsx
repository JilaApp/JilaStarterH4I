import React, { useEffect, useRef } from "react";
import { X, Trash } from "lucide-react";
import Button from "@/components/common/Button";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Z_INDEX } from "@/lib/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  description = "This action cannot be undone.",
  icon,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useClickOutside(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[rgb(83,83,83,0.19)]"
      style={{ zIndex: Z_INDEX.MODAL }}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-[10px] w-[368px] h-[277px] p-6"
      >
        <div className="flex justify-end">
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex justify-center items-center mt-[-12px]">
          <div className="w-[45px] h-[44px] bg-error-200 rounded-[10px] flex justify-center items-center">
            {icon || <Trash className="text-error-400" />}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-[4px]">
          <div className="text-2xl mt-[26px] body1-desktop-semi-text text-type-400">
            {title}
          </div>
          <div className="flex flex-col justify-center items-center w-[308px] h-[32px]">
            <div className="text-lg text-gray-300 body2-desktop-text">
              {description}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mt-[26px] gap-x-[26px]">
          <Button
            onClick={onClose}
            text="Cancel"
            defaultClassName="w-[141px] h-[60px] bg-gray-200 text-type-400 rounded-[10px] components-text"
            hoverClassName="hover:bg-gray-300"
          />
          <Button
            onClick={onConfirm}
            text="Confirm"
            defaultClassName="w-[141px] h-[60px] rounded-[10px] components-text"
          />
        </div>
      </div>
    </div>
  );
}
