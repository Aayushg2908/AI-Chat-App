import ChatComponent from "@/components/chat";

const ThreadPage = async ({ params }: { params: { threadId: string } }) => {
  const { threadId } = await params;
  return <ChatComponent threadId={threadId} />;
};

export default ThreadPage;
