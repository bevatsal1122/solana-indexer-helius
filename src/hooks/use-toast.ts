"use client";

import { toast } from "sonner";

interface ToastProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  invert?: boolean;
  theme?: "light" | "dark" | "system";
  duration?: number;
  gap?: number;
  visibleToasts?: number;
  className?: string;
  style?: React.CSSProperties;
  dir?: "rtl" | "ltr" | "auto";
  closeButton?: boolean;
  richColors?: boolean;
}

function useToast() {
  return {
    toast: ({ title, description, action, ...props }: ToastProps) => {
      return toast(title, {
        description,
        action: action
          ? {
              label: action.label,
              onClick: action.onClick,
            }
          : undefined,
        ...props,
      });
    },
    dismiss: toast.dismiss,
  };
}

export { useToast, toast };
