import React, { ReactNode } from "react";
import { Trash } from "lucide-react";
import BaseModal from "./BaseModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete",
  description = "This action cannot be undone.",
  icon,
}: ModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showFooter={true}
      cancelText="Cancel"
      confirmText="Confirm"
      onConfirm={onConfirm}
      className="w-[368px] h-[277px]"
    >
      <div className="flex justify-center items-center mt-[-32px]">
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
    </BaseModal>
  );
}
