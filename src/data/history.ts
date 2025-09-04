
export type CalculationResult = {
    id: string; // Changed from number to string
    namaBidang: string;
    subKegiatan: string;
    jenisTransaksi: string;
    wajibPajak: string;
    fakturPajak: string;
    asn: string;
    golongan: string;
    sertifikatKonstruksi: string;
    nilaiTransaksi: number;
    jenisPajak: string;
    tarifPajak: string;
    nilaiDpp: number;
    pajakPph: number;
    kodeKapPph: string;
    pajakDaerah: number;
    tarifPpn: string;
    ppn: number;
    kodeKapPpn: string;
    totalPajak: number;
    yangDibayarkan: number;
    createdAt: string;
    status: 'Aktif' | 'Tidak Aktif';
};


// This acts as a simple in-memory "database" for the prototype.
// In a real application, this would be replaced with a database like Firestore.
// It will be initialized from localStorage if available.
export let calculationHistory: CalculationResult[] = [];
