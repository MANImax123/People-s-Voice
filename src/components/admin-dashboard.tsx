"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getIssues } from "@/ai/flows/issue-flow";
import { type Issue } from "@/ai/schema";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

export default function AdminDashboard() {
  const [allIssues, setAllIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const fetchedIssues = await getIssues();
        setAllIssues(fetchedIssues);
        setFilteredIssues(fetchedIssues);
      } catch (error) {
        console.error("Failed to fetch issues:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch issues. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [toast]);

  useEffect(() => {
    let issues = [...allIssues];
    if (categoryFilter !== "all") {
      issues = issues.filter(issue => issue.category === categoryFilter);
    }
    if (statusFilter !== "all") {
      issues = issues.filter(issue => issue.status === statusFilter);
    }
    setFilteredIssues(issues);
  }, [categoryFilter, statusFilter, allIssues]);
  
  const getStatusVariant = (status: Issue["status"]): "default" | "secondary" | "destructive" => {
    if (status === "Resolved") return "default";
    if (status === "In Progress") return "secondary";
    return "destructive";
  };
  
  const categoryData = useMemo(() => {
    const counts = allIssues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allIssues]);

  const statusData = useMemo(() => {
    const counts = allIssues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allIssues]);

  const locationData = useMemo(() => {
    const counts = allIssues.reduce((acc, issue) => {
      acc[issue.location] = (acc[issue.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allIssues]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Overall view of civic issues and performance analytics.</CardDescription>
        </CardHeader>
      </Card>

      {/* Analytics Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Issues by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Issues Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Issues</CardTitle>
           <div className="flex items-center gap-4 pt-4">
            <Select onValueChange={setCategoryFilter} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Street Light">Street Light</SelectItem>
                <SelectItem value="Pothole">Pothole</SelectItem>
                <SelectItem value="Garbage">Garbage</SelectItem>
                <SelectItem value="Water Leakage">Water Leakage</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setStatusFilter} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading issues...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upvotes</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">{issue.category}</TableCell>
                      <TableCell>{issue.location}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell>{issue.upvotes}</TableCell>
                      <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                       <TableCell>{issue.assigneeId || "Unassigned"}</TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/technician/${issue.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View/Update
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
