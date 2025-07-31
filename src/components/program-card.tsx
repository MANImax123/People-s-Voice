'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Calendar, 
  Users, 
  DollarSign,
  Eye,
  Send,
  Heart
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  text: string;
  likes: any[];
  likesCount: number;
  createdAt: string;
}

interface Program {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  targetBeneficiaries?: number;
  eligibilityCriteria?: string;
  applicationProcess?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  tags: string[];
  likes: any[];
  dislikes: any[];
  comments: Comment[];
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  createdBy: {
    adminName: string;
  };
}

interface ProgramCardProps {
  program: Program;
  user: any;
  onUpdate?: (programId: string) => void;
  compact?: boolean;
}

export default function ProgramCard({ program, user, onUpdate, compact = false }: ProgramCardProps) {
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const { toast } = useToast();

  const userLiked = program.likes?.some((like: any) => like.userEmail === user?.email);
  const userDisliked = program.dislikes?.some((dislike: any) => dislike.userEmail === user?.email);

  const handleAction = async (action: string, commentId?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to interact with programs",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const body: any = {
        action,
        userEmail: user.email,
        userName: user.name,
        userId: user.email,
      };

      if (action === 'comment') {
        if (!newComment.trim()) {
          toast({
            title: "Comment Required",
            description: "Please enter a comment",
            variant: "destructive",
          });
          return;
        }
        body.commentText = newComment.trim();
        setCommentLoading(true);
      }

      if (action === 'likeComment' && commentId) {
        body.commentId = commentId;
      }

      const response = await fetch(`/api/programs/${program._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (action === 'comment') {
          setNewComment('');
          toast({
            title: "Comment Added",
            description: "Your comment has been posted successfully",
          });
        } else if (action === 'like') {
          toast({
            title: userLiked ? "Like Removed" : "Program Liked",
            description: userLiked ? "You removed your like" : "Thank you for your feedback!",
          });
        } else if (action === 'dislike') {
          toast({
            title: userDisliked ? "Dislike Removed" : "Feedback Recorded",
            description: userDisliked ? "You removed your dislike" : "Thank you for your feedback!",
          });
        }

        if (onUpdate) {
          onUpdate(program._id);
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to perform action');
      }
    } catch (error: any) {
      console.error('Action error:', error);
      toast({
        title: "Action Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCommentLoading(false);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    await handleAction('likeComment', commentId);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      health: 'bg-red-100 text-red-800',
      education: 'bg-blue-100 text-blue-800',
      infrastructure: 'bg-gray-100 text-gray-800',
      welfare: 'bg-purple-100 text-purple-800',
      employment: 'bg-green-100 text-green-800',
      environment: 'bg-emerald-100 text-emerald-800',
      housing: 'bg-orange-100 text-orange-800',
      transportation: 'bg-indigo-100 text-indigo-800',
      agriculture: 'bg-lime-100 text-lime-800',
      technology: 'bg-cyan-100 text-cyan-800',
      tourism: 'bg-pink-100 text-pink-800',
      safety: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-sm line-clamp-2">{program.title}</h3>
              <Badge className={`text-xs ${getCategoryColor(program.category)}`}>
                {program.category}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {program.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {program.commentsCount}
                </span>
              </div>
              <span>{formatDistanceToNow(new Date(program.createdAt))} ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl leading-tight">{program.title}</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor(program.category)}>
                {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
              </Badge>
              <Badge variant="outline" className={getPriorityColor(program.priority)}>
                {program.priority}
              </Badge>
              <Badge variant="secondary">{program.status}</Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-3">
          {program.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Program Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">
              {new Date(program.startDate).toLocaleDateString()}
            </span>
          </div>
          
          {program.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">
                ₹{program.budget.toLocaleString()}
              </span>
            </div>
          )}
          
          {program.targetBeneficiaries && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">
                {program.targetBeneficiaries.toLocaleString()} people
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {program.viewsCount} views
            </span>
          </div>
        </div>

        {/* Tags */}
        {program.tags && program.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {program.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant={userLiked ? "default" : "outline"}
              size="sm"
              onClick={() => handleAction('like')}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              {program.likesCount}
            </Button>
            
            <Button
              variant={userDisliked ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleAction('dislike')}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              {program.dislikesCount}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {program.commentsCount} Comments
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            by {program.createdBy?.adminName} • {formatDistanceToNow(new Date(program.createdAt))} ago
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {/* Add Comment */}
            {user && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  onClick={() => handleAction('comment')}
                  disabled={commentLoading || !newComment.trim()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {program.comments && program.comments.length > 0 ? (
                program.comments.map((comment) => (
                  <div key={comment._id} className="p-3 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 pl-8">{comment.text}</p>
                    
                    <div className="flex items-center gap-2 pl-8">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentLike(comment._id)}
                        disabled={loading}
                        className="h-6 px-2 text-xs flex items-center gap-1"
                      >
                        <Heart className="w-3 h-3" />
                        {comment.likesCount}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
