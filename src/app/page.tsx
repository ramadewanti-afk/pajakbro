
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
import { transactionTypes as initialTransactionTypes, TransactionType } from "@/data/transaction-types";
import { calculationHistory as initialHistory, CalculationResult } from "@/data/history";
import { Calculator, Coins, LogIn, History, ArrowRight, Search, FileWarning, MoreHorizontal, FileText, Trash2, CheckCircle, Info, ChevronsUpDown, Check } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type WpType = "Orang Pribadi" | "Badan Usaha";

const ITEMS_PER_PAGE = 10;

// Function to format currency
const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return 'Rp 0';
    const roundedValue = Math.round(value);
    return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(roundedValue);
}

// Function to generate a short alphanumeric ID
const generateShortId = () => {
    const timestampPart = Date.now().toString(36).slice(-3); // Get last 3 chars of timestamp
    const randomPart = Math.random().toString(36).substring(2, 5); // Get 3 random chars
    return (timestampPart + randomPart).toUpperCase();
}

// Check if a value is within a PTKP range string (e.g., ">2000000" or "0-2000000")
const checkPtkp = (value: number, ptkp: string): boolean => {
  if (ptkp === "N/A" || !ptkp) return true;
  
  const cleanPtkp = ptkp.replace(/\s/g, '').replace(/,/g, '');

  if (cleanPtkp.startsWith('>=')) {
    const limit = parseFloat(cleanPtkp.substring(2));
    return !isNaN(limit) && value >= limit;
  }

  if (cleanPtkp.startsWith('>')) {
    const limit = parseFloat(cleanPtkp.substring(1));
    return !isNaN(limit) && value > limit;
  }

  if (cleanPtkp.startsWith('<=')) {
    const limit = parseFloat(cleanPtkp.substring(2));
    return !isNaN(limit) && value <= limit;
  }

  if (cleanPtkp.startsWith('<')) {
    const limit = parseFloat(cleanPtkp.substring(1));
    return !isNaN(limit) && value < limit;
  }
  
  if (cleanPtkp.includes('-')) {
    const [min, max] = cleanPtkp.split('-').map(v => parseFloat(v));
    if (!isNaN(min) && !isNaN(max)) {
      return value >= min && value <= max;
    }
  }
  
  return false;
};

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
            <CardFooter className="flex justify-end bg-blue-100 border-t pt-4">
                <Button onClick={onSave}>
                    <FileText className="mr-2 h-4 w-4" />
                    Simpan & Lihat Rincian Lengkap
                </Button>
            </CardFooter>
        </Card>
    );
};

