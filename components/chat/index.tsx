import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

const ChatComponent = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-45px)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bottom-[75px] overflow-hidden">
        <ChatMessages />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-background z-10 border-t border-border shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
