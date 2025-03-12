import ChatComponent from "@/components/chat";

const ThreadPage = ({ params }: { params: { threadId: string } }) => {
  return <ChatComponent threadId={params.threadId} />;
};

export default ThreadPage;
