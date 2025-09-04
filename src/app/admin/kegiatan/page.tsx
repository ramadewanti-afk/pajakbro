
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function KegiatanPage() {

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="text-primary" />
                        Manajemen Bidang/Kegiatan
                    </CardTitle>
                    <CardDescription>
                        Kelola bidang dan kegiatan di sini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">Fungsionalitas belum diimplementasikan.</p>
                </CardContent>
            </Card>
        </div>
    )
}
