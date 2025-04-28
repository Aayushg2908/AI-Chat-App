"use client";

import { useCanvas } from "@/hooks/use-canvas";
import ChatInterface from "./chat-interface";
import CanvasEditor from "../canvas/canvas-editor";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "../ui/resizable";
import { ThreadType } from "@/db/schema";

interface ChatComponentProps {
  thread: ThreadType | null;
  isEditable: boolean;
}

export const ChatComponent = ({ thread, isEditable }: ChatComponentProps) => {
  const { isOpen } = useCanvas();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-4rem)]"
    >
      <ResizablePanel defaultSize={isOpen ? 50 : 100} minSize={30}>
        <div className="h-[calc(100vh-45px)] relative flex flex-col overflow-hidden mr-1">
          <div className="h-full">
            <ChatInterface thread={thread} isEditable={isEditable} />
          </div>
        </div>
      </ResizablePanel>
      {isOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={50}
            minSize={40}
            className="h-[calc(100vh-45px)]"
          >
            <CanvasEditor />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default ChatComponent;
