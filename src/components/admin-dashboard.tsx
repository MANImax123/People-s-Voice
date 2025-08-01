'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminMeetingManager from '@/components/admin-meeting-manager';
import { 
  Calendar,
  Users, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  MessageSquare 
} from 'lucide-react';

// Mock admin data - replace with actual auth
const mockAdmin = {
  id: 'admin_64a1b2c3d4e5f6789abcdef0',
  name: 'Admin User',
  email: 'admin@municipality.gov'
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage civic issues, programs, and meeting requests from citizens.
          </p>
        </div>

        <Tabs defaultValue="meetings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meetings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Meeting Requests
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="meetings">
            <AdminMeetingManager adminId={mockAdmin.id} />
          </TabsContent>
          
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Issue Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Issue management interface will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management interface will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard will be here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}