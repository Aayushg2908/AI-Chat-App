import { create } from "zustand";

type OpenType = "editor" | "preview";

interface CanvasStore {
  isOpen: OpenType | null;
  code: string;
  readOnly: boolean;
  onOpen: (isOpen: OpenType, code: string, readOnly: boolean) => void;
  setIsOpen: (isOpen: OpenType | null) => void;
  onClose: () => void;
  onCodeChange: (code: string) => void;
}

export const useCanvas = create<CanvasStore>((set) => ({
  isOpen: null,
  code: "",
  readOnly: false,
  onOpen: (isOpen: OpenType, code: string, readOnly: boolean) =>
    set(() => ({ isOpen, code, readOnly })),
  setIsOpen: (isOpen: OpenType | null) => set(() => ({ isOpen })),
  onClose: () => set(() => ({ isOpen: null, code: "", readOnly: false })),
  onCodeChange: (code: string) => set(() => ({ code })),
}));
