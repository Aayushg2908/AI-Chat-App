import { create } from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  description: string;
  prompt: string;
  onOpen: (description: string, prompt: string) => void;
  onClose: () => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  description: "",
  prompt: "",
  onOpen: (description: string, prompt: string) =>
    set(() => ({ isOpen: true, description, prompt })),
  onClose: () => set(() => ({ isOpen: false, description: "", prompt: "" })),
}));
