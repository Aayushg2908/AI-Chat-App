"use client";

import { cloneSharedThread } from "@/actions";
import ChatComponent from "@/components/chat";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThreadType } from "@/db/schema";
import { useLoginModal } from "@/hooks/use-login-modal";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { User } from "better-auth";
import { ArrowLeft, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const SharedPage = ({
  thread,
  user,
}: {
  thread: ThreadType;
  user: User | undefined;
}) => {
  const { isOpen, onOpen } = useLoginModal();
  const router = useRouter();

  const cloneThreadMutation = useMutation({
    mutationFn: ({ threadId }: { threadId: string }) =>
      cloneSharedThread(threadId),
    onSuccess: ({ threadId }) => {
      toast.success("Thread cloned successfully");
      router.push(`/${threadId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (thread.requireAuth && !user) {
      onOpen(
        "Please login to view this thread or ask the owner to make it public.",
        ""
      );
    }
  }, [thread.requireAuth, onOpen]);

  if (isOpen) return null;

  const handleCloneThread = async () => {
    cloneThreadMutation.mutate({ threadId: thread.id });
  };

  return (
    <div className="w-full h-full overflow-hidden">
      <header className="flex items-center justify-between mx-4 h-[50px]">
        <Link
          href="/"
          className={cn(
            buttonVariants({
              variant: "ghost",
            })
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>
        <Button
          onClick={handleCloneThread}
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={cloneThreadMutation.isPending}
        >
          {cloneThreadMutation.isPending && (
            <Loader2Icon className="size-4 animate-spin" />
          )}
          {cloneThreadMutation.isPending ? "Cloning..." : "Clone this Thread"}
        </Button>
      </header>
      <ChatComponent thread={thread} isEditable={false} />
    </div>
  );
};

export default SharedPage;
