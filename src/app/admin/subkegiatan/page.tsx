
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules } from "@/data/tax-rules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import React from 'react';

export default function SubKegiatanPage() {
  // In a real app, this state would be managed via API calls
  const [rules, setRules] = React.useState(taxRules);

  const toggleStatus = (indexToToggle: number) => {
    setRules(currentRules =>
      currentRules.map((rule, index) =>
        index === indexToToggle
          ? { ...rule, status: rule.status === "Aktif" ? "Tidak Aktif" : "Aktif" }
          : rule
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Master Data Aturan Pajak</CardTitle>
            <CardDescription>
            Daftar semua aturan pajak yang digunakan dalam kalkulator.
            </CardDescription>
        </div>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Aturan
        </Button>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Jenis Transaksi</TableHead>
                <TableHead>Wajib Pajak</TableHead>
                <TableHead>Jenis Pajak</TableHead>
                <TableHead>Tarif</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rules.map((rule, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{rule.jenisTransaksi}</TableCell>
                    <TableCell>{rule.wp}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{rule.jenisPajak}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{typeof rule.tarifPajak === 'number' ? `${rule.tarifPajak}%` : rule.tarifPajak}</TableCell>
                    <TableCell>
                      {rule.status === 'Aktif' ? (
                          <Badge variant="default">Aktif</Badge>
                      ) : (
                          <Badge variant="destructive">Tidak Aktif</Badge>
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
                                <DropdownMenuItem>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleStatus(index)}>
                                    {rule.status === 'Aktif' ? (
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
