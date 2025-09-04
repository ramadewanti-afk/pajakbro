
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function PengaturanPage() {
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-md">
                 <Settings className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Pengaturan Aplikasi</CardTitle>
                <CardDescription>Atur konfigurasi umum dan preferensi aplikasi di sini.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center text-center border-2 border-dashed rounded-lg p-12 min-h-[400px]">
            <h3 className="text-xl font-semibold">Fitur Dalam Pengembangan</h3>
            <p className="text-muted-foreground mt-2">
                Halaman untuk pengaturan umum aplikasi akan segera tersedia.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
