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

// Mock data, replace with actual data fetching
const calculationHistory = [
  {
    id: "1",
    tanggal: "2024-07-28",
    jenisTransaksi: "Honor (Narsum, Juri, dll)",
    wajibPajak: "Orang Pribadi",
    nilai: 5000000,
    pph: 250000,
    ppn: 0,
    total: 250000,
    statusKepatuhan: "Compliant",
  },
  {
    id: "2",
    tanggal: "2024-07-27",
    jenisTransaksi: "Pembelian Barang (ATK, Komputer, Material, dll)",
    wajibPajak: "Badan Usaha",
    nilai: 3000000,
    pph: 45000,
    ppn: 330000,
    total: 375000,
    statusKepatuhan: "Compliant",
  },
  {
    id: "3",
    tanggal: "2024-07-26",
    jenisTransaksi: "Jasa Konsultasi Konstruksi",
    wajibPajak: "Badan Usaha",
    nilai: 10000000,
    pph: 350000,
    ppn: 1100000,
    total: 1450000,
    statusKepatuhan: "Needs Review",
  },
    {
    id: "4",
    tanggal: "2024-07-25",
    jenisTransaksi: "Sewa (Alat kesenian, Genset, Sound System, Kendaraan,dll)",
    wajibPajak: "Orang Pribadi",
    nilai: 1500000,
    pph: 37500,
    ppn: 0,
    total: 37500,
    statusKepatuhan: "Compliant",
  },
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

export default function AdminPage() {
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
        </CardContent>
      </Card>
    </div>
  );
}
