
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
import { History, Loader2 } from "lucide-react";
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

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

const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function AdminPage() {
    const [calculationHistory, setCalculationHistory] = useState<CalculationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchHistory(currentUser.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchHistory = async (uid: string) => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "pajakHistory"), 
                where("userId", "==", uid),
                orderBy("tanggal", "desc")
            );
            const querySnapshot = await getDocs(q);
            const history: CalculationHistory[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                history.push({
                    id: doc.id,
                    tanggal: formatDate(data.tanggal),
                    jenisTransaksi: data.jenisTransaksi,
                    wajibPajak: data.wajibPajak,
                    nilai: data.nilai,
                    pph: data.pph,
                    ppn: data.ppn,
                    total: data.total,
                    statusKepatuhan: data.statusKepatuhan
                });
            });
            setCalculationHistory(history);
        } catch (e) {
            console.error("Failed to load history from Firestore", e);
        } finally {
            setLoading(false);
        }
    };


  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="text-primary" />
            Riwayat Perhitungan Pajak
          </CardTitle>
          <CardDescription>
            Berikut adalah daftar perhitungan pajak yang telah Anda lakukan.
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
