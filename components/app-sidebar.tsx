import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { LogInIcon, SquarePen } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <h1 className="text-[22px] font-bold">ALLIN1</h1>
        <SquarePen className="size-5 cursor-pointer" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="flex flex-row items-center justify-between border border-t">
        <div className="text-lg font-semibold ml-2">Login</div>
        <LogInIcon className="size-5 cursor-pointer mr-2" />
      </SidebarFooter>
    </Sidebar>
  );
}
