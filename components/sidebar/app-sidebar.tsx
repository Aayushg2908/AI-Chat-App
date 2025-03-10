import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarFooterComponent from "./sidebar-footer";
import SidebarHeaderComponent from "./sidebar-header";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderComponent />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border border-t">
        <SidebarFooterComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
