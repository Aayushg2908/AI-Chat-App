"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchIcon, SquarePen } from "lucide-react";
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
      <div className="flex items-center gap-x-4">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <SearchIcon className="size-5 cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-800 text-white">
              Search
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
    </div>
  );
};

export default SidebarHeaderComponent;
