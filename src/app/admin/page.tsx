
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ListTree } from "lucide-react";

export default function AdminPage() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <ShieldCheck className="h-10 w-10 text-primary" />
          Dasbor Admin
        </h1>
        <p className="text-gray-500 mt-2">Selamat datang! Kelola data aplikasi dari sini.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTree className="h-6 w-6 text-primary" />
              Manajemen Data Master
            </CardTitle>
            <CardDescription>
              Kelola data master untuk jenis transaksi dan aturan pajak.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/subkegiatan" passHref>
              <Button className="w-full">
                Buka Pengaturan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        {/* You can add more cards here for other admin sections */}
      </div>
    </div>
  );
}
