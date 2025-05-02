import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarTriggerComponent from "./sidebar-trigger";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        <SidebarTriggerComponent />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
