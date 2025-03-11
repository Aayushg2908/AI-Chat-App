import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

const ChatComponent = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-50px)]">
      <div className="flex-1 overflow-hidden">
        <ChatMessages />
      </div>
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatComponent;
