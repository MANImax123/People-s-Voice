'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Eye, Calendar, DollarSign, Users, Tag } from "lucide-react";
import { TableSkeleton } from "@/components/ui/skeleton-loaders";

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
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  createdBy: {
    adminName: string;
  };
}

export default function AdminProgramsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    budget: '',
    targetBeneficiaries: '',
    eligibilityCriteria: '',
    applicationProcess: '',
    contactEmail: '',
    contactPhone: '',
    contactWebsite: '',
    tags: '',
  });

  const router = useRouter();
  const { toast } = useToast();

  const categories = [
    { value: 'health', label: 'Health' },
    { value: 'education', label: 'Education' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'welfare', label: 'Welfare' },
    { value: 'employment', label: 'Employment' },
    { value: 'environment', label: 'Environment' },
    { value: 'housing', label: 'Housing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'technology', label: 'Technology' },
    { value: 'tourism', label: 'Tourism' },
    { value: 'safety', label: 'Safety' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    // Check admin authentication - check both auth-user and admin-user
    const authData = localStorage.getItem('auth-user');
    const adminData = localStorage.getItem('admin-user');
    
    let adminUser = null;
    
    if (authData) {
      const userData = JSON.parse(authData);
      if (userData.role === 'admin') {
        adminUser = userData;
      }
    }
    
    if (!adminUser && adminData) {
      adminUser = JSON.parse(adminData);
    }
    
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    setUser(adminUser);
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/programs?status=all&limit=100');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.programs);
      } else {
        throw new Error('Failed to load programs');
      }
    } catch (error: any) {
      console.error('Load programs error:', error);
      toast({
        title: "Error",
        description: "Failed to load programs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      startDate: '',
      endDate: '',
      budget: '',
      targetBeneficiaries: '',
      eligibilityCriteria: '',
      applicationProcess: '',
      contactEmail: '',
      contactPhone: '',
      contactWebsite: '',
      tags: '',
    });
    setEditingProgram(null);
  };

  const handleEdit = (program: Program) => {
    setFormData({
      title: program.title,
      description: program.description,
      category: program.category,
      priority: program.priority,
      startDate: program.startDate.split('T')[0],
      endDate: program.endDate ? program.endDate.split('T')[0] : '',
      budget: program.budget?.toString() || '',
      targetBeneficiaries: program.targetBeneficiaries?.toString() || '',
      eligibilityCriteria: program.eligibilityCriteria || '',
      applicationProcess: program.applicationProcess || '',
      contactEmail: program.contactInfo?.email || '',
      contactPhone: program.contactInfo?.phone || '',
      contactWebsite: program.contactInfo?.website || '',
      tags: program.tags.join(', '),
    });
    setEditingProgram(program);
    setShowCreateDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.startDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        targetBeneficiaries: formData.targetBeneficiaries ? parseInt(formData.targetBeneficiaries) : undefined,
        contactInfo: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
          website: formData.contactWebsite,
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        adminId: user.email,
        adminEmail: user.email,
        adminName: user.name,
      };

      const url = editingProgram ? `/api/programs/${editingProgram._id}` : '/api/programs';
      const method = editingProgram ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Program ${editingProgram ? 'updated' : 'created'} successfully`,
        });
        
        setShowCreateDialog(false);
        resetForm();
        loadPrograms();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save program');
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save program",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
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

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableSkeleton rows={8} cols={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
              <p className="text-gray-600 mt-2">Create and manage government programs and schemes</p>
            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </a>
              <a 
                href="/admin/whatsapp"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                WhatsApp
              </a>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2" onClick={resetForm}>
                    <Plus className="w-4 h-4" />
                    New Program
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Program Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter program title"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter program description"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (₹)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="Enter budget amount"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="targetBeneficiaries">Target Beneficiaries</Label>
                      <Input
                        id="targetBeneficiaries"
                        type="number"
                        value={formData.targetBeneficiaries}
                        onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
                        placeholder="Number of people"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                    <Textarea
                      id="eligibilityCriteria"
                      value={formData.eligibilityCriteria}
                      onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                      placeholder="Who can apply for this program?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applicationProcess">Application Process</Label>
                    <Textarea
                      id="applicationProcess"
                      value={formData.applicationProcess}
                      onChange={(e) => setFormData({ ...formData, applicationProcess: e.target.value })}
                      placeholder="How to apply for this program?"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="contact@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+91 9876543210"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactWebsite">Website</Label>
                      <Input
                        id="contactWebsite"
                        value={formData.contactWebsite}
                        onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="housing, scheme, government, benefits"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (editingProgram ? 'Updating...' : 'Creating...') : (editingProgram ? 'Update Program' : 'Create Program')}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
        
        {/* Programs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Programs ({programs.length})</CardTitle>
            <CardDescription>
              Manage government programs and citizen engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {programs.length > 0 ? (
              <div className="space-y-4">
                {programs.map((program) => (
                  <div key={program._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{program.title}</h3>
                          <Badge className={getCategoryColor(program.category)}>
                            {program.category}
                          </Badge>
                          <Badge className={getStatusColor(program.status)}>
                            {program.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(program.startDate).toLocaleDateString()}
                          </div>
                          
                          {program.budget && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ₹{program.budget.toLocaleString()}
                            </div>
                          )}
                          
                          {program.targetBeneficiaries && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {program.targetBeneficiaries.toLocaleString()} people
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {program.viewsCount} views
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-green-600">👍 {program.likesCount} likes</span>
                          <span className="text-red-600">👎 {program.dislikesCount} dislikes</span>
                          <span className="text-blue-600">💬 {program.commentsCount} comments</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(program)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex items-center gap-2"
                        >
                          <a href={`/programs`} target="_blank">
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Programs Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first government program to engage with citizens.
                </p>
                <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create First Program
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
