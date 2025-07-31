"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TechResponseForm, { TechResponseView } from "@/components/tech-response-form";
import { ArrowLeft, MapPin, Calendar, User, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Issue {
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
  updatedAt: string;
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
}

export default function TechIssuePage() {
  const params = useParams();
  const issueId = params.issueId as string;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // For demo purposes, using a real tech ID from the system
  // In production, this should come from auth context/session
  const technicianId = "6887aa0a3806e0cac0913572"; // This should be dynamic from auth

  useEffect(() => {
    if (issueId) {
      fetchIssue();
    }
  }, [issueId]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tech/issues/${issueId}`);
      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
      } else {
        throw new Error('Failed to fetch issue');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load issue details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmitted = () => {
    fetchIssue(); // Reload the issue to show the updated response
  };

  const handleAddReply = async (message: string, submittedBy: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          submittedBy,
          isFromReporter: false
        }),
      });

      if (response.ok) {
        toast({
          title: "Reply added",
          description: "Your feedback has been submitted.",
        });
        fetchIssue(); // Reload to show new reply
      } else {
        throw new Error('Failed to add reply');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add reply. Please try again.",
      });
    }
  };

  const updateIssueStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Status updated",
          description: `Issue status changed to ${newStatus}`,
        });
        fetchIssue();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status.",
      });
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading issue details...</div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Issue not found</div>
      </div>
    );
  }

  const isWorkCompleted = issue.technicianResponse?.completedAt;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/technician">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Issue Details</h1>
          <p className="text-gray-600">Manage and update issue status</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Issue Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{issue.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusColor(issue.status)}>
                      {issue.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant={getPriorityColor(issue.priority)}>
                      Priority {issue.priority}
                    </Badge>
                    <Badge variant="outline">{issue.category.replace('-', ' ')}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {issue.status !== 'in-progress' && !isWorkCompleted && (
                    <Button 
                      onClick={() => updateIssueStatus('in-progress')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Work
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description:</h4>
                <p className="text-gray-700">{issue.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{issue.location.area}, {issue.location.metropolitanCity}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{issue.reportedBy.name}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Exact Address:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {issue.location.exactAddress}
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
            </CardContent>
          </Card>

          {/* Tech Response Form or View */}
          {!isWorkCompleted && issue.status === 'in-progress' ? (
            <TechResponseForm
              issueId={issue._id}
              techId={technicianId}
              onResponseSubmitted={handleResponseSubmitted}
            />
          ) : isWorkCompleted && issue.technicianResponse ? (
            <TechResponseView
              response={issue.technicianResponse}
              userReplies={issue.userReplies || []}
              onAddReply={handleAddReply}
            />
          ) : null}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reporter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-sm text-gray-600">{issue.reportedBy.name}</p>
              </div>
              <div>
                <span className="font-medium">Email:</span>
                <p className="text-sm text-gray-600">{issue.reportedBy.email}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p className="text-sm text-gray-600">{issue.reportedBy.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {issue.status === 'reported' && (
                <Button 
                  onClick={() => updateIssueStatus('acknowledged')}
                  variant="outline" 
                  className="w-full"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Acknowledge Issue
                </Button>
              )}
              {issue.status === 'acknowledged' && (
                <Button 
                  onClick={() => updateIssueStatus('in-progress')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Working
                </Button>
              )}
              {isWorkCompleted && issue.status !== 'closed' && (
                <Button 
                  onClick={() => updateIssueStatus('closed')}
                  variant="outline"
                  className="w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Close Issue
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
