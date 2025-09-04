
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules } from "@/data/tax-rules";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import React from 'react';

export default function JenisTransaksiPage() {
  const [transactions, setTransactions] = React.useState([...new Set(taxRules.map(rule => rule.jenisTransaksi))]);

  const handleDelete = (transactionToDelete: string) => {
    setTransactions(currentTransactions =>
      currentTransactions.filter(transaction => transaction !== transactionToDelete)
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Master Data Jenis Transaksi</CardTitle>
            <CardDescription>
            Kelola jenis transaksi yang tersedia di kalkulator pajak.
            </CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Jenis Transaksi
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nama Jenis Transaksi</TableHead>
                <TableHead className="w-[100px] text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{transaction}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(transaction)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
