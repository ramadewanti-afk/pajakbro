
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { taxRules } from "@/data/tax-rules";
import { departments } from "@/data/departments";
import { activities } from "@/data/activities";
import { Briefcase, ClipboardList, ListTree, ShieldCheck, TrendingUp } from "lucide-react";
import React from 'react';

// Simulate transaction usage data
const getPopularTransactions = () => {
    // In a real app, this data would come from a database.
    // For now, we'll simulate it by assigning random counts to unique transaction types.
    const uniqueTransactions = [...new Set(taxRules.map(rule => rule.jenisTransaksi))];
    const popular = uniqueTransactions.map(name => ({
        name: name,
        total: Math.floor(Math.random() * 100) + 10, // Random count between 10 and 110
    })).sort((a, b) => b.total - a.total);
    
    return popular.slice(0, 5); // Return top 5
};


export default function AdminPage() {
    const popularTransactions = getPopularTransactions();

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                    <ShieldCheck className="h-10 w-10 text-primary" />
                    Dasbor Admin
                </h1>
                <p className="text-gray-500 mt-2">Selamat datang! Kelola dan pantau data aplikasi dari sini.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-blue-100 border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-800">Total Bidang/Bagian</CardTitle>
                        <Briefcase className="h-4 w-4 text-blue-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{departments.length}</div>
                        <p className="text-xs text-blue-600">Jumlah bidang/bagian yang terdaftar.</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-100 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-800">Total Subkegiatan</CardTitle>
                        <ClipboardList className="h-4 w-4 text-green-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{activities.length}</div>
                         <p className="text-xs text-green-600">Jumlah subkegiatan yang tersedia.</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-100 border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-yellow-800">Total Aturan Pajak</CardTitle>
                        <ListTree className="h-4 w-4 text-yellow-700" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-900">{taxRules.length}</div>
                         <p className="text-xs text-yellow-600">Jumlah aturan pajak yang didefinisikan.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-6 w-6 text-primary" />
                        Transaksi Terpopuler
                    </CardTitle>
                    <CardDescription>
                        5 jenis transaksi yang paling sering digunakan (data simulasi).
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={popularTransactions}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#888888"
                                fontSize={12} 
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                             />
                            <YAxis 
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                             />
                            <Tooltip 
                                 contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
