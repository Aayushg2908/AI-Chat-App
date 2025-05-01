import { create } from "zustand";

interface CanvasStore {
  isOpen: boolean;
  code: string;
  readOnly: boolean;
  onOpen: (code: string, readOnly: boolean) => void;
  onClose: () => void;
}

export const useCanvas = create<CanvasStore>((set) => ({
  isOpen: false,
  code: "",
  readOnly: true,
  onOpen: (code: string, readOnly: boolean) =>
    set(() => ({ isOpen: true, code, readOnly })),
  onClose: () => set(() => ({ isOpen: false, code: "", readOnly: false })),
}));
