"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarFooterComponent from "./sidebar-footer";
import SidebarHeaderComponent from "./sidebar-header";
import { getUserThreads } from "@/actions";
import SidebarContentComponent from "./sidebar-content";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";

export function AppSidebar() {
  const { data: session, isPending } = useSession();

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

  return (
    <Sidebar>
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
