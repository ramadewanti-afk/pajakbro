

"use client";

import { useEffect, useState, Suspense } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileDown, Loader2, QrCode } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';
import QRCode from "react-qr-code";
import { Separator } from '@/components/ui/separator';
import { CalculationResult } from '@/data/history';

const LOGO_STORAGE_KEY = 'app-logo-url';
const DEFAULT_LOGO_URL = 'https://placehold.co/80x80';

function HasilContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<CalculationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO_URL);
    const [formattedDate, setFormattedDate] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        let resultData = null;
        // ALWAYS prioritize data from session storage first, as it's the most reliable source.
        const sessionData = sessionStorage.getItem('calculationResult');
        if (sessionData) {
            try {
                resultData = JSON.parse(sessionData);
            } catch (error) {
                console.error("Failed to parse calculation result from session storage", error);
            }
        } else {
             // Fallback to URL param if session storage is empty (e.g., shared link)
            const dataParam = searchParams.get('data');
            if (dataParam) {
                try {
                    resultData = JSON.parse(atob(dataParam));
                } catch (error) {
                    console.error("Failed to parse data from URL", error);
                }
            }
        }
        
        if (resultData) {
            setData(resultData);
            if (resultData.createdAt) {
                setFormattedDate(
                    new Date(resultData.createdAt).toLocaleString('id-ID', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                    })
                );
            }
            // Generate QR code URL from the definitive result data
            const encodedData = btoa(JSON.stringify(resultData));
            setQrCodeUrl(`${window.location.origin}/hasil?data=${encodedData}`);
        } else {
            // If no data is found anywhere, redirect to home.
            router.push('/');
            return; // Exit early
        }
        
        // Load logo from localStorage
        const storedLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY);
        if (storedLogoUrl) {
            setLogoUrl(storedLogoUrl);
        }

        setLoading(false);
    }, [router, searchParams]);

    const formatCurrency = (value: number) => {
        if (typeof value !== 'number') return 'Rp 0';
        return 'Rp ' + new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(value);
    }
    
    const handlePrint = () => {
        window.print();
    }

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    const isApplicable = (value: string | undefined | null) => value && value !== "N/A" && value.trim() !== "";

    return (
         <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 print:bg-white">
            <Card className="w-full max-w-4xl print:shadow-none print:border-none">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Image 
                            src={logoUrl} 
                            alt="Logo" 
                            width={60} 
                            height={60} 
                            data-ai-hint="tax calculator" 
                            unoptimized
                        />
                    </div>
                    <CardTitle className="text-2xl font-bold">HASIL PERHITUNGAN PAJAK</CardTitle>
                </CardHeader>
                <CardContent className="px-8 grid md:grid-cols-3 gap-8">
                   <div className="md:col-span-2">
                        <Table className="mb-6">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-semibold w-1/3">ID Transaksi</TableCell>
                                    <TableCell className="w-2/3">: #{String(data.id).slice(-6)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold">Tanggal & Waktu Dibuat</TableCell>
                                    <TableCell>: {formattedDate || 'Memuat...'}</TableCell>
                                </TableRow>
                                {isApplicable(data.namaBidang) && (
                                    <TableRow>
                                        <TableCell className="font-semibold">Nama Bidang atau Bagian</TableCell>
                                        <TableCell>: {data.namaBidang}</TableCell>
                                    </TableRow>
                                )}
                                {isApplicable(data.subKegiatan) && (
                                    <TableRow>
                                        <TableCell className="font-semibold">Sub Kegiatan</TableCell>
                                        <TableCell>: {data.subKegiatan}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <h3 className="font-semibold text-lg mb-2">Data Pajak</h3>
                        <Table className="mb-6">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3">Jenis Transaksi</TableCell>
                                    <TableCell className="w-2/3">: {data.jenisTransaksi}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Wajib Pajak atau NPWP</TableCell>
                                    <TableCell>: {data.wajibPajak}</TableCell>
                                </TableRow>
                                {isApplicable(data.fakturPajak) && (
                                    <TableRow>
                                        <TableCell>Faktur Pajak</TableCell>
                                        <TableCell>: {data.fakturPajak}</TableCell>
                                    </TableRow>
                                )}
                                {isApplicable(data.asn) && (
                                    <TableRow>
                                        <TableCell>ASN atau NON ASN</TableCell>
                                        <TableCell>: {data.asn}</TableCell>
                                    </TableRow>
                                )}
                                {isApplicable(data.golongan) && (
                                    <TableRow>
                                        <TableCell>Golongan</TableCell>
                                        <TableCell>: {data.golongan}</TableCell>
                                    </TableRow>
                                )}
                                {isApplicable(data.sertifikatKonstruksi) && (
                                    <TableRow>
                                        <TableCell>Sertifikat Konstruksi</TableCell>
                                        <TableCell>: {data.sertifikatKonstruksi}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <h3 className="font-semibold text-lg mb-2">Perhitungan</h3>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3">Nilai Transaksi</TableCell>
                                    <TableCell className="w-2/3">: {formatCurrency(data.nilaiTransaksi)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nilai DPP</TableCell>
                                    <TableCell>: {formatCurrency(data.nilaiDpp)}</TableCell>
                                </TableRow>
                                {data.pajakDaerah > 0 && (
                                    <TableRow>
                                        <TableCell>Pajak daerah Makan Minum (10%)</TableCell>
                                        <TableCell>: {formatCurrency(data.pajakDaerah)}</TableCell>
                                    </TableRow>
                                )}
                                <TableRow>
                                    <TableCell>Tarif PPN</TableCell>
                                    <TableCell>: {data.tarifPpn}</TableCell>
                                </TableRow>
                                <TableRow className="bg-blue-50 font-medium">
                                    <TableCell>PPN</TableCell>
                                    <TableCell>: {formatCurrency(data.ppn)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Kode KAP E-Billing PPN</TableCell>
                                    <TableCell>: {data.kodeKapPpn}</TableCell>
                                </TableRow>
                                <TableRow className="bg-blue-50 font-medium">
                                    <TableCell>Jenis Pajak</TableCell>
                                    <TableCell>: {data.jenisPajak}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Tarif Pajak</TableCell>
                                    <TableCell>: {data.tarifPajak}</TableCell>
                                </TableRow>
                                <TableRow className="bg-blue-50 font-medium">
                                    <TableCell>Pajak PPh</TableCell>
                                    <TableCell>: {formatCurrency(data.pajakPph)}</TableCell>                            
                                </TableRow>
                                <TableRow>
                                    <TableCell>Kode KAP E-Billing PPh</TableCell>
                                    <TableCell>: {data.kodeKapPph}</TableCell>
                                </TableRow>
                                <TableRow className="bg-primary/10 font-bold text-lg text-primary">
                                    <TableCell>Total Pajak</TableCell>
                                    <TableCell>: {formatCurrency(data.totalPajak)}</TableCell>
                                </TableRow>
                                <TableRow className="bg-primary/10 font-bold text-lg text-primary">
                                    <TableCell>Yang dibayarkan</TableCell>
                                    <TableCell>: {formatCurrency(data.yangDibayarkan)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                   </div>
                   <div className="md:col-span-1 flex flex-col items-center justify-start pt-6 space-y-4 print:hidden">
                        <div className="p-4 border rounded-lg bg-white">
                            {qrCodeUrl && <QRCode value={qrCodeUrl} size={160} />}
                        </div>
                        <div className='text-center'>
                             <h4 className="font-semibold flex items-center gap-2"><QrCode className="h-5 w-5" /> Pindai untuk Berbagi</h4>
                             <p className="text-xs text-muted-foreground">Bagikan hasil perhitungan ini dengan memindai kode QR.</p>
                        </div>
                   </div>
                </CardContent>
                 <CardFooter className="flex justify-end space-x-4 mt-8 print:hidden">
                    <Button variant="outline" onClick={() => router.push('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <Button onClick={handlePrint}>
                        <FileDown className="mr-2 h-4 w-4" /> Simpan sebagai PDF
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}


export default function HasilPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        }>
            <HasilContent />
        </Suspense>
    )
}
