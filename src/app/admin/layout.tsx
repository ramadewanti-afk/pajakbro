
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListTree, LogOut, ShieldCheck, BookType, Briefcase, ClipboardList } from "lucide-react";
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin"
                  isActive={pathname === '/admin'}
                >
                  <LayoutDashboard />
                  Dasbor
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/bidang"
                  isActive={pathname === '/admin/bidang'}
                >
                  <Briefcase />
                  Manajemen Bidang/Bagian
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/kegiatan"
                  isActive={pathname === '/admin/kegiatan'}
                >
                  <ClipboardList />
                  Manajemen Subkegiatan
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/subkegiatan"
                  isActive={pathname === '/admin/subkegiatan'}
                >
                  <ListTree />
                  Master Data Aturan Pajak
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  href="/admin/jenis-transaksi"
                  isActive={pathname === '/admin/jenis-transaksi'}
                >
                  <BookType />
                  Jenis Transaksi
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/')}>
                <LogOut />
                <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
            <header className="p-4 border-b md:hidden">
                 <SidebarTrigger />
            </header>
          <main className="p-4 md:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
