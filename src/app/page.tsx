
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { taxRules as initialTaxRules, Transaction } from "@/data/tax-rules";
import { departments as initialDepartments } from "@/data/departments";
import { activities as initialActivities } from "@/data/activities";
import { transactionTypes as initialTransactionTypes } from "@/data/transaction-types";
import { calculationHistory as initialHistory, CalculationResult } from "@/data/history";
import { Calculator, Coins, LogIn, History, ArrowRight, Search, FileWarning, MoreHorizontal, FileText, Trash2, CheckCircle, Info } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";


type WpType = "Orang Pribadi" | "Badan Usaha";
type AsnStatus = "ASN" | "NON ASN";
type AsnGolongan = "I" | "II" | "III" | "IV";
type FakturPajak = "Punya" | "Tidak Punya";
type SertifikatKonstruksi = "Punya" | "Tidak Punya";

const ITEMS_PER_PAGE = 10;

// Function to format currency
const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return 'Rp 0';
    const roundedValue = Math.round(value);
    return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(roundedValue);
}

// Result display component
const CalculationResultDisplay = ({ result, onSave }: { result: CalculationResult | null, onSave: () => void }) => {
    if (!result) return null;

    return (
        <Card className="mt-6 bg-muted/50 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-6 w-6" />
                    Hasil Perhitungan Pajak
                </CardTitle>
                <CardDescription>Berikut adalah rincian pajak berdasarkan data yang Anda masukkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <p className="text-muted-foreground">Jenis Pajak</p>
                    <p className="font-semibold text-right">{result.jenisPajak} ({result.tarifPajak})</p>
                    
                    <p className="text-muted-foreground">Dasar Pengenaan Pajak (DPP)</p>
                    <p className="font-mono text-right">{formatCurrency(result.nilaiDpp)}</p>

                    <p className="text-muted-foreground">Potongan PPh</p>
                    <p className="font-mono text-right">{formatCurrency(result.pajakPph)}</p>

                    {result.ppn > 0 && (
                        <>
                            <p className="text-muted-foreground">PPN ({result.tarifPpn})</p>
                            <p className="font-mono text-right">{formatCurrency(result.ppn)}</p>
                        </>
                    )}
                     {result.pajakDaerah > 0 && (
                        <>
                            <p className="text-muted-foreground">Pajak Daerah (10%)</p>
                            <p className="font-mono text-right">{formatCurrency(result.pajakDaerah)}</p>
                        </>
                    )}
                 </div>
                 <Separator />
                 <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <p className="font-bold text-lg">Total Pajak</p>
                    <p className="font-bold text-lg font-mono text-right">{formatCurrency(result.totalPajak)}</p>
                    
                    <p className="text-muted-foreground">Nilai Dibayarkan ke Vendor</p>
                    <p className="font-mono text-right">{formatCurrency(result.yangDibayarkan)}</p>
                 </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onSave}>
                    <FileText className="mr-2 h-4 w-4" />
                    Simpan & Lihat Rincian Lengkap
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function HomePage() {
  const router = useRouter();
  
  // Persisted state from localStorage
  const [taxRules] = useLocalStorage("taxRules", initialTaxRules);
  const [departments] = useLocalStorage("departments", initialDepartments);
  const [activities] = useLocalStorage("activities", initialActivities);
  const [transactionTypes] = useLocalStorage("transactionTypes", initialTransactionTypes);
  const [calculationHistory, setCalculationHistory] = useLocalStorage("calculationHistory", initialHistory);
  
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
  
  // Calculation and history state
  const [error, setError] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    sessionStorage.removeItem('calculationResult');
  }, []);
  
  const filteredHistory = useMemo(() => {
    const activeHistory = calculationHistory.filter(item => item.status === 'Aktif').sort((a, b) => b.id - a.id);
    if (!searchTerm) return activeHistory;
    return activeHistory.filter(item => 
        String(item.id).slice(-6).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [calculationHistory, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setVisibleHistoryCount(ITEMS_PER_PAGE); // Reset pagination on new search
  }

  // Effect to trigger automatic calculation
  useEffect(() => {
    const nilai = parseFloat(nilaiTransaksi);
    if (isNaN(nilai) || nilai <= 0 || !jenisTransaksi) {
      setCalculationResult(null);
      setError("");
      return;
    }

    let rule = findMatchingRule();

    if (!rule || rule.status === 'Tidak Aktif') {
      setError("Kombinasi yang Anda pilih tidak memiliki aturan pajak yang aktif atau sesuai.");
      setCalculationResult(null);
      return;
    }

    setError("");
    performCalculation(nilai, rule);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nilaiTransaksi, jenisTransaksi, wp, fakturPajak, asnStatus, asnGolongan, sertifikatKonstruksi, selectedBidang, selectedKegiatan]);


  const findMatchingRule = () => {
    // This logic needs to be robust to find the most specific rule.
    const allRules = taxRules.filter(r => r.jenisTransaksi === jenisTransaksi && r.wp === wp && r.status === 'Aktif');

    let bestMatch = allRules.find(r => 
        r.fakturPajak === "N/A" && 
        r.asn === "N/A" && 
        r.sertifikatKonstruksi === "N/A"
    );

    // More specific matches override the base one
    for (const rule of allRules) {
        let isMatch = true;
        if (rule.fakturPajak !== "N/A" && rule.fakturPajak !== fakturPajak) isMatch = false;
        if (rule.asn !== "N/A" && rule.asn !== asnStatus) isMatch = false;
        if (rule.golongan !== "N/A" && asnStatus === "ASN" && rule.golongan !== asnGolongan) isMatch = false;
        if (rule.sertifikatKonstruksi !== "N/A" && rule.sertifikatKonstruksi !== sertifikatKonstruksi) isMatch = false;

        if (isMatch) {
            bestMatch = rule;
        }
    }
    return bestMatch;
  };
  
 const performCalculation = (nilai: number, rule: Transaction) => {
    let pph = 0;
    let ppn = 0;
    let pajakDaerah = 0;
    let dpp = nilai;

    // Recalculate DPP based on ratio if applicable (for PPN or Pajak Daerah)
    if (rule.kenaPPN || rule.jenisTransaksi === "Makan Minum") {
        const [numerator, denominator] = rule.dppRatio.split('/').map(Number);
        if (denominator) {
            dpp = Math.round(nilai * (numerator / denominator));
        }
    }
    
    // Calculate PPN if applicable
    if (rule.kenaPPN) {
        ppn = Math.round(nilai - dpp);
    }
    
    // Special case for Makan Minum, it has its own tax. This tax is for information only
    // and does not affect the total tax calculation for payment.
    if (rule.jenisTransaksi === "Makan Minum") {
        pajakDaerah = Math.round(dpp * 0.10); // 10% of DPP
    }

    // Calculate PPh based on the final DPP
    if (String(rule.tarifPajak).includes('%')) {
        const rate = parseFloat(String(rule.tarifPajak).replace('%', '')) / 100;
        pph = Math.round(dpp * rate);
    }

    // Special case for Tukang Harian
    if (rule.jenisTransaksi.includes('Tukang Harian')) {
        if (nilai > 450000 && nilai <= 2500000) {
            pph = Math.round((dpp - 450000) * 0.005);
        } else if (nilai > 2500000) {
             const applicableRule = taxRules.find(r => r.jenisTransaksi.includes('Tukang Harian') && r.ptkp === ">2500000");
             if(applicableRule) {
                const rate = parseFloat(String(applicableRule.tarifPajak).replace('%','')) / 100
                pph = Math.round(dpp * rate);
             }
        } else {
            pph = 0;
        }
    }
    
    const totalPajak = Math.round(pph + ppn); // Pajak daerah is not included in total tax
    const yangDibayarkan = Math.round(nilai - totalPajak);

    const result: CalculationResult = {
      id: Date.now(),
      namaBidang: selectedBidang,
      subKegiatan: selectedKegiatan,
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
      kodeKapPpn: rule.kenaPPN ? "411211-100" : "-",
      totalPajak: totalPajak,
      yangDibayarkan: yangDibayarkan,
      createdAt: new Date().toISOString(),
      status: 'Aktif',
    };
    
    setCalculationResult(result);
  }

  const handleSaveAndShowDetails = () => {
    if (!calculationResult) return;
    
    const newHistory = [calculationResult, ...calculationHistory];
    setCalculationHistory(newHistory);
    sessionStorage.setItem('calculationResult', JSON.stringify(calculationResult));
    router.push('/hasil');
  };

  const availableTransactions = useMemo(() => {
      const activeRuleTransactions = new Set(taxRules.filter(r => r.wp === wp && r.status === 'Aktif').map(r => r.jenisTransaksi));
      return transactionTypes.filter(t => activeRuleTransactions.has(t.name));
  }, [wp, taxRules, transactionTypes]);
  
  const resetDynamicFields = () => {
      setFakturPajak("");
      setAsnStatus("");
      setAsnGolongan("");
      setSertifikatKonstruksi("");
      setError("");
      setJenisTransaksi("");
      setCalculationResult(null);
  }

  const handleWpChange = (value: string) => {
      setWp(value as WpType);
      resetDynamicFields();
  }

  const handleTransactionChange = (value: string) => {
      setJenisTransaksi(value);
      setFakturPajak("");
      setAsnStatus("");
      setAsnGolongan("");
      setSertifikatKonstruksi("");
      setError("");
      setCalculationResult(null);
  }
  
  const viewHistoryDetails = (item: CalculationResult) => {
    sessionStorage.setItem('calculationResult', JSON.stringify(item));
    router.push('/hasil');
  };

  const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  }

  const currentRule = useMemo(findMatchingRule, [jenisTransaksi, wp, fakturPajak, asnStatus, asnGolongan, sertifikatKonstruksi, taxRules]);


  return (
    <div className="min-h-screen w-full bg-background">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        <header className="text-center relative">
            <div className="absolute top-0 right-0 flex gap-2">
                <Link href="/login" passHref>
                    <Button variant="ghost" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Admin
                    </Button>
                </Link>
            </div>
            <div className="flex justify-center items-center gap-4 mb-2">
                <Coins className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight">
                    Kalkulator Pajak Bro
                </h1>
            </div>
          <p className="text-muted-foreground">
            Hitung Pajak Penghasilan (PPh) dan PPN berdasarkan jenis transaksi dengan mudah dan akurat.
          </p>
        </header>
        
        <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
               <Info className="h-5 w-5 text-orange-700"/>
               <h3 className="font-semibold text-sm text-orange-800">Info Pajak</h3>
            </div>
             <div className="relative flex overflow-x-hidden text-xs text-orange-700">
                <div className="animate-marquee whitespace-nowrap">
                    <span className="mx-4">Pastikan semua data yang Anda masukkan sudah benar untuk hasil perhitungan yang akurat.</span>
                    <span className="mx-4">Gunakan NPWP untuk mendapatkan tarif pajak yang lebih rendah pada beberapa jenis transaksi.</span>
                    <span className="mx-4">Simpan bukti potong pajak Anda sebagai dokumentasi resmi.</span>
                    <span className="mx-4">Batas waktu pelaporan SPT Tahunan adalah 31 Maret untuk Wajib Pajak Orang Pribadi.</span>
                </div>
                 <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                    <span className="mx-4">Pastikan semua data yang Anda masukkan sudah benar untuk hasil perhitungan yang akurat.</span>
                    <span className="mx-4">Gunakan NPWP untuk mendapatkan tarif pajak yang lebih rendah pada beberapa jenis transaksi.</span>
                    <span className="mx-4">Simpan bukti potong pajak Anda sebagai dokumentasi resmi.</span>
                    <span className="mx-4">Batas waktu pelaporan SPT Tahunan adalah 31 Maret untuk Wajib Pajak Orang Pribadi.</span>
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="w-full space-y-8 lg:sticky lg:top-8">
                <Card className="border-2 relative">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-6 w-6" />
                          Formulir Perhitungan
                        </CardTitle>
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
                      
                      {currentRule && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50">
                          {currentRule.fakturPajak !== "N/A" && (
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
                           {currentRule.asn !== "N/A" && (
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
                          {asnStatus === "ASN" && currentRule.golongan !== "N/A" && (
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
                          {currentRule.sertifikatKonstruksi !== "N/A" && (
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
                      
                      <CalculationResultDisplay result={calculationResult} onSave={handleSaveAndShowDetails} />

                    </CardContent>
                </Card>
            </div>
            <div className="w-full space-y-8 lg:sticky lg:top-8">
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 mb-4">
                            <History className="h-6 w-6" />
                            <CardTitle>Riwayat Perhitungan Terakhir</CardTitle>
                        </div>
                         <div className="relative w-full">
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
                            <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
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
        </div>
      </div>
    </div>
  );
}

    