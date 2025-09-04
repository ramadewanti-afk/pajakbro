
"use client";

import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, History, LogOut, Loader2, Database, ClipboardList, ListTree, LayoutList } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login');
      } else {
        setAuthLoaded(true);
      }
    });
    return () => unsubscribe();
  }, [router]);


  const handleLogout = async () => {
    await auth.signOut();
    router.replace('/login');
  };
  
  if (!authLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                <SidebarMenuButton asChild tooltip="Data Aturan Pajak">
                  <Link href="/admin/tax-rules">
                    <Database />
                    <span>Data Aturan Pajak</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manajemen Bidang/Kegiatan">
                  <Link href="/admin/kegiatan">
                    <ClipboardList />
                    <span>Manajemen Bidang/Kegiatan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manajemen Sub Kegiatan">
                  <Link href="/admin/subkegiatan">
                    <ListTree />
                    <span>Manajemen Sub Kegiatan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manajemen Jenis Transaksi">
                  <Link href="/admin/jenis-transaksi">
                    <LayoutList />
                    <span>Manajemen Jenis Transaksi</span>
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
               <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
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
