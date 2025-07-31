"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Calendar, User, CheckCircle, Camera, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Issue {
  _id: string;
  issueNumber: string;
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
    mimetype: string;
    size: number;
    uploadedAt: string;
  }>;
  reportedBy: {
    name: string;
    email: string;
    phone: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    specialization: string;
  };
  technicianResponse?: {
    description: string;
    evidencePhotos: Array<{
      data: string;
      filename: string;
      mimetype: string;
      size: number;
      uploadedAt: string;
    }>;
    completedAt: string;
    technicianId?: {
      name: string;
      email: string;
    };
  };
  aiAnalysis?: {
    priorityReason: string;
    severityFactors: Array<{
      factor: string;
      impact: string;
      score: number;
    }>;
    confidence: number;
  };
  reportedAt: string;
  updatedAt: string;
}

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchIssue();
    }
  }, [params.id]);

  const fetchIssue = async () => {
    try {
      const response = await fetch(`/api/issues/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
      } else {
        throw new Error('Failed to fetch issue details');
      }
    } catch (error) {
      console.error('Error fetching issue:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load issue details.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800 border-red-200';
    if (priority >= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (priority >= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'High Priority';
    if (priority >= 6) return 'Medium-High';
    if (priority >= 4) return 'Medium';
    return 'Low Priority';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h1>
            <Link href="/issues" className="text-blue-600 hover:text-blue-800">
              ← Back to Issues
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasResponse = issue.technicianResponse?.completedAt;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/issues">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Issues
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Issue #{issue.issueNumber}
          </h1>
        </div>

        <div className="space-y-6">
          {/* Main Issue Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {issue.title}
                  </h2>
                  <div className="flex gap-2 mb-2">
                    <Badge className={`${getPriorityColor(issue.priority)}`}>
                      Priority: {issue.priority}/10 - {getPriorityLabel(issue.priority)}
                    </Badge>
                    <Badge className={`${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{issue.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-1">Category</h3>
                <div className="mt-1">
                  <Badge variant="outline">{issue.category.replace('-', ' ')}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{issue.location.exactAddress}, {issue.location.area}, {issue.location.metropolitanCity}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Reported on {new Date(issue.reportedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Reported by {issue.reportedBy.name}</span>
              </div>

              {issue.assignedTo && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Assigned to {issue.assignedTo.name} ({issue.assignedTo.specialization})</span>
                </div>
              )}

              {/* Original Photos */}
              {issue.photos.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Original Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {issue.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo.data}
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tech Response Card */}
          {hasResponse && issue.technicianResponse && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Work Completed by Tech
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-green-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-green-700">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{issue.technicianResponse.technicianId?.name || 'Tech'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Completed on {new Date(issue.technicianResponse.completedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Work Description</h4>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <p className="text-green-700">{issue.technicianResponse.description}</p>
                    </div>
                  </div>

                  {issue.technicianResponse.evidencePhotos.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Evidence Photos</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {issue.technicianResponse.evidencePhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo.data}
                              alt={`Evidence ${index + 1}`}
                              className="w-full h-32 object-cover rounded border border-green-200"
                            />
                            <div className="absolute top-1 right-1">
                              <Camera className="w-4 h-4 text-white bg-green-600 rounded p-0.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Response Message */}
          {!hasResponse && issue.status !== 'completed' && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <Clock className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Work in Progress
                </h3>
                <p className="text-gray-600">
                  {issue.status === 'assigned' ? 
                    'This issue has been assigned to a tech and is waiting to be started.' :
                    issue.status === 'in-progress' ?
                    'A tech is currently working on this issue. You will see the completion details here once the work is finished.' :
                    'This issue is still being processed.'
                  }
                </p>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {issue.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>🤖 AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Priority Reasoning</h4>
                    <p className="text-gray-600 text-sm">{issue.aiAnalysis.priorityReason}</p>
                  </div>
                  
                  {issue.aiAnalysis.severityFactors && issue.aiAnalysis.severityFactors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Severity Factors</h4>
                      <div className="space-y-2">
                        {issue.aiAnalysis.severityFactors.map((factor, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                            <div className="font-medium text-gray-700">{factor.factor}</div>
                            <div className="text-gray-600">{factor.impact}</div>
                            <div className="text-xs text-gray-500">Score: {factor.score}/10</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Confidence: {Math.round((issue.aiAnalysis.confidence || 0) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
