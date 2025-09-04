
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Image as ImageIcon, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const LOGO_STORAGE_KEY = 'app-logo-url';
const DEFAULT_LOGO_URL = 'https://placehold.co/80x80';

export default function PengaturanPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY) || DEFAULT_LOGO_URL;
    setLogoUrl(storedLogoUrl);
    setInputUrl(storedLogoUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem(LOGO_STORAGE_KEY, inputUrl);
    setLogoUrl(inputUrl);
    setSuccessMessage('Logo berhasil diperbarui! Perubahan akan terlihat di seluruh aplikasi.');
    setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleReset = () => {
      localStorage.removeItem(LOGO_STORAGE_KEY);
      setLogoUrl(DEFAULT_LOGO_URL);
      setInputUrl(DEFAULT_LOGO_URL);
      setSuccessMessage('Logo berhasil direset ke default.');
      setTimeout(() => setSuccessMessage(''), 3000);
  }

  return (
    <Card>
      <CardHeader>
         <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-md">
                 <Settings className="h-6 w-6" />
            </div>
            <div>
                <CardTitle>Pengaturan Aplikasi</CardTitle>
                <CardDescription>Atur konfigurasi umum dan preferensi aplikasi di sini.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Kustomisasi Logo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="logo-url">URL Logo</Label>
                        <p className="text-xs text-muted-foreground">
                            Masukkan URL gambar (misalnya dari imgur.com atau situs hosting lainnya).
                        </p>
                        <Input 
                            id="logo-url"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                     {successMessage && (
                        <Alert variant="default" className="bg-green-100 text-green-800 border-green-300">
                            <AlertDescription>{successMessage}</AlertDescription>
                        </Alert>
                    )}
                </div>
                <div className="space-y-2">
                    <Label>Pratinjau Logo Saat Ini</Label>
                    <div className="flex items-center justify-center rounded-md border border-dashed bg-muted/50 p-4 h-32">
                        {logoUrl && (
                           <Image 
                                key={logoUrl} // Use key to force re-render on change
                                src={logoUrl}
                                alt="Pratinjau Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                                unoptimized // Allows external URLs without config
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>Reset ke Default</Button>
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
            </Button>
      </CardFooter>
    </Card>
  );
}
