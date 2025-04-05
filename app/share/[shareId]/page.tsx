import { getThreadFromShareId } from "@/actions";
import ChatComponent from "@/components/chat";
import { notFound } from "next/navigation";

const SharedThreadPage = async ({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) => {
  const { shareId } = await params;
  const thread = await getThreadFromShareId(shareId);
  if (!thread) {
    return notFound();
  }

  return <ChatComponent thread={thread} isEditable={false} />;
};

export default SharedThreadPage;
