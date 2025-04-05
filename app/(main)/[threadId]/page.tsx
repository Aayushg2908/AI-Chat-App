import { getUserThread } from "@/actions";
import ChatComponent from "@/components/chat";

const ThreadPage = async ({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) => {
  const { threadId } = await params;
  let thread = null;
  const response = await getUserThread(threadId);
  if (response.success) {
    thread = response.data;
  }

  return <ChatComponent thread={thread} isEditable={true} />;
};

export default ThreadPage;
