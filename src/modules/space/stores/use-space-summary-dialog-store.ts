import { create } from "zustand";

interface SpaceSummaryDialogStore {
  isOpen: boolean;
  spaceSummaryId: string | null;
  openDialog: (spaceSummaryId: string) => void;
  closeDialog: () => void;
}

export const useSpaceSummaryDialogStore = create<SpaceSummaryDialogStore>(
  (set) => ({
    isOpen: false,
    spaceSummaryId: null,
    openDialog: (spaceSummaryId: string) =>
      set({ isOpen: true, spaceSummaryId }),
    closeDialog: () => set({ isOpen: false }),
  })
);
