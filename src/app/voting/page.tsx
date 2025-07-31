"use client";

import { useState } from "react";
import { Vote, MapPin, Clock, Users, Search, Building, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const votingData = [
  {
    id: 1,
    name: "City Hall - Precinct 1",
    precinct: "Precinct 1",
    address: "100 Main Street",
    district: "Downtown",
    hours: "7:00 AM - 8:00 PM",
    capacity: 500,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 15", "Metro Blue Line"],
    services: ["Voter Registration", "Ballot Drop-off", "Assistance Available"],
    registeredVoters: 2840,
    lastElectionTurnout: "72%"
  },
  {
    id: 2,
    name: "Community Center - Precinct 2",
    precinct: "Precinct 2",
    address: "250 Oak Avenue",
    district: "North District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 300,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 22"],
    services: ["Voter Registration", "Ballot Drop-off", "Multilingual Assistance"],
    registeredVoters: 1950,
    lastElectionTurnout: "68%"
  },
  {
    id: 3,
    name: "High School - Precinct 3",
    precinct: "Precinct 3",
    address: "500 School Drive",
    district: "East District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 400,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 8", "Campus Shuttle"],
    services: ["Voter Registration", "Student Voter Assistance", "Ballot Drop-off"],
    registeredVoters: 3120,
    lastElectionTurnout: "65%"
  },
  {
    id: 4,
    name: "Library Branch - Precinct 4",
    precinct: "Precinct 4",
    address: "75 Elm Street",
    district: "West District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 250,
    accessibility: true,
    parking: true,
    publicTransit: ["Metro Red Line", "Bus Route 12"],
    services: ["Voter Registration", "Information Center", "Ballot Drop-off"],
    registeredVoters: 2210,
    lastElectionTurnout: "74%"
  },
  {
    id: 5,
    name: "Recreation Center - Precinct 5",
    precinct: "Precinct 5",
    address: "888 Wellness Way",
    district: "South District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 350,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 18"],
    services: ["Voter Registration", "Senior Voting Assistance", "Ballot Drop-off"],
    registeredVoters: 2680,
    lastElectionTurnout: "70%"
  },
  {
    id: 6,
    name: "Fire Station 2 - Precinct 6",
    precinct: "Precinct 6",
    address: "432 Safety Boulevard",
    district: "Industrial District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 200,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 25"],
    services: ["Voter Registration", "Worker Voting Hours", "Ballot Drop-off"],
    registeredVoters: 1560,
    lastElectionTurnout: "62%"
  },
  {
    id: 7,
    name: "Senior Center - Precinct 7",
    precinct: "Precinct 7",
    address: "222 Golden Years Avenue",
    district: "Residential West",
    hours: "7:00 AM - 8:00 PM",
    capacity: 180,
    accessibility: true,
    parking: true,
    publicTransit: ["Bus Route 14", "Senior Shuttle"],
    services: ["Voter Registration", "Senior Assistance", "Large Print Ballots"],
    registeredVoters: 1890,
    lastElectionTurnout: "78%"
  },
  {
    id: 8,
    name: "Community College - Precinct 8",
    precinct: "Precinct 8",
    address: "1000 Education Way",
    district: "College District",
    hours: "7:00 AM - 8:00 PM",
    capacity: 450,
    accessibility: true,
    parking: true,
    publicTransit: ["Metro Blue Line", "Campus Shuttle", "Bus Route 30"],
    services: ["Voter Registration", "Student Registration Drive", "Information Booth"],
    registeredVoters: 2750,
    lastElectionTurnout: "58%"
  }
];

const upcomingElections = [
  {
    id: 1,
    name: "Municipal Elections",
    date: "November 5, 2025",
    type: "Local",
    positions: ["Mayor", "City Council", "School Board"],
    registrationDeadline: "October 15, 2025",
    earlyVoting: "October 20-31, 2025"
  },
  {
    id: 2,
    name: "Special Ballot Measures",
    date: "March 18, 2026",
    type: "Special",
    positions: ["Bond Measures", "Tax Propositions"],
    registrationDeadline: "February 18, 2026",
    earlyVoting: "March 1-15, 2026"
  }
];

export default function VotingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterServices, setFilterServices] = useState("all");

  const filteredLocations = votingData.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = filterDistrict === "all" || location.district.toLowerCase().includes(filterDistrict.toLowerCase());
    const matchesServices = filterServices === "all" || 
                           location.services.some(service => service.toLowerCase().includes(filterServices.toLowerCase()));
    
    return matchesSearch && matchesDistrict && matchesServices;
  });

  const getDistrictColor = (district: string) => {
    const hash = district.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-teal-100 text-teal-800"
    ];
    return colors[hash % colors.length];
  };

  const getTurnoutColor = (turnout: string) => {
    const percentage = parseInt(turnout);
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Voting Information</h1>
          <p className="text-xl text-gray-600">Find polling locations, voting hours, and election information</p>
        </div>

        {/* Upcoming Elections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Elections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingElections.map((election) => (
              <Card key={election.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg">{election.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {election.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {election.type} Election</div>
                    <div><strong>Positions:</strong> {election.positions.join(", ")}</div>
                    <div><strong>Registration Deadline:</strong> {election.registrationDeadline}</div>
                    <div><strong>Early Voting:</strong> {election.earlyVoting}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search polling locations, addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="north">North District</SelectItem>
                <SelectItem value="east">East District</SelectItem>
                <SelectItem value="west">West District</SelectItem>
                <SelectItem value="south">South District</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="college">College District</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterServices} onValueChange={setFilterServices}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="registration">Voter Registration</SelectItem>
                <SelectItem value="assistance">Voting Assistance</SelectItem>
                <SelectItem value="multilingual">Multilingual Support</SelectItem>
                <SelectItem value="senior">Senior Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Polling Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getDistrictColor(location.district)}>
                    {location.district}
                  </Badge>
                  <Badge variant="outline" className="text-blue-600">
                    {location.precinct}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{location.name}</CardTitle>
                <CardDescription className="text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-green-600">{location.hours}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-600 mb-1">Capacity</div>
                      <div className="font-semibold text-blue-600">{location.capacity} voters</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-600 mb-1">Registered</div>
                      <div className="font-semibold text-blue-600">{location.registeredVoters.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Last Turnout:</div>
                    <div className={`font-semibold ${getTurnoutColor(location.lastElectionTurnout)}`}>
                      {location.lastElectionTurnout}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Public Transit:</div>
                    <div className="flex flex-wrap gap-1">
                      {location.publicTransit.map((transit, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {transit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Services:</div>
                    <div className="flex flex-wrap gap-1">
                      {location.services.slice(0, 2).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-green-600">
                          {service}
                        </Badge>
                      ))}
                      {location.services.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{location.services.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {location.accessibility && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        ♿ Accessible
                      </Badge>
                    )}
                    {location.parking && (
                      <Badge variant="outline" className="text-xs text-blue-600">
                        🅿️ Parking
                      </Badge>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No polling locations found matching your criteria.</p>
          </div>
        )}

        {/* Voter Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Important Voter Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">What to Bring:</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Valid photo ID</li>
                <li>Voter registration card (recommended)</li>
                <li>Proof of address if recently moved</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Voting Hours:</h4>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>All locations: 7:00 AM - 8:00 PM</li>
                <li>Early voting available at City Hall</li>
                <li>Absentee ballots accepted until 8:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
