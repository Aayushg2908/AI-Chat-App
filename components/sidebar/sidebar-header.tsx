"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen } from "lucide-react";

const SidebarHeaderComponent = () => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="text-[22px] font-bold">ALLIN1</h1>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <SquarePen className="size-5 cursor-pointer" />
          </TooltipTrigger>
          <TooltipContent className="bg-zinc-800 text-white">
            New Chat
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SidebarHeaderComponent;
