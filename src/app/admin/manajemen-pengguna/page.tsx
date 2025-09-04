
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
import { users as initialUsers, User } from "@/data/users";
import { departments } from "@/data/departments";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserFormDialog = ({
  isOpen,
  setIsOpen,
  onSave,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (user: Omit<User, 'id'> & { id?: number }) => void;
  user: User | null;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "User">("User");
  const [bidang, setBidang] = useState<string | undefined>("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setBidang(user.bidang);
    } else {
      setName("");
      setEmail("");
      setRole("User");
      setBidang("");
    }
  }, [user]);

  const handleSave = () => {
    if (!name || !email) return;
    onSave({ id: user?.id, name, email, role, bidang });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
          <DialogDescription>
            {user ? 'Perbarui detail pengguna di bawah ini.' : 'Isi detail untuk pengguna baru.'}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
            />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bidang" className="text-right">
              Bidang
            </Label>
             <Select value={bidang} onValueChange={setBidang} >
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Bidang" />
                </SelectTrigger>
                <SelectContent>
                    {departments.map(dep => (
                        <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>
                    ))}
                     <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
            </Select>
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


export default function ManajemenPenggunaPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAddNew = () => {
    router.push('/register');
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
      setUsers(currentUsers => currentUsers.filter(user => user.id !== id));
  }

  const handleSave = (userToSave: Omit<User, 'id'> & { id?: number }) => {
    if (userToSave.id) {
      // Update existing user
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userToSave.id ? { ...user, ...userToSave } as User : user
        )
      );
    } else {
      // Add new user (handled via registration page, but good to have)
      const newUser: User = {
        id: Date.now(), 
        name: userToSave.name,
        email: userToSave.email,
        role: userToSave.role || "User",
        bidang: userToSave.bidang
      };
      setUsers(currentUsers => [...currentUsers, newUser]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manajemen Pengguna</CardTitle>
            <CardDescription>
              Kelola pengguna, peran, dan hak akses untuk aplikasi.
            </CardDescription>
          </div>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bidang/Bagian</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.bidang || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
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
                                  <DropdownMenuItem onClick={() => handleEdit(user)}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      <span>Edit</span>
                                  </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-red-600">
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
      <UserFormDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSave={handleSave}
        user={editingUser}
      />
    </>
  );
}
