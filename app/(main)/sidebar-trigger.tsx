"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCanvas } from "@/hooks/use-canvas";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SidebarTriggerComponent = () => {
  const { isOpen, onClose, code, setIsOpen } = useCanvas();
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1000);
  };

  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />
      {isOpen !== null && (
        <div className="mr-5 flex items-center gap-3">
          <div className="flex border-r border-border pr-3 dark:border-border">
            <button
              onClick={() => setIsOpen("editor")}
              className={cn(
                "px-2 py-1 text-sm font-medium transition-colors",
                isOpen === "editor"
                  ? "text-foreground dark:text-foreground"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              )}
            >
              Code
            </button>
            <button
              onClick={() => setIsOpen("preview")}
              className={cn(
                "px-2 py-1 text-sm font-medium transition-colors",
                isOpen === "preview"
                  ? "text-foreground dark:text-foreground"
                  : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
              )}
            >
              Preview
            </button>
          </div>
          {isOpen === "editor" ? (
            <>
              {showCheck ? (
                <Check className="size-[18px] text-green-500" />
              ) : (
                <Copy
                  className="size-[18px] cursor-pointer text-muted-foreground hover:text-foreground dark:hover:text-foreground"
                  onClick={handleCopy}
                />
              )}
            </>
          ) : (
            <ExternalLink className="size-[18px] cursor-pointer text-muted-foreground hover:text-foreground dark:hover:text-foreground" />
          )}
          <X
            className="size-[18px] cursor-pointer text-muted-foreground hover:text-foreground dark:hover:text-foreground"
            onClick={onClose}
          />
        </div>
      )}
    </div>
  );
};

export default SidebarTriggerComponent;
