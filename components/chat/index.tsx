"use client";

import { useCanvas } from "@/hooks/use-canvas";
import ChatInterface from "./chat-interface";
import CanvasEditor from "../canvas/canvas-editor";
import { ThreadType } from "@/db/schema";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CanvasPreview from "../canvas/canvas-preview";
import { usePathname } from "next/navigation";

interface ChatComponentProps {
  thread: ThreadType | null;
  isEditable: boolean;
}

export const ChatComponent = ({ thread, isEditable }: ChatComponentProps) => {
  const { isOpen, onClose } = useCanvas();
  const [isResizing, setIsResizing] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const percentage = ((windowWidth - mouseX) / windowWidth) * 100;
      const clampedPercentage = Math.min(Math.max(percentage, 30), 70);
      setEditorWidth(clampedPercentage);
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative h-[calc(100vh-4rem)] flex">
      <div
        className="h-full"
        style={{ width: isOpen ? `${100 - editorWidth}%` : "100%" }}
      >
        <div className="h-[calc(100vh-45px)] relative flex flex-col overflow-hidden">
          <div className="h-full">
            <ChatInterface thread={thread} isEditable={isEditable} />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute right-0 top-0 h-[calc(100vh-45px)] overflow-hidden",
          !isResizing && "transition-[width] duration-300 ease-in-out",
          isResizing && "select-none"
        )}
        style={{ width: isOpen ? `${editorWidth}%` : 0 }}
      >
        <div
          className={cn(
            "h-full",
            !isResizing && "transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-[4px] cursor-col-resize hover:bg-blue-600 group z-50"
            onMouseDown={handleMouseDown}
          />
          {isOpen === "editor" && <CanvasEditor />}
          {isOpen === "preview" && <CanvasPreview />}
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
