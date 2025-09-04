
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
import { Calculator, Coins, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl space-y-8">
            <Card className="border-2 relative">
                <CardHeader className="text-center">
                    <div className="absolute top-4 right-4">
                        <Link href="/login" passHref>
                            <Button variant="ghost" size="sm">
                                <LogIn className="mr-2 h-4 w-4" />
                                Admin
                            </Button>
                        </Link>
                    </div>
                    <div className="flex justify-center items-center gap-4 mb-2 pt-8">
                        <Coins className="h-10 w-10 text-primary" />
                        <CardTitle className="text-4xl font-bold tracking-tight">
                            Kalkulator Pajak Bro
                        </CardTitle>
                    </div>
                  <CardDescription>
                    Hitung Pajak Penghasilan (PPh) dan PPN berdasarkan jenis transaksi dengan mudah dan akurat.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Wajib Pajak (WP)</Label>
                      <RadioGroup value={wp} onValueChange={handleWpChange} className="flex space-x-4 pt-2">
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
                    <Label htmlFor="nilai-transaksi">Nilai Transaksi (dalam Rupiah)</Label>
                    <Input
                      id="nilai-transaksi"
                      type="number"
                      placeholder="Contoh: 5000000"
                      value={nilaiTransaksi}
                      onChange={(e) => setNilaiTransaksi(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {selectedTransaction && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50">
                      {selectedTransaction.fakturPajak !== "N/A" && (
                        <div className="space-y-2">
                          <Label>Punya Faktur Pajak?</Label>
                          <RadioGroup value={fakturPajak} onValueChange={(v) => setFakturPajak(v as FakturPajak)} className="flex space-x-4 pt-2">
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
                          <RadioGroup value={sertifikatKonstruksi} onValueChange={(v) => setSertifikatKonstruksi(v as SertifikatKonstruksi)} className="flex space-x-4 pt-2">
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
                    <div className="p-4 rounded-md bg-destructive/10 text-destructive text-center font-medium">
                        <p>{error}</p>
                    </div>
                  )}
                  
                </CardContent>
                <CardFooter>
                  <Button onClick={handleCalculate} className="w-full text-lg py-6" size="lg">
                    <Calculator className="mr-2 h-5 w-5" />
                    Hitung Pajak
                  </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
       <div className="hidden lg:flex items-center justify-center bg-primary/5 p-10">
            <Image 
                src="https://picsum.photos/800/1000"
                alt="Tax Calculation Illustration"
                width={800}
                height={1000}
                className="rounded-2xl object-cover shadow-2xl"
                data-ai-hint="financial planning tax"
            />
        </div>
    </div>
  );
}
