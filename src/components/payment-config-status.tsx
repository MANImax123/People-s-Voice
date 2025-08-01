'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Settings, ExternalLink, RefreshCw } from "lucide-react";

interface PaymentConfig {
  configured: boolean;
  keyType: string;
  hasKeyId: boolean;
  hasKeySecret: boolean;
  isPlaceholder: boolean;
  keyIdPreview: string;
  recommendations: string[];
}

export default function PaymentConfigStatus() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error checking payment config:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  if (loading) {
    return (
      <Alert>
        <Settings className="w-4 h-4" />
        <AlertDescription>Checking payment configuration...</AlertDescription>
      </Alert>
    );
  }

  if (!config) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>Failed to check payment configuration.</AlertDescription>
      </Alert>
    );
  }

  if (config.configured) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="w-4 h-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Payment Gateway Ready!</strong>
              <div className="text-sm mt-1">
                <Badge variant="outline" className="bg-white">
                  {config.keyType === 'live' ? '🔴 Live Mode' : '🟡 Test Mode'}
                </Badge>
                <span className="ml-2">Key: {config.keyIdPreview}</span>
              </div>
            </div>
            <Button onClick={checkConfig} variant="outline" size="sm">
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertCircle className="w-5 h-5" />
          Payment Gateway Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-orange-700">
            <p className="font-medium">Razorpay credentials are not configured properly.</p>
            <p className="text-sm mt-1">
              To enable payments, you need to set up your Razorpay API keys.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-orange-800">Setup Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-orange-700">
              {config.recommendations.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.open('https://dashboard.razorpay.com/signin', '_blank')}
              variant="outline"
              size="sm"
              className="bg-white"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Get Razorpay Keys
            </Button>
            <Button onClick={checkConfig} variant="outline" size="sm" className="bg-white">
              <RefreshCw className="w-3 h-3 mr-1" />
              Check Again
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Quick Setup:</strong> Create a free Razorpay account, get test keys, 
              add them to your .env.local file, and restart the server.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
