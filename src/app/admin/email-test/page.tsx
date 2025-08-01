'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, TestTube } from 'lucide-react';

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [configStatus, setConfigStatus] = useState<any>(null);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
    // Fetch email configuration status from API
    fetchConfigStatus();
  }, []);

  const fetchConfigStatus = async () => {
    try {
      const response = await fetch('/api/email-config-status');
      const data = await response.json();
      setConfigStatus(data);
    } catch (error) {
      console.error('Failed to fetch config status:', error);
    }
  };

  const testEmail = async () => {
    if (!email || email.trim() === '') {
      setResult({ success: false, error: 'Please enter an email address' });
      return;
    }

    console.log('🔍 Testing email with:', email.trim());
    setLoading(true);
    setResult(null);

    try {
      const payload = { to: email.trim() };
      console.log('� Sending payload:', payload);
      
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📨 Response status:', response.status);
      const data = await response.json();
      console.log('📨 Response data:', data);
      setResult(data);
    } catch (error: any) {
      setResult({ 
        success: false, 
        error: 'Failed to test email',
        details: { message: error?.message || 'Unknown error' }
      });
    } finally {
      setLoading(false);
    }
  };

  const quickEmailTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('🚀 Starting quick email test...');
      const response = await fetch('/api/quick-email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📨 Quick test response status:', response.status);
      const data = await response.json();
      console.log('📨 Quick test response data:', data);
      setResult(data);
    } catch (error: any) {
      setResult({ 
        success: false, 
        error: 'Quick email test failed',
        details: { message: error?.message || 'Unknown error' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Configuration Test</h1>
              <p className="text-gray-600">
                Test if email notifications are working correctly for meeting approvals
              </p>
            </div>
          </div>
        </div>

        {/* Email Test Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Send Test Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Test Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter email address to test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Button 
              onClick={testEmail}
              disabled={loading || !email}
              className="w-full mb-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Testing Email...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Send Test Email
                </div>
              )}
            </Button>

            <Button 
              onClick={quickEmailTest}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  Quick Testing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Quick Test (No Validation)
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className={result.success ? 'text-green-700' : 'text-red-700'}>
                {result.success ? '✅ Email Test Results' : '❌ Email Test Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success ? (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-800">
                        Email sent successfully! 🎉
                      </p>
                      <div className="text-sm text-green-700">
                        <p><strong>Message ID:</strong> {result.messageId}</p>
                        <p><strong>From:</strong> {result.from}</p>
                        <p><strong>To:</strong> {result.to}</p>
                        <p className="mt-2">
                          Check your inbox (including spam folder) for the test email.
                        </p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold text-red-800">
                        Email test failed 😞
                      </p>
                      <div className="text-sm text-red-700">
                        <p><strong>Error:</strong> {result.error}</p>
                        {result.details && (
                          <div className="mt-2">
                            <p><strong>Details:</strong></p>
                            <pre className="bg-red-100 p-2 rounded text-xs overflow-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Email Configuration Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔧 Email Configuration Check</CardTitle>
          </CardHeader>
          <CardContent>
            {mounted && configStatus ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">EMAIL_USER:</span>
                  <span className="text-gray-600">
                    {configStatus.emailUser ? '✅ Configured' : '❌ Missing'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">EMAIL_PASS:</span>
                  <span className="text-gray-600">
                    {configStatus.emailPass ? '✅ Configured' : '❌ Missing'}
                  </span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> Make sure your Gmail account has "2-Step Verification" enabled 
                    and you're using an "App Password" instead of your regular password.
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
