
export type User = {
    id: number;
    name: string;
    email: string;
    role: "Admin" | "User";
    bidang?: string; // Menambahkan bidang ke data pengguna
};

export const users: User[] = [
    { id: 1, name: "Admin Utama", email: "admin@example.com", role: "Admin", bidang: "Administrator" },
    { id: 2, name: "Budi Santoso", email: "budi.s@example.com", role: "User", bidang: "Keuangan dan Aset" },
    { id: 3, name: "Citra Lestari", email: "citra.l@example.com", role: "User", bidang: "Perencanaan dan Evaluasi" },
];
