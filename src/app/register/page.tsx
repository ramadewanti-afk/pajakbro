
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = () => {
        setError("");
        if (!name || !email || !password) {
            setError("Semua field wajib diisi.");
            return;
        }
        // In a real app, you would send this to your backend API
        // to create a new user. Here, we'll just simulate success.
        console.log("New user registered:", { name, email });
        setSuccess(true);
        // Optionally redirect after a delay
        setTimeout(() => {
            router.push('/login');
        }, 2000);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
                    <CardDescription>Buat akun untuk mengelola aplikasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {success ? (
                        <Alert variant="default" className="bg-green-100 border-green-200 text-green-800">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription>
                                Pendaftaran berhasil! Anda akan diarahkan ke halaman login.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input 
                                    id="name" 
                                    type="text" 
                                    placeholder="John Doe" 
                                    required 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="user@example.com" 
                                    required 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Button className="w-full" onClick={handleRegister}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Daftar
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="link" className="w-full" asChild>
                        <Link href="/login">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali ke Login
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
