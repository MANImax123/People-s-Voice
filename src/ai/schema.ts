/**
 * @fileOverview Zod schemas and TypeScript types for the civic issue reporting application.
 */

import { z } from 'zod';

// Define Zod schemas for our data structures
export const IssueSchema = z.object({
    id: z.string(),
    description: z.string(),
    category: z.string(),
    location: z.string(),
    status: z.enum(["Pending", "In Progress", "Resolved"]),
    upvotes: z.number(),
    createdAt: z.string(), // Changed from datetime() to string for simplicity and reliability
    assigneeId: z.string().optional(),
    resolvedAt: z.string().optional(), // Changed from datetime() to string
    userId: z.string().optional(),
});

export type Issue = z.infer<typeof IssueSchema>;

export const CreateIssueInputSchema = z.object({
  description: z.string(),
  category: z.string(),
  location: z.string(),
  userId: z.string().optional(),
});
export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;

export const UpvoteIssueInputSchema = z.object({
  issueId: z.string(),
});
export type UpvoteIssueInput = z.infer<typeof UpvoteIssueInputSchema>;

export const AssignIssueInputSchema = z.object({
    issueId: z.string(),
    assigneeId: z.string(),
});
export type AssignIssueInput = z.infer<typeof AssignIssueInputSchema>;


export const UpdateIssueStatusInputSchema = z.object({
    issueId: z.string(),
    status: z.enum(["In Progress", "Resolved"]),
});
export type UpdateIssueStatusInput = z.infer<typeof UpdateIssueStatusInputSchema>;

export const GetIssueInputSchema = z.object({
    issueId: z.string(),
});
export type GetIssueInput = z.infer<typeof GetIssueInputSchema>;

export const GeocodeAddressInputSchema = z.object({
  address: z.string().describe('The street address to geocode.'),
});
export type GeocodeAddressInput = z.infer<typeof GeocodeAddressInputSchema>;

export const GeocodeAddressOutputSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export type GeocodeAddressOutput = z.infer<typeof GeocodeAddressOutputSchema>;
