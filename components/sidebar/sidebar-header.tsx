"use client";

import { handleUserRedirect } from "@/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, SearchIcon, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarHeaderComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleNewChat = async () => {
    try {
      setLoading(true);
      await handleUserRedirect();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              {loading ? (
                <Loader2 className="size-5 cursor-pointer animate-spin" />
              ) : (
                <SquarePen
                  onClick={handleNewChat}
                  className="size-5 cursor-pointer"
                />
              )}
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
