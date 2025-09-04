import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, History } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h2 className="font-semibold text-lg group-data-[collapsible=icon]:hidden">
              Admin Panel
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Riwayat Perhitungan">
                  <Link href="/admin">
                    <History />
                    <span>Riwayat Perhitungan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Kalkulator">
                  <Link href="/">
                    <Home />
                    <span>Kalkulator</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
