"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCanvas } from "@/hooks/use-canvas";
import { Check, Copy, X } from "lucide-react";
import { useState } from "react";

const SidebarTriggerComponent = () => {
  const { isOpen, onClose, code } = useCanvas();
  const [showCheck, setShowCheck] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setShowCheck(true);
    setTimeout(() => setShowCheck(false), 1000);
  };

  return (
    <div className="flex items-center justify-between">
      <SidebarTrigger />
      {isOpen && (
        <div className="mr-4 flex gap-3">
          {showCheck ? (
            <Check className="size-[18px] text-green-500" />
          ) : (
            <Copy className="size-[18px] cursor-pointer" onClick={handleCopy} />
          )}
          <X className="size-[18px] cursor-pointer" onClick={onClose} />
        </div>
      )}
    </div>
  );
};

export default SidebarTriggerComponent;
