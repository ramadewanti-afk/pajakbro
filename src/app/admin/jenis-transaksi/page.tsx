
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules } from "@/data/tax-rules";
import React from 'react';

export default function JenisTransaksiPage() {
  // The list of transactions is derived directly from the master tax rules.
  // This ensures it's always in sync.
  const transactions = [...new Set(taxRules.map(rule => rule.jenisTransaksi))];

  return (
    <Card>
      <CardHeader>
        <div>
            <CardTitle>Master Data Jenis Transaksi</CardTitle>
            <CardDescription>
            Daftar ini menampilkan semua jenis transaksi unik yang ada. Untuk menambah, mengubah, atau menghapus jenis transaksi, silakan kelola melalui halaman "Master Data Aturan Pajak".
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Jenis Transaksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{transaction}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
