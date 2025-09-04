
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowLeft, Printer } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function HasilPage() {
    const router = useRouter();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(value);
    }

    // Placeholder data based on the image
    const data = {
        id: 15,
        namaBidang: "Umum Kepegawaian",
        subKegiatan: "Penyediaan Bahan Logistik Kantor",
        jenisTransaksi: "Makan Minum",
        wajibPajak: "Orang Pribadi",
        fakturPajak: "Tidak dapat menerbitkan",
        asn: "-",
        golongan: "-",
        sertifikatKonstruksi: "-",
        nilaiTransaksi: 1200000,
        jenisPajak: "PPh 21",
        tarifPajak: "2,50%",
        nilaiDpp: 1090909,
        pajakPph: 27273,
        kodeKapPph: "411618-100",
        pajakDaerah: 109091,
        tarifPpn: "0%",
        ppn: 0,
        kodeKapPpn: "-",
        totalPajak: 27273,
        yangDibayarkan: 1172727,
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 print:bg-white">
            <Card className="w-full max-w-4xl print:shadow-none print:border-none">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Image src="https://placehold.co/80x80" alt="Logo" width={60} height={60} data-ai-hint="tax calculator" />
                    </div>
                    <CardTitle className="text-2xl font-bold">HASIL PERHITUNGAN PAJAK</CardTitle>
                </CardHeader>
                <CardContent className="px-8">
                    <Table className="mb-6">
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-semibold w-1/3">ID</TableCell>
                                <TableCell className="w-2/3">: {data.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-semibold">Nama Bidang atau Bagian</TableCell>
                                <TableCell>: {data.namaBidang}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell className="font-semibold">Sub Kegiatan</TableCell>
                                <TableCell>: {data.subKegiatan}</TableCell>
                            </TableRow>
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
                             <TableRow>
                                <TableCell>Faktur Pajak</TableCell>
                                <TableCell>: {data.fakturPajak}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>ASN atau NON ASN</TableCell>
                                <TableCell>: {data.asn}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Golongan</TableCell>
                                <TableCell>: {data.golongan}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sertifikat Konstruksi</TableCell>
                                <TableCell>: {data.sertifikatKonstruksi}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <h3 className="font-semibold text-lg mb-2">Perhitungan</h3>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-1/3">Nilai Transaksi</TableCell>
                                <TableCell className="w-2/3">: {formatCurrency(data.nilaiTransaksi)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-blue-100 font-bold">
                                <TableCell>Jenis Pajak</TableCell>
                                <TableCell>: {data.jenisPajak}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tarif Pajak</TableCell>
                                <TableCell>: {data.tarifPajak}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Nilai DPP</TableCell>
                                <TableCell>: {formatCurrency(data.nilaiDpp)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-blue-100 font-bold">
                                <TableCell>Pajak PPh</TableCell>
                                <TableCell>: {formatCurrency(data.pajakPph)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Kode KAP E-Billing PPh</TableCell>
                                <TableCell>: {data.kodeKapPph}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Pajak daerah Makan Minum</TableCell>
                                <TableCell>: {formatCurrency(data.pajakDaerah)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Tarif PPN 11%</TableCell>
                                <TableCell>: {data.tarifPpn}</TableCell>
                            </TableRow>
                             <TableRow className="bg-blue-100 font-bold">
                                <TableCell>PPN</TableCell>
                                <TableCell>: {formatCurrency(data.ppn)}</TableCell>
                            </TableRow>
                             <TableRow>
                                <TableCell>Kode KAP E-Billing PPN</TableCell>
                                <TableCell>: {data.kodeKapPpn}</TableCell>
                            </TableRow>
                            <TableRow className="bg-blue-200 font-bold text-lg">
                                <TableCell>Total Pajak</TableCell>
                                <TableCell>: {formatCurrency(data.totalPajak)}</TableCell>
                            </TableRow>
                             <TableRow className="bg-blue-200 font-bold text-lg">
                                <TableCell>Yang dibayarkan</TableCell>
                                <TableCell>: {formatCurrency(data.yangDibayarkan)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter className="flex justify-end space-x-4 mt-8 print:hidden">
                    <Button variant="outline" onClick={() => router.push('/')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
                    </Button>
                    <Button onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Cetak
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
