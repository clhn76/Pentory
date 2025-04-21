import { create } from "zustand";

interface ArticleData {
  content: string;
  source: {
    name: string;
    url: string;
  };
  thumbnailUrl: string;
  createdAt: string;
}

interface ArticleDialogStore {
  isOpen: boolean;
  articleData: ArticleData | null;
  openDialog: (articleData: ArticleData) => void;
  closeDialog: () => void;
}

export const useArticleDialogStore = create<ArticleDialogStore>((set) => ({
  isOpen: false,
  articleData: null,
  openDialog: (articleData: ArticleData) => set({ isOpen: true, articleData }),
  closeDialog: () => set({ isOpen: false }),
}));
