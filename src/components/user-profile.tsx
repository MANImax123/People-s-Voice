
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { CreditCard, FileText, User, Calendar } from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
  upvotes?: number;
  description: string;
  location: {
    area: string;
    metropolitanCity: string;
  };
}

interface Payment {
  _id: string;
  billType: string;
  amount: number;
  paymentMethod: string;
  status: string;
  billNumber: string;
  description: string;
  paymentDate: string;
  userEmail: string;
  userName: string;
}

export default function UserProfile() {
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyIssues = async () => {
      if (!user?.email) {
        setLoadingIssues(false);
        return;
      }

      try {
        setLoadingIssues(true);
        const response = await fetch(`/api/issues?userEmail=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setMyIssues(data.issues || []);
        } else {
          throw new Error('Failed to fetch issues');
        }
      } catch (error) {
        console.error("Failed to fetch user issues:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your reported issues.",
        });
      } finally {
        setLoadingIssues(false);
      }
    };

    const fetchMyPayments = async () => {
      if (!user?.email) {
        setLoadingPayments(false);
        return;
      }

      try {
        setLoadingPayments(true);
        const response = await fetch(`/api/payments?userEmail=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          setMyPayments(data.payments || []);
        } else {
          throw new Error('Failed to fetch payments');
        }
      } catch (error) {
        console.error("Failed to fetch user payments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch your payment history.",
        });
      } finally {
        setLoadingPayments(false);
      }
    };

    fetchMyIssues();
    fetchMyPayments();
  }, [toast, user]);

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl">User Profile</CardTitle>
              <CardDescription>
                Welcome, {user?.displayName || user?.name || user?.email?.split('@')[0]}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Issues
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="issues">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Submitted Issues
              </CardTitle>
              <CardDescription>
                Track all the civic issues you have reported
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingIssues ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading your issues...</p>
                  </div>
                </div>
              ) : myIssues.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date Reported</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myIssues.map(issue => (
                      <TableRow key={issue._id}>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell className="capitalize">{issue.category?.replace('-', ' ')}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={issue.status === 'resolved' ? 'default' : 'outline'} 
                            className="capitalize"
                          >
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.location?.area}, {issue.location?.metropolitanCity}</TableCell>
                        <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">You have not reported any issues yet.</p>
                  <Button className="mt-3" onClick={() => window.location.href = '/report'}>
                    Report Your First Issue
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment History
              </CardTitle>
              <CardDescription>
                View all your government bill payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPayments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading your payment history...</p>
                  </div>
                </div>
              ) : myPayments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Type</TableHead>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPayments.map(payment => (
                      <TableRow key={payment._id}>
                        <TableCell className="font-medium capitalize">
                          {payment.billType?.replace('-', ' ')}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {payment.billNumber}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₹{payment.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.paymentMethod}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={payment.status === 'completed' ? 'default' : 'outline'}
                            className={`capitalize ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">You have no payment history yet.</p>
                  <Button className="mt-3" onClick={() => window.location.href = '/payments'}>
                    Make Your First Payment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
