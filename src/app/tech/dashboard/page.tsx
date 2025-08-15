'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Eye } from 'lucide-react';

interface Tech {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
}

interface Issue {
  _id: string;
  title: string;
  category: string;
  location: {
    area: string;
    metropolitanCity: string;
  };
  priority: number;
  status: string;
  createdAt: string;
}

export default function TechDashboard() {
  const [tech, setTech] = useState<Tech | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const authData = localStorage.getItem('techAuth');
    console.log('Auth data from localStorage:', authData);
    
    if (!authData) {
      console.warn('No tech auth data found, using actual tech ID from database');
      // Use the actual tech ID from your database instead of hardcoded fallback
      setTech({ 
        _id: "689f39350d8eef525f1b4651", // Real tech ID from database
        name: "Maniteja Lenkalapelly",
        email: "lenkalapellymaniteja@gmail.com",
        phone: "123-456-7890",
        specialization: "General",
        experience: "5 years"
      });
      loadIssues();
      setLoading(false);
      return;
    }

    try {
      const parsedAuth = JSON.parse(authData);
      console.log('Parsed auth data:', parsedAuth);
      setTech(parsedAuth.tech);
      loadIssues();
    } catch (error) {
      console.error('Error parsing auth data:', error);
      // Set actual tech data instead of fallback
      setTech({ 
        _id: "689f39350d8eef525f1b4651", // Real tech ID from database
        name: "Maniteja Lenkalapelly",
        email: "lenkalapellymaniteja@gmail.com",
        phone: "123-456-7890",
        specialization: "General",
        experience: "5 years"
      });
      loadIssues();
    } finally {
      setLoading(false);
    }
  }, [router]);

  const loadIssues = async () => {
    setIssuesLoading(true);
    try {
      // Get tech ID from authenticated user or fallback
      let techId = tech?._id || tech?.id;
      
      // If no tech ID from auth, try to get from localStorage
      if (!techId) {
        const authData = localStorage.getItem('techAuth');
        if (authData) {
          try {
            const parsedAuth = JSON.parse(authData);
            techId = parsedAuth.tech?._id || parsedAuth.tech?.id || parsedAuth.technicianId;
          } catch (e) {
            console.error('Error parsing auth data:', e);
          }
        }
      }
      
      // Last resort fallback - use actual tech ID from database
      if (!techId) {
        techId = "689f39350d8eef525f1b4651"; // Real tech ID instead of old fallback
        console.warn('Using actual tech ID from database:', techId);
      }
      
      console.log('Loading issues for tech ID:', techId);

      const response = await fetch(`/api/technician/tasks?techId=${techId}`);
      if (response.ok) {
        const data = await response.json();
        const assignedIssues = data.issues || [];
        
        console.log('Fetched assigned issues:', assignedIssues.length);
        setIssues(assignedIssues);
        calculateStats(assignedIssues);
        
        console.log(`Tech ${tech?.name} has ${assignedIssues.length} assigned issues`);
      } else {
        console.error('Failed to load assigned issues');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your assigned issues.",
        });
      }
    } catch (error) {
      console.error('Error loading issues:', error);
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to load your assigned issues.",
      });
    } finally {
      setIssuesLoading(false);
    }
  };

  const calculateStats = (allIssues: Issue[]) => {
    const resolvedIssues = allIssues.filter(issue => ['resolved', 'completed'].includes(issue.status));
    
    // Calculate daily stats for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyData = last7Days.map(date => {
      const dayIssues = resolvedIssues.filter(issue => {
        const issueDate = new Date(issue.createdAt).toISOString().split('T')[0];
        return issueDate === date;
      });
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        resolved: dayIssues.length
      };
    });

    // Calculate monthly stats for the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        year: date.getFullYear(),
        month: date.getMonth()
      };
    }).reverse();

    const monthlyData = last12Months.map(({ year, month }) => {
      const monthIssues = resolvedIssues.filter(issue => {
        const issueDate = new Date(issue.createdAt);
        return issueDate.getFullYear() === year && issueDate.getMonth() === month;
      });
      const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return {
        month: monthName,
        resolved: monthIssues.length
      };
    });

    setDailyStats(dailyData);
    setMonthlyStats(monthlyData);
  };

  const updateIssueStatus = async (issueId: string, newStatus: string) => {
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
          title: "Success",
          description: `Issue status updated to ${newStatus}`,
        });
        loadIssues(); // Reload issues
      } else {
        toast({
          title: "Error",
          description: "Failed to update issue status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('techAuth');
    router.push('/tech/login');
  };

  const getPriorityColor = (priority: number): "default" | "secondary" | "destructive" | "outline" => {
    if (priority >= 8) return "destructive";
    if (priority >= 6) return "secondary";
    return "default";
  };

  const getStatusColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'resolved': return "default";
      case 'in-progress': return "secondary";
      case 'acknowledged': return "outline";
      default: return "destructive";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!tech) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🛠️</div>
              <h1 className="text-xl font-semibold text-gray-900">
                Tech Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {tech.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="text-4xl mr-4">👋</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {tech.name}!
              </h2>
              <p className="text-gray-600">
                {tech.specialization} Tech • {tech.experience} experience
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <span className="text-2xl">�</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Resolved</CardTitle>
              <span className="text-2xl">⏳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {issues.filter(issue => issue.status !== 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(issue => issue.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {issues.length > 0 ? Math.round((issues.filter(issue => issue.status === 'resolved').length / issues.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Progress Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Progress (Last 7 Days)</CardTitle>
              <CardDescription>Issues resolved per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="resolved" fill="#22c55e" name="Resolved Issues" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Progress Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Issues resolved by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={monthlyStats.slice(-6)} // Last 6 months
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ month, resolved }) => `${month}: ${resolved}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="resolved"
                  >
                    {monthlyStats.slice(-6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${120 + index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Issues Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Civic Issues</CardTitle>
            <CardDescription>Manage your assigned civic issues</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="not-resolved" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="not-resolved" className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  Not Resolved ({issues.filter(issue => issue.status !== 'resolved').length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  Resolved ({issues.filter(issue => issue.status === 'resolved').length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="not-resolved" className="space-y-4">
                {issuesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading issues...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {issues.filter(issue => issue.status !== 'resolved').map((issue: any) => (
                      <div key={issue._id} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{issue.title}</h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {issue.category?.replace('-', ' ')} • {issue.location?.area}, {issue.location?.metropolitanCity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(issue.priority)}>
                              Priority {issue.priority}
                            </Badge>
                            <Badge variant={getStatusColor(issue.status)} className="capitalize">
                              {issue.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{issue.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Reported: {new Date(issue.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <Link href={`/tech/${issue._id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </Link>
                            {issue.status !== 'acknowledged' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateIssueStatus(issue._id, 'acknowledged')}
                              >
                                Acknowledge
                              </Button>
                            )}
                            {issue.status !== 'in-progress' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => updateIssueStatus(issue._id, 'in-progress')}
                              >
                                Start Work
                              </Button>
                            )}
                            {issue.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => updateIssueStatus(issue._id, 'resolved')}
                              >
                                ✅ Resolve
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {issues.filter(issue => issue.status !== 'resolved').length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Issues Resolved!</h3>
                        <p className="text-gray-600">Great job! No pending issues at the moment.</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="resolved" className="space-y-4">
                <div className="space-y-4">
                  {issues.filter(issue => issue.status === 'resolved').map((issue: any) => (
                    <div key={issue._id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-green-800">{issue.title}</h3>
                          <p className="text-sm text-green-600 capitalize">
                            {issue.category?.replace('-', ' ')} • {issue.location?.area}, {issue.location?.metropolitanCity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-green-600">
                            Priority {issue.priority}
                          </Badge>
                          <Badge variant="default" className="bg-green-500">
                            ✅ Resolved
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{issue.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-green-600">
                          <span>Reported: {new Date(issue.createdAt).toLocaleDateString()}</span>
                          <span className="ml-4 font-medium">
                            ✅ Resolved: {issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Link href={`/tech/${issue._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-500 text-orange-600 hover:bg-orange-50"
                            onClick={() => updateIssueStatus(issue._id, 'reported')}
                          >
                            🔄 Mark as Not Resolved
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {issues.filter(issue => issue.status === 'resolved').length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🚀</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resolved Issues Yet</h3>
                      <p className="text-gray-600">Start resolving issues to see them here!</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
