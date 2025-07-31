"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Calendar, 
  User, 
  CheckCircle, 
  MessageSquare, 
  Eye,
  EyeOff,
  Camera,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IssueCardProps {
  issue: {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: number;
    status: string;
    location: {
      metropolitanCity: string;
      area: string;
      exactAddress: string;
    };
    photos: Array<{
      data: string;
      filename: string;
    }>;
    reportedBy: {
      name: string;
      email: string;
      phone: string;
    };
    createdAt: string;
    technicianResponse?: {
      description: string;
      evidencePhotos: Array<{
        data: string;
        filename: string;
        uploadedAt: string;
      }>;
      completedAt: string;
      technicianId?: {
        name: string;
        email: string;
      };
    };
    userReplies: Array<{
      message: string;
      submittedBy: string;
      submittedAt: string;
      isFromReporter: boolean;
    }>;
  };
  onReplyAdded?: () => void;
}

export default function IssueCard({ issue, onReplyAdded }: IssueCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "destructive";
    if (priority >= 5) return "default";
    return "secondary";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return "secondary";
      case 'acknowledged': return "default";
      case 'in-progress': return "default";
      case 'resolved': return "default";
      case 'closed': return "outline";
      default: return "secondary";
    }
  };

  const submitReply = async () => {
    if (!replyMessage.trim() || !submitterName.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both your name and message.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/issues/${issue._id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyMessage,
          submittedBy: submitterName,
          isFromReporter: submitterName === issue.reportedBy.name
        }),
      });

      if (response.ok) {
        toast({
          title: "Reply submitted",
          description: "Your feedback has been added successfully.",
        });
        setReplyMessage('');
        setSubmitterName('');
        setShowReplyForm(false);
        onReplyAdded?.();
      } else {
        throw new Error('Failed to submit reply');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit reply. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hasResponse = issue.technicianResponse?.completedAt;
  const hasReplies = issue.userReplies && issue.userReplies.length > 0;

  return (
    <Card className={`w-full transition-all duration-200 ${
      hasResponse ? 'border-green-200 bg-green-50/30' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{issue.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={getStatusColor(issue.status)}>
                {issue.status.replace('-', ' ')}
              </Badge>
              <Badge variant={getPriorityColor(issue.priority)}>
                Priority {issue.priority}
              </Badge>
              <Badge variant="outline">{issue.category.replace('-', ' ')}</Badge>
              {hasResponse && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Work Completed
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {issue.location.area}, {issue.location.metropolitanCity}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(issue.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {issue.reportedBy.name}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                <EyeOff className="w-4 h-4 mr-1" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Details
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="space-y-6">
          {/* Issue Description */}
          <div>
            <h4 className="font-medium mb-2">Description:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {issue.description}
            </p>
          </div>

          {/* Original Photos */}
          {issue.photos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Original Photos:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.data}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
                      {photo.filename}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Response */}
          {hasResponse && issue.technicianResponse && (
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800">Work Completed by Tech</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-green-700">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {issue.technicianResponse.technicianId?.name || 'Tech'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(issue.technicianResponse.completedAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-green-800 mb-1">Work Description:</h5>
                  <p className="text-green-700 bg-white p-2 rounded border">
                    {issue.technicianResponse.description}
                  </p>
                </div>

                {issue.technicianResponse.evidencePhotos.length > 0 && (
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Evidence Photos:</h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {issue.technicianResponse.evidencePhotos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={photo.data}
                            alt={`Evidence ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <div className="absolute top-1 right-1">
                            <Camera className="w-3 h-3 text-white bg-green-600 rounded p-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Replies Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Community Feedback ({hasReplies ? issue.userReplies.length : 0})
              </h4>
              {hasResponse && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  Add Feedback
                </Button>
              )}
            </div>

            {/* Existing Replies */}
            {hasReplies && (
              <div className="space-y-3 mb-4">
                {issue.userReplies.map((reply, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{reply.submittedBy}</span>
                        {reply.isFromReporter && (
                          <Badge variant="outline" className="text-xs">Original Reporter</Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(reply.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Reply Form */}
            {showReplyForm && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
                <h5 className="font-medium">Share your feedback about the completed work:</h5>
                <Input
                  placeholder="Your name"
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                />
                <Textarea
                  placeholder="Your feedback or questions about the work..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  maxLength={500}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={submitReply}
                    disabled={submitting || !replyMessage.trim() || !submitterName.trim()}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </div>
            )}

            {!hasReplies && !showReplyForm && hasResponse && (
              <p className="text-gray-500 text-center py-4 text-sm">
                No feedback yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
