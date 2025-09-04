
export type TransactionType = {
    id: number;
    name: string;
};

// Initial data based on the unique values from tax-rules.ts
export const transactionTypes: TransactionType[] = [
    { id: 1, name: "Makan Minum" },
    { id: 2, name: "Service Kendaraan, AC, Laptop, dll" },
    { id: 3, name: "Sewa (Alat kesenian, Genset, Sound System, Kendaraan, dll)" },
    { id: 4, name: "Fotokopi/Cetak banner, dll" },
    { id: 5, name: "Honor (Narsum, Juri, dll)" },
    { id: 6, name: "Jasa Pentas Seni (Tari, Wayang, dll)" },
    { id: 7, name: "Tukang Harian (Pekerja lepas)" },
    { id: 8, name: "Hadiah Lomba" },
    { id: 9, name: "Pembelian Barang (ATK, Komputer, Material, dll)" },
    { id: 10, name: "Sewa Kendaraan Plat Kuning" },
    { id: 11, name: "Jasa Penyelenggara Acara (EO)" },
    { id: 12, name: "Belanja Premi Asuransi" },
    { id: 13, name: "Pemeliharaan Bangunan (Service lampu, pipa bocor, pengecatan ring)" },
    { id: 14, name: "Jasa Konsultasi Konstruksi" },
    { id: 15, name: "Pemeliharaan Bangunan (ganti atap, sekat permanen, perbaikan stru)" },
];
