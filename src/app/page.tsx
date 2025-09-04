
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { taxRules } from "@/data/tax-rules";
import { departments } from "@/data/departments";
import { activities } from "@/data/activities";
import { transactionTypes } from "@/data/transaction-types";
import { calculationHistory, CalculationResult } from "@/data/history";
import { Calculator, Coins, LogIn, History, ArrowRight, Search, FileWarning, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';


type WpType = "Orang Pribadi" | "Badan Usaha";
type AsnStatus = "ASN" | "NON ASN";
type AsnGolongan = "I" | "II" | "III" | "IV";
type FakturPajak = "Punya" | "Tidak Punya";
type SertifikatKonstruksi = "Punya" | "Tidak Punya";

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const router = useRouter();
  
  // Master Data State
  const [jenisTransaksi, setJenisTransaksi] = useState<string>("");
  const [wp, setWp] = useState<WpType>("Orang Pribadi");
  const [nilaiTransaksi, setNilaiTransaksi] = useState<string>("");
  
  // Optional Data State
  const [selectedBidang, setSelectedBidang] = useState<string>("");
  const [selectedKegiatan, setSelectedKegiatan] = useState<string>("");


  // Dynamic fields
  const [fakturPajak, setFakturPajak] = useState<FakturPajak | "">("");
  const [asnStatus, setAsnStatus] = useState<AsnStatus | "">("");
  const [asnGolongan, setAsnGolongan] = useState<AsnGolongan | "">("");
  const [sertifikatKonstruksi, setSertifikatKonstruksi] = useState<SertifikatKonstruksi | "">("");
  
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    // Clear session storage on initial load to ensure a fresh start
    sessionStorage.removeItem('calculationResult');

    // Load history from central data source
    // In a real app, this would be an API call.
    // For prototype, we filter only active items for the user view.
    setHistory(calculationHistory.filter(item => item.status === 'Aktif').sort((a, b) => b.id - a.id));
  }, []);
  
  const filteredHistory = useMemo(() => {
    if (!searchTerm) {
        return history;
    }
    return history.filter(item => 
        String(item.id).slice(-6).includes(searchTerm.toLowerCase())
    );
  }, [history, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setVisibleHistoryCount(ITEMS_PER_PAGE); // Reset pagination on new search
  }

  const selectedTransaction = useMemo(() => {
    return taxRules.find(rule => rule.jenisTransaksi === jenisTransaksi && rule.wp === wp);
  }, [jenisTransaksi, wp]);
  
  // Filter available transaction types based on selected WP
  const availableTransactions = useMemo(() => {
      const activeRuleTransactions = new Set(taxRules.filter(r => r.wp === wp && r.status === 'Aktif').map(r => r.jenisTransaksi));
      return transactionTypes.filter(t => activeRuleTransactions.has(t.name));
  }, [wp]);


  const handleCalculate = () => {
    const nilai = parseFloat(nilaiTransaksi);
    if (isNaN(nilai) || nilai <= 0) {
      setError("Masukkan nilai transaksi yang valid.");
      return;
    }

    let rule = selectedTransaction;

    // Additional filtering for complex rules
    if (selectedTransaction?.jenisTransaksi === "Honor (Narsum, Juri, dll)" && wp === "Orang Pribadi") {
        const honorRule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.asn === asnStatus &&
            (r.golongan === asnGolongan || r.golongan === "N/A") &&
            r.status === 'Aktif'
        );
        rule = honorRule;
    } else if (selectedTransaction?.jenisTransaksi.includes("Jasa Konsultasi Konstruksi")) {
        const konstruksiRule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.sertifikatKonstruksi === sertifikatKonstruksi &&
            r.status === 'Aktif'
        );
        rule = konstruksiRule;
    } else if (selectedTransaction?.jenisPajak === "PPh 23" && wp === "Badan Usaha") {
         const pph23Rule = taxRules.find(r => 
            r.jenisTransaksi === jenisTransaksi &&
            r.wp === wp &&
            r.fakturPajak === fakturPajak &&
            r.status === 'Aktif'
        );
        rule = pph23Rule;
    }


    if (!rule || rule.status === 'Tidak Aktif') {
      setError("Kombinasi yang Anda pilih tidak memiliki aturan pajak yang aktif atau sesuai.");
      return;
    }

    setError("");

    let pph = 0;
    let dpp = nilai;
    let ppn = 0;

    // PPN calculation is done first, as it might affect the DPP for PPh
    if (rule.kenaPPN) {
        // Use dppRatio to calculate DPP from gross value
        const [numerator, denominator] = rule.dppRatio.split('/').map(Number);
        if(denominator) {
            dpp = nilai * (numerator / denominator);
            ppn = dpp * 0.11; // PPN is 11% of DPP
        } else {
            dpp = nilai; // fallback
        }
    }

    // Simple percentage calculation for PPh
    if (String(rule.tarifPajak).includes('%')) {
        const rate = parseFloat(String(rule.tarifPajak).replace('%', '')) / 100;
        pph = dpp * rate;
    }

    // Special case for 'Tukang Harian' based on gross value (nilai transaksi)
    // This logic needs to be precise and based on the PTKP ranges
    if (rule.jenisTransaksi.includes('Tukang Harian')) {
        if (nilai > 450000 && nilai <= 2500000) {
            pph = (nilai - 450000) * 0.005; // 0.5% on the excess of 450,000
        } else if (nilai > 2500000) {
             const applicableRule = taxRules.find(r => r.jenisTransaksi.includes('Tukang Harian') && r.ptkp === ">2500000");
             if(applicableRule) {
                 const rate = parseFloat(String(applicableRule.tarifPajak).replace('%','')) / 100;
                 pph = nilai * rate;
             }
        } else {
            pph = 0;
        }
    }
    
    // Pajak Daerah (assuming it is 10% from DPP if it's makan minum)
    const pajakDaerah = rule.jenisTransaksi === "Makan Minum" ? dpp * 0.10 : 0;

    const totalPajak = pph + ppn;
    const yangDibayarkan = nilai - pph; // In many cases, yang dibayarkan is Nilai Transaksi - PPh

    const resultData: CalculationResult = {
      id: Date.now(),
      namaBidang: selectedBidang || "-",
      subKegiatan: selectedKegiatan || "-",
      jenisTransaksi,
      wajibPajak: wp,
      fakturPajak: fakturPajak || rule.fakturPajak,
      asn: asnStatus || rule.asn,
      golongan: asnGolongan || rule.golongan,
      sertifikatKonstruksi: sertifikatKonstruksi || rule.sertifikatKonstruksi,
      nilaiTransaksi: nilai,
      jenisPajak: rule.jenisPajak,
      tarifPajak: String(rule.tarifPajak),
      nilaiDpp: dpp,
      pajakPph: pph,
      kodeKapPph: rule.kodePajak,
      pajakDaerah: pajakDaerah,
      tarifPpn: rule.kenaPPN ? "11%" : "0%",
      ppn: ppn,
      kodeKapPpn: rule.kenaPPN ? "411211-100" : "-", // Example KODE PPN
      totalPajak: totalPajak,
      yangDibayarkan: yangDibayarkan,
      createdAt: new Date().toISOString(),
      status: 'Aktif',
    };
    
    // Save to session storage for immediate viewing
    sessionStorage.setItem('calculationResult', JSON.stringify(resultData));

    // Save to central "database"
    calculationHistory.unshift(resultData);
    setHistory([resultData, ...history]);

    router.push('/hasil');
  };
  
  const resetDynamicFields = () => {
      setFakturPajak("");
      setAsnStatus("");
      setAsnGolongan("");
      setSertifikatKonstruksi("");
      setError("");
      setJenisTransaksi("");
  }

  const handleWpChange = (value: string) => {
      setWp(value as WpType);
      resetDynamicFields();
  }

  const handleTransactionChange = (value: string) => {
      setJenisTransaksi(value);
      // Reset only fields that might change with transaction type
      setFakturPajak("");
      setAsnStatus("");
      setAsnGolongan("");
      setSertifikatKonstruksi("");
      setError("");
  }
  
  const viewHistoryDetails = (item: CalculationResult) => {
    // Re-stringify the specific history item to be viewed
    sessionStorage.setItem('calculationResult', JSON.stringify(item));
    router.push('/hasil');
  };

  const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
  }


  return (
    <div className="min-h-screen w-full bg-background">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl mx-auto lg:mx-0 space-y-8">
                <Card className="border-2 relative">
                    <CardHeader className="text-center">
                        <div className="absolute top-4 right-4 flex gap-2">
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
                              {availableTransactions.map(transaction => (
                                <SelectItem key={transaction.id} value={transaction.name}>{transaction.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50">
                          <div className="space-y-2">
                            <Label htmlFor="bidang-bagian">Bidang / Bagian (Opsional)</Label>
                            <Select value={selectedBidang} onValueChange={setSelectedBidang}>
                                <SelectTrigger id="bidang-bagian">
                                    <SelectValue placeholder="Pilih Bidang/Bagian" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dep => <SelectItem key={dep.id} value={dep.name}>{dep.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                          </div>
                           <div className="space-y-2">
                            <Label htmlFor="sub-kegiatan">Sub Kegiatan (Opsional)</Label>
                            <Select value={selectedKegiatan} onValueChange={setSelectedKegiatan}>
                                <SelectTrigger id="sub-kegiatan">
                                    <SelectValue placeholder="Pilih Sub Kegiatan" />
                                </SelectTrigger>
                                <SelectContent>
                                     {activities.map(act => <SelectItem key={act.id} value={act.name}>{act.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                          </div>
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
                      <Button onClick={handleCalculate} className="w-full text-lg py-6" size="lg" disabled={!jenisTransaksi || !nilaiTransaksi}>
                        <Calculator className="mr-2 h-5 w-5" />
                        Hitung Pajak
                      </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <History className="h-6 w-6" />
                            <CardTitle>Riwayat Perhitungan Terakhir</CardTitle>
                        </div>
                         <div className="relative w-full max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari berdasarkan ID..." 
                                className="pl-9"
                                value={searchTerm}
                                onChange={handleSearchChange}
                             />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredHistory.length > 0 ? (
                            <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                                {filteredHistory.slice(0, visibleHistoryCount).map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => viewHistoryDetails(item)}
                                            className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors border flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="font-semibold truncate">
                                                    <span className="font-mono text-primary mr-2">#{String(item.id).slice(-6)}</span>
                                                    {item.jenisTransaksi}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <Alert className="bg-muted/50 border-dashed">
                                 <FileWarning className="h-4 w-4" />
                                <AlertTitle>{searchTerm ? "Tidak Ditemukan" : "Riwayat Kosong"}</AlertTitle>
                                <AlertDescription>
                                    {searchTerm ? `Tidak ada riwayat yang cocok dengan ID "${searchTerm}".` : "Anda belum melakukan perhitungan apapun. Hasil akan muncul di sini."}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    {filteredHistory.length > visibleHistoryCount && (
                        <CardFooter className="pt-4 border-t">
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={() => setVisibleHistoryCount(prev => prev + ITEMS_PER_PAGE)}
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" />
                                Muat Lebih Banyak ({visibleHistoryCount}/{filteredHistory.length})
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
             <div className="hidden lg:flex items-center justify-center">
                <Image
                    src="https://picsum.photos/800/1200"
                    width={800}
                    height={1200}
                    alt="Ilustrasi Kalkulator Pajak"
                    className="rounded-lg shadow-xl object-cover w-full h-auto max-h-[90vh]"
                    data-ai-hint="tax calculation"
                />
            </div>
        </div>
    </div>
  );
}

    