
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutList, MoreVertical, PlusCircle } from "lucide-react";

// Mock data based on the provided image
const initialTransactionTypes = [
    { id: 1, name: 'Belanja Premi Asuransi' },
    { id: 2, name: 'Fotokopi/Cetak banner,dll' },
    { id: 3, name: 'Hadiah Lomba' },
    { id: 4, name: 'Honor (Narsum, Juri, dll)' },
    { id: 5, name: 'Jasa Konsultasi Konstruksi' },
    { id: 6, name: 'Jasa Pentas Seni (Tari, Wayang, dll)' },
    { id: 7, name: 'Jasa Penyelenggara Acara (EO)' },
    { id: 8, name: 'Makan Minum' },
    { id: 9, name: 'Pembelian Barang (ATK, Komputer, Material, dll)' },
    { id: 10, name: 'Pemeliharaan Bangunan (Service lampu, pipa bocor, pengecatan ringan)' },
    { id: 11, name: 'Pemeliharaan Bangunan (ganti atap, sekat permanen, perbaikan struktur)' },
    { id: 12, name: 'Service Kendaraan, AC, Laptop, dll - <2jt' },
    { id: 13, name: 'Service Kendaraan, AC, Laptop, dll - >2jt' },
    { id: 14, name: 'Sewa (Alat kesenian, Genset, Sound System, Kendaraan,dll)' },
    { id: 15, name: 'Sewa Kendaraan Plat Kuning' },
    { id: 16, name: 'Tukang Harian (Pekerja lepas)' },
    { id: 17, name: 'cek' },
];

type TransactionType = typeof initialTransactionTypes[0];

function TransactionTypeForm({ transaction, onSave, children }: { transaction?: TransactionType | null, onSave: (name: string) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(transaction?.name || '');

    const handleSubmit = () => {
        if(name) {
            onSave(name);
            setOpen(false);
            setName('');
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{transaction ? 'Edit Jenis Transaksi' : 'Tambah Jenis Transaksi'}</DialogTitle>
                    <DialogDescription>
                        Masukkan nama jenis transaksi baru.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Nama
                        </Label>
                        <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Batal</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function JenisTransaksiPage() {
    const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(initialTransactionTypes);

    const handleAdd = (name: string) => {
        const newTransaction: TransactionType = {
            id: Math.max(...transactionTypes.map(t => t.id), 0) + 1,
            name,
        };
        setTransactionTypes(prev => [...prev, newTransaction].sort((a,b) => a.name.localeCompare(b.name)));
    };

    const handleEdit = (id: number, name: string) => {
        setTransactionTypes(prev => 
            prev.map(t => (t.id === id ? { ...t, name } : t)).sort((a,b) => a.name.localeCompare(b.name))
        );
    };

    const handleDelete = (id: number) => {
        setTransactionTypes(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <LayoutList className="text-primary" />
                            Jenis Transaksi
                        </CardTitle>
                        <CardDescription>
                            Lihat dan kelola semua jenis transaksi. Perubahan akan disimpan secara permanen.
                        </CardDescription>
                    </div>
                    <TransactionTypeForm onSave={handleAdd}>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Jenis Transaksi
                        </Button>
                    </TransactionTypeForm>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <div className="p-4 flex justify-between items-center font-medium text-sm text-muted-foreground bg-gray-50/50 border-b">
                            <span>Nama Jenis Transaksi</span>
                            <span>Aksi</span>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {transactionTypes.map((transaction) => (
                                <AccordionItem value={`item-${transaction.id}`} key={transaction.id}>
                                    <div className="flex items-center pr-4 hover:bg-muted/50">
                                        <AccordionTrigger className="flex-1 px-4 py-3 text-sm">
                                            {transaction.name}
                                        </AccordionTrigger>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Buka menu</span>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <TransactionTypeForm transaction={transaction} onSave={(name) => handleEdit(transaction.id, name)}>
                                                    <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                                        Edit
                                                    </button>
                                                </TransactionTypeForm>
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
                                                            Aksi ini tidak dapat dibatalkan. Jenis transaksi akan terhapus secara permanen.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(transaction.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Ya, Hapus
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                     <AccordionContent className="px-4 pb-4">
                                        Detail untuk {transaction.name}. Fungsionalitas detail belum diimplementasikan.
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
