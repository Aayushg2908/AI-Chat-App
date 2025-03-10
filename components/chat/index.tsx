import ChatInput from "./chat-input";

const ChatComponent = () => {
  const messages = Array.from({ length: 50 }, (_, i) => `Message ${i + 1}`);

  return (
    <div className="relative h-[calc(100vh-50px)]">
      <div className="h-[calc(100%-111px)] overflow-y-auto scrollbar-hide">
        {messages.map((message, index) => (
          <div key={index} className="p-4 space-y-4">
            {message}
          </div>
        ))}
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatComponent;
