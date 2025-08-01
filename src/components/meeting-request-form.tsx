'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface MeetingRequestFormProps {
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
}

export default function MeetingRequestForm({ userId, userEmail, userName, userPhone }: MeetingRequestFormProps) {
  const [formData, setFormData] = useState({
    meetingType: '',
    priority: 'medium',
    initialDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const meetingTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'complaint', label: 'File a Complaint' },
    { value: 'suggestion', label: 'Suggestion/Feedback' },
    { value: 'project_proposal', label: 'Project Proposal' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/meeting-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userEmail,
          userName,
          userPhone,
          ...formData
        }),
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (response.ok && data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Meeting request submitted successfully! You will receive an email once the admin reviews your request.' 
        });
        setFormData({
          meetingType: '',
          priority: 'medium',
          initialDescription: ''
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to submit meeting request' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Request Meeting with Municipal Corporation
        </CardTitle>
        <p className="text-sm text-gray-600">
          Submit a request to meet with municipal officials. All requests are reviewed by administrators.
        </p>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {message.type === 'success' ? 
              <CheckCircle className="h-4 w-4 text-green-600" /> : 
              <AlertCircle className="h-4 w-4 text-red-600" />
            }
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* User Information Display */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>{userName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{userEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{userPhone}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meeting Type */}
          <div className="space-y-2">
            <Label htmlFor="meetingType">Meeting Type *</Label>
            <Select onValueChange={(value) => handleInputChange('meetingType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of meeting" />
              </SelectTrigger>
              <SelectContent>
                {meetingTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => handleInputChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Description */}
          <div className="space-y-2">
            <Label htmlFor="initialDescription">
              Initial Description (Optional)
              <span className="text-sm text-gray-500 font-normal ml-2">
                Brief description of what you'd like to discuss
              </span>
            </Label>
            <Textarea
              id="initialDescription"
              placeholder="Provide a brief overview of the purpose of your meeting request..."
              value={formData.initialDescription}
              onChange={(e) => handleInputChange('initialDescription', e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {formData.initialDescription.length}/500 characters
            </p>
          </div>

          {/* Information Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              What happens next?
            </h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Your request will be reviewed by our administrators</li>
              <li>You'll receive an email notification about the decision</li>
              <li>If approved, you can select your preferred date and time</li>
              <li>Final confirmation will be sent to both parties</li>
            </ol>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !formData.meetingType}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting Request...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Submit Meeting Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
