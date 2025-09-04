
"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { ListTree } from "lucide-react";

export default function SubKegiatanPage() {

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListTree className="text-primary" />
                        Manajemen Sub Kegiatan
                    </CardTitle>
                    <CardDescription>
                        Kelola sub kegiatan di sini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">Fungsionalitas belum diimplementasikan.</p>
                </CardContent>
            </Card>
        </div>
    )
}
