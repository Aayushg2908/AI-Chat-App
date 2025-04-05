import ChatInterface from "./chat-interface";
import { Thread } from "@prisma/client";

const ChatComponent = async ({
  thread,
  isEditable,
}: {
  thread: Thread | null;
  isEditable: boolean;
}) => {
  return (
    <div className="flex flex-col h-[calc(100vh-45px)] relative overflow-hidden">
      <div className="h-full">
        <ChatInterface thread={thread} isEditable={isEditable} />
      </div>
    </div>
  );
};

export default ChatComponent;
