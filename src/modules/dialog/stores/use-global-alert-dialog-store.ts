import { create } from "zustand";

interface GlobalAlertDialogStore {
  isOpen: boolean;
  content: React.ReactNode;
  onConfirm: () => void;
  openDialog: ({
    content,
    onConfirm,
  }: {
    content: React.ReactNode;
    onConfirm: () => void;
  }) => void;
  closeDialog: () => void;
}

export const useGlobalAlertDialogStore = create<GlobalAlertDialogStore>(
  (set) => ({
    isOpen: false,
    content: null,
    onConfirm: () => {},
    openDialog: ({
      content,
      onConfirm,
    }: {
      content: React.ReactNode;
      onConfirm: () => void;
    }) => set({ isOpen: true, content, onConfirm }),
    closeDialog: () => set({ isOpen: false }),
  })
);
