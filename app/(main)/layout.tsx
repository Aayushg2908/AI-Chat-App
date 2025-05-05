import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarTriggerComponent from "./sidebar-trigger";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./sign-out-button";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    process.env.APP_ACCESS &&
    !process.env.APP_ACCESS.includes(session?.user?.email || "")
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-sm text-muted-foreground">
          You do not have access to this application. Please contact the admin
          for granting you access to this application.
        </p>
        <SignOutButton />
      </div>
    );
  }

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
