"use client";

import { ReactNode, useEffect } from "react";
import {
  Inter,
  Roboto,
  Poppins,
  Open_Sans,
  Source_Code_Pro,
} from "next/font/google";
import { JetBrains_Mono, Fira_Code } from "next/font/google";
import { useFontSettings } from "@/hooks/use-font";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const allFonts = {
  inter,
  roboto,
  poppins,
  openSans,
  firaCode,
  jetbrainsMono,
  sourceCodePro,
};

function getFontVariable(fontFamily: string): string {
  switch (fontFamily) {
    case "sans":
      return "var(--font-geist-sans)";
    case "serif":
      return "serif";
    case "mono":
      return "var(--font-geist-mono)";
    case "inter":
      return "var(--font-inter)";
    case "roboto":
      return "var(--font-roboto)";
    case "poppins":
      return "var(--font-poppins)";
    case "openSans":
      return "var(--font-open-sans)";
    case "firaCode":
      return "var(--font-fira-code)";
    case "jetbrainsMono":
      return "var(--font-jetbrains-mono)";
    case "sourceCodePro":
      return "var(--font-source-code-pro)";
    default:
      return "var(--font-geist-sans)";
  }
}

export function FontProvider({ children }: { children: ReactNode }) {
  const { textFont, codeFont } = useFontSettings();

  useEffect(() => {
    const fontVariables = [
      inter.variable,
      roboto.variable,
      poppins.variable,
      openSans.variable,
      firaCode.variable,
      jetbrainsMono.variable,
      sourceCodePro.variable,
    ];

    const existingClasses = document.documentElement.className.split(" ");
    const preservedClasses = existingClasses.filter((className) => {
      return (
        className === "dark" ||
        className === "light" ||
        !className.startsWith("--")
      );
    });

    const newClassList = [...preservedClasses, ...fontVariables];
    document.documentElement.className = newClassList.join(" ");

    if (textFont !== "default") {
      document.documentElement.style.setProperty(
        "--font-text",
        getFontVariable(textFont)
      );
    } else {
      document.documentElement.style.removeProperty("--font-text");
    }

    if (codeFont !== "default") {
      document.documentElement.style.setProperty(
        "--font-code",
        getFontVariable(codeFont)
      );
    } else {
      document.documentElement.style.removeProperty("--font-code");
    }
  }, [textFont, codeFont]);

  return <>{children}</>;
}
