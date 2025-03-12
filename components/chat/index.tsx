import { getThread } from "@/actions";
import ChatInterface from "./chat-interface";

const ChatComponent = async ({ threadId }: { threadId?: string }) => {
  let thread = null;
  if (threadId) {
    const response = await getThread(threadId);
    if (response.success) {
      thread = response.data;
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-45px)] relative overflow-hidden">
      <div className="h-full">
        <ChatInterface thread={thread} />
      </div>
    </div>
  );
};

export default ChatComponent;
