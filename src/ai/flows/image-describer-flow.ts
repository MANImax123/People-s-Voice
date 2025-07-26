'use server';
/**
 * @fileOverview An AI flow to generate a description from an image.
 *
 * - generateImageDescription: Generates a text description of an image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImageDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a civic issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const ImageDescriptionOutputSchema = z.object({
    description: z.string().describe("A detailed text description of the image provided.")
});

const imageDescriberPrompt = ai.definePrompt({
  name: 'imageDescriberPrompt',
  input: {
    schema: ImageDescriptionInputSchema,
  },
  output: {
    schema: ImageDescriptionOutputSchema,
  },
  prompt: `You are an expert at analyzing images of civic problems like potholes, broken streetlights, or garbage piles. Your task is to provide a concise, factual description of the image. Do not offer solutions or opinions. Just describe what you see.

Image:
{{media url=photoDataUri}}
`,
});

export const generateImageDescriptionFlow = ai.defineFlow(
  {
    name: 'generateImageDescriptionFlow',
    inputSchema: ImageDescriptionInputSchema,
    outputSchema: ImageDescriptionOutputSchema,
  },
  async ({photoDataUri}) => {
    const {output} = await imageDescriberPrompt({photoDataUri});
    return output!;
  }
);

export async function generateImageDescription(photoDataUri: string): Promise<string> {
    const result = await generateImageDescriptionFlow({ photoDataUri });
    return result.description;
}
