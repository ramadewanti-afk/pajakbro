'use server';

import { ensureTaxLawCompliance } from '@/ai/flows/ensure-tax-law-compliance';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FormData {
    jenisTransaksi: string;
    wajibPajak: string;
    fakturPajak?: string;
    isASN: boolean;
    golongan?: string;
    sertifikatKonstruksi: boolean;
    nilaiTransaksi: number;
    userId: string;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
};

export async function checkComplianceAction(data: FormData) {
  
  const { pph21, ppn, totalPajak, tarifPajak } = getTaxDetails(data);

  const taxCalculationDetails = `
Transaction Details:
- Transaction Type: ${data.jenisTransaksi}
- Taxpayer Type: ${data.wajibPajak}
- Tax Invoice: ${data.fakturPajak || 'N/A'}
- Is ASN: ${data.isASN ? 'Yes' : 'No'}
${data.isASN ? `- ASN Group: ${data.golongan || 'N/A'}` : ''}
- Has Construction Certificate: ${data.sertifikatKonstruksi ? 'Yes' : 'No'}
- Transaction Value (DPP): ${formatCurrency(data.nilaiTransaksi)}
- PPh Rate: ${tarifPajak}%

Calculated Taxes:
- PPh: ${formatCurrency(pph21)}
- PPN: ${formatCurrency(ppn)}
- Total Tax: ${formatCurrency(totalPajak)}
  `;

  try {
    const result = await ensureTaxLawCompliance({ taxCalculationDetails });

     // Save to Firestore
    if (data.userId) {
        try {
            await addDoc(collection(db, "pajakHistory"), {
                userId: data.userId,
                tanggal: serverTimestamp(),
                jenisTransaksi: data.jenisTransaksi,
                wajibPajak: data.wajibPajak,
                nilai: data.nilaiTransaksi,
                pph: pph21,
                ppn: ppn,
                total: totalPajak,
                statusKepatuhan: result.complianceReport?.toLowerCase().includes('compliant') ? 'Compliant' : 'Needs Review',
            });
        } catch (e) {
            console.error("Error adding document: ", e);
            // Don't block user flow if firestore fails
        }
    }


    return { 
      complianceReport: result.complianceReport,
      pph21,
      ppn,
      totalPajak,
      tarifPajak,
    };
  } catch (error) {
    console.error("Error checking tax compliance:", error);
    return { error: "Failed to check tax compliance. Please try again." };
  }
}

// Simplified tax logic based on the provided image
function getTaxDetails(data: Omit<FormData, 'userId'>) {
  let tarifPajak = 0;
  let kenaPPN = false;
  const { jenisTransaksi, wajibPajak, isASN, golongan, nilaiTransaksi, sertifikatKonstruksi } = data;

  if (wajibPajak === 'Orang Pribadi') {
    if (jenisTransaksi.includes('Honor')) {
      if (isASN) {
        if (golongan === 'Golongan IV') tarifPajak = 15;
        else if (golongan === 'Golongan III') tarifPajak = 5;
        else tarifPajak = 0;
      } else { // NON ASN
        tarifPajak = 5;
      }
    } else if (jenisTransaksi === 'Tukang Harian (Pekerja lepas)') {
        if (nilaiTransaksi <= 450000) tarifPajak = 0;
        else if (nilaiTransaksi <= 2500000) tarifPajak = 0.5;
        else tarifPajak = 2.5;
    } else if (jenisTransaksi === 'Hadiah Lomba') {
        tarifPajak = 5;
    } else { // Makan Minum, Service, Sewa, Fotokopi
      tarifPajak = 2.5;
      if (nilaiTransaksi > 2000000) {
        kenaPPN = true;
      }
      if (jenisTransaksi === 'Makan Minum') {
          kenaPPN = false;
      }
    }
  } else { // Badan Usaha
    if (jenisTransaksi.includes('Konstruksi')) {
        if(sertifikatKonstruksi) {
            if (jenisTransaksi === 'Jasa Konsultasi Konstruksi') tarifPajak = 3.5;
            else tarifPajak = 1.75;
        } else {
            if (jenisTransaksi === 'Jasa Konsultasi Konstruksi') tarifPajak = 6;
            else tarifPajak = 4;
        }
        kenaPPN = true;
    } else if (jenisTransaksi === 'Pembelian Barang') {
        tarifPajak = 1.5;
        if(nilaiTransaksi > 2000000) kenaPPN = true;
    } else if (jenisTransaksi === 'Belanja Premi Asuransi') {
        tarifPajak = 2;
        kenaPPN = false;
    } else { // Makan Minum, Service, Sewa, Fotokopi, Jasa Pentas, EO, Pemeliharaan
        tarifPajak = 2;
        if(jenisTransaksi === 'Makan Minum') {
            kenaPPN = false;
        } else {
             if(nilaiTransaksi > 2000000) kenaPPN = true;
        }
    }
  }

  const pphValue = nilaiTransaksi * (tarifPajak / 100);
  const ppnValue = kenaPPN ? nilaiTransaksi * 0.11 : 0;
  const totalPajak = pphValue + ppnValue;

  return { pph21: pphValue, ppn: ppnValue, totalPajak, tarifPajak, kenaPPN };
}

export async function calculateTaxAction(data: Omit<FormData, 'userId'>) {
    const details = getTaxDetails(data);
    return {
        ...details,
        error: null,
    }
}
