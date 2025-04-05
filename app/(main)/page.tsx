import ChatComponent from "@/components/chat";
import { handleUserRedirect } from "@/actions";

export default async function Home() {
  await handleUserRedirect();

  return <ChatComponent thread={null} isEditable={true} />;
}
