
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
import { ClipboardList, MoreVertical, PlusCircle } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


// Mock data
const initialKegiatan = [
    { id: 1, name: 'Sekretariat' },
    { id: 2, name: 'Bidang Kebudayaan' },
    { id: 3, name: 'Bidang Pariwisata' },
    { id: 4, name: 'Bidang Ekonomi Kreatif' },
];

type KegiatanType = typeof initialKegiatan[0];

function KegiatanForm({ kegiatan, onSave, children }: { kegiatan?: KegiatanType | null, onSave: (name: string) => void, children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(kegiatan?.name || '');

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
                    <DialogTitle>{kegiatan ? 'Edit Bidang/Kegiatan' : 'Tambah Bidang/Kegiatan'}</DialogTitle>
                    <DialogDescription>
                        Masukkan nama bidang atau kegiatan baru.
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

export default function KegiatanPage() {
    const [kegiatanList, setKegiatanList] = useState<KegiatanType[]>(initialKegiatan);

    const handleAdd = (name: string) => {
        const newItem: KegiatanType = {
            id: Math.max(...kegiatanList.map(t => t.id), 0) + 1,
            name,
        };
        setKegiatanList(prev => [...prev, newItem].sort((a,b) => a.name.localeCompare(b.name)));
    };

    const handleEdit = (id: number, name: string) => {
        setKegiatanList(prev => 
            prev.map(t => (t.id === id ? { ...t, name } : t)).sort((a,b) => a.name.localeCompare(b.name))
        );
    };

    const handleDelete = (id: number) => {
        setKegiatanList(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="text-primary" />
                            Manajemen Bidang/Kegiatan
                        </CardTitle>
                        <CardDescription>
                            Kelola bidang dan kegiatan di sini. Perubahan akan disimpan secara permanen.
                        </CardDescription>
                    </div>
                    <KegiatanForm onSave={handleAdd}>
                         <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah Kegiatan
                        </Button>
                    </KegiatanForm>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Bidang/Kegiatan</TableHead>
                                    <TableHead className="w-[100px] text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {kegiatanList.map((kegiatan) => (
                                    <TableRow key={kegiatan.id}>
                                        <TableCell className="font-medium">{kegiatan.name}</TableCell>
                                        <TableCell className="text-center">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Buka menu</span>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <KegiatanForm kegiatan={kegiatan} onSave={(name) => handleEdit(kegiatan.id, name)}>
                                                        <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
                                                            Edit
                                                        </button>
                                                    </KegiatanForm>
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
                                                            <AlertDialogAction onClick={() => handleDelete(kegiatan.id)} className="bg-destructive hover:bg-destructive/90">
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
                     {kegiatanList.length === 0 && (
                        <p className="text-center text-muted-foreground mt-4">Belum ada data kegiatan.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
