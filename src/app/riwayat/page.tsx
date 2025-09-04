
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Eye, History, Trash2, Home, FileWarning } from "lucide-react";
import Link from 'next/link';

// Define a type for the calculation result data for better type safety
type CalculationResult = {
    id: number;
    jenisTransaksi: string;
    nilaiTransaksi: number;
    totalPajak: number;
    createdAt: string;
};

const HISTORY_STORAGE_KEY = 'calculationHistory';

export default function RiwayatPage() {
    const router = useRouter();
    const [history, setHistory] = useState<CalculationResult[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // This ensures the code inside only runs on the client
        setIsClient(true);
        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const viewDetails = (item: CalculationResult) => {
        sessionStorage.setItem('calculationResult', JSON.stringify(item));
        router.push('/hasil');
    };

    const clearHistory = () => {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        setHistory([]);
    }
    
    const formatCurrency = (value: number) => {
        if (typeof value !== 'number') return '0';
        return new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(value);
    }
    
    const formatDate = (dateString: string) => {
         return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    }

    if (!isClient) {
        // Render nothing or a loading indicator on the server
        return null;
    }

    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center gap-3'>
                             <History className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>Riwayat Perhitungan</CardTitle>
                                <CardDescription>Daftar 50 perhitungan terakhir yang telah Anda buat.</CardDescription>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                             <Button variant="outline" asChild>
                                <Link href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Beranda
                                </Link>
                            </Button>
                           {history.length > 0 && (
                                <Button variant="destructive" onClick={clearHistory}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Hapus Riwayat
                                </Button>
                           )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {history.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Jenis Transaksi</TableHead>
                                        <TableHead>Nilai Transaksi</TableHead>
                                        <TableHead>Total Pajak</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{formatDate(item.createdAt)}</TableCell>
                                            <TableCell className="max-w-xs truncate">{item.jenisTransaksi}</TableCell>
                                            <TableCell>Rp {formatCurrency(item.nilaiTransaksi)}</TableCell>
                                            <TableCell>Rp {formatCurrency(item.totalPajak)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => viewDetails(item)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Lihat Detail
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <Alert className="bg-yellow-100 border-yellow-200">
                             <FileWarning className="h-4 w-4 text-yellow-700" />
                            <AlertTitle className="text-yellow-800">Riwayat Kosong</AlertTitle>
                            <AlertDescription className="text-yellow-700">
                                Anda belum melakukan perhitungan apapun. Kembali ke beranda untuk mulai menghitung.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
