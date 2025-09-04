
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { transactionTypes as initialTransactionTypes, TransactionType } from "@/data/transaction-types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ItemFormDialog = ({
  isOpen,
  setIsOpen,
  onSave,
  item,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (item: Omit<TransactionType, 'id'> & { id?: number }) => void;
  item: TransactionType | null;
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
        if (item) {
          setName(item.name);
        } else {
          setName("");
        }
    }
  }, [isOpen, item]);

  const handleSave = () => {
    if (!name) return;
    onSave({ id: item?.id, name });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Jenis Transaksi' : 'Tambah Jenis Transaksi'}</DialogTitle>
          <DialogDescription>
            {item ? 'Perbarui nama jenis transaksi.' : 'Tambahkan jenis transaksi baru.'}
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
              placeholder="Contoh: Belanja ATK"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function JenisTransaksiPage() {
  const [items, setItems] = useLocalStorage<TransactionType[]>("transactionTypes", initialTransactionTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransactionType | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: TransactionType) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
      // Note: In a real app, you might want to check if this transaction type
      // is being used in any tax rules before allowing deletion.
  }

  const handleSave = (itemToSave: Omit<TransactionType, 'id'> & { id?: number }) => {
    if (itemToSave.id) {
      // Update existing item
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === itemToSave.id ? { ...item, name: itemToSave.name } : item
        )
      );
    } else {
      // Add new item
      const newItem: TransactionType = {
        id: Date.now(), // Use timestamp for unique ID in this example
        name: itemToSave.name,
      };
      setItems(currentItems => [...currentItems, newItem]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Jenis Transaksi</CardTitle>
            <CardDescription>
              Kelola semua jenis transaksi yang tersedia untuk kalkulator.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Baru
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Jenis Transaksi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Buka menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
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
      <ItemFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSave}
        item={editingItem}
      />
    </>
  );
}
