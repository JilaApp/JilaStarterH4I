import React, { useEffect } from "react";
import { X, Trash } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(83,83,83,0.19)]">
      <div className="relative bg-white rounded-[10px] w-[368px] h-[277px] p-6">
        <div className="flex justify-end">
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        <div className="flex justify-center items-center mt-[-12px]">
          <div className="w-[45px] h-[44px] bg-error-200 rounded-[10px] flex justify-center items-center">
            <Trash className="text-error-400" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-[4px]">
          <div className="text-[24px] mt-[26px] body1-desktop-semi-text text-type-400">
            Delete
          </div>
          <div className="flex flex-col justify-center items-center w-[308px] h-[32px]">
            <div className="text-[18px] text-gray-300 body2-desktop-text">
              This action cannot be undone.
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
