import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

const ChatComponent = () => {
  return (
    <div className="relative h-[calc(100vh-50px)]">
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatComponent;
