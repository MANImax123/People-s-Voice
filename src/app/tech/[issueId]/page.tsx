"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Calendar, User, AlertCircle, Upload, Camera } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

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
  reportedBy: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  photos?: Array<{
    data: string;
    filename: string;
    mimetype: string;
  }>;
  technicianResponse?: {
    description: string;
    evidencePhotos: Array<{
      data: string;
      filename: string;
      mimetype: string;
    }>;
    completedAt: string;
    techId: string;
  };
  userReplies?: Array<{
    userId: string;
    userName: string;
    message: string;
    timestamp: string;
  }>;
}

export default function TechIssueDetail() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [responseDescription, setResponseDescription] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState<File[]>([]);

  useEffect(() => {
    if (params.issueId) {
      fetchIssue();
    }
  }, [params.issueId]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tech/issues/${params.issueId}`);
      if (response.ok) {
        const data = await response.json();
        setIssue(data.issue);
        if (data.issue.technicianResponse?.description) {
          setResponseDescription(data.issue.technicianResponse.description);
        }
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setEvidencePhotos(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const submitTechResponse = async () => {
    if (!responseDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a description of the work completed.",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('description', responseDescription);
      
      evidencePhotos.forEach((photo, index) => {
        formData.append(`evidencePhotos`, photo);
      });

      const response = await fetch(`/api/tech/issues/${params.issueId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your response has been submitted successfully.",
        });
        fetchIssue(); // Refresh the issue data
        setResponseDescription('');
        setEvidencePhotos([]);
      } else {
        throw new Error('Failed to submit response');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your response. Please try again.",
      });
    } finally {
      setSubmitting(false);
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
        <div className="text-center">
          <p className="text-gray-500 mb-4">Issue not found</p>
          <Link href="/tech">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tech">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <p className="text-gray-600">Issue Details & Response Management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Issue Information
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(issue.priority)}>
                    Priority: {issue.priority}
                  </Badge>
                  <Badge variant={getStatusColor(issue.status)}>
                    {issue.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Description</Label>
                <p className="mt-1">{issue.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Category</Label>
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
                <span>Reported on {new Date(issue.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Reported by {issue.reportedBy.name} ({issue.reportedBy.email})</span>
              </div>
            </CardContent>
          </Card>

          {/* Issue Photos */}
          {issue.photos && issue.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Issue Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {issue.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={`data:${photo.mimetype};base64,${photo.data}`}
                        alt={`Issue photo ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tech Response */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Submit Work Evidence
              </CardTitle>
              <CardDescription>
                Document your work with photos and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Work Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work performed, materials used, and current status..."
                  value={responseDescription}
                  onChange={(e) => setResponseDescription(e.target.value)}
                  className="min-h-[120px]"
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="photos">Evidence Photos</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={submitting}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload before/after photos of your work
                </p>
              </div>

              {/* Photo Preview */}
              {evidencePhotos.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Photos</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {evidencePhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-500">
                          📷 {photo.name}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removePhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={submitTechResponse}
                disabled={submitting || !responseDescription.trim()}
                className="w-full"
              >
                {submitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Work Evidence
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Previous Response */}
          {issue.technicianResponse && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Response</CardTitle>
                <CardDescription>
                  Submitted on {new Date(issue.technicianResponse.completedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="mt-1">{issue.technicianResponse.description}</p>
                </div>

                {issue.technicianResponse.evidencePhotos.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Evidence Photos</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {issue.technicianResponse.evidencePhotos.map((photo, index) => (
                        <div key={index} className="relative aspect-square">
                          <Image
                            src={`data:${photo.mimetype};base64,${photo.data}`}
                            alt={`Evidence photo ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
