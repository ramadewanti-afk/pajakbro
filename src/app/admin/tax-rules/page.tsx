
"use client";

import { useState } from "react";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, MoreHorizontal, PlusCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Mock data based on the provided image
const initialTaxRules = [
    { id: 1, jenisTransaksi: 'cek', wp: 'Tidak ada', jenisPajak: 'Belum diatur', tarif: 0, kenaPpn: false, status: 'NON-AKTIF' },
    { id: 2, jenisTransaksi: 'Service Kendaraan, AC, Laptop, dll - <2jt', wp: 'Tidak ada', jenisPajak: 'Belum diatur', tarif: 0, kenaPpn: false, status: 'AKTIF' },
    { id: 3, jenisTransaksi: 'Makan Minum', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 2.5, kenaPpn: false, status: 'AKTIF' },
    { id: 4, jenisTransaksi: 'Service Kendaraan, AC, Laptop, dll - >2jt', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 2.5, kenaPpn: true, status: 'AKTIF' },
    { id: 5, jenisTransaksi: 'Sewa (Alat kesenian, Genset, Sound System, Kendaraan,dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 2.5, kenaPpn: true, status: 'AKTIF' },
    { id: 6, jenisTransaksi: 'Fotokopi/Cetak banner,dll', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 2.5, kenaPpn: true, status: 'AKTIF' },
    { id: 7, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 15, kenaPpn: false, status: 'AKTIF' },
    { id: 8, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 5, kenaPpn: false, status: 'AKTIF' },
    { id: 9, jenisTransaksi: 'Honor (Narsum, Juri, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 0, kenaPpn: false, status: 'AKTIF' },
    { id: 10, jenisTransaksi: 'Jasa Pentas Seni (Tari, Wayang, dll)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 2.5, kenaPpn: true, status: 'AKTIF' },
    { id: 11, jenisTransaksi: 'Tukang Harian (Pekerja lepas)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 0, kenaPpn: false, status: 'AKTIF' },
    { id: 12, jenisTransaksi: 'Tukang Harian (Pekerja lepas)', wp: 'Orang Pribadi', jenisPajak: 'PPh 21', tarif: 0.5, kenaPpn: false, status: 'AKTIF' },
];

type TaxRule = typeof initialTaxRules[0];


function TaxRuleForm({ rule, onSave, children }: { rule?: TaxRule | null, onSave: (rule: Omit<TaxRule, 'id'>) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Omit<TaxRule, 'id'>>({
        jenisTransaksi: rule?.jenisTransaksi || '',
        wp: rule?.wp || 'Tidak ada',
        jenisPajak: rule?.jenisPajak || 'Belum diatur',
        tarif: rule?.tarif || 0,
        kenaPpn: rule?.kenaPpn || false,
        status: rule?.status || 'AKTIF',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = () => {
        onSave(formData);
        setOpen(false);
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{rule ? 'Edit Aturan Pajak' : 'Tambah Aturan Pajak'}</DialogTitle>
                    <DialogDescription>
                        Isi detail aturan pajak. Klik simpan jika sudah selesai.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="jenisTransaksi" className="text-right">Jenis Transaksi</Label>
                        <Input id="jenisTransaksi" name="jenisTransaksi" value={formData.jenisTransaksi} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wp" className="text-right">Wajib Pajak (WP)</Label>
                        <Select name="wp" value={formData.wp} onValueChange={(value) => handleSelectChange('wp', value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih WP" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Orang Pribadi">Orang Pribadi</SelectItem>
                                <SelectItem value="Badan Usaha">Badan Usaha</SelectItem>
                                <SelectItem value="Tidak ada">Tidak ada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="jenisPajak" className="text-right">Jenis Pajak</Label>
                         <Select name="jenisPajak" value={formData.jenisPajak} onValueChange={(value) => handleSelectChange('jenisPajak', value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih Jenis Pajak" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PPh 21">PPh 21</SelectItem>
                                <SelectItem value="PPh 22">PPh 22</SelectItem>
                                <SelectItem value="PPh 23">PPh 23</SelectItem>
                                <SelectItem value="PPh Final">PPh Final</SelectItem>
                                <SelectItem value="Belum diatur">Belum diatur</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tarif" className="text-right">Tarif (%)</Label>
                        <Input id="tarif" name="tarif" type="number" value={formData.tarif} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="kenaPpn" className="text-right">Kena PPN</Label>
                        <Switch id="kenaPpn" name="kenaPpn" checked={formData.kenaPpn} onCheckedChange={(checked) => handleSwitchChange('kenaPpn', checked)} />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                         <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AKTIF">AKTIF</SelectItem>
                                <SelectItem value="NON-AKTIF">NON-AKTIF</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function TaxRulesPage() {
    const [taxRules, setTaxRules] = useState<TaxRule[]>(initialTaxRules);

    const handleAddRule = (newRuleData: Omit<TaxRule, 'id'>) => {
        const newRule: TaxRule = {
            id: Math.max(...taxRules.map(r => r.id), 0) + 1, // simple ID generation
            ...newRuleData,
        };
        setTaxRules(prev => [...prev, newRule]);
    };

    const handleEditRule = (editedRule: TaxRule) => {
        setTaxRules(prev => prev.map(rule => rule.id === editedRule.id ? editedRule : rule));
    };

    const handleToggleStatus = (ruleToToggle: TaxRule) => {
        const updatedRule = {
            ...ruleToToggle,
            status: ruleToToggle.status === 'AKTIF' ? 'NON-AKTIF' : 'AKTIF',
        };
        handleEditRule(updatedRule);
    };

    const handleDeleteRule = (idToDelete: number) => {
        setTaxRules(prev => prev.filter(rule => rule.id !== idToDelete));
    };

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
                    Kelola semua aturan perhitungan pajak.
                </CardDescription>
            </div>
            <TaxRuleForm onSave={handleAddRule}>
                 <Button>
                    <PlusCircle className="mr-2" />
                    Tambah Aturan Pajak
                </Button>
            </TaxRuleForm>
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
                    <TableCell className="text-center">{rule.tarif}%</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={rule.kenaPpn ? 'default' : 'secondary'}>{rule.kenaPpn ? 'YA' : 'TIDAK'}</Badge>
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
                                <TaxRuleForm 
                                    rule={rule} 
                                    onSave={(editedData) => handleEditRule({ ...rule, ...editedData })}
                                >
                                    <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                        Edit
                                    </button>
                                </TaxRuleForm>
                                <DropdownMenuItem onClick={() => handleToggleStatus(rule)}>
                                    {rule.status === 'AKTIF' ? 'Non-aktifkan' : 'Aktifkan'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                 <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive">
                                            Hapus
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aksi ini tidak dapat dibatalkan. Aturan pajak akan terhapus secara permanen.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteRule(rule.id)} className="bg-destructive hover:bg-destructive/90">
                                            Ya, Hapus
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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

