"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createIssue } from "@/ai/flows/issue-flow";
import { type CreateIssueInput } from "@/ai/schema";

const hyderabadLocations = [
  "Ameerpet",
  "Banjara Hills",
  "Begumpet",
  "Dilsukhnagar",
  "Gachibowli",
  "Hitec City",
  "Jubilee Hills",
  "Kukatpally",
  "Madhapur",
  "Mehdipatnam",
  "Secunderabad",
  "Pragathi Nagar",
  "Other",
];

const formSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description.").max(500),
  category: z.enum(["Street Light", "Pothole", "Garbage", "Water Leakage", "Other"]),
  location: z.string().refine((val) => hyderabadLocations.includes(val), {
    message: "Please select a valid location.",
  }),
});


export default function ReportIssueForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      category: "Street Light",
      location: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    if (!user) {
       toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to report an issue.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const issueInput: CreateIssueInput = {
        description: values.description,
        category: values.category,
        location: values.location,
        userId: user.uid,
      };

      await createIssue(issueInput);
      
      router.push("/confirmation");
       toast({
        title: "Issue Reported",
        description: "Your report has been submitted successfully.",
      });
    } catch (error) {
       console.error("Failed to create issue:", error);
       toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!user) {
    return (
        <div className="container mx-auto py-8 text-center">
            <p>Please <Link href="/login" className="text-primary underline">login</Link> to report an issue.</p>
        </div>
    )
  }
  
  return (
     <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
            <h1 className="text-4xl font-headline font-bold text-primary">Report a Civic Issue</h1>
            <p className="text-muted-foreground mt-2">Help improve your community by reporting issues.</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Location in Hyderabad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hyderabadLocations.map(loc => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Issue Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Street Light">Street Light</SelectItem>
                            <SelectItem value="Pothole">Pothole</SelectItem>
                            <SelectItem value="Garbage">Garbage</SelectItem>
                            <SelectItem value="Water Leakage">Water Leakage</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Issue Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., A large pothole is forming on the corner of Maple Ave and 2nd St."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Submit Report"}
                  </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
