import ChatInterface from "./chat-interface";

const ChatComponent = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-45px)] relative overflow-hidden">
      <div className="h-full">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatComponent;
