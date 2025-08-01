'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, CheckCircle, AlertCircle, TestTube, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TEST_CARDS = {
  success: {
    number: '4111 1111 1111 1111',
    cvv: '123',
    expiry: '12/25',
    name: 'Test User',
    description: 'Always succeeds'
  },
  failure: {
    number: '4000 0000 0000 0002',
    cvv: '123', 
    expiry: '12/25',
    name: 'Test User',
    description: 'Always fails'
  },
  authenticate: {
    number: '4000 0000 0000 3220',
    cvv: '123',
    expiry: '12/25', 
    name: 'Test User',
    description: 'Requires 3DS authentication'
  }
};

export default function PaymentTestingPage() {
  const [paymentData, setPaymentData] = useState({
    billType: 'electricity',
    billNumber: 'TEST-' + Date.now(),
    description: 'Test Payment - No Real Money',
    amount: 100,
    userEmail: 'test@example.com',
    userName: 'Test User'
  });
  const [selectedCard, setSelectedCard] = useState('success');
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const { toast } = useToast();

  const handlePayment = async () => {
    setLoading(true);
    setPaymentResult(null);

    try {
      // Create payment order
      const orderResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log('Payment order created:', orderData);

      // Simulate payment success (in real testing, Razorpay checkout would open)
      const testCard = TEST_CARDS[selectedCard];
      
      if (selectedCard === 'failure') {
        throw new Error('Test payment failed as expected');
      }

      // Simulate successful payment
      const mockPaymentId = 'pay_test_' + Date.now();
      const mockSignature = 'test_signature_' + Date.now();

      setPaymentResult({
        success: true,
        orderId: orderData.orderId,
        paymentId: mockPaymentId,
        signature: mockSignature,
        amount: paymentData.amount,
        testCard: testCard
      });

      toast({
        title: "Test Payment Successful! 🎉",
        description: `Test transaction completed. No real money charged.`,
      });

    } catch (error) {
      console.error('Payment test failed:', error);
      setPaymentResult({
        success: false,
        error: error.message,
        testCard: TEST_CARDS[selectedCard]
      });

      toast({
        title: "Test Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube className="w-8 h-8 text-blue-600" />
          Payment Testing Lab
        </h1>
        <p className="text-gray-600 mt-2">Safe environment for testing payment flows - No real money involved!</p>
      </div>

      {/* Safety Notice */}
      <Alert className="mb-6 border-green-200 bg-green-50">
        <Shield className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>100% Safe Testing:</strong> This is a test environment. No real credit cards will be charged and no actual money will be processed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Test Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="billType">Bill Type</Label>
              <Select value={paymentData.billType} onValueChange={(value) => setPaymentData({...paymentData, billType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">Electricity Bill</SelectItem>
                  <SelectItem value="water">Water Bill</SelectItem>
                  <SelectItem value="gas">Gas Bill</SelectItem>
                  <SelectItem value="tax">Property Tax</SelectItem>
                  <SelectItem value="fine">Traffic Fine</SelectItem>
                  <SelectItem value="permit">Permit Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="billNumber">Bill Number</Label>
              <Input
                id="billNumber"
                value={paymentData.billNumber}
                onChange={(e) => setPaymentData({...paymentData, billNumber: e.target.value})}
                placeholder="Enter bill number"
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({...paymentData, amount: parseInt(e.target.value) || 0})}
                placeholder="Enter amount"
                min="1"
                max="10000"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={paymentData.description}
                onChange={(e) => setPaymentData({...paymentData, description: e.target.value})}
                placeholder="Payment description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Test Credit Cards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Test Scenario</Label>
              <div className="space-y-2 mt-2">
                {Object.entries(TEST_CARDS).map(([key, card]) => (
                  <div
                    key={key}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCard === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCard(key)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{card.number}</div>
                        <div className="text-sm text-gray-600">{card.description}</div>
                      </div>
                      <Badge variant={
                        key === 'success' ? 'default' : 
                        key === 'failure' ? 'destructive' : 
                        'secondary'
                      }>
                        {key === 'success' ? 'Success' : 
                         key === 'failure' ? 'Failure' : 
                         '3DS Auth'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium mb-1">Selected Card Details:</div>
              <div className="text-sm text-gray-600">
                <div>Card: {TEST_CARDS[selectedCard].number}</div>
                <div>CVV: {TEST_CARDS[selectedCard].cvv}</div>
                <div>Expiry: {TEST_CARDS[selectedCard].expiry}</div>
                <div>Name: {TEST_CARDS[selectedCard].name}</div>
              </div>
            </div>

            <Button 
              onClick={handlePayment} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? "Processing Test Payment..." : `Pay ₹${paymentData.amount} (Test)`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment Result */}
      {paymentResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {paymentResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              Payment Test Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentResult.success ? (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">✅ Test Payment Successful!</div>
                <div className="text-sm text-gray-600">
                  <div>Order ID: {paymentResult.orderId}</div>
                  <div>Payment ID: {paymentResult.paymentId}</div>
                  <div>Amount: ₹{paymentResult.amount}</div>
                  <div>Test Card: {paymentResult.testCard.number}</div>
                  <div className="mt-2 text-green-600">
                    <strong>Note:</strong> This was a test transaction. No real money was charged.
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-red-600 font-medium">❌ Test Payment Failed</div>
                <div className="text-sm text-gray-600">
                  <div>Error: {paymentResult.error}</div>
                  <div>Test Card: {paymentResult.testCard.number}</div>
                  <div className="mt-2 text-orange-600">
                    <strong>Note:</strong> This failure was expected for testing purposes.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Testing Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Select Test Scenario:</strong> Choose a test card based on what you want to test (success, failure, or authentication).
          </div>
          <div>
            <strong>2. Fill Payment Details:</strong> Enter bill information and amount (keep amount low for testing).
          </div>
          <div>
            <strong>3. Run Test:</strong> Click "Pay" to simulate the payment flow without any real money being charged.
          </div>
          <div>
            <strong>4. Check Results:</strong> View the test results and verify the payment flow works as expected.
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <strong>Safety Reminder:</strong> All payments in this environment are simulated. No real credit cards are charged and no actual money is transferred.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
