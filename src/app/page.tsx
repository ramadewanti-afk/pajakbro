
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [penghasilan, setPenghasilan] = useState("");
  const [pajak, setPajak] = useState<number | null>(null);

  const handleCalculate = () => {
    // Logika perhitungan pajak akan ditambahkan di sini
    const income = parseFloat(penghasilan);
    if (!isNaN(income)) {
      // Contoh perhitungan sederhana
      setPajak(income * 0.1); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Kalkulator Pajak Penghasilan</CardTitle>
          <CardDescription>
            Masukkan penghasilan Anda untuk menghitung perkiraan pajak.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="penghasilan">Penghasilan Bruto Tahunan (Rp)</Label>
            <Input
              id="penghasilan"
              type="number"
              placeholder="Contoh: 50000000"
              value={penghasilan}
              onChange={(e) => setPenghasilan(e.target.value)}
            />
          </div>
          {pajak !== null && (
            <div className="p-4 rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">
                Perkiraan Pajak yang Harus Dibayar:
              </p>
              <p className="text-2xl font-bold">
                Rp {pajak.toLocaleString("id-ID")}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleCalculate} className="w-full">
            Hitung Pajak
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
