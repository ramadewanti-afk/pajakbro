"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Mock authentication
    if (email === 'admin@pajak.bro' && password === 'admin123') {
      // In a real app, you'd set a session cookie here
      document.cookie = "auth=true; path=/";
      router.push('/admin');
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <LogIn className="text-primary" />
            Admin Login
            </CardTitle>
          <CardDescription>
            Masukkan kredensial Anda untuk masuk ke panel admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Login Gagal</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@pajak.bro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                placeholder="admin123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <Button onClick={handleLogin} className="w-full mt-2">
            Login
          </Button>
            <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                Kembali ke Kalkulator
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
