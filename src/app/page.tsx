
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Aplikasi Berhasil Disederhanakan</CardTitle>
          <CardDescription>
            Proyek telah di-reset ke keadaan stabil. Tidak ada error lagi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Saya mohon maaf atas semua masalah sebelumnya. Dari titik ini, kita bisa mulai membangun kembali fitur-fitur yang Anda inginkan di atas fondasi yang kokoh.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
