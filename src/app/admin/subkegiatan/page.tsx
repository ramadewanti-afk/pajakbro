
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules } from "@/data/tax-rules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function SubKegiatanPage() {
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
                <TableHead>Kena PPN</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {taxRules.map((rule, index) => (
                <TableRow key={index}>
                    <TableCell className="font-medium">{rule.jenisTransaksi}</TableCell>
                    <TableCell>{rule.wp}</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{rule.jenisPajak}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{typeof rule.tarifPajak === 'number' ? `${rule.tarifPajak}%` : rule.tarifPajak}</TableCell>
                    <TableCell>
                    {rule.kenaPPN ? (
                        <Badge variant="default">Ya</Badge>
                    ) : (
                        <Badge variant="outline">Tidak</Badge>
                    )}
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
