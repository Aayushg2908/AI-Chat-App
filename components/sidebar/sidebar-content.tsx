"use client";

import Link from "next/link";
import { Thread } from "@prisma/client";
import { useParams } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { SidebarGroup, SidebarGroupContent } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

const SidebarContentComponent = ({ threads }: { threads: Thread[] }) => {
  const params = useParams();
  const threadId = params?.threadId as string;

  return (
    <SidebarGroup>
      {threads?.map((thread) => {
        const isActive = threadId === thread.id;

        return (
          <SidebarGroupContent
            key={thread.id}
            className={cn(
              "relative group px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors mb-2",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Link
                href={`/${thread.id}`}
                className={cn("flex-1 truncate", isActive && "font-medium")}
              >
                {thread.title}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                  <MoreHorizontal className="size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="size-4 mr-1" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer">
                    <Trash2 className="size-4 mr-1" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarGroupContent>
        );
      })}
    </SidebarGroup>
  );
};

export default SidebarContentComponent;
