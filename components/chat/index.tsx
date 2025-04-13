import ChatInterface from "./chat-interface";
import { ThreadType } from "@/db/schema";

const ChatComponent = ({
  thread,
  isEditable,
}: {
  thread: ThreadType | null;
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
