'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Users, FileText, CheckCircle, Clock, 
  Image as ImageIcon, BarChart3, TrendingUp, Calendar, 
  MapPin, Mail, Star
} from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  priority: number;
  images?: string[];
  location: {
    area: string;
    metropolitanCity: string;
  };
  reportedBy: {
    name: string;
    email: string;
  };
  assignedTo: {
    techId: string | null;
    techName: string | null;
    assignedAt: string | null;
  };
  progressUpdates?: Array<{
    updateText: string;
    timestamp: string;
    techId: string;
    images?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Tech {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  currentAssignments: number;
  completedIssues: number;
  averageResolutionTime: number;
  rating: number;
  availability: 'available' | 'busy' | 'overloaded';
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [technicians, setTechnicians] = useState<Tech[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [issueDetailsOpen, setIssueDetailsOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check admin authentication
    const authData = localStorage.getItem('adminAuth');
    if (!authData) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      setAdmin(parsedAuth.admin);
      loadData();
    } catch (error) {
      console.error('Error parsing admin auth data:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadData = async () => {
    await Promise.all([loadIssues(), loadTechnicians()]);
  };

  const loadIssues = async () => {
    try {
      const response = await fetch('/api/issues');
      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error('Error loading issues:', error);
    }
  };

  const loadTechnicians = async () => {
    try {
      const response = await fetch('/api/admin/technicians');
      if (response.ok) {
        const data = await response.json();
        setTechnicians(data.techs || []);
      }
    } catch (error) {
      console.error('Error loading techs:', error);
    }
  };

  const handleAssignIssue = async () => {
    if (!selectedIssue || !selectedTech || !admin) return;

    setAssigning(true);
    try {
      const response = await fetch('/api/admin/assign-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: selectedIssue._id,
          techId: selectedTech,
          adminId: admin._id,
          reason: 'Assigned by admin dashboard'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: data.message,
        });
        
        setAssignDialogOpen(false);
        setSelectedIssue(null);
        setSelectedTech('');
        loadData(); // Reload data
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to assign issue",
        variant: "destructive",
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('adminAuth');
      router.push('/admin/login');
    } catch (error) {
      localStorage.removeItem('adminAuth');
      router.push('/admin/login');
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800";
    if (priority >= 6) return "bg-orange-100 text-orange-800";
    if (priority >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return "bg-green-100 text-green-800";
      case 'in-progress': return "bg-blue-100 text-blue-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'reported': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return "bg-green-100 text-green-800";
      case 'busy': return "bg-yellow-100 text-yellow-800";
      case 'overloaded': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const unassignedIssues = issues.filter(issue => !issue.assignedTo.techId);
  const assignedIssues = issues.filter(issue => issue.assignedTo.techId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👨‍💼</div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/admin/programs"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Programs
              </Link>
              <Link 
                href="/admin/whatsapp"
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4" />
                WhatsApp
              </Link>
              <span className="text-gray-700">Welcome, {admin.name}</span>
              <Badge variant="outline">admin</Badge>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
              <p className="text-xs text-muted-foreground">
                {unassignedIssues.length} unassigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Techs</CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{technicians.length}</div>
              <p className="text-xs text-muted-foreground">
                {technicians.filter(t => t.availability === 'available').length} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(i => i.status === 'resolved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total resolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <p className="text-xs text-muted-foreground">
                Performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/meetings">
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-blue-900">Meeting Requests</span>
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Review and manage citizen meeting requests with municipal officials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Click to manage</span>
                    <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Open →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {/* You can add more quick access cards here */}
            <Card className="border-gray-200 bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-gray-500">
                  <div className="bg-gray-400 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span>Reports</span>
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate and view administrative reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Coming soon</span>
                  <Button variant="outline" size="sm" disabled>
                    Open →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="unassigned" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="unassigned">
              Unassigned Issues ({unassignedIssues.length})
            </TabsTrigger>
            <TabsTrigger value="assigned">
              Assigned Issues ({assignedIssues.length})
            </TabsTrigger>
            <TabsTrigger value="technicians">
              Techs ({technicians.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unassigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Unassigned Issues</CardTitle>
                <CardDescription>
                  Issues waiting to be assigned to techs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Reported</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedIssues.map((issue) => (
                      <TableRow key={issue._id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{issue.title}</div>
                            {issue.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {issue.description.substring(0, 100)}...
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{issue.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(issue.priority)}>
                            Priority {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {issue.location.area}, {issue.location.metropolitanCity}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setAssignDialogOpen(true);
                            }}
                            size="sm"
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Issues</CardTitle>
                <CardDescription>
                  Issues currently being worked on by techs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignedIssues.map((issue) => (
                      <TableRow key={issue._id}>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell>{issue.assignedTo.techName}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(issue.priority)}>
                            Priority {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {issue.assignedTo.assignedAt 
                            ? new Date(issue.assignedTo.assignedAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedIssue(issue);
                              setIssueDetailsOpen(true);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tech Management</CardTitle>
                <CardDescription>
                  Manage and monitor tech performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tech</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Current Load</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians.map((tech) => (
                      <TableRow key={tech._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-gray-500">{tech.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tech.specialization}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{tech.currentAssignments}</span>
                            <Progress value={(tech.currentAssignments / 10) * 100} className="w-16 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            {tech.completedIssues || 0}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium">{tech.rating || 4.5}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAvailabilityColor(tech.availability)}>
                            {tech.availability}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Issue to Tech</DialogTitle>
            <DialogDescription>
              {selectedIssue && (
                <>
                  Assigning: <strong>{selectedIssue.title}</strong>
                  <br />
                  Category: {selectedIssue.category.replace('-', ' ')}
                  <br />
                  Priority: {selectedIssue.priority}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Tech</label>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tech" />
                </SelectTrigger>
                <SelectContent>
                  {technicians
                    .filter(tech => tech.availability !== 'overloaded')
                    .map((tech) => (
                    <SelectItem key={tech._id} value={tech._id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{tech.name}</span>
                        <div className="flex gap-2 ml-4">
                          <Badge variant="outline" className="text-xs">
                            {tech.specialization}
                          </Badge>
                          <Badge className={`text-xs ${getAvailabilityColor(tech.availability)}`}>
                            {tech.currentAssignments} issues
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setAssignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignIssue}
                disabled={!selectedTech || assigning}
              >
                {assigning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Assigning...
                  </>
                ) : (
                  'Assign Issue'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Issue Details Dialog */}
      <Dialog open={issueDetailsOpen} onOpenChange={setIssueDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected issue
            </DialogDescription>
          </DialogHeader>
          
          {selectedIssue && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedIssue.title}</h3>
                  {selectedIssue.description && (
                    <p className="text-sm text-gray-600 mt-2">{selectedIssue.description}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-4">
                    <Badge>{selectedIssue.category}</Badge>
                    <Badge variant="outline">Priority {selectedIssue.priority}</Badge>
                    <Badge className={getStatusColor(selectedIssue.status)}>
                      {selectedIssue.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedIssue.location.area}, {selectedIssue.location.metropolitanCity}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(selectedIssue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{selectedIssue.reportedBy.email}</span>
                  </div>
                </div>
              </div>

              {selectedIssue.images && selectedIssue.images.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Issue Images ({selectedIssue.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedIssue.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Issue image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}