'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function WhatsAppTestPanel() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('Hello! This is a test message from CMR Civic Platform.');
  const [title, setTitle] = useState('Test Notification');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);

  // Check WhatsApp configuration status
  const checkStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  // Send test WhatsApp message
  const sendTestMessage = async () => {
    if (!phoneNumber || !message) {
      alert('Please fill in phone number and message');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programId: 'test-program-' + Date.now(),
          userPhoneNumbers: [phoneNumber],
          notificationType: 'test'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to send message: ' + error
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-check status on component mount
  useState(() => {
    checkStatus();
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <MessageCircle className="text-green-600" />
          WhatsApp Integration Test
        </h1>
        <p className="text-gray-600 mt-2">Test your Twilio WhatsApp integration</p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Configuration Status
          </CardTitle>
          <CardDescription>
            Current WhatsApp integration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Service Status</label>
              <div className="flex items-center gap-2 mt-1">
                {status?.stats?.whatsappConfigured ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Configured
                    </Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-600" />
                    <Badge variant="destructive">
                      Not Configured
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Total Users</label>
              <p className="text-lg font-bold">{status?.stats?.totalUsers || 0}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Active Programs</label>
              <p className="text-lg font-bold">{status?.stats?.totalActivePrograms || 0}</p>
            </div>
            
            <div>
              <Button onClick={checkStatus} variant="outline" size="sm">
                Refresh Status
              </Button>
            </div>
          </div>

          {!status?.stats?.whatsappConfigured && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Setup Required:</strong> Please configure your Twilio credentials in .env.local file. 
                Check TWILIO_WHATSAPP_SETUP.md for detailed instructions.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Message Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Test Message
          </CardTitle>
          <CardDescription>
            Send a test WhatsApp message to verify integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: +91XXXXXXXXXX (Indian numbers) or +1XXXXXXXXXX (US numbers)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Message Title</label>
            <Input
              type="text"
              placeholder="Test Notification"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Message Content</label>
            <Textarea
              placeholder="Enter your test message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              rows={4}
            />
          </div>

          <Button 
            onClick={sendTestMessage}
            disabled={loading || !phoneNumber || !message}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Test Message'}
          </Button>

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <h3 className="font-medium">
                  {result.success ? 'Message Sent Successfully!' : 'Failed to Send Message'}
                </h3>
              </div>
              
              {result.message && (
                <p className="text-sm mt-2">{result.message}</p>
              )}
              
              {result.notifications && (
                <div className="text-sm mt-2">
                  <p>Sent: {result.notifications.totalSent}</p>
                  <p>Failed: {result.notifications.failed}</p>
                </div>
              )}
              
              {result.error && (
                <p className="text-sm text-red-600 mt-2">{result.error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">1</span>
              <p>Create a Twilio account at <a href="https://www.twilio.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">twilio.com</a></p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">2</span>
              <p>Get your Account SID and Auth Token from the Twilio Console</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">3</span>
              <p>Join the WhatsApp Sandbox by sending "join &lt;sandbox-name&gt;" to +1 415 523 8886</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">4</span>
              <p>Update your .env.local file with the credentials</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">5</span>
              <p>Restart your development server</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
