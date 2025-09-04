
"use client";

import { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { taxRules } from "@/data/tax-rules";

type WpType = "Orang Pribadi" | "Badan Usaha";
type AsnStatus = "ASN" | "NON ASN";
type AsnGolongan = "I" | "II" | "III" | "IV";
type FakturPajak = "Punya" | "Tidak Punya";
type SertifikatKonstruksi = "Punya" | "Tidak Punya";

export default function HomePage() {
  const router = useRouter();
  const [jenisTransaksi, setJenisTransaksi] = useState<string>("");
  const [wp, setWp] = useState<WpType>("Orang Pribadi");
  const [nilaiTransaksi, setNilaiTransaksi] = useState<string>("");

  // Dynamic fields
  const [fakturPajak, setFakturPajak] = useState<FakturPajak | "">("");
  const [asnStatus, setAsnStatus] = useState<AsnStatus | "">("");
  const [asnGolongan, setAsnGolongan] = useState<AsnGolongan | "">("");
  const [sertifikatKonstruksi, setSertifikatKonstruksi] = useState<SertifikatKonstruksi | "">("");
  
  const [pajak, setPajak] = useState<{ pph: number; ppn: number; jenisPajak: string, tarif: string } | null>(null);
  const [error, setError] = useState<string>("");

  const selectedTransaction = useMemo(() => {
    return taxRules.find(rule => rule.jenisTransaksi === jenisTransaksi && rule.wp === wp);
  }, [jenisTransaksi, wp]);

  const uniqueTransactions = useMemo(() => {
    const transactionNames = taxRules.map(rule => rule.jenisTransaksi);
    return [...new Set(transactionNames)];
  }, []);

  const handleCalculate = () => {
    const nilai = parseFloat(nilaiTransaksi);
    if (isNaN(nilai) || nilai <= 0) {
      setError("Masukkan nilai transaksi yang valid.");
      setPajak(null);
      return;
    }

    let rule = selectedTransaction;

    // Additional filtering for complex rules
    if (selectedTransaction?.jenisTransaksi === "Honor (Narsum, Juri, dll)" && wp === "Orang Pribadi") {
        const honorRule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.asn === asnStatus &&
            (r.golongan === asnGolongan || r.golongan === "N/A")
        );
        rule = honorRule;
    } else if (selectedTransaction?.jenisTransaksi.includes("Jasa Konsultasi Konstruksi")) {
        const konstruksiRule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.sertifikatKonstruksi === sertifikatKonstruksi
        );
        rule = konstruksiRule;
    } else if (selectedTransaction?.jenisPajak === "PPh 23" && wp === "Badan Usaha") {
         const pph23Rule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.fakturPajak === fakturPajak
        );
        rule = pph23Rule;
    }


    if (!rule) {
      setError("Kombinasi yang Anda pilih tidak memiliki aturan pajak yang sesuai.");
      setPajak(null);
      return;
    }

    setError("");

    let pph = 0;
    
    // Simple percentage calculation
    if (String(rule.tarifPajak).includes('%')) {
        const rate = parseFloat(String(rule.tarifPajak).replace('%', '')) / 100;
        pph = nilai * rate;
    }

    // Special case for 'Tukang Harian'
    if (rule.jenisTransaksi.includes('Tukang Harian')) {
        if (nilai > 450000 && nilai <= 2500000) {
            pph = (nilai - 450000) * 0.005; // 0.5%
        } else if (nilai > 2500000) {
            pph = nilai * 0.025; // 2.5%
        } else {
            pph = 0;
        }
    }

    const ppn = rule.kenaPPN ? nilai * 0.11 : 0; // PPN is 11%

    setPajak({
      pph,
      ppn,
      jenisPajak: rule.jenisPajak,
      tarif: String(rule.tarifPajak)
    });

    // Instead of showing results here, navigate to the results page
    router.push('/hasil');
  };
  
  const resetDynamicFields = () => {
      setFakturPajak("");
      setAsnStatus("");
      setAsnGolongan("");
      setSertifikatKonstruksi("");
      setPajak(null);
      setError("");
  }

  const handleWpChange = (value: string) => {
      setWp(value as WpType);
      setJenisTransaksi("");
      resetDynamicFields();
  }

  const handleTransactionChange = (value: string) => {
      setJenisTransaksi(value);
      resetDynamicFields();
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Kalkulator Pajak Bro</CardTitle>
          <CardDescription>
            Hitung Pajak Penghasilan (PPh) dan PPN berdasarkan jenis transaksi.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Wajib Pajak (WP)</Label>
              <RadioGroup value={wp} onValueChange={handleWpChange} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Orang Pribadi" id="op" />
                  <Label htmlFor="op">Orang Pribadi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Badan Usaha" id="bu" />
                  <Label htmlFor="bu">Badan Usaha</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jenis-transaksi">Jenis Transaksi</Label>
              <Select value={jenisTransaksi} onValueChange={handleTransactionChange}>
                <SelectTrigger id="jenis-transaksi">
                  <SelectValue placeholder="Pilih Jenis Transaksi" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueTransactions.filter(jt => taxRules.some(r => r.jenisTransaksi === jt && r.wp === wp)).map(transaction => (
                    <SelectItem key={transaction} value={transaction}>{transaction}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nilai-transaksi">Nilai Transaksi (Rp)</Label>
            <Input
              id="nilai-transaksi"
              type="number"
              placeholder="Contoh: 5000000"
              value={nilaiTransaksi}
              onChange={(e) => setNilaiTransaksi(e.target.value)}
            />
          </div>

          {selectedTransaction && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md">
              {selectedTransaction.fakturPajak !== "N/A" && (
                <div className="space-y-2">
                  <Label>Punya Faktur Pajak?</Label>
                  <RadioGroup value={fakturPajak} onValueChange={(v) => setFakturPajak(v as FakturPajak)} className="flex space-x-4">
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Punya" id="fp-punya" />
                        <Label htmlFor="fp-punya">Punya</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tidak Punya" id="fp-tidak" />
                        <Label htmlFor="fp-tidak">Tidak</Label>
                     </div>
                  </RadioGroup>
                </div>
              )}
               {selectedTransaction.asn !== "N/A" && (
                <div className="space-y-2">
                    <Label>Status Kepegawaian</Label>
                    <Select value={asnStatus} onValueChange={(v) => setAsnStatus(v as AsnStatus)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ASN">ASN</SelectItem>
                            <SelectItem value="NON ASN">NON ASN</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}
              {asnStatus === "ASN" && selectedTransaction.golongan !== "N/A" && (
                 <div className="space-y-2">
                    <Label>Golongan ASN</Label>
                    <Select value={asnGolongan} onValueChange={(v) => setAsnGolongan(v as AsnGolongan)}>
                        <SelectTrigger><SelectValue placeholder="Pilih Golongan" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="I">I</SelectItem>
                            <SelectItem value="II">II</SelectItem>
                            <SelectItem value="III">III</SelectItem>
                            <SelectItem value="IV">IV</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              )}
              {selectedTransaction.sertifikatKonstruksi !== "N/A" && (
                <div className="space-y-2">
                  <Label>Punya Sertifikat Konstruksi?</Label>
                  <RadioGroup value={sertifikatKonstruksi} onValueChange={(v) => setSertifikatKonstruksi(v as SertifikatKonstruksi)} className="flex space-x-4">
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Punya" id="sk-punya" />
                        <Label htmlFor="sk-punya">Punya</Label>
                     </div>
                     <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tidak Punya" id="sk-tidak" />
                        <Label htmlFor="sk-tidak">Tidak</Label>
                     </div>
                  </RadioGroup>
                </div>
              )}
            </div>
          )}
          
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
                <p>{error}</p>
            </div>
          )}

          {pajak !== null && (
            <div className="p-4 rounded-md bg-muted space-y-4">
              <h3 className="font-bold text-lg">Hasil Perhitungan:</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-sm text-muted-foreground">Jenis Pajak:</p>
                <p className="text-sm font-bold text-right">{pajak.jenisPajak} ({pajak.tarif})</p>
                
                <p className="text-sm text-muted-foreground">Potongan PPh:</p>
                <p className="text-sm font-bold text-right">Rp {pajak.pph.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>

                <p className="text-sm text-muted-foreground">Potongan PPN (jika ada):</p>
                <p className="text-sm font-bold text-right">Rp {pajak.ppn.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                
                <p className="text-lg font-bold">Total Potongan:</p>
                <p className="text-lg font-bold text-right">Rp {(pajak.pph + pajak.ppn).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
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
