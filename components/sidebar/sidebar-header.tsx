"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SidebarHeaderComponent = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        router.push("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="text-[22px] font-bold">ALLIN1</h1>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link href="/">
              <SquarePen className="size-5 cursor-pointer" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-800 text-white">
            New Chat (Ctrl+Shift+O)
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SidebarHeaderComponent;
