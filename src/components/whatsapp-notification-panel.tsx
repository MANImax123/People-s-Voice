'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Users, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Smartphone,
  Bell,
  Settings,
  Eye
} from "lucide-react";

interface Program {
  _id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
}

interface User {
  name: string;
  phoneNumber: string;
  email: string;
}

interface NotificationStats {
  totalUsers: number;
  totalActivePrograms: number;
  whatsappConfigured: boolean;
}

interface WhatsAppConfig {
  isConfigured: boolean;
  primaryApi: string;
  hasMetaConfig: boolean;
  hasTwilioConfig: boolean;
  guide: {
    status: string;
    message: string;
    nextSteps: string[];
  };
}

export default function WhatsAppNotificationPanel() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [customPhoneNumbers, setCustomPhoneNumbers] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load programs
      const programsResponse = await fetch('/api/programs?status=all&limit=50');
      if (programsResponse.ok) {
        const programsData = await programsResponse.json();
        setPrograms(programsData.programs || []);
      }

      // Load notification stats and users
      const statsResponse = await fetch('/api/whatsapp?includeUsers=true');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.stats);
        setUsers(statsData.users || []);
      }

      // Load WhatsApp configuration
      const configResponse = await fetch('/api/whatsapp/config');
      if (configResponse.ok) {
        const configData = await configResponse.json();
        setConfig(configData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotifications = async () => {
    if (!selectedProgram) {
      toast({
        title: "Program Required",
        description: "Please select a program to notify users about.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      let phoneNumbers: string[] = [];

      // Parse custom phone numbers if provided
      if (customPhoneNumbers.trim()) {
        phoneNumbers = customPhoneNumbers
          .split(',')
          .map(phone => phone.trim())
          .filter(phone => phone.length > 0);
      }

      // Add selected users' phone numbers
      if (selectedUsers.length > 0) {
        const selectedUserPhones = users
          .filter(user => selectedUsers.includes(user.email))
          .map(user => user.phoneNumber);
        phoneNumbers = [...phoneNumbers, ...selectedUserPhones];
      }

      // Remove duplicates
      phoneNumbers = [...new Set(phoneNumbers)];

      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: selectedProgram,
          userPhoneNumbers: phoneNumbers.length > 0 ? phoneNumbers : undefined
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Notifications Sent!",
          description: `Successfully sent to ${result.notifications.totalSent} users. ${result.notifications.failed} failed.`,
        });
        
        // Reset form
        setSelectedProgram('');
        setSelectedUsers([]);
        setCustomPhoneNumbers('');
      } else {
        throw new Error(result.error || 'Failed to send notifications');
      }
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send notifications.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const toggleUserSelection = (userEmail: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(userEmail)) {
        return prev.filter(email => email !== userEmail);
      } else {
        return [...prev, userEmail];
      }
    });
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.email));
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading WhatsApp notification panel...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-green-600" />
          WhatsApp Notifications
        </h1>
        <p className="text-gray-600 mt-2">Send program notifications to users via WhatsApp</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
              </div>
              <div className="ml-auto">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-green-600">{stats?.totalActivePrograms || 0}</p>
              </div>
              <div className="ml-auto">
                <Bell className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">WhatsApp Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {config?.isConfigured ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {config.primaryApi}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Console Mode (Testing)</span>
                    </>
                  )}
                </div>
              </div>
              <div className="ml-auto">
                <Settings className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Guide */}
      {config && config.guide.status === 'needs-setup' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              WhatsApp Setup Required
            </CardTitle>
            <CardDescription className="text-orange-700">
              {config.guide.message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-800">Next Steps:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                {config.guide.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  💡 <strong>Testing Tip:</strong> For immediate testing without API setup, the system works in Console Mode. 
                  All messages will be logged to your terminal - perfect for testing the workflow!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send Program Notifications
          </CardTitle>
          <CardDescription>
            Notify users about new or updated government programs via WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Program Selection */}
          <div className="space-y-2">
            <Label htmlFor="program">Select Program *</Label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a program to notify about" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program._id} value={program._id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{program.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {program.category}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* User Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Target Users (Optional)</Label>
              <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Select Users ({selectedUsers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[70vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Select Users for Notification</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {selectedUsers.length} of {users.length} users selected
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllUsers}
                      >
                        {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                      </Button>
                    </div>
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                      {users.map((user) => (
                        <div
                          key={user.email}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedUsers.includes(user.email)
                              ? 'bg-blue-50 border-blue-300'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => toggleUserSelection(user.email)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm flex items-center gap-1">
                                <Smartphone className="w-3 h-3" />
                                {user.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-gray-500">
              Leave empty to send to all users. Select specific users above or add custom phone numbers below.
            </p>
          </div>

          {/* Custom Phone Numbers */}
          <div className="space-y-2">
            <Label htmlFor="customPhones">Additional Phone Numbers (Optional)</Label>
            <Textarea
              id="customPhones"
              placeholder="Enter phone numbers separated by commas (e.g., +919876543210, +919876543211)"
              value={customPhoneNumbers}
              onChange={(e) => setCustomPhoneNumbers(e.target.value)}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              Add phone numbers of users not in the system. Use international format (+91 for India).
            </p>
          </div>

          {/* Send Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={sendNotifications}
              disabled={sending || !selectedProgram}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send WhatsApp Notifications'}
            </Button>
            
            {!stats?.whatsappConfigured && (
              <Badge variant="outline" className="text-orange-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                Console Mode - Check terminal for messages
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Info */}
      {!stats?.whatsappConfigured && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              WhatsApp Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-orange-700">
              <p>To enable actual WhatsApp sending, configure these environment variables:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li><code>TWILIO_ACCOUNT_SID</code> - Your Twilio Account SID</li>
                <li><code>TWILIO_AUTH_TOKEN</code> - Your Twilio Auth Token</li>
                <li><code>TWILIO_WHATSAPP_FROM</code> - Your Twilio WhatsApp number (e.g., whatsapp:+14155238886)</li>
              </ul>
              <p className="mt-3">
                Get these credentials from <a href="https://console.twilio.com/" target="_blank" className="underline font-medium">Twilio Console</a>.
                Currently running in console mode - notifications will be logged to the terminal.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
