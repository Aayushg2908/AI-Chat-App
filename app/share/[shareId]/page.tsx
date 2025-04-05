import { getThreadFromShareId } from "@/actions";
import { notFound } from "next/navigation";
import SharedPage from "./shared-page";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <SharedPage thread={thread} user={session?.user} />;
};

export default SharedThreadPage;
