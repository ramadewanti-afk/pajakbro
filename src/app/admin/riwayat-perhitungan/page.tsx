
"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, ToggleLeft, ToggleRight, Trash2, History } from "lucide-react";
import { calculationHistory, CalculationResult } from "@/data/history";

export default function RiwayatPerhitunganPage() {
  const router = useRouter();
  const [history, setHistory] = useState<CalculationResult[]>(calculationHistory);

  const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('id-ID', { useGrouping: false }).format(value);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  }
  
  const viewDetails = (item: CalculationResult) => {
    sessionStorage.setItem('calculationResult', JSON.stringify(item));
    router.push('/hasil');
  };

  const toggleStatus = (idToToggle: number) => {
    setHistory(currentHistory =>
      currentHistory.map(item =>
        item.id === idToToggle
          ? { ...item, status: item.status === "Aktif" ? "Tidak Aktif" : "Aktif" }
          : item
      )
    );
  };
  
  const handleDelete = (idToDelete: number) => {
      const index = calculationHistory.findIndex(item => item.id === idToDelete);
      if (index > -1) {
          calculationHistory.splice(index, 1);
          setHistory([...calculationHistory]);
      }
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <History className="h-6 w-6" />
            <div>
                <CardTitle>Riwayat Perhitungan</CardTitle>
                <CardDescription>Kelola semua riwayat perhitungan yang dibuat oleh pengguna.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Jenis Transaksi</TableHead>
                <TableHead>Nilai Transaksi</TableHead>
                <TableHead>Total Pajak</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.sort((a, b) => b.id - a.id).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">#{String(item.id).slice(-6)}</TableCell>
                  <TableCell className="font-medium max-w-xs truncate">{item.jenisTransaksi}</TableCell>
                  <TableCell>Rp {formatCurrency(item.nilaiTransaksi)}</TableCell>
                  <TableCell>Rp {formatCurrency(item.totalPajak)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                     {item.status === 'Aktif' ? (
                        <Badge variant="default">Aktif</Badge>
                    ) : (
                        <Badge variant="destructive">Nonaktif</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewDetails(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Lihat Detail</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(item.id)}>
                            {item.status === 'Aktif' ? (
                                <>
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                    <span>Nonaktifkan</span>
                                </>
                            ) : (
                                <>
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                    <span>Aktifkan</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus Permanen</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         {history.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
                Belum ada riwayat perhitungan yang tersimpan.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
