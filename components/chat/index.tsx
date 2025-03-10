import ChatInput from "./chat-input";

const ChatComponent = () => {
  return (
    <div className="relative h-[calc(100vh-64px)]">
      <div className="h-[calc(100%-64px)] overflow-y-auto">
        <div className="p-4 space-y-4">Main content will come here</div>
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatComponent;
