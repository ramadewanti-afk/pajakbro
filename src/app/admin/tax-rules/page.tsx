
"use client";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, MoreHorizontal, PlusCircle } from "lucide-react";

// Mock data based on the provided image
const taxRules = [
    { id: 1, jenisTransaksi: 'cek', wp: 'Tidak ada', jenisPajak: 'Belum diatur', tarif: '0%', kenaPpn: 'TIDAK', status: 'NON-AKTIF' },
    { id: 2, jenisTransaksi: 'Service Kendaraan, AC, Laptop, dll - <2jt', wp: 'Tidak ada', jenisPajak: 'Belum diatur', tarif: '0%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 3, jenisTransaksi: 'Makan Minum', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '2,5%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 4, jenisTransaksi: 'Service Kendaraan, AC, Laptop, dll - >2jt', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '2,5%', kenaPpn: 'YA', status: 'AKTIF' },
    { id: 5, jenisTransaksi: 'Sewa (Alat kesenian, Genset, Sound System, Kendaraan,dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '2,5%', kenaPpn: 'YA', status: 'AKTIF' },
    { id: 6, jenisTransaksi: 'Fotokopi/Cetak banner,dll', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '2,5%', kenaPpn: 'YA', status: 'AKTIF' },
    { id: 7, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '15%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 8, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '5%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 9, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '0%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 10, jenisTransaksi: 'Jasa Pentas Seni (Tari, Wayang, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '2,5%', kenaPpn: 'YA', status: 'AKTIF' },
    { id: 11, jenisTransaksi: 'Tukang Harian (Pekerja lepas)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '0%', kenaPpn: 'TIDAK', status: 'AKTIF' },
    { id: 12, jenisTransaksi: 'Tukang Harian (Pekerja lepas)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: '0,5%', kenaPpn: 'TIDAK', status: 'AKTIF' },
];


export default function TaxRulesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Database className="text-primary" />
                    Data Aturan Pajak
                </CardTitle>
                <CardDescription>
                    Kelola semua aturan perhitungan pajak. Perubahan akan disimpan secara lokal.
                </CardDescription>
            </div>
            <Button>
                <PlusCircle className="mr-2" />
                Tambah Aturan Pajak
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis Transaksi</TableHead>
                  <TableHead>WP</TableHead>
                  <TableHead>Jenis Pajak</TableHead>
                  <TableHead className="text-center">Tarif</TableHead>
                  <TableHead className="text-center">Kena PPN</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium max-w-xs truncate">{rule.jenisTransaksi}</TableCell>
                    <TableCell>{rule.wp}</TableCell>
                    <TableCell>{rule.jenisPajak}</TableCell>
                    <TableCell className="text-center">{rule.tarif}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={rule.kenaPpn === 'YA' ? 'default' : 'secondary'}>{rule.kenaPpn}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rule.status === 'AKTIF' ? 'default' : 'destructive'}>
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Non-aktifkan</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
