
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules as initialTaxRules, Transaction } from "@/data/tax-rules";
import { transactionTypes } from "@/data/transaction-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontal, PlusCircle, Pencil, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import React from 'react';
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Form Dialog Component
const RuleFormDialog = ({
  isOpen,
  setIsOpen,
  onSave,
  rule,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (rule: Transaction) => void;
  rule: Partial<Transaction> | null;
}) => {
  const [formData, setFormData] = React.useState<Partial<Transaction>>({});

  React.useEffect(() => {
    if (isOpen) {
      if (rule) {
        setFormData(rule);
      } else {
        // Set defaults for a new rule
        setFormData({
          jenisTransaksi: "",
          wp: "Orang Pribadi",
          fakturPajak: "N/A",
          asn: "N/A",
          golongan: "N/A",
          sertifikatKonstruksi: "N/A",
          ptkp: "0",
          jenisPajak: "",
          kodePajak: "",
          dppRatio: "100/100",
          tarifPajak: "0%",
          kenaPPN: false,
          kodeKapPpn: "-",
          status: "Aktif",
        });
      }
    }
  }, [isOpen, rule]);

  const handleChange = (field: keyof Transaction, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData as Transaction);
    setIsOpen(false);
  };
  
  if (!isOpen) return null;

  return (
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule?.id ? 'Edit Aturan Pajak' : 'Tambah Aturan Pajak'}</DialogTitle>
          <DialogDescription>
            {rule?.id ? 'Ubah detail aturan pajak di bawah ini.' : 'Isi detail untuk aturan pajak baru.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-2">
            {/* Kondisi Aturan */}
            <div className="space-y-4">
                <h4 className="text-md font-semibold text-primary">Kondisi Aturan (Pemicu)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                    <div className="space-y-1.5">
                        <Label>Jika Jenis Transaksi adalah...</Label>
                        <Select value={formData.jenisTransaksi} onValueChange={(v) => handleChange('jenisTransaksi', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Jenis Transaksi" /></SelectTrigger>
                            <SelectContent>
                                {transactionTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1.5">
                        <Label>dan Wajib Pajak (WP) adalah...</Label>
                        <Select value={formData.wp} onValueChange={(v) => handleChange('wp', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih WP" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Orang Pribadi">Orang Pribadi</SelectItem>
                                <SelectItem value="Badan Usaha">Badan Usaha</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>dan Faktur Pajak...</Label>
                        <Select value={formData.fakturPajak} onValueChange={(v) => handleChange('fakturPajak', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Opsi Faktur" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A">Tidak Ada</SelectItem>
                                <SelectItem value="Punya">Punya</SelectItem>
                                <SelectItem value="Tidak Punya">Tidak Punya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>dan Statusnya...</Label>
                        <Select value={formData.asn} onValueChange={(v) => handleChange('asn', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Status ASN" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A">Tidak Ada</SelectItem>
                                <SelectItem value="ASN">ASN</SelectItem>
                                <SelectItem value="NON ASN">NON ASN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>dan Golongannya...</Label>
                        <Select value={formData.golongan} onValueChange={(v) => handleChange('golongan', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Golongan" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A">Tidak Ada</SelectItem>
                                <SelectItem value="I">I</SelectItem>
                                <SelectItem value="II">II</SelectItem>
                                <SelectItem value="III">III</SelectItem>
                                <SelectItem value="IV">IV</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1.5">
                        <Label>dan Sertifikat Konstruksi...</Label>
                        <Select value={formData.sertifikatKonstruksi} onValueChange={(v) => handleChange('sertifikatKonstruksi', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Opsi Sertifikat" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N/A">Tidak Ada</SelectItem>
                                <SelectItem value="Punya">Punya</SelectItem>
                                <SelectItem value="Tidak Punya">Tidak Punya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5 col-span-full">
                        <Label>dan Nilai Transaksi (PTKP)...</Label>
                        <Input
                            value={formData.ptkp || ''}
                            onChange={(e) => handleChange('ptkp', e.target.value)}
                            placeholder="Contoh: >2000000 atau 0-450000"
                        />
                    </div>
                </div>
            </div>

            <Separator />
            
            {/* Hasil Perhitungan */}
            <div className="space-y-4">
                <h4 className="text-md font-semibold text-primary">Hasil Perhitungan (Aksi)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg">
                    <div className="space-y-1.5">
                        <Label>Maka Jenis Pajak yang berlaku adalah...</Label>
                        <Select value={formData.jenisPajak} onValueChange={(v) => handleChange('jenisPajak', v)}>
                            <SelectTrigger><SelectValue placeholder="Pilih Jenis Pajak" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PPh 21">PPh 21</SelectItem>
                                <SelectItem value="PPh 22">PPh 22</SelectItem>
                                <SelectItem value="PPh 23">PPh 23</SelectItem>
                                <SelectItem value="Pasal 4 ayat 2">Pasal 4 ayat 2</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Kode Pajak PPh</Label>
                        <Input value={formData.kodePajak} onChange={(e) => handleChange('kodePajak', e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>DPP Rasio</Label>
                        <Input value={formData.dppRatio} onChange={(e) => handleChange('dppRatio', e.target.value)} placeholder="Contoh: 100/111 atau 100/100" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Tarif Pajak</Label>
                        <Input value={String(formData.tarifPajak || '')} onChange={(e) => handleChange('tarifPajak', e.target.value)} placeholder="Contoh: 2.5% atau 0%" />
                    </div>
                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm col-span-full">
                        <div className="space-y-0.5">
                            <Label>Dikenakan PPN?</Label>
                            <p className="text-xs text-muted-foreground">Aktifkan jika transaksi ini dikenai PPN.</p>
                        </div>
                        <Switch
                            checked={formData.kenaPPN}
                            onCheckedChange={(c) => handleChange('kenaPPN', c)}
                        />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Kode Pajak PPN</Label>
                        <Input value={formData.kodeKapPpn} onChange={(e) => handleChange('kodeKapPpn', e.target.value)} placeholder="Isi jika kena PPN" />
                    </div>
                </div>
            </div>

             <Separator />

            {/* Status Aturan */}
            <div className="space-y-4">
                 <h4 className="text-md font-semibold text-primary">Status Aturan</h4>
                 <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <Label>Status</Label>
                        <p className="text-xs text-muted-foreground">
                            {formData.status === 'Aktif' ? 'Aturan ini aktif dan akan digunakan dalam perhitungan.' : 'Aturan ini tidak aktif dan diabaikan.'}
                        </p>
                    </div>
                    <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                        <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aktif">Aktif</SelectItem>
                            <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                        </SelectContent>
                    </Select>
                 </div>
            </div>
        </div>

        <DialogFooter className="pt-4 border-t">
            <DialogClose asChild>
                <Button variant="outline">Batal</Button>
            </DialogClose>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default function AturanPajakPage() {
  const [rules, setRules] = useLocalStorage<Transaction[]>("taxRules", initialTaxRules);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<Transaction | null>(null);


  const toggleStatus = (idToToggle: number) => {
    setRules(currentRules =>
      currentRules.map((rule) =>
        rule.id === idToToggle
          ? { ...rule, status: rule.status === "Aktif" ? "Tidak Aktif" : "Aktif" }
          : rule
      )
    );
  };

  const handleEdit = (rule: Transaction) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };
  
  const handleAddNew = () => {
      setEditingRule(null);
      setIsDialogOpen(true);
  }

  const handleDelete = (idToDelete: number) => {
      setRules(currentRules => currentRules.filter((rule) => rule.id !== idToDelete));
  }

  const handleSaveRule = (ruleToSave: Partial<Transaction>) => {
    if (ruleToSave.id) {
        // Update existing rule
        setRules(currentRules => currentRules.map(r => r.id === ruleToSave.id ? {...r, ...ruleToSave} as Transaction : r));
    } else {
        // Add new rule
        const newRule = { ...ruleToSave, id: Date.now() } as Transaction; // Use timestamp for unique ID
        setRules(currentRules => [...currentRules, newRule]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
              <CardTitle>Master Data Aturan Pajak</CardTitle>
              <CardDescription>
              Daftar semua aturan pajak yang digunakan dalam kalkulator.
              </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
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
                  {rules.map((rule) => (
                  <TableRow key={rule.id}>
                      <TableCell className="font-medium max-w-xs truncate">{rule.jenisTransaksi}</TableCell>
                      <TableCell>{rule.wp}</TableCell>
                      <TableCell>
                          <Badge variant="secondary">{rule.jenisPajak}</Badge>
                      </TableCell>
                      <TableCell className="font-mono">{rule.tarifPajak}</TableCell>
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
                                  <DropdownMenuItem onClick={() => handleEdit(rule)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toggleStatus(rule.id)}>
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
                                  <DropdownMenuItem onClick={() => handleDelete(rule.id)} className="text-red-600">
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
      <RuleFormDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSaveRule}
        rule={editingRule}
      />
    </>
  );
}
