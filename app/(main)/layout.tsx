import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default MainLayout;
