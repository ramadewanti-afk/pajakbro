
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, TriangleAlert, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const LOGO_STORAGE_KEY = 'app-logo-url';
const DEFAULT_LOGO_URL = 'https://placehold.co/80x80';


export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);

    useEffect(() => {
        const storedLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY);
        if (storedLogoUrl) {
            setLogoUrl(storedLogoUrl);
        }
    }, []);


    const handleLogin = () => {
        setError(""); // Reset error on new attempt
        // Hardcoded credentials for demonstration
        if (email === "admin@example.com" && password === "password") {
            // In a real app, you'd set a token/session here
            router.push('/admin');
        } else {
            setError("Email atau password salah. Silakan coba lagi.");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Image 
                            src={logoUrl} 
                            alt="Logo" 
                            width={60} 
                            height={60} 
                            data-ai-hint="authentication" 
                            unoptimized
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">Login Admin</CardTitle>
                    <CardDescription>Masukkan kredensial Anda untuk mengakses dasbor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="admin@example.com" 
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
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                         <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                     <Button className="w-full" onClick={handleLogin}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </CardContent>
                <CardFooter>
                     <Button variant="link" className="w-full" onClick={() => router.push('/')}>
                        Kembali ke Kalkulator
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
