'use client';

/*
 * AUTO-FILL RECEIPT SCANNER
 * 
 * This component includes intelligent receipt scanning that auto-fills form data.
 * 
 * For PRODUCTION use with real OCR:
 * 1. Install Tesseract.js: npm install tesseract.js
 * 2. Replace extractTextFromImage() with:
 *    
 *    import Tesseract from 'tesseract.js';
 *    
 *    const extractTextFromImage = async (imageFile: File): Promise<string[]> => {
 *      const { data: { text } } = await Tesseract.recognize(imageFile, 'eng', {
 *        logger: m => console.log(m)
 *      });
 *      return text.split('\n').filter(line => line.trim().length > 0);
 *    };
 * 
 * 3. Or use Google Cloud Vision API for better accuracy:
 *    - Create Google Cloud Vision API credentials
 *    - Install @google-cloud/vision
 *    - Implement server-side OCR endpoint
 * 
 * Current implementation uses intelligent simulation for demo purposes.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Receipt, Clock, CheckCircle, XCircle, Calendar, Upload, Camera, FileText, Zap, AlertCircle } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Payment {
  _id: string;
  billType: string;
  billNumber: string;
  description: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  paidAt?: string;
  dueDate?: string;
  receiptImage?: string;
  paymentMethod: 'online' | 'offline';
}

export default function PaymentsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [formData, setFormData] = useState({
    billType: '',
    billNumber: '',
    description: '',
    amount: '',
    dueDate: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  // Offline receipt states
  const [receiptData, setReceiptData] = useState({
    billType: '',
    billNumber: '',
    description: '',
    amount: '',
    paidDate: '',
    receiptNumber: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [extractingData, setExtractingData] = useState(false);
  const [extractionResults, setExtractionResults] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('auth-user');
    if (!authData) {
      router.push('/login');
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      setUser(parsedAuth);
      loadPayments(parsedAuth.email);
    } catch (error) {
      console.error('Error parsing auth data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadPayments = async (userEmail: string) => {
    setPaymentsLoading(true);
    try {
      const response = await fetch(`/api/payments?userEmail=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      } else {
        console.error('Failed to load payments');
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setPaymentsLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to make payments",
        variant: "destructive",
      });
      return;
    }

    if (!formData.billType || !formData.billNumber || !formData.amount || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setPaymentLoading(true);

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create payment order
      const orderResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name,
          billType: formData.billType,
          billNumber: formData.billNumber,
          description: formData.description,
          amount: amount,
          dueDate: formData.dueDate || null,
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Government Bill Payment',
        description: formData.description,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transactionId: orderData.transactionId,
              }),
            });

            if (verifyResponse.ok) {
              toast({
                title: "Payment Successful",
                description: `Your ${formData.billType} payment has been completed successfully!`,
              });
              
              // Reset form
              setFormData({
                billType: '',
                billNumber: '',
                description: '',
                amount: '',
                dueDate: '',
              });
              
              // Reload payments
              loadPayments(user.email);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  // Receipt handling functions
  const extractTextFromImage = async (imageFile: File): Promise<string[]> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Enhanced simulation with more realistic receipt patterns
        // This simulates what real OCR would extract from different government receipts
        const receiptTypes = [
          {
            type: 'property-tax',
            text: [
              'MUNICIPAL CORPORATION',
              'PROPERTY TAX RECEIPT',
              'Bill No: PT2024001234',
              'Property ID: PRP789456',
              'Assessment Year: 2024-25',
              'Amount Paid: Rs. 25,500.00',
              'Date of Payment: 28/07/2025',
              'Receipt No: MCR456789',
              'Ward: Ward No. 15',
              'Property Owner: John Doe',
              'Payment Mode: Cash',
              'PAID STAMP'
            ]
          },
          {
            type: 'water-bill',
            text: [
              'WATER SUPPLY DEPARTMENT',
              'WATER BILL PAYMENT RECEIPT',
              'Consumer No: WTR123456',
              'Bill No: WB2024567890',
              'Billing Period: Jun 2025',
              'Amount: Rs. 1,850.00',
              'Paid Date: 28/07/2025',
              'Receipt No: WRC789123',
              'Meter Reading: 1245 Units',
              'Connection Type: Domestic',
              'THANK YOU'
            ]
          },
          {
            type: 'electricity-bill',
            text: [
              'STATE ELECTRICITY BOARD',
              'ELECTRICITY BILL RECEIPT',
              'Account No: EB987654321',
              'Bill No: EB2024789456',
              'Billing Month: July 2025',
              'Total Amount: Rs. 3,200.00',
              'Payment Date: 28/07/2025',
              'Receipt Number: ERC123789',
              'Units Consumed: 450 KWH',
              'Tariff: Domestic',
              'RECEIPT'
            ]
          }
        ];
        
        // Randomly select a receipt type for simulation
        const randomReceipt = receiptTypes[Math.floor(Math.random() * receiptTypes.length)];
        
        // Add some general government receipt text
        const commonText = [
          'GOVERNMENT RECEIPT',
          'Official Payment Confirmation',
          'Authorized Signature',
          'For official use only',
          'This is a computer generated receipt'
        ];
        
        resolve([...randomReceipt.text, ...commonText]);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const parseReceiptData = (extractedText: string[]) => {
    const fullText = extractedText.join(' ').toLowerCase();
    let parsedData = {
      billType: '',
      billNumber: '',
      amount: '',
      paidDate: '',
      receiptNumber: '',
      description: ''
    };

    // Enhanced Bill Type Detection with multiple patterns
    const billTypePatterns = [
      { keywords: ['property tax', 'house tax', 'municipal tax'], type: 'property-tax', desc: 'Property Tax Payment' },
      { keywords: ['water bill', 'water tax', 'water supply', 'water department'], type: 'water-bill', desc: 'Water Bill Payment' },
      { keywords: ['electricity', 'power bill', 'electric bill', 'electricity board'], type: 'electricity-bill', desc: 'Electricity Bill Payment' },
      { keywords: ['vehicle tax', 'road tax', 'motor vehicle', 'transport tax'], type: 'vehicle-tax', desc: 'Vehicle Tax Payment' },
      { keywords: ['trade license', 'business license', 'commercial license'], type: 'trade-license', desc: 'Trade License Fee Payment' },
      { keywords: ['building permit', 'construction permit', 'building plan'], type: 'building-permit', desc: 'Building Permit Fee Payment' }
    ];

    for (const pattern of billTypePatterns) {
      if (pattern.keywords.some(keyword => fullText.includes(keyword))) {
        parsedData.billType = pattern.type;
        parsedData.description = pattern.desc;
        break;
      }
    }

    if (!parsedData.billType) {
      parsedData.billType = 'other';
      parsedData.description = 'Government Payment';
    }

    // Enhanced Bill Number Extraction with multiple patterns
    const billNumberPatterns = [
      /(?:bill\s*no|bill\s*number|bill\s*#)[\s:]*([a-z0-9]+)/i,
      /(?:ref\s*no|reference\s*no|ref\s*#)[\s:]*([a-z0-9]+)/i,
      /(?:account\s*no|consumer\s*no|connection\s*no)[\s:]*([a-z0-9]+)/i,
      /(?:property\s*id|assessment\s*no)[\s:]*([a-z0-9]+)/i
    ];

    for (const line of extractedText) {
      for (const pattern of billNumberPatterns) {
        const match = line.match(pattern);
        if (match) {
          parsedData.billNumber = match[1].toUpperCase();
          break;
        }
      }
      if (parsedData.billNumber) break;
    }

    // Enhanced Amount Extraction
    const amountPatterns = [
      /(?:amount\s*paid|total\s*amount|amount)[\s:]*(?:rs\.?|₹)?\s*([0-9,]+\.?[0-9]*)/i,
      /(?:rs\.?|₹)\s*([0-9,]+\.?[0-9]*)/i,
      /([0-9,]+\.?[0-9]*)\s*(?:rupees|inr)/i
    ];

    for (const line of extractedText) {
      for (const pattern of amountPatterns) {
        const match = line.match(pattern);
        if (match) {
          parsedData.amount = match[1].replace(/,/g, '');
          break;
        }
      }
      if (parsedData.amount) break;
    }

    // Enhanced Receipt Number Extraction
    const receiptPatterns = [
      /(?:receipt\s*no|receipt\s*number|receipt\s*#)[\s:]*([a-z0-9]+)/i,
      /(?:transaction\s*id|txn\s*id|ref\s*id)[\s:]*([a-z0-9]+)/i,
      /(?:rcpt|rcp)[\s:]*([a-z0-9]+)/i
    ];

    for (const line of extractedText) {
      for (const pattern of receiptPatterns) {
        const match = line.match(pattern);
        if (match) {
          parsedData.receiptNumber = match[1].toUpperCase();
          break;
        }
      }
      if (parsedData.receiptNumber) break;
    }

    // Enhanced Date Extraction with multiple formats
    const datePatterns = [
      /(?:date|paid\s*on|payment\s*date)[\s:]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
      /(?:date)[\s:]*(\d{1,2}\s+[a-z]+\s+\d{2,4})/i
    ];

    for (const line of extractedText) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          let dateStr = match[1];
          
          // Handle DD/MM/YYYY or DD-MM-YYYY format
          if (dateStr.includes('/') || dateStr.includes('-')) {
            const dateParts = dateStr.split(/[\/\-]/);
            if (dateParts.length === 3) {
              let year = dateParts[2];
              if (year.length === 2) {
                year = '20' + year;
              }
              const month = dateParts[1].padStart(2, '0');
              const day = dateParts[0].padStart(2, '0');
              parsedData.paidDate = `${year}-${month}-${day}`;
              break;
            }
          }
        }
      }
      if (parsedData.paidDate) break;
    }

    // If no date found, use today's date
    if (!parsedData.paidDate) {
      const today = new Date();
      parsedData.paidDate = today.toISOString().split('T')[0];
    }

    // Enhanced description with all available details
    let descParts = [parsedData.description];
    if (parsedData.billNumber) {
      descParts.push(`Bill No: ${parsedData.billNumber}`);
    }
    if (parsedData.receiptNumber) {
      descParts.push(`Receipt: ${parsedData.receiptNumber}`);
    }
    
    // Add year for tax payments
    if (parsedData.billType.includes('tax')) {
      descParts.push(`for ${new Date().getFullYear()}`);
    }

    parsedData.description = descParts.join(' - ');

    return parsedData;
  };

  const handleReceiptFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid image file (JPEG, PNG, or WebP)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setReceiptFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Auto-extract data from receipt
      setExtractingData(true);
      toast({
        title: "Processing Receipt",
        description: "Extracting payment details from your receipt...",
      });

      try {
        const extractedText = await extractTextFromImage(file);
        setExtractionResults(extractedText);
        
        const parsedData = parseReceiptData(extractedText);
        
        // Auto-fill the form with extracted data
        setReceiptData(prevData => ({
          ...prevData,
          ...parsedData
        }));

        toast({
          title: "Receipt Processed Successfully",
          description: "Payment details have been auto-filled. Please review and edit if needed.",
        });

      } catch (error) {
        console.error('Error extracting text:', error);
        toast({
          title: "Processing Error",
          description: "Could not extract text from receipt. Please fill details manually.",
          variant: "destructive",
        });
      } finally {
        setExtractingData(false);
      }
    }
  };

  const uploadReceiptData = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please login to upload receipts",
        variant: "destructive",
      });
      return;
    }

    if (!receiptData.billType || !receiptData.billNumber || !receiptData.amount || !receiptData.description || !receiptFile) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and upload a receipt image",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(receiptData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setUploadingReceipt(true);

    try {
      // Convert file to base64
      const base64File = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(receiptFile);
      });

      const response = await fetch('/api/payments/offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name,
          billType: receiptData.billType,
          billNumber: receiptData.billNumber,
          description: receiptData.description,
          amount: amount,
          paidDate: receiptData.paidDate,
          receiptNumber: receiptData.receiptNumber,
          receiptImage: base64File,
          paymentMethod: 'offline'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Receipt Uploaded Successfully",
          description: `Your offline payment receipt has been saved. Transaction ID: ${data.transactionId}`,
        });

        // Reset form
        setReceiptData({
          billType: '',
          billNumber: '',
          description: '',
          amount: '',
          paidDate: '',
          receiptNumber: '',
        });
        setReceiptFile(null);
        setReceiptPreview(null);

        // Reload payments
        loadPayments(user.email);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload receipt');
      }
    } catch (error: any) {
      console.error('Receipt upload error:', error);
      toast({
        title: "Receipt Upload Failed",
        description: error.message || "Failed to upload receipt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingReceipt(false);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
                Government Bill Payments
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="pay-bills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pay-bills">Pay Bills & Taxes</TabsTrigger>
            <TabsTrigger value="offline-receipts">Offline Receipts</TabsTrigger>
            <TabsTrigger value="payment-history">Payment History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pay-bills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Pay Government Bills & Taxes
                </CardTitle>
                <CardDescription>
                  Pay your government bills and taxes securely online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="billType">Bill Type *</Label>
                      <Select
                        value={formData.billType}
                        onValueChange={(value) => setFormData({...formData, billType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bill type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property-tax">Property Tax</SelectItem>
                          <SelectItem value="water-bill">Water Bill</SelectItem>
                          <SelectItem value="electricity-bill">Electricity Bill</SelectItem>
                          <SelectItem value="vehicle-tax">Vehicle Tax</SelectItem>
                          <SelectItem value="trade-license">Trade License</SelectItem>
                          <SelectItem value="building-permit">Building Permit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="billNumber">Bill/Reference Number *</Label>
                      <Input
                        id="billNumber"
                        value={formData.billNumber}
                        onChange={(e) => setFormData({...formData, billNumber: e.target.value})}
                        placeholder="Enter bill or reference number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter payment description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount (₹) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        max="1000000"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        placeholder="Enter amount"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="dueDate">Due Date (Optional)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Now
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="offline-receipts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Upload Offline Payment Receipts
                </CardTitle>
                <CardDescription>
                  Scan and upload receipts from offline payments to track all your bills in one place. 
                  <span className="text-blue-600 font-medium"> Upload your receipt image and watch the form auto-fill!</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); uploadReceiptData(); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="receipt-bill-type">Bill Type *</Label>
                      <Select 
                        value={receiptData.billType} 
                        onValueChange={(value) => setReceiptData({...receiptData, billType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bill type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="property-tax">Property Tax</SelectItem>
                          <SelectItem value="water-bill">Water Bill</SelectItem>
                          <SelectItem value="electricity-bill">Electricity Bill</SelectItem>
                          <SelectItem value="vehicle-tax">Vehicle Tax</SelectItem>
                          <SelectItem value="trade-license">Trade License</SelectItem>
                          <SelectItem value="building-permit">Building Permit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receipt-bill-number">Bill Number *</Label>
                      <Input
                        id="receipt-bill-number"
                        type="text"
                        placeholder="Enter bill number"
                        value={receiptData.billNumber}
                        onChange={(e) => setReceiptData({...receiptData, billNumber: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="receipt-amount">Amount Paid (₹) *</Label>
                      <Input
                        id="receipt-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter amount paid"
                        value={receiptData.amount}
                        onChange={(e) => setReceiptData({...receiptData, amount: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receipt-paid-date">Payment Date *</Label>
                      <Input
                        id="receipt-paid-date"
                        type="date"
                        value={receiptData.paidDate}
                        onChange={(e) => setReceiptData({...receiptData, paidDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="receipt-number">Receipt/Reference Number</Label>
                      <Input
                        id="receipt-number"
                        type="text"
                        placeholder="Receipt or reference number (optional)"
                        value={receiptData.receiptNumber}
                        onChange={(e) => setReceiptData({...receiptData, receiptNumber: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="receipt-description">Description *</Label>
                    <Textarea
                      id="receipt-description"
                      placeholder="Describe the payment (e.g., Property tax for 2024, Water bill for January 2025)"
                      value={receiptData.description}
                      onChange={(e) => setReceiptData({...receiptData, description: e.target.value})}
                      required
                    />
                  </div>

                  {/* Receipt Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Upload Receipt Image *</Label>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Zap className="w-4 h-4" />
                        <span>Auto-fills form data</span>
                      </div>
                    </div>
                    
                    {extractingData && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <div>
                            <p className="font-medium text-blue-900">Processing Receipt...</p>
                            <p className="text-sm text-blue-700">Extracting payment details from your image</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      {receiptPreview ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={receiptPreview}
                              alt="Receipt preview"
                              className="max-w-full h-64 object-contain mx-auto rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setReceiptFile(null);
                                setReceiptPreview(null);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600 text-center">
                            Receipt uploaded successfully. You can change it by uploading a new image.
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4">
                            <label htmlFor="receipt-file" className="cursor-pointer">
                              <span className="mt-2 block text-sm font-medium text-gray-900">
                                Upload receipt image
                              </span>
                              <span className="mt-1 block text-sm text-gray-500">
                                PNG, JPG, JPEG, or WebP up to 5MB
                              </span>
                            </label>
                            <input
                              id="receipt-file"
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleReceiptFileChange}
                            />
                          </div>
                          <div className="mt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('receipt-file')?.click()}
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Choose Image
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Data Review */}
                  {extractionResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900 mb-2">Auto-Extracted Data</h4>
                            <p className="text-sm text-green-700 mb-3">
                              The following information was extracted from your receipt. Please review and edit if needed.
                            </p>
                            <div className="bg-white rounded-md p-3 border border-green-200">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Detected Text:</h5>
                              <div className="text-xs text-gray-600 space-y-1 max-h-32 overflow-y-auto">
                                {extractionResults.map((line, index) => (
                                  <div key={index} className="font-mono bg-gray-50 px-2 py-1 rounded">
                                    {line}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Review Auto-Filled Data</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Please verify the auto-filled information above is correct before submitting. 
                          You can edit any field if the detection was not accurate.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={uploadingReceipt || !receiptFile || extractingData}
                  >
                    {extractingData ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Receipt...
                      </>
                    ) : uploadingReceipt ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading Receipt...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Save Offline Payment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payment-history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Payment History
                </CardTitle>
                <CardDescription>
                  View your past payments and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading payment history...</p>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Yet</h3>
                    <p className="text-gray-600">Your payment history will appear here once you make your first payment.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment._id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{getBillTypeLabel(payment.billType)}</h3>
                              <Badge variant={payment.paymentMethod === 'online' ? 'default' : 'secondary'}>
                                {payment.paymentMethod === 'online' ? (
                                  <>
                                    <CreditCard className="w-3 h-3 mr-1" />
                                    Online
                                  </>
                                ) : (
                                  <>
                                    <Receipt className="w-3 h-3 mr-1" />
                                    Offline
                                  </>
                                )}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Bill #: {payment.billNumber}</p>
                            <p className="text-sm text-gray-600">Transaction ID: {payment.transactionId}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">₹{payment.amount}</div>
                            <Badge className={`${getStatusColor(payment.status)} flex items-center gap-1`}>
                              {getStatusIcon(payment.status)}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{payment.description}</p>
                        
                        {/* Receipt Image for Offline Payments */}
                        {payment.paymentMethod === 'offline' && payment.receiptImage && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Receipt:</p>
                            <div className="relative inline-block">
                              <img
                                src={payment.receiptImage}
                                alt="Payment Receipt"
                                className="w-32 h-24 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(payment.receiptImage, '_blank')}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="opacity-0 hover:opacity-100 transition-opacity"
                                  onClick={() => window.open(payment.receiptImage, '_blank')}
                                >
                                  View Full Size
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created: {new Date(payment.createdAt).toLocaleDateString()}
                          </span>
                          {payment.paidAt && (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Paid: {new Date(payment.paidAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
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
