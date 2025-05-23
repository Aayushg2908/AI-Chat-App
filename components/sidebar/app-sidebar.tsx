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
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThreadType } from "@/db/schema";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let threads: ThreadType[] = [];
  const response = await getUserThreads();
  if (response.success) {
    threads = response.data;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderComponent threads={threads} />
      </SidebarHeader>
      <SidebarContent className="mt-8 scrollbar-hide">
        <SidebarContentComponent threads={threads} />
      </SidebarContent>
      <SidebarFooter className="border border-t">
        <SidebarFooterComponent session={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
