import { create } from "zustand";

interface LoginModalStore {
  isOpen: boolean;
  description: string;
  onOpen: (description: string) => void;
  onClose: () => void;
}

export const useLoginModal = create<LoginModalStore>((set) => ({
  isOpen: false,
  description: "",
  onOpen: (description: string) => set(() => ({ isOpen: true, description })),
  onClose: () => set(() => ({ isOpen: false })),
}));
