'use server';
/**
 * @fileOverview Civic issue reporting and management flow using Firestore.
 * - createIssue: Creates a new civic issue report.
 * - getIssues: Retrieves all reported issues.
 * - upvoteIssue: Increments the upvote count for an issue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { IssueSchema, CreateIssueInputSchema, UpvoteIssueInputSchema, AssignIssueInputSchema, UpdateIssueStatusInputSchema, GetIssueInputSchema, type Issue, type CreateIssueInput, type UpvoteIssueInput, type AssignIssueInput, type UpdateIssueStatusInput, type GetIssueInput } from '@/ai/schema';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, increment, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

// Helper to convert Firestore document data to an Issue object
const toIssue = (docSnap: any): Issue => {
    const data = docSnap.data();
    if (!data) {
        throw new Error("Document data is empty for document: " + docSnap.id);
    }
    
    // Safely handle timestamps. When a document is created with serverTimestamp(),
    // an immediate read-back might return null for the timestamp field as it's being set on the server.
    // We default to the current time in that edge case to ensure the returned object is valid.
    const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString() 
        : new Date().toISOString();
        
    const resolvedAt = data.resolvedAt instanceof Timestamp 
        ? data.resolvedAt.toDate().toISOString() 
        : undefined;

    return {
      id: docSnap.id,
      description: data.description,
      category: data.category,
      location: data.location,
      status: data.status,
      upvotes: data.upvotes,
      createdAt: createdAt,
      resolvedAt: resolvedAt,
      userId: data.userId,
      assigneeId: data.assigneeId,
    };
};


// Flow to create a new issue
const createIssueFlow = ai.defineFlow(
  {
    name: 'createIssueFlow',
    inputSchema: CreateIssueInputSchema,
    outputSchema: IssueSchema,
  },
  async (input) => {
    // Data to be saved in Firestore.
    // Note: We use serverTimestamp() for createdAt.
    const newIssueData = {
      ...input,
      status: "Pending" as const,
      upvotes: 0,
      createdAt: serverTimestamp(),
      resolvedAt: null, // Explicitly set to null
      assigneeId: null, // Explicitly set to null
    };
    
    // Add the document to Firestore.
    const docRef = await addDoc(collection(db, "issues"), newIssueData);

    // Fetch the document we just created to get the server-generated timestamp.
    const newDocSnap = await getDoc(docRef);

    // Convert the full document snapshot to our Issue type.
    return toIssue(newDocSnap);
  }
);

// Flow to get all issues
const getIssuesFlow = ai.defineFlow(
  {
    name: 'getIssuesFlow',
    inputSchema: z.void(),
    outputSchema: z.array(IssueSchema),
  },
  async () => {
    const issuesCol = collection(db, "issues");
    const q = query(issuesCol, orderBy("createdAt", "desc"));
    const issueSnapshot = await getDocs(q);
    const issuesList = issueSnapshot.docs.map(toIssue);
    return issuesList;
  }
);

// Flow to get a single issue by ID
const getIssueFlow = ai.defineFlow(
    {
        name: 'getIssueFlow',
        inputSchema: GetIssueInputSchema,
        outputSchema: IssueSchema.optional(),
    },
    async ({ issueId }) => {
        const issueRef = doc(db, "issues", issueId);
        const issueSnap = await getDoc(issueRef);
        if (issueSnap.exists()) {
            return toIssue(issueSnap);
        }
        return undefined;
    }
);

// Flow to upvote an issue
const upvoteIssueFlow = ai.defineFlow(
  {
    name: 'upvoteIssueFlow',
    inputSchema: UpvoteIssueInputSchema,
    outputSchema: IssueSchema,
  },
  async ({ issueId }) => {
    const issueRef = doc(db, "issues", issueId);
    await updateDoc(issueRef, {
        upvotes: increment(1)
    });
    
    const updatedIssueSnap = await getDoc(issueRef);
    if (!updatedIssueSnap.exists()) {
        throw new Error("Issue not found after upvoting");
    }
    return toIssue(updatedIssueSnap);
  }
);

// Flow to assign an issue
const assignIssueFlow = ai.defineFlow(
    {
        name: 'assignIssueFlow',
        inputSchema: AssignIssueInputSchema,
        outputSchema: IssueSchema,
    },
    async ({ issueId, assigneeId }) => {
        const issueRef = doc(db, "issues", issueId);
        await updateDoc(issueRef, { assigneeId });
        
        const updatedDoc = await getDoc(issueRef);
        if (!updatedDoc.exists()) {
            throw new Error("Issue not found after assigning");
        }
        return toIssue(updatedDoc);
    }
);

// Flow to update an issue's status
const updateIssueStatusFlow = ai.defineFlow(
    {
        name: 'updateIssueStatusFlow',
        inputSchema: UpdateIssueStatusInputSchema,
        outputSchema: IssueSchema,
    },
    async ({ issueId, status }) => {
        const issueRef = doc(db, "issues", issueId);
        
        const updateData: any = { status };

        if (status === "Resolved") {
            updateData.resolvedAt = serverTimestamp();
        }

        await updateDoc(issueRef, updateData);
        
        const updatedDoc = await getDoc(issueRef);
        if (!updatedDoc.exists()) {
            throw new Error("Issue not found after updating status");
        }
        
        return toIssue(updatedDoc);
    }
);

// Exported functions for client-side usage
export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  return await createIssueFlow(input);
}

export async function getIssues(): Promise<Issue[]> {
  return await getIssuesFlow();
}

export async function getIssue(input: GetIssueInput): Promise<Issue | undefined> {
    return await getIssueFlow(input);
}

export async function upvoteIssue(input: UpvoteIssueInput): Promise<Issue> {
  return await upvoteIssueFlow(input);
}

export async function assignIssue(input: AssignIssueInput): Promise<Issue> {
    return await assignIssueFlow(input);
}

export async function updateIssueStatus(input: UpdateIssueStatusInput): Promise<Issue> {
    return await updateIssueStatusFlow(input);
}