// Custom Combobox Component
const TransactionCombobox = ({
  transactions,
  value,
  onValueChange,
}: {
  transactions: TransactionType[];
  value: string;
  onValueChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredTransactions = useMemo(() => {
    if (!searchValue) return transactions;
    return transactions.filter(t => t.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [transactions, searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">
            {value ? transactions.find(t => t.name === value)?.name : "Pilih Jenis Transaksi"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
        <div className="flex flex-col">
          <div className="p-2 border-b">
             <Input
                placeholder="Cari jenis transaksi..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-9"
              />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
             {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                <Button
                  key={transaction.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left h-auto py-2 whitespace-normal",
                    value === transaction.name && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                    onValueChange(transaction.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === transaction.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1">{transaction.name}</span>
                </Button>
              ))
             ) : (
                <div className="p-2 text-center text-sm text-muted-foreground">
                    Tidak ditemukan.
                </div>
             )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};


export default function HomePage() {
  const router = useRouter();
  
  // Persisted state from localStorage
  const [taxRules] = useLocalStorage("taxRules", initialTaxRules);
  const [departments] = useLocalStorage("departments", initialDepartments);
  const [activities] = useLocalStorage("activities", initialActivities);
  const [transactionTypes] = useLocalStorage("transactionTypes", initialTransactionTypes);
  const [calculationHistory, setCalculationHistory] = useLocalStorage<CalculationResult[]>("calculationHistory", initialHistory);
  
  // Master Data State
  const [jenisTransaksi, setJenisTransaksi] = useState<string>("");
  const [wp, setWp] = useState<WpType>("Orang Pribadi");
  const [nilaiTransaksi, setNilaiTransaksi] = useState<string>("");
  
  // Optional Data State
  const [selectedBidang, setSelectedBidang] = useState<string>("");
  const [selectedKegiatan, setSelectedKegiatan] = useState<string>("");

  // Specific condition states that the user might need to specify in some cases.
  // These are not primary inputs but might be needed to disambiguate rules.
  const [fakturPajak, setFakturPajak] = useState<"Punya" | "Tidak Punya" | "N/A">("N/A");
  const [asnStatus, setAsnStatus] = useState<"ASN" | "NON ASN" | "N/A">("N/A");
  const [asnGolongan, setAsnGolongan] = useState<"I" | "II" | "III" | "IV" | "N/A">("N/A");
  const [sertifikatKonstruksi, setSertifikatKonstruksi] = useState<"Punya" | "Tidak Punya" | "N/A">("N/A");

  // Calculation and history state
  const [error, setError] = useState<string>("");
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState<number>(ITEMS_PER_PAGE);

  useEffect(() => {
    sessionStorage.removeItem('calculationResult');
  }, []);
  
  const filteredHistory = useMemo(() => {
    const activeHistory = calculationHistory.filter(item => item.status === 'Aktif').sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    if (!searchTerm) return activeHistory;
    return activeHistory.filter(item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenisTransaksi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [calculationHistory, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setVisibleHistoryCount(ITEMS_PER_PAGE); // Reset pagination on new search
  }

  const findMatchingRule = () => {
    const nilai = parseFloat(nilaiTransaksi);
    if (isNaN(nilai)) return null;

    const candidates = taxRules.filter(r => {
        // Must be active and match primary conditions
        if (r.status !== 'Aktif') return false;
        if (r.jenisTransaksi !== jenisTransaksi) return false;
        if (r.wp !== wp) return false;
        if (!checkPtkp(nilai, r.ptkp)) return false;
        
        // Match specific conditions if they are not "N/A" for the user input
        if (fakturPajak !== 'N/A' && r.fakturPajak !== 'N/A' && r.fakturPajak !== fakturPajak) return false;
        if (asnStatus !== 'N/A' && r.asn !== 'N/A' && r.asn !== asnStatus) return false;
        if (asnGolongan !== 'N/A' && r.golongan !== 'N/A' && r.golongan !== asnGolongan) return false;
        if (sertifikatKonstruksi !== 'N/A' && r.sertifikatKonstruksi !== 'N/A' && r.sertifikatKonstruksi !== sertifikatKonstruksi) return false;
        
        return true;
    });

    if (candidates.length === 0) return null;
    
    // Simple logic: return the first candidate found.
    // For more complex scenarios, scoring might be needed, but this is a robust start.
    return candidates[0];
  };

  const performCalculation = () => {
    const nilai = parseFloat(nilaiTransaksi);
    if (isNaN(nilai) || nilai < 0 || !jenisTransaksi) {
      setCalculationResult(null);
      setError("");
      return;
    }

    const rule = findMatchingRule();

    if (!rule) {
      setError("Kombinasi yang Anda pilih tidak memiliki aturan pajak yang aktif atau sesuai.");
      setCalculationResult(null);
    } else {
      setError("");
      let pph = 0;
      let ppn = 0;
      let pajakDaerah = 0;
      let dpp = nilai;

      // Determine DPP automatically based on the matched rule
      if (rule.jenisTransaksi === "Makan Minum") {
          dpp = Math.round(nilai / 1.1); // DPP = 100/110 * Nilai
      } else if (rule.kenaPPN) {
          dpp = Math.round(nilai / 1.11); // DPP = 100/111 * Nilai
      }

      // Calculate PPN if applicable
      if (rule.kenaPPN) {
          ppn = Math.round(nilai - dpp);
      }
      
      // Special case for Makan Minum, which has a regional tax.
      if (rule.jenisTransaksi === "Makan Minum") {
          pajakDaerah = Math.round(dpp * 0.10); // 10% of DPP
      }

      // Calculate PPh based on the final DPP
      if (String(rule.tarifPajak).includes('%')) {
          const rate = parseFloat(String(rule.tarifPajak).replace('%', '')) / 100;
          pph = Math.round(dpp * rate);
      }
      
      const totalPajak = Math.round(pph + ppn);
      const yangDibayarkan = Math.round(nilai - totalPajak);

      const result: CalculationResult = {
        id: generateShortId(),
        namaBidang: selectedBidang,
        subKegiatan: selectedKegiatan,
        jenisTransaksi,
        wajibPajak: wp,
        fakturPajak: fakturPajak,
        asn: asnStatus,
        golongan: asnGolongan,
        sertifikatKonstruksi: sertifikatKonstruksi,
        nilaiTransaksi: nilai,
        jenisPajak: rule.jenisPajak,
        tarifPajak: String(rule.tarifPajak),
        nilaiDpp: dpp,
        pajakPph: pph,
        kodeKapPph: rule.kodePajak,
        pajakDaerah: pajakDaerah,
        tarifPpn: rule.kenaPPN ? "11%" : "0%",
        ppn: ppn,
        kodeKapPpn: rule.kenaPPN ? rule.kodeKapPpn : "-",
        totalPajak: totalPajak,
        yangDibayarkan: yangDibayarkan,
        createdAt: new Date().toISOString(),
        status: 'Aktif',
      };
      
      setCalculationResult(result);
    }
  }

  // Effect to trigger automatic calculation
  useEffect(() => {
    // This function will run whenever the core dependencies change.
    performCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nilaiTransaksi, jenisTransaksi, wp, fakturPajak, asnStatus, asnGolongan, sertifikatKonstruksi]);
  
  // Effect to update optional data if the calculation result already exists
  useEffect(() => {
      if (calculationResult) {
          setCalculationResult(prevResult => {
              if (!prevResult) return null;
              return {
                  ...prevResult,
                  namaBidang: selectedBidang,
                  subKegiatan: selectedKegiatan,
              }
          })
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBidang, selectedKegiatan]);

  const handleSaveAndShowDetails = () => {
    if (!calculationResult) return;
    
    // The result from state is already updated by the useEffects, so we can use it directly.
    const newHistory = [calculationResult, ...calculationHistory];
    setCalculationHistory(newHistory);
    sessionStorage.setItem('calculationResult', JSON.stringify(calculationResult));
    router.push('/hasil');
  };

  const availableTransactions = useMemo(() => {
      return transactionTypes;
  }, [transactionTypes]);

  const handleTransactionChange = (value: string) => {
      setJenisTransaksi(value);
      // Reset value to force recalculation if needed, or let useEffect handle it.
      setCalculationResult(null); 
      setError("");
  }
  
  const viewHistoryDetails = (item: CalculationResult) => {
    sessionStorage.setItem('calculationResult', JSON.stringify(item));
    router.push('/hasil');
  };

  const formatDate = (dateString: string) => {
     return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  }

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
        
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="w-full space-y-8 lg:sticky lg:top-8">
                <Card className="relative bg-blue-50 border-blue-200">
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
                          <RadioGroup value={wp} onValueChange={(v) => setWp(v as WpType)} className="flex space-x-4 pt-2">
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
                          <TransactionCombobox
                              transactions={availableTransactions}
                              value={jenisTransaksi}
                              onValueChange={handleTransactionChange}
                           />
                        </div>
                      </div>

                      {/* Specific Conditions Section */}
                      <div className="p-4 border rounded-md bg-white space-y-4">
                          <p className="text-sm font-medium text-muted-foreground">Kondisi Spesifik (jika ada)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label>Punya Faktur Pajak?</Label>
                                <RadioGroup value={fakturPajak} onValueChange={(v) => setFakturPajak(v as any)} className="flex space-x-4 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Punya" id="fp_punya" /><Label htmlFor="fp_punya">Punya</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Tidak Punya" id="fp_tidak" /><Label htmlFor="fp_tidak">Tidak</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="N/A" id="fp_na" /><Label htmlFor="fp_na">N/A</Label></div>
                                </RadioGroup>
                            </div>
                            <div className="space-y-2">
                                <Label>Status Kepegawaian</Label>
                                <Select value={asnStatus} onValueChange={(v) => setAsnStatus(v as any)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="N/A">N/A (Tidak Berlaku)</SelectItem>
                                        <SelectItem value="ASN">ASN</SelectItem>
                                        <SelectItem value="NON ASN">NON ASN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label>Golongan ASN</Label>
                                <Select value={asnGolongan} onValueChange={(v) => setAsnGolongan(v as any)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="N/A">N/A (Tidak Berlaku)</SelectItem>
                                        <SelectItem value="I">I</SelectItem>
                                        <SelectItem value="II">II</SelectItem>
                                        <SelectItem value="III">III</SelectItem>
                                        <SelectItem value="IV">IV</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Punya Sertifikat Konstruksi?</Label>
                                <RadioGroup value={sertifikatKonstruksi} onValueChange={(v) => setSertifikatKonstruksi(v as any)} className="flex space-x-4 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Punya" id="sk_punya" /><Label htmlFor="sk_punya">Punya</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="Tidak Punya" id="sk_tidak" /><Label htmlFor="sk_tidak">Tidak</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="N/A" id="sk_na" /><Label htmlFor="sk_na">N/A</Label></div>
                                </RadioGroup>
                            </div>
                          </div>
                      </div>
                      
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-white">
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
                 <Card className="bg-red-50 border-red-200">
                    <CardHeader className="space-y-4">
                        <div className="flex items-center gap-2">
                            <History className="h-6 w-6" />
                            <CardTitle>Riwayat Perhitungan Terakhir</CardTitle>
                        </div>
                         <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari berdasarkan ID atau jenis transaksi..." 
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
                                                    <span className="font-mono text-primary mr-2">#{item.id}</span>
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
                                    {searchTerm ? `Tidak ada riwayat yang cocok dengan pencarian "${searchTerm}".` : "Anda belum melakukan perhitungan apapun. Hasil akan muncul di sini."}
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
