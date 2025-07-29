'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, CheckCircle, Clock, XCircle, Users } from "lucide-react";

interface Payment {
  _id: string;
  userName: string;
  userEmail: string;
  billType: string;
  billNumber: string;
  description: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  paidAt?: string;
}

interface Statistics {
  totalPayments: number;
  totalAmount: number;
  completedPayments: number;
  completedAmount: number;
  pendingPayments: number;
  failedPayments: number;
}

interface BillTypeStat {
  _id: string;
  count: number;
  totalAmount: number;
  completedAmount: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    completedAmount: 0,
    pendingPayments: 0,
    failedPayments: 0
  });
  const [billTypeStats, setBillTypeStats] = useState<BillTypeStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentsData();
  }, []);

  const loadPaymentsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
        setStatistics(data.statistics || {});
        setBillTypeStats(data.billTypeStats || []);
      } else {
        console.error('Failed to load payments data');
      }
    } catch (error) {
      console.error('Error loading payments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBillTypeLabel = (billType: string) => {
    const labels: { [key: string]: string } = {
      'property-tax': 'Property Tax',
      'water-bill': 'Water Bill',
      'electricity-bill': 'Electricity Bill',
      'vehicle-tax': 'Vehicle Tax',
      'trade-license': 'Trade License',
      'building-permit': 'Building Permit',
      'other': 'Other',
    };
    return labels[billType] || billType;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Admin - Payment Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={loadPaymentsData} variant="outline">
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                Total amount: {formatCurrency(statistics.totalAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statistics.completedPayments}</div>
              <p className="text-xs text-muted-foreground">
                Amount: {formatCurrency(statistics.completedAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statistics.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statistics.failedPayments}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-payments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all-payments">All Payments</TabsTrigger>
            <TabsTrigger value="bill-types">Bill Type Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>
                  Complete list of all payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
                    <p className="text-gray-600">Payment transactions will appear here once users start making payments.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Bill Type</TableHead>
                        <TableHead>Bill Number</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment._id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.userName}</div>
                              <div className="text-sm text-gray-500">{payment.userEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>{getBillTypeLabel(payment.billType)}</TableCell>
                          <TableCell>{payment.billNumber}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</div>
                              {payment.paidAt && (
                                <div className="text-xs text-green-600">
                                  Paid: {new Date(payment.paidAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bill-types" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill Type Analytics</CardTitle>
                <CardDescription>
                  Payment statistics by bill type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billTypeStats.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Yet</h3>
                    <p className="text-gray-600">Bill type analytics will appear here once payments are made.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {billTypeStats.map((stat) => (
                      <Card key={stat._id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{getBillTypeLabel(stat._id)}</h3>
                            <p className="text-sm text-gray-600">{stat.count} total payments</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(stat.totalAmount)}
                            </div>
                            <div className="text-sm text-green-600">
                              Completed: {formatCurrency(stat.completedAmount)}
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: `${stat.totalAmount > 0 ? (stat.completedAmount / stat.totalAmount) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Completion Rate</span>
                          <span>
                            {stat.totalAmount > 0 ? Math.round((stat.completedAmount / stat.totalAmount) * 100) : 0}%
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
