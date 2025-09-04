"use client";

import { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Calculator,
  FileText,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkComplianceAction } from "./actions";

const formSchema = z.object({
  jenisTransaksi: z.string().min(1, "Jenis transaksi harus diisi"),
  wajibPajak: z.string().min(1, "Wajib Pajak/NPWP harus diisi"),
  fakturPajak: z.string().optional(),
  isASN: z.boolean().default(false),
  golongan: z.string().optional(),
  sertifikatKonstruksi: z.boolean().default(false),
  nilaiTransaksi: z.coerce.number().min(0, "Nilai transaksi harus positif"),
  tarifPajak: z.coerce.number().min(0, "Tarif pajak harus positif"),
});

type FormValues = z.infer<typeof formSchema>;

const PPN_RATE = 0.11; // 11%

export default function PajakBroCalculator() {
  const [isPending, startTransition] = useTransition();
  const [pph21, setPph21] = useState(0);
  const [ppn, setPpn] = useState(0);
  const [totalPajak, setTotalPajak] = useState(0);
  const [complianceReport, setComplianceReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jenisTransaksi: "",
      wajibPajak: "",
      fakturPajak: "",
      isASN: false,
      golongan: "Golongan III",
      sertifikatKonstruksi: false,
      nilaiTransaksi: 0,
      tarifPajak: 0,
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const { nilaiTransaksi, tarifPajak } = watchedValues;
    const pphValue = nilaiTransaksi * (tarifPajak / 100);
    const ppnValue = nilaiTransaksi * PPN_RATE;
    const totalValue = pphValue + ppnValue;

    setPph21(pphValue);
    setPpn(ppnValue);
    setTotalPajak(totalValue);
  }, [watchedValues.nilaiTransaksi, watchedValues.tarifPajak]);

  const handleCheckCompliance = () => {
    setError(null);
    setComplianceReport(null);
    startTransition(async () => {
      const result = await checkComplianceAction({ ...watchedValues, pph21, ppn, totalPajak });
      if (result.error) {
        setError(result.error);
      } else {
        setComplianceReport(result.complianceReport ?? null);
      }
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen w-full bg-background font-body">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Pajak Bro
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Kalkulator Pajak Lengkap untuk Keperluan Dinas
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="text-primary" />
                Input Transaksi
              </CardTitle>
              <CardDescription>
                Masukkan detail transaksi untuk menghitung pajak.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="jenisTransaksi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jenis Transaksi</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis transaksi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pembelian Barang">Pembelian Barang</SelectItem>
                            <SelectItem value="Sewa">Sewa</SelectItem>
                            <SelectItem value="Jasa Konsultansi">Jasa Konsultansi</SelectItem>
                            <SelectItem value="Jasa Konstruksi">Jasa Konstruksi</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <FormField
                      control={form.control}
                      name="wajibPajak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wajib Pajak / NPWP</FormLabel>
                          <FormControl>
                            <Input placeholder="cth: 12.345.678.9-012.000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fakturPajak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faktur Pajak</FormLabel>
                          <FormControl>
                            <Input placeholder="Nomor faktur (opsional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <FormField
                      control={form.control}
                      name="isASN"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Status ASN</FormLabel>
                            <FormDescription>Aktifkan jika wajib pajak adalah ASN.</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {watchedValues.isASN && (
                      <FormField
                        control={form.control}
                        name="golongan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Golongan</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih Golongan ASN"/>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Golongan I">Golongan I</SelectItem>
                                  <SelectItem value="Golongan II">Golongan II</SelectItem>
                                  <SelectItem value="Golongan III">Golongan III</SelectItem>
                                  <SelectItem value="Golongan IV">Golongan IV</SelectItem>
                                </SelectContent>
                              </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="sertifikatKonstruksi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Sertifikat Konstruksi</FormLabel>
                          <FormDescription>Aktifkan jika memiliki sertifikat.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nilaiTransaksi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nilai Transaksi (DPP)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="cth: 1000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tarifPajak"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tarif PPh (%)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="cth: 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="w-full sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary" />
                Hasil Perhitungan
              </CardTitle>
              <CardDescription>
                Rincian perhitungan pajak berdasarkan input.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between"><span className="font-medium text-foreground">Nilai Transaksi:</span> <span>{formatCurrency(watchedValues.nilaiTransaksi)}</span></div>
                <div className="flex justify-between"><span className="font-medium text-foreground">Tarif PPh:</span> <span>{watchedValues.tarifPajak}%</span></div>
              </div>
              <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-foreground">Potongan Pajak:</h4>
                  <div className="flex justify-between text-base">
                      <span>PPh 21</span>
                      <span className="font-medium">{formatCurrency(pph21)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                      <span>PPN ({PPN_RATE * 100}%)</span>
                      <span className="font-medium">{formatCurrency(ppn)}</span>
                  </div>
              </div>
              <div className="mt-4 p-4 bg-accent/30 rounded-lg">
                <div className="flex justify-between items-center font-bold text-lg text-green-800">
                    <span>TOTAL PAJAK</span>
                    <span>{formatCurrency(totalPajak)}</span>
                </div>
              </div>
              <div className="pt-6 text-center">
                 <Button onClick={handleCheckCompliance} disabled={isPending} className="w-full md:w-auto">
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memeriksa...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Cek Kepatuhan Pajak
                      </>
                    )}
                 </Button>
                 <p className="text-xs text-muted-foreground mt-2">Gunakan AI untuk memvalidasi kepatuhan pajak.</p>
              </div>

              <div className="pt-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {complianceReport && (
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertTitle>Laporan Kepatuhan Pajak</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{complianceReport}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
