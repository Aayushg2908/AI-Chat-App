import { create } from "zustand";

export type FontFamily =
  | "default"
  | "sans"
  | "serif"
  | "mono"
  | "inter"
  | "roboto"
  | "poppins"
  | "openSans"
  | "firaCode"
  | "jetbrainsMono"
  | "sourceCodePro";

interface FontSettings {
  textFont: FontFamily;
  codeFont: FontFamily;

  setTextFont: (font: FontFamily) => void;
  setCodeFont: (font: FontFamily) => void;
  resetFonts: () => void;
}

const getInitialTextFont = (): FontFamily => {
  const saved = localStorage.getItem("chat-text-font");
  return (saved as FontFamily) || "default";
};

const getInitialCodeFont = (): FontFamily => {
  const saved = localStorage.getItem("chat-code-font");
  return (saved as FontFamily) || "mono";
};

export const useFontSettings = create<FontSettings>((set) => ({
  textFont: getInitialTextFont(),
  codeFont: getInitialCodeFont(),

  setTextFont: (font: FontFamily) => {
    if (font === "default") {
      localStorage.removeItem("chat-text-font");
    } else {
      localStorage.setItem("chat-text-font", font);
    }
    set({ textFont: font });
  },

  setCodeFont: (font: FontFamily) => {
    if (font === "default") {
      localStorage.removeItem("chat-code-font");
    } else {
      localStorage.setItem("chat-code-font", font);
    }
    set({ codeFont: font });
  },

  resetFonts: () => {
    localStorage.removeItem("chat-text-font");
    localStorage.removeItem("chat-code-font");
    set({ textFont: "default", codeFont: "mono" });
  },
}));
