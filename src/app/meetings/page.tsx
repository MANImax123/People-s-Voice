'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MeetingRequestForm from '@/components/meeting-request-form';
import UserMeetingScheduler from '@/components/user-meeting-scheduler';
import { Calendar, Plus } from 'lucide-react';

// Mock user data - replace with actual auth
const mockUser = {
  id: '64a1b2c3d4e5f6789abcdef0',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91-9876543210'
};

export default function MeetingRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Requests</h1>
          <p className="text-gray-600">
            Request meetings with Municipal Corporation officials and manage your scheduled appointments.
          </p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Meetings
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Request
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="schedule">
            <UserMeetingScheduler userId={mockUser.id} />
          </TabsContent>
          
          <TabsContent value="request">
            <MeetingRequestForm
              userId={mockUser.id}
              userEmail={mockUser.email}
              userName={mockUser.name}
              userPhone={mockUser.phone}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
