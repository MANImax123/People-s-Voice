"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, CheckCircle, MessageSquare, User, Calendar } from "lucide-react";

interface TechResponseFormProps {
  issueId: string;
  onResponseSubmitted: () => void;
  techId: string;
}

interface EvidencePhoto {
  data: string;
  filename: string;
  mimetype: string;
  size: number;
}

export default function TechResponseForm({ 
  issueId, 
  onResponseSubmitted, 
  techId 
}: TechResponseFormProps) {
  const [description, setDescription] = useState('');
  const [evidencePhotos, setEvidencePhotos] = useState<EvidencePhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} is larger than 5MB. Please choose a smaller file.`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        const newPhoto: EvidencePhoto = {
          data: base64Data,
          filename: file.name,
          mimetype: file.type,
          size: file.size
        };
        
        setEvidencePhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const submitResponse = async () => {
    if (!description.trim()) {
      toast({
        variant: "destructive",
        title: "Description required",
        description: "Please provide a description of the work completed.",
      });
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(`/api/tech/issues/${issueId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          evidencePhotos,
          techId
        }),
      });

      if (response.ok) {
        toast({
          title: "Response submitted",
          description: "Your work completion report has been submitted successfully.",
        });
        setDescription('');
        setEvidencePhotos([]);
        onResponseSubmitted();
      } else {
        throw new Error('Failed to submit response');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit response. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Complete Work & Submit Evidence
        </CardTitle>
        <CardDescription>
          Upload photos and provide a description of the completed work
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="work-description">Work Description *</Label>
          <Textarea
            id="work-description"
            placeholder="Describe the work you completed, any challenges faced, and the current status..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px]"
            maxLength={1000}
          />
          <div className="text-sm text-gray-500">
            {description.length}/1000 characters
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-4">
          <Label>Evidence Photos</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-700">Upload Evidence Photos</p>
              <p className="text-sm text-gray-500">
                Take photos showing the completed work (Max 5MB per file)
              </p>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {/* Photo Preview */}
          {evidencePhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {evidencePhotos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.data}
                    alt={`Evidence ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {photo.filename}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            onClick={submitResponse}
            disabled={uploading || !description.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {uploading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Work Completion
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface TechResponseViewProps {
  response: {
    description: string;
    evidencePhotos: Array<{
      data: string;
      filename: string;
      uploadedAt: string;
    }>;
    completedAt: string;
    techId?: {
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
  onAddReply?: (message: string, submittedBy: string) => void;
}

export function TechResponseView({ 
  response, 
  userReplies, 
  onAddReply 
}: TechResponseViewProps) {
  const [replyMessage, setReplyMessage] = useState('');
  const [submitterName, setSubmitterName] = useState('');

  const handleAddReply = () => {
    if (!replyMessage.trim() || !submitterName.trim()) return;
    
    onAddReply?.(replyMessage, submitterName);
    setReplyMessage('');
    setSubmitterName('');
  };

  return (
    <div className="space-y-6">
      {/* Tech Response */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Work Completed
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {response.techId?.name || 'Tech'}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(response.completedAt).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Work Description:</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
              {response.description}
            </p>
          </div>

          {response.evidencePhotos.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Evidence Photos:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {response.evidencePhotos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.data}
                      alt={`Evidence ${index + 1}`}
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

      {/* User Replies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Community Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Replies */}
          {userReplies.length > 0 ? (
            <div className="space-y-3">
              {userReplies.map((reply, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
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
                  <p className="text-gray-700">{reply.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No replies yet</p>
          )}

          {/* Add New Reply */}
          {onAddReply && (
            <div className="border-t pt-4 space-y-3">
              <h5 className="font-medium">Add your feedback:</h5>
              <Input
                placeholder="Your name"
                value={submitterName}
                onChange={(e) => setSubmitterName(e.target.value)}
              />
              <Textarea
                placeholder="Share your thoughts about the completed work..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                maxLength={500}
              />
              <Button 
                onClick={handleAddReply}
                disabled={!replyMessage.trim() || !submitterName.trim()}
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
