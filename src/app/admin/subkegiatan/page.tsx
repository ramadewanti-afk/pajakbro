
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { ListTree, MoreVertical, PlusCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


// Mock data
const initialSubKegiatan = [
    { id: 1, name: 'Penyelenggaraan pertunjukan seni' },
    { id: 2, name: 'Pengembangan destinasi pariwisata' },
    { id: 3, name: 'Pelatihan UMKM bidang kuliner' },
    { id: 4, name: 'Pengelolaan Gaji dan Tunjangan' },
];

type SubKegiatanType = typeof initialSubKegiatan[0];

function SubKegiatanForm({ subKegiatan, onSave, children }: { subKegiatan?: SubKegiatanType | null, onSave: (name: string) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(subKegiatan?.name || '');

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
                    <DialogTitle>{subKegiatan ? 'Edit Sub Kegiatan' : 'Tambah Sub Kegiatan'}</DialogTitle>
                    <DialogDescription>
                        Masukkan nama sub kegiatan baru.
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

export default function SubKegiatanPage() {
    const [subKegiatanList, setSubKegiatanList] = useState<SubKegiatanType[]>(initialSubKegiatan);

    const handleAdd = (name: string) => {
        const newItem: SubKegiatanType = {
            id: Math.max(...subKegiatanList.map(t => t.id), 0) + 1,
            name,
        };
        setSubKegiatanList(prev => [...prev, newItem].sort((a,b) => a.name.localeCompare(b.name)));
    };

    const handleEdit = (id: number, name: string) => {
        setSubKegiatanList(prev => 
            prev.map(t => (t.id === id ? { ...t, name } : t)).sort((a,b) => a.name.localeCompare(b.name))
        );
    };

    const handleDelete = (id: number) => {
        setSubKegiatanList(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ListTree className="text-primary" />
                            Manajemen Sub Kegiatan
                        </CardTitle>
                        <CardDescription>
                            Kelola sub kegiatan di sini. Perubahan akan disimpan secara permanen.
                        </CardDescription>
                    </div>
                    <SubKegiatanForm onSave={handleAdd}>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Sub Kegiatan
                        </Button>
                    </SubKegiatanForm>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Sub Kegiatan</TableHead>
                                    <TableHead className="w-[100px] text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subKegiatanList.map((subKegiatan) => (
                                    <TableRow key={subKegiatan.id}>
                                        <TableCell className="font-medium">{subKegiatan.name}</TableCell>
                                        <TableCell className="text-center">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Buka menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <SubKegiatanForm subKegiatan={subKegiatan} onSave={(name) => handleEdit(subKegiatan.id, name)}>
                                                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                                            Edit
                                                        </button>
                                                    </SubKegiatanForm>
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
                                                                Aksi ini tidak dapat dibatalkan. Data akan terhapus secara permanen.
                                                            </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Batal</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(subKegiatan.id)} className="bg-destructive hover:bg-destructive/90">
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
                    </div>
                     {subKegiatanList.length === 0 && (
                        <p className="text-center text-muted-foreground mt-4">Belum ada data sub kegiatan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
