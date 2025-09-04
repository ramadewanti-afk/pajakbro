
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { taxRules, Transaction } from "@/data/tax-rules";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, PlusCircle, Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import React from 'react';

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
    if (isOpen && rule) {
      setFormData(rule);
    } else if (isOpen && !rule) {
      // Set defaults for a new rule
      setFormData({
        jenisTransaksi: "",
        wp: "Orang Pribadi",
        fakturPajak: "N/A",
        asn: "N/A",
        golongan: "N/A",
        sertifikatKonstruksi: "N/A",
        jenisPajak: "",
        kodePajak: "",
        ptkp: "N/A",
        tarifPajak: "",
        kenaPPN: false,
        status: "Aktif",
      });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{rule?.jenisTransaksi ? 'Edit Aturan Pajak' : 'Tambah Aturan Pajak'}</DialogTitle>
          <DialogDescription>
            {rule?.jenisTransaksi ? 'Perbarui detail aturan pajak di bawah ini.' : 'Isi detail untuk aturan pajak baru.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jenisTransaksi" className="text-right">
              Jenis Transaksi
            </Label>
            <Input
              id="jenisTransaksi"
              value={formData.jenisTransaksi || ''}
              onChange={(e) => handleChange('jenisTransaksi', e.target.value)}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label className="text-right">Wajib Pajak</Label>
              <Select value={formData.wp} onValueChange={(v) => handleChange('wp', v)}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih WP" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="Orang Pribadi">Orang Pribadi</SelectItem>
                      <SelectItem value="Badan Usaha">Badan Usaha</SelectItem>
                  </SelectContent>
              </Select>
           </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="jenisPajak" className="text-right">
              Jenis Pajak
            </Label>
             <Select value={formData.jenisPajak} onValueChange={(v) => handleChange('jenisPajak', v)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Jenis Pajak" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="PPh 21">PPh 21</SelectItem>
                    <SelectItem value="PPh 22">PPh 22</SelectItem>
                    <SelectItem value="PPh 23">PPh 23</SelectItem>
                    <SelectItem value="Pasal 4 ayat 2">Pasal 4 ayat 2</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tarifPajak" className="text-right">
              Tarif Pajak
            </Label>
            <Input
              id="tarifPajak"
              value={String(formData.tarifPajak || '')}
              onChange={(e) => handleChange('tarifPajak', e.target.value)}
              className="col-span-3"
              placeholder="Contoh: 2.5% atau 0"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="kenaPPN" className="text-right">Kena PPN</Label>
             <Switch
                id="kenaPPN"
                checked={formData.kenaPPN}
                onCheckedChange={(c) => handleChange('kenaPPN', c)}
             />
           </div>
        </div>
        <DialogFooter>
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
  const [rules, setRules] = React.useState<Transaction[]>(taxRules);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<Transaction | null>(null);


  const toggleStatus = (indexToToggle: number) => {
    setRules(currentRules =>
      currentRules.map((rule, index) =>
        index === indexToToggle
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

  const handleSaveRule = (ruleToSave: Partial<Transaction>) => {
    if (editingRule) {
        // This is a simplified update. For a real app, you'd likely want a unique ID per rule.
        const originalIndex = rules.findIndex(r => r.jenisTransaksi === editingRule.jenisTransaksi && r.wp === editingRule.wp && r.asn === editingRule.asn && r.golongan === editingRule.golongan && r.fakturPajak === editingRule.fakturPajak && r.sertifikatKonstruksi === editingRule.sertifikatKonstruksi);

        if (originalIndex !== -1) {
            setRules(currentRules => {
                const updatedRules = [...currentRules];
                updatedRules[originalIndex] = { ...currentRules[originalIndex], ...ruleToSave } as Transaction;
                return updatedRules;
            });
        }
    } else {
        // Add new rule
        setRules(currentRules => [...currentRules, ruleToSave as Transaction]);
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
                                  <DropdownMenuItem onClick={() => handleEdit(rule)}>
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
      <RuleFormDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSaveRule}
        rule={editingRule}
      />
    </>
  );
}
