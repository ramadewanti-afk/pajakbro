
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calculationHistory as initialHistory, CalculationResult } from "@/data/history";
import { ArrowLeft, ArrowRight, History, Search, FileWarning, Badge } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";

// Function to format currency
const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return 'Rp 0';
    const roundedValue = Math.round(value);
    return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(roundedValue);
}

// Function to format date
const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
}


export default function RiwayatPage() {
  const router = useRouter();
  const [calculationHistory] = useLocalStorage<CalculationResult[]>("calculationHistory", initialHistory);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    sessionStorage.removeItem('calculationResult');
  }, []);

  const filteredHistory = useMemo(() => {
    const activeHistory = calculationHistory.filter(item => item.status === 'Aktif').sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    if (!searchTerm) return activeHistory;
    return activeHistory.filter(item =>
        String(item.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisTransaksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(item.nilaiTransaksi).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [calculationHistory, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
  }

  const viewHistoryDetails = (item: CalculationResult) => {
    sessionStorage.setItem('calculationResult', JSON.stringify(item));
    router.push('/hasil');
  };


  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">

        <header className="mb-8">
            <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Kalkulator
            </Button>
            <div className="flex items-center gap-3">
                <History className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Semua Riwayat Perhitungan
                    </h1>
                    <p className="text-muted-foreground">
                        Lihat dan cari semua perhitungan yang pernah Anda simpan.
                    </p>
                </div>
            </div>
        </header>

        <Card>
            <CardHeader>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari ID, jenis, atau nilai transaksi..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={handleSearchChange}
                     />
                </div>
            </CardHeader>
            <CardContent>
                {filteredHistory.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Transaksi</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Transaksi</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Pajak</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Lihat</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-primary">#{item.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">{item.jenisTransaksi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.nilaiTransaksi)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.totalPajak)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button variant="outline" size="sm" onClick={() => viewHistoryDetails(item)}>
                                                Lihat Detail
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                     <Alert>
                         <FileWarning className="h-4 w-4" />
                        <AlertTitle>{searchTerm ? "Tidak Ditemukan" : "Riwayat Kosong"}</AlertTitle>
                        <AlertDescription>
                            {searchTerm ? `Tidak ada riwayat yang cocok dengan pencarian "${searchTerm}".` : "Anda belum melakukan perhitungan apapun. Hasil akan muncul di sini."}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
