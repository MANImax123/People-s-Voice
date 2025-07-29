'use client';

import { useState } from 'react';

export default function TestReportPage() {
  const [result, setResult] = useState('');

  const testReport = async () => {
    const payload = {
      title: "Test pothole on main road",
      description: "There is a large pothole causing traffic issues on the main road near the community center.",
      category: "potholes",
      metropolitanCity: "Hyderabad",
      area: "Gachibowli",
      exactAddress: "Gachibowli, Hyderabad",
      reporterName: "Test User",
      reporterEmail: "test@example.com", 
      reporterPhone: "9876543210",
      photos: [{
        data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // 1x1 pixel test image
        filename: "test.png",
        mimetype: "image/png",
        size: 67
      }]
    };

    try {
      console.log('Sending payload:', payload);
      const response = await fetch('/api/issues/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', { status: response.status, data });
      
      setResult(`Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      console.error('Error:', error);
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Issue Report API</h1>
      <button onClick={testReport} style={{ padding: '10px', marginBottom: '20px' }}>
        Test Report Submission
      </button>
      <pre style={{ background: '#f5f5f5', padding: '10px', whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </div>
  );
}
