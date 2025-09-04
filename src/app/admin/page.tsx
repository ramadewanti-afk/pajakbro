"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";

const HISTORY_KEY = 'pajakBroHistory';

interface CalculationHistory {
    id: string;
    tanggal: string;
    jenisTransaksi: string;
    wajibPajak: string;
    nilai: number;
    pph: number;
    ppn: number;
    total: number;
    statusKepatuhan: string;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

export default function AdminPage() {
    const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);

    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                setCalculationHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from local storage", e);
        }
    }, []);


  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="text-primary" />
            Riwayat Perhitungan Pajak
          </CardTitle>
          <CardDescription>
            Berikut adalah daftar perhitungan pajak yang telah dilakukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calculationHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis Transaksi</TableHead>
                  <TableHead>Wajib Pajak</TableHead>
                  <TableHead className="text-right">Nilai</TableHead>
                  <TableHead className="text-right">PPh</TableHead>
                  <TableHead className="text-right">PPN</TableHead>
                  <TableHead className="text-right">Total Pajak</TableHead>
                  <TableHead className="text-center">Kepatuhan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculationHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.jenisTransaksi}</TableCell>
                    <TableCell>{item.wajibPajak}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.nilai)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.pph)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.ppn)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.statusKepatuhan === 'Compliant' ? 'default' : 'destructive'}>
                        {item.statusKepatuhan}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground mt-4">Belum ada riwayat perhitungan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    