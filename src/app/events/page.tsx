'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search,
  Filter,
  Plus,
  ExternalLink
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'festival' | 'meeting' | 'workshop' | 'celebration' | 'sports' | 'cultural';
  organizer: string;
  capacity?: number;
  registered?: number;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

// Real Hyderabad events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Bonalu Festival 2025',
    description: 'Traditional Telangana festival honoring Goddess Mahakali. Join the colorful processions from Golconda Fort to Secunderabad with traditional folk dances and offerings.',
    date: '2025-08-10',
    time: '06:00',
    location: 'Golconda Fort to Ujjaini Mahankali Temple',
    category: 'festival',
    organizer: 'Greater Hyderabad Municipal Corporation (GHMC)',
    capacity: 50000,
    registered: 35000,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Hyderabad IT Expo 2025',
    description: 'Premier technology exhibition showcasing innovations from HITEC City companies, startups, and research institutions. Features AI, blockchain, and cybersecurity pavilions.',
    date: '2025-08-20',
    time: '09:00',
    location: 'HITEC City Convention Centre',
    category: 'workshop',
    organizer: 'HITEC City Association',
    capacity: 5000,
    registered: 3200,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Deccan Heritage Walk',
    description: 'Guided walking tour through historic Hyderabad covering Charminar, Laad Bazaar, Mecca Masjid, and traditional Irani cafes. Learn about 400+ years of history.',
    date: '2025-08-05',
    time: '16:00',
    location: 'Charminar to Laad Bazaar',
    category: 'cultural',
    organizer: 'Hyderabad Metropolitan Development Authority (HMDA)',
    capacity: 200,
    registered: 180,
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Ganga Jamuna Cultural Festival',
    description: 'Celebrating Hyderabad\'s composite culture with Hindustani and Carnatic music concerts, Qawwali performances, and traditional dance shows.',
    date: '2025-08-15',
    time: '18:00',
    location: 'Shilparamam Cultural Village',
    category: 'cultural',
    organizer: 'Telangana Tourism Development Corporation',
    capacity: 3000,
    registered: 2100,
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Hyderabad Marathon 2025',
    description: 'Annual international marathon featuring 42km, 21km, 10km, and 5km categories. Route covers Tank Bund, Necklace Road, and HITEC City.',
    date: '2025-08-25',
    time: '05:30',
    location: 'Tank Bund to HITEC City',
    category: 'sports',
    organizer: 'Hyderabad Runners Society & GHMC',
    capacity: 15000,
    registered: 12000,
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Ramadan Night Market',
    description: 'Traditional Iftar market in the old city featuring authentic Hyderabadi cuisine, dates, and religious items. Experience the spirit of Ramadan.',
    date: '2025-08-12',
    time: '19:00',
    location: 'Sultan Bazaar to Madina Market',
    category: 'festival',
    organizer: 'Old City Development Corporation',
    capacity: 10000,
    registered: 7500,
    status: 'upcoming'
  },
  {
    id: '7',
    title: 'Startup Hyderabad Demo Day',
    description: 'Pitch competition for emerging startups in fintech, biotech, and agritech. Featuring investors from T-Hub and international VCs.',
    date: '2025-08-18',
    time: '10:00',
    location: 'T-Hub Gachibowli',
    category: 'workshop',
    organizer: 'T-Hub & WE Hub',
    capacity: 500,
    registered: 380,
    status: 'upcoming'
  },
  {
    id: '8',
    title: 'Kite Flying Championship',
    description: 'Annual kite flying competition during Independence Day celebrations. Traditional Hyderabadi patang flying with prizes for most creative designs.',
    date: '2025-08-15',
    time: '15:00',
    location: 'Hussain Sagar Lake (Tank Bund)',
    category: 'sports',
    organizer: 'Hyderabad Kite Flyers Association',
    capacity: 2000,
    registered: 1500,
    status: 'upcoming'
  },
  {
    id: '9',
    title: 'Pearl and Jewelry Exhibition',
    description: 'Showcase of Hyderabad\'s famous pearl industry with traditional and contemporary jewelry designs. Includes live pearl drilling demonstrations.',
    date: '2025-08-22',
    time: '11:00',
    location: 'Hitex Exhibition Centre',
    category: 'cultural',
    organizer: 'Hyderabad Pearl Dealers Association',
    capacity: 1000,
    registered: 650,
    status: 'upcoming'
  },
  {
    id: '10',
    title: 'Greater Hyderabad Public Meeting',
    description: 'Monthly civic meeting for citizen grievances and municipal updates. Discuss infrastructure projects, water supply, and waste management.',
    date: '2025-08-30',
    time: '10:00',
    location: 'GHMC Head Office, Abids',
    category: 'meeting',
    organizer: 'Greater Hyderabad Municipal Corporation',
    capacity: 300,
    registered: 150,
    status: 'upcoming'
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(event => event.status === selectedStatus);
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, events]);

  const getCategoryColor = (category: string) => {
    const colors = {
      festival: 'bg-purple-100 text-purple-800',
      meeting: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      celebration: 'bg-red-100 text-red-800',
      sports: 'bg-orange-100 text-orange-800',
      cultural: 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Events</h1>
              <p className="text-gray-600">
                Discover and participate in upcoming civic events, workshops, and community activities.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="festival">Festivals</option>
              <option value="meeting">Meetings</option>
              <option value="workshop">Workshops</option>
              <option value="celebration">Celebrations</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Add Event Button */}
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Suggest Event
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(event.category)}>
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {event.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.registered || 0} / {event.capacity} registered</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-500">
                  Organized by: {event.organizer}
                </div>

                {event.capacity && event.registered && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    disabled={event.status === 'completed' || event.status === 'cancelled'}
                  >
                    {event.status === 'upcoming' ? 'Register' : 
                     event.status === 'ongoing' ? 'Join Now' : 
                     event.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Events Message */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria to find more events.
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Want to organize an event?</h3>
          <p className="text-blue-700 text-sm mb-4">
            Community members can suggest events for municipal approval. Submit your event proposal 
            and help make our community more vibrant!
          </p>
          <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
            Submit Event Proposal
          </Button>
        </div>
      </div>
    </div>
  );
}