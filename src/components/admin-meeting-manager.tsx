'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye
} from 'lucide-react';

interface MeetingRequest {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'completed' | 'cancelled';
  adminResponse?: string;
  selectedDate?: string;
  selectedTime?: string;
  meetingDescription?: string;
  meetingType: string;
  priority: string;
  createdAt: string;
}

interface AdminMeetingManagerProps {
  adminId: string;
}

export default function AdminMeetingManager({ adminId }: AdminMeetingManagerProps) {
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchMeetingRequests();
  }, []);

  const fetchMeetingRequests = async () => {
    try {
      const response = await fetch('/api/meeting-requests?admin=true');
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

  const handleResponse = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId);
    setMessage(null);

    try {
      const response = await fetch('/api/meeting-requests/admin-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
          adminId,
          adminResponse
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `Meeting request ${action}d successfully. User has been notified via email.` 
        });
        setAdminResponse('');
        setSelectedRequest(null);
        fetchMeetingRequests(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: data.error || `Failed to ${action} meeting request` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
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

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800', icon: null },
      medium: { color: 'bg-blue-100 text-blue-800', icon: null },
      high: { color: 'bg-orange-100 text-orange-800', icon: <AlertTriangle className="w-3 h-3" /> },
      urgent: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3" /> }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingRequests = meetingRequests.filter(req => req.status === 'pending');
  const otherRequests = meetingRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          {message.type === 'success' ? 
            <CheckCircle className="h-4 w-4 text-green-600" /> : 
            <XCircle className="h-4 w-4 text-red-600" />
          }
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Pending Meeting Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending meeting requests</p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4 bg-yellow-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{request.userName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {request.userEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {request.userPhone}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="font-medium">Meeting Type:</span> {request.meetingType.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Requested:</span> {formatDate(request.requestDate)}
                    </div>
                  </div>

                  {request.meetingDescription && (
                    <div className="mb-4">
                      <span className="font-medium text-sm">Initial Description:</span>
                      <p className="text-sm text-gray-600 mt-1 bg-white p-2 rounded border">
                        {request.meetingDescription}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Approve Meeting Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Approving meeting request for <strong>{request.userName}</strong></p>
                          <div>
                            <label className="text-sm font-medium">Admin Response (Optional)</label>
                            <Textarea
                              placeholder="Add any additional instructions or notes for the user..."
                              value={adminResponse}
                              onChange={(e) => setAdminResponse(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleResponse(request._id, 'approve')}
                              disabled={processingId === request._id}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {processingId === request._id ? 'Processing...' : 'Approve & Notify User'}
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Meeting Request</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Rejecting meeting request for <strong>{request.userName}</strong></p>
                          <div>
                            <label className="text-sm font-medium">Reason for Rejection *</label>
                            <Textarea
                              placeholder="Please provide a reason for rejecting this meeting request..."
                              value={adminResponse}
                              onChange={(e) => setAdminResponse(e.target.value)}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleResponse(request._id, 'reject')}
                              disabled={processingId === request._id || !adminResponse.trim()}
                              variant="destructive"
                            >
                              {processingId === request._id ? 'Processing...' : 'Reject & Notify User'}
                            </Button>
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Requests History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            All Meeting Requests ({meetingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meetingRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No meeting requests found</p>
          ) : (
            <div className="space-y-3">
              {meetingRequests.map((request) => (
                <div key={request._id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{request.userName}</h4>
                      <p className="text-sm text-gray-600">
                        {request.meetingType.replace('_', ' ')} • {formatDate(request.requestDate)}
                      </p>
                      {request.status === 'scheduled' && request.selectedDate && (
                        <p className="text-sm text-blue-600 font-medium mt-1">
                          Scheduled: {formatDate(request.selectedDate)} at {request.selectedTime}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
