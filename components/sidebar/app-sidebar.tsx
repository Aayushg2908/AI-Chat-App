import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarFooterComponent from "./sidebar-footer";
import SidebarHeaderComponent from "./sidebar-header";
import { getUserThreads } from "@/actions";
import { Thread } from "@prisma/client";
import SidebarContentComponent from "./sidebar-content";

export async function AppSidebar() {
  const response = await getUserThreads();
  let threads: Thread[] = [];
  if (response.success) {
    threads = response.data;
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderComponent threads={threads} />
      </SidebarHeader>
      <SidebarContent className="mt-10 scrollbar-hide">
        <SidebarContentComponent threads={threads} />
      </SidebarContent>
      <SidebarFooter className="border border-t">
        <SidebarFooterComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
