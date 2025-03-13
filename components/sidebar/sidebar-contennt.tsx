"use client";

import Link from "next/link";
import { Thread } from "@prisma/client";
import { SidebarGroup, SidebarGroupContent } from "../ui/sidebar";

const SidebarContentComponent = ({ threads }: { threads: Thread[] }) => {
  return (
    <SidebarGroup>
      {threads?.map((thread) => (
        <SidebarGroupContent key={thread.id}>
          <Link
            href={`/${thread.id}`}
            className="flex items-center justify-between"
          >
            {thread.title}
          </Link>
        </SidebarGroupContent>
      ))}
    </SidebarGroup>
  );
};

export default SidebarContentComponent;
