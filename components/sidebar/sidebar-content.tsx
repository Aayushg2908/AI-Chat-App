"use client";

import Link from "next/link";
import { Thread } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { SidebarGroup, SidebarGroupContent } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { deleteThread, editThread } from "@/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SidebarContentComponent = ({ threads }: { threads: Thread[] }) => {
  const params = useParams();
  const threadId = params?.threadId as string;
  const [deleteThreadId, setDeleteThreadId] = useState<string | null>(null);
  const [editThreadId, setEditThreadId] = useState<string | null>(null);
  const [editThreadTitle, setEditThreadTitle] = useState("");
  const router = useRouter();

  const threadRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (threadId && threadRefs.current.has(threadId)) {
      const activeThreadElement = threadRefs.current.get(threadId);
      if (activeThreadElement) {
        activeThreadElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [threadId]);

  const handleEdit = async () => {
    if (!editThreadId) return;
    try {
      if (!editThreadTitle) {
        toast.error("Thread title cannot be empty");
        return;
      }
      await editThread(editThreadId, editThreadTitle);
      setEditThreadId(null);
      toast.success("Thread renamed successfully");
    } catch (error) {
      toast.error("Failed to rename thread");
    }
  };

  const handleDelete = async () => {
    if (!deleteThreadId) return;
    try {
      await deleteThread(deleteThreadId);
      setDeleteThreadId(null);
      toast.success("Thread deleted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to delete thread");
    }
  };

  return (
    <>
      <SidebarGroup>
        {threads?.map((thread) => (
          <SidebarGroupContent
            key={thread.id}
            ref={(el) => {
              if (el) threadRefs.current.set(thread.id, el);
            }}
            className={cn(
              "relative group/thread px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors mb-2",
              threadId === thread.id &&
                "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/${thread.id}`}
                className={cn(
                  "flex-1 truncate",
                  threadId === thread.id && "font-bold"
                )}
              >
                {thread.title}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover/thread:opacity-100 focus:opacity-100 transition-opacity">
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      setEditThreadId(thread.id);
                      setEditThreadTitle(thread.title);
                    }}
                  >
                    <Pencil className="size-4 mr-1" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={() => setDeleteThreadId(thread.id)}
                  >
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarGroupContent>
        ))}
      </SidebarGroup>
      <AlertDialog
        open={deleteThreadId !== null}
        onOpenChange={() => setDeleteThreadId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              thread
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={editThreadId !== null}
        onOpenChange={() => setEditThreadId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Thread</DialogTitle>
            <DialogDescription>Edit the title of your thread</DialogDescription>
          </DialogHeader>
          <Input
            value={editThreadTitle}
            onChange={(e) => setEditThreadTitle(e.target.value)}
            placeholder="Enter new thread title"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditThreadId(null);
                setEditThreadTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SidebarContentComponent;
