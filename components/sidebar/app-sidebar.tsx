"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarFooterComponent from "./sidebar-footer";
import SidebarHeaderComponent from "./sidebar-header";
import { getUserThreads } from "@/actions";
import SidebarContentComponent from "./sidebar-content";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { useCanvas } from "@/hooks/use-canvas";
import { useEffect } from "react";

export function AppSidebar() {
  const { isOpen } = useCanvas();
  const { data: session, isPending } = useSession();
  const { toggleSidebar, state } = useSidebar();

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ["get-user-threads"],
    queryFn: async () => {
      const response = await getUserThreads();
      if (response.success) {
        return response.data;
      }
      return [];
    },
  });

  useEffect(() => {
    if (isOpen && state === "expanded") {
      toggleSidebar();
    }
  }, [isOpen]);

  return (
    <Sidebar hidden={isOpen}>
      <SidebarHeader>
        <SidebarHeaderComponent threads={threads} />
      </SidebarHeader>
      <SidebarContent className="mt-8 scrollbar-hide">
        <SidebarContentComponent threads={threads} isLoading={isLoading} />
      </SidebarContent>
      <SidebarFooter className="border border-t">
        <SidebarFooterComponent session={session?.user} isPending={isPending} />
      </SidebarFooter>
    </Sidebar>
  );
}
