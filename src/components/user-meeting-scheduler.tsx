'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface MeetingRequest {
  _id: string;
  status: string;
  meetingType: string;
  priority: string;
  requestDate: string;
  approvedDate?: string;
  selectedDate?: string;
  selectedTime?: string;
  meetingDescription?: string;
  adminResponse?: string;
}

interface UserMeetingSchedulerProps {
  userId: string;
}

export default function UserMeetingScheduler({ userId }: UserMeetingSchedulerProps) {
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Available time slots (you can customize these)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    fetchMeetingRequests();
  }, [userId]);

  const fetchMeetingRequests = async () => {
    try {
      const response = await fetch(`/api/meeting-requests?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setMeetingRequests(data.meetingRequests);
      }
    } catch (error) {
      console.error('Error fetching meeting requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    if (!selectedRequest || !selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Please select both date and time for your meeting.' });
      return;
    }

    setScheduling(true);
    setMessage(null);

    try {
      const response = await fetch('/api/meeting-requests/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          selectedDate: selectedDate.toISOString(),
          selectedTime,
          meetingDescription,
          userId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Meeting scheduled successfully! You will receive a confirmation email shortly.' 
        });
        setSelectedRequest(null);
        setSelectedDate(undefined);
        setSelectedTime('');
        setMeetingDescription('');
        fetchMeetingRequests(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to schedule meeting' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setScheduling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Ready to Schedule' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      cancelled: { color: 'bg-orange-100 text-orange-800', label: 'Cancelled' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDateDisabled = (date: Date) => {
    // Disable past dates and weekends
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const day = date.getDay();
    return date < today || day === 0 || day === 6; // Disable Sundays (0) and Saturdays (6)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const approvedRequests = meetingRequests.filter(req => req.status === 'approved');
  const scheduledRequests = meetingRequests.filter(req => req.status === 'scheduled');
  const otherRequests = meetingRequests.filter(req => !['approved', 'scheduled'].includes(req.status));

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          {message.type === 'success' ? 
            <CheckCircle className="h-4 w-4 text-green-600" /> : 
            <AlertCircle className="h-4 w-4 text-red-600" />
          }
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Approved Requests - Ready to Schedule */}
      {approvedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              Ready to Schedule ({approvedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {approvedRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Meeting Request Approved!</h3>
                      <p className="text-sm text-gray-600">
                        {request.meetingType.replace('_', ' ')} • Approved on {formatDate(request.approvedDate!)}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {request.adminResponse && (
                    <div className="mb-4 p-3 bg-blue-50 rounded border">
                      <h4 className="font-medium text-blue-800 text-sm">Admin Message:</h4>
                      <p className="text-sm text-blue-700 mt-1">{request.adminResponse}</p>
                    </div>
                  )}

                  <Button 
                    onClick={() => setSelectedRequest(request)}
                    className="w-full"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Schedule This Meeting
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduling Interface */}
      {selectedRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Schedule Your Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Meeting Details</h3>
              <p className="text-sm text-blue-700">
                Type: {selectedRequest.meetingType.replace('_', ' ')} • Priority: {selectedRequest.priority.toUpperCase()}
              </p>
            </div>

            {/* Calendar */}
            <div>
              <h4 className="font-medium mb-2">Select Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border"
              />
              <p className="text-xs text-gray-500 mt-2">
                * Weekends are not available. Please select a weekday.
              </p>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <h4 className="font-medium mb-2">Select Time</h4>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Meeting Description */}
            <div>
              <h4 className="font-medium mb-2">
                Meeting Description (Optional)
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Provide details about what you'd like to discuss
                </span>
              </h4>
              <Textarea
                placeholder="Describe the purpose of your meeting, specific topics you want to discuss, or any materials you'll bring..."
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {meetingDescription.length}/1000 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleScheduleMeeting}
                disabled={!selectedDate || !selectedTime || scheduling}
                className="flex-1"
              >
                {scheduling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Scheduling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Meeting
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedRequest(null);
                  setSelectedDate(undefined);
                  setSelectedTime('');
                  setMeetingDescription('');
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Meetings */}
      {scheduledRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Your Scheduled Meetings ({scheduledRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {request.meetingType.replace('_', ' ')}
                      </h3>
                      <p className="text-blue-700 font-medium">
                        📅 {formatDate(request.selectedDate!)} at {request.selectedTime}
                      </p>
                      {request.meetingDescription && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Discussion:</strong> {request.meetingDescription}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="mt-3 p-3 bg-white rounded border">
                    <h4 className="font-medium text-sm mb-1">📍 Meeting Location</h4>
                    <p className="text-sm text-gray-600">
                      Municipal Corporation Office<br />
                      Main Conference Room, 2nd Floor
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Requests */}
      {otherRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              Request History ({otherRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {otherRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {request.meetingType.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Requested on {formatDate(request.requestDate)}
                      </p>
                      {request.status === 'rejected' && request.adminResponse && (
                        <p className="text-sm text-red-600 mt-1">
                          <strong>Reason:</strong> {request.adminResponse}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Requests Message */}
      {meetingRequests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-600 mb-2">No Meeting Requests</h3>
            <p className="text-sm text-gray-500">
              You haven't submitted any meeting requests yet. Submit your first request to get started!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
