// Test script for offline payment receipt upload
const testOfflinePayment = async () => {
  try {
    // Test data
    const testData = {
      userEmail: "test@example.com",
      userName: "Test User",
      billType: "property-tax",
      billNumber: "PT123456",
      description: "Property Tax Payment - Test",
      amount: 1500,
      paidDate: "2025-01-15",
      receiptNumber: "RCP123456",
      receiptImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Minimal test image
      paymentMethod: "offline"
    };

    const response = await fetch('http://localhost:3000/api/payments/offline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS: Offline payment saved successfully');
      console.log('Transaction ID:', result.transactionId);
      console.log('Payment details:', result.payment);
    } else {
      console.log('❌ ERROR:', result.error);
    }
  } catch (error) {
    console.log('❌ NETWORK ERROR:', error.message);
  }
};

// Run the test
testOfflinePayment();
