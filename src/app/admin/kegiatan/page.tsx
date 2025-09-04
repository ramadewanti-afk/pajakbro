
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
import { activities as initialActivities, Activity } from "@/data/activities";

const ItemFormDialog = ({
  isOpen,
  setIsOpen,
  onSave,
  item,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (item: Omit<Activity, 'id'> & { id?: number }) => void;
  item: Activity | null;
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (item) {
      setName(item.name);
    } else {
      setName("");
    }
  }, [item]);

  const handleSave = () => {
    if (!name) return;
    onSave({ id: item?.id, name });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Subkegiatan' : 'Tambah Subkegiatan'}</DialogTitle>
          <DialogDescription>
            {item ? 'Perbarui nama subkegiatan.' : 'Tambahkan subkegiatan baru.'}
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
          <DialogClose asChild><Button variant="outline">Batal</Button></DialogClose>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function KegiatanPage() {
  const [items, setItems] = useState<Activity[]>(initialActivities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Activity | null>(null);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Activity) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
      setItems(currentItems => currentItems.filter(item => item.id !== id));
  }

  const handleSave = (itemToSave: Omit<Activity, 'id'> & { id?: number }) => {
    if (itemToSave.id) {
      // Update existing item
      setItems(currentItems =>
        currentItems.map(item =>
          item.id === itemToSave.id ? { ...item, name: itemToSave.name } : item
        )
      );
    } else {
      // Add new item
      const newItem: Activity = {
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
            <CardTitle>Manajemen Subkegiatan</CardTitle>
            <CardDescription>
              Kelola daftar subkegiatan yang tersedia untuk kalkulator.
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
                  <TableHead>Nama Subkegiatan</TableHead>
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
