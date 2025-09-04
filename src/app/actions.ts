'use server';

import { ensureTaxLawCompliance } from '@/ai/flows/ensure-tax-law-compliance';

interface FormData {
    jenisTransaksi: string;
    wajibPajak: string;
    fakturPajak?: string;
    isASN: boolean;
    golongan?: string;
    sertifikatKonstruksi: boolean;
    nilaiTransaksi: number;
    tarifPajak: number;
    pph21: number;
    ppn: number;
    totalPajak: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
};

export async function checkComplianceAction(data: FormData) {
  const taxCalculationDetails = `
Transaction Details:
- Transaction Type: ${data.jenisTransaksi}
- Taxpayer/NPWP: ${data.wajibPajak}
- Tax Invoice: ${data.fakturPajak || 'N/A'}
- Is ASN: ${data.isASN ? 'Yes' : 'No'}
${data.isASN ? `- ASN Group: ${data.golongan || 'N/A'}` : ''}
- Has Construction Certificate: ${data.sertifikatKonstruksi ? 'Yes' : 'No'}
- Transaction Value (DPP): ${formatCurrency(data.nilaiTransaksi)}
- PPh Rate: ${data.tarifPajak}%

Calculated Taxes:
- PPh 21: ${formatCurrency(data.pph21)}
- PPN (11%): ${formatCurrency(data.ppn)}
- Total Tax: ${formatCurrency(data.totalPajak)}
  `;

  try {
    const result = await ensureTaxLawCompliance({ taxCalculationDetails });
    return { complianceReport: result.complianceReport };
  } catch (error) {
    console.error("Error checking tax compliance:", error);
    return { error: "Failed to check tax compliance. Please try again." };
  }
}
