'use server';

/**
 * @fileOverview A flow that ensures tax law compliance by accessing up-to-date tax regulation information.
 *
 * - ensureTaxLawCompliance - A function that ensures tax law compliance.
 * - EnsureTaxLawComplianceInput - The input type for the ensureTaxLawCompliance function.
 * - EnsureTaxLawComplianceOutput - The return type for the ensureTaxLawCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnsureTaxLawComplianceInputSchema = z.object({
  taxCalculationDetails: z
    .string()
    .describe('Details of the tax calculation, including types of taxes, values, and rates.'),
});
export type EnsureTaxLawComplianceInput = z.infer<
  typeof EnsureTaxLawComplianceInputSchema
>;

const EnsureTaxLawComplianceOutputSchema = z.object({
  complianceReport: z
    .string()
    .describe(
      'A report indicating whether the tax calculation is compliant with the latest tax regulations, and if not, what needs to be adjusted.'
    ),
});
export type EnsureTaxLawComplianceOutput = z.infer<
  typeof EnsureTaxLawComplianceOutputSchema
>;

export async function ensureTaxLawCompliance(
  input: EnsureTaxLawComplianceInput
): Promise<EnsureTaxLawComplianceOutput> {
  return ensureTaxLawComplianceFlow(input);
}

const getTaxRegulationInfo = ai.defineTool({
  name: 'getTaxRegulationInfo',
  description: 'Retrieves the latest tax regulation information.',
  inputSchema: z.object({
    taxType: z.string().describe('The type of tax (e.g., PPh 21, PPN).'),
    transactionDetails: z
      .string()
      .describe('Details of the transaction to check compliance for.'),
  }),
  outputSchema: z.string(),
  async resolve(input) {
    // This is a simplified logic based on the provided image.
    // A real implementation would query a comprehensive and up-to-date tax database.
    return `Based on the provided tax rules for ${input.taxType} and transaction details: ${input.transactionDetails}. Please verify against the latest official tax regulations.`;
  },
});

const compliancePrompt = ai.definePrompt({
  name: 'compliancePrompt',
  tools: [getTaxRegulationInfo],
  input: {schema: EnsureTaxLawComplianceInputSchema},
  output: {schema: EnsureTaxLawComplianceOutputSchema},
  prompt: `You are a tax compliance expert. Review the following tax calculation details:

  {{{taxCalculationDetails}}}

  Determine whether the calculation is compliant with the latest tax regulations, using the getTaxRegulationInfo tool to access the relevant regulations. Provide a compliance report indicating any issues and necessary adjustments.
  `,
});

const ensureTaxLawComplianceFlow = ai.defineFlow(
  {
    name: 'ensureTaxLawComplianceFlow',
    inputSchema: EnsureTaxLawComplianceInputSchema,
    outputSchema: EnsureTaxLawComplianceOutputSchema,
  },
  async input => {
    const {output} = await compliancePrompt(input);
    return output!;
  }
);
