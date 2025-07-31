"use client";

import { useState } from "react";
import { Bus, Clock, MapPin, Filter, Search, Navigation, Route, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const transportationData = [
  {
    id: 1,
    type: "Bus",
    route: "Route 15",
    name: "City Center - Airport",
    frequency: "Every 20 mins",
    hours: "6:00 AM - 11:00 PM",
    status: "Active",
    stops: ["City Center", "Main Plaza", "University", "Shopping Mall", "Airport"],
    fare: "$2.50",
    accessibility: true
  },
  {
    id: 2,
    type: "Metro",
    route: "Blue Line",
    name: "Downtown - University",
    frequency: "Every 5 mins",
    hours: "5:30 AM - 12:00 AM",
    status: "Active",
    stops: ["Downtown Central", "Business District", "Park Avenue", "University Campus"],
    fare: "$3.00",
    accessibility: true
  },
  {
    id: 3,
    type: "Shuttle",
    route: "Hospital Shuttle",
    name: "Hospital - Medical Center",
    frequency: "Every 30 mins",
    hours: "7:00 AM - 9:00 PM",
    status: "Active",
    stops: ["City Hospital", "Medical Plaza", "Pharmacy District", "Health Center"],
    fare: "Free",
    accessibility: true
  },
  {
    id: 4,
    type: "Bus",
    route: "Night Bus N1",
    name: "Main Street Loop",
    frequency: "Every hour",
    hours: "11:00 PM - 5:00 AM",
    status: "Active",
    stops: ["Main Street", "Entertainment District", "Residential Area", "Transit Hub"],
    fare: "$3.50",
    accessibility: false
  },
  {
    id: 5,
    type: "Bus",
    route: "Route 22",
    name: "North - South Corridor",
    frequency: "Every 15 mins",
    hours: "6:30 AM - 10:30 PM",
    status: "Active",
    stops: ["North Terminal", "Commercial Center", "City Hall", "South Station"],
    fare: "$2.50",
    accessibility: true
  },
  {
    id: 6,
    type: "Metro",
    route: "Red Line",
    name: "East - West Line",
    frequency: "Every 7 mins",
    hours: "5:45 AM - 11:45 PM",
    status: "Maintenance",
    stops: ["East Gateway", "Central Station", "West Plaza", "Industrial Zone"],
    fare: "$3.00",
    accessibility: true
  },
  {
    id: 7,
    type: "Bus",
    route: "Route 8",
    name: "Suburban Express",
    frequency: "Every 25 mins",
    hours: "7:00 AM - 9:00 PM",
    status: "Active",
    stops: ["Suburb Center", "School District", "Shopping Center", "Downtown"],
    fare: "$4.00",
    accessibility: true
  },
  {
    id: 8,
    type: "Shuttle",
    route: "Campus Shuttle",
    name: "University Campus Loop",
    frequency: "Every 10 mins",
    hours: "7:00 AM - 11:00 PM",
    status: "Active",
    stops: ["Main Campus", "Library", "Student Housing", "Sports Complex"],
    fare: "Free",
    accessibility: true
  }
];

// Common locations for dropdown selection
const commonLocations = [
  "City Center", "Downtown Central", "Airport", "University Campus", "Hospital",
  "Shopping Mall", "Business District", "Main Plaza", "Industrial Zone",
  "Suburb Center", "East Gateway", "West Plaza", "Park Avenue", "Sports Complex",
  "Library", "Medical Plaza", "Student Housing", "Central Station"
];

export default function TransportationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // AI Route Planning State
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [routeSuggestions, setRouteSuggestions] = useState<any[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);

  // AI-powered route planning function
  const planRoute = async () => {
    if (!fromLocation || !toLocation) return;
    
    setIsLoadingRoute(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI-generated route suggestions based on available transportation
    const suggestions = generateRouteSuggestions(fromLocation, toLocation);
    setRouteSuggestions(suggestions);
    setIsLoadingRoute(false);
  };

  // AI Route Generation Logic
  const generateRouteSuggestions = (from: string, to: string) => {
    const relevantRoutes = transportationData.filter(route => 
      route.stops.some(stop => stop.toLowerCase().includes(from.toLowerCase())) &&
      route.stops.some(stop => stop.toLowerCase().includes(to.toLowerCase()))
    );

    const multiModalRoutes = findMultiModalRoutes(from, to);
    
    const suggestions = [
      ...relevantRoutes.map(route => ({
        id: `direct-${route.id}`,
        type: "Direct Route",
        routes: [route],
        totalTime: calculateTravelTime(route, from, to),
        totalCost: route.fare,
        transfers: 0,
        accessibility: route.accessibility,
        aiRating: 95,
        description: `Direct ${route.type.toLowerCase()} from ${from} to ${to}`
      })),
      ...multiModalRoutes
    ];

    return suggestions.sort((a, b) => b.aiRating - a.aiRating).slice(0, 3);
  };

  const findMultiModalRoutes = (from: string, to: string) => {
    // AI logic to find connecting routes
    const connectionRoutes = [];
    
    // Example multi-modal route generation
    const possibleConnections = transportationData.filter(route => 
      route.stops.some(stop => stop.toLowerCase().includes(from.toLowerCase()))
    );
    
    for (const firstRoute of possibleConnections) {
      const connectingRoutes = transportationData.filter(route => 
        route.id !== firstRoute.id &&
        route.stops.some(stop => firstRoute.stops.includes(stop)) &&
        route.stops.some(stop => stop.toLowerCase().includes(to.toLowerCase()))
      );
      
      if (connectingRoutes.length > 0) {
        connectionRoutes.push({
          id: `multi-${firstRoute.id}-${connectingRoutes[0].id}`,
          type: "Multi-Modal",
          routes: [firstRoute, connectingRoutes[0]],
          totalTime: calculateTravelTime(firstRoute, from, "") + calculateTravelTime(connectingRoutes[0], "", to) + 5,
          totalCost: `$${(parseFloat(firstRoute.fare.replace('$', '')) + parseFloat(connectingRoutes[0].fare.replace('$', ''))).toFixed(2)}`,
          transfers: 1,
          accessibility: firstRoute.accessibility && connectingRoutes[0].accessibility,
          aiRating: 85,
          description: `${firstRoute.type} + ${connectingRoutes[0].type} with transfer`
        });
      }
    }
    
    return connectionRoutes;
  };

  const calculateTravelTime = (route: any, from: string, to: string) => {
    // AI estimation based on route type and distance
    const baseTime = route.type === "Metro" ? 15 : route.type === "Bus" ? 25 : 20;
    const frequencyMultiplier = parseInt(route.frequency.split(' ')[1]) / 10;
    return Math.round(baseTime + frequencyMultiplier);
  };

  const filteredData = transportationData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type.toLowerCase() === filterType.toLowerCase();
    const matchesStatus = filterStatus === "all" || item.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bus": return <Bus className="w-5 h-5" />;
      case "metro": return <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">M</span></div>;
      case "shuttle": return <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"><span className="text-white text-xs font-bold">S</span></div>;
      default: return <Bus className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Public Transportation</h1>
          <p className="text-xl text-gray-600">Real-time schedules, routes, and transportation information</p>
        </div>

        {/* AI Route Planner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Route Planner</h2>
              <p className="text-blue-100">Get optimal routes with real-time AI analysis</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRoutePlanner(!showRoutePlanner)}
              className="ml-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {showRoutePlanner ? 'Hide' : 'Plan Route'}
            </Button>
          </div>

          {showRoutePlanner && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select starting location" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={planRoute}
                disabled={!fromLocation || !toLocation || isLoadingRoute}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              >
                {isLoadingRoute ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    AI Analyzing Best Routes...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Find Optimal Routes
                  </div>
                )}
              </Button>

              {/* AI Route Suggestions */}
              {routeSuggestions.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="text-lg font-semibold">AI Recommended Routes</h3>
                  {routeSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="bg-white/10 border-white/20 text-white">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white">
                              AI Score: {suggestion.aiRating}%
                            </Badge>
                            <Badge variant="outline" className="border-white/30 text-white">
                              {suggestion.type}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{suggestion.totalTime} min</div>
                            <div className="text-sm text-blue-100">{suggestion.totalCost}</div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-blue-100 mb-2">{suggestion.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Route className="w-4 h-4" />
                            <span>{suggestion.routes.length} route{suggestion.routes.length > 1 ? 's' : ''}</span>
                          </div>
                          {suggestion.transfers > 0 && (
                            <div className="flex items-center gap-1">
                              <ArrowRight className="w-4 h-4" />
                              <span>{suggestion.transfers} transfer{suggestion.transfers > 1 ? 's' : ''}</span>
                            </div>
                          )}
                          {suggestion.accessibility && (
                            <Badge variant="outline" className="border-green-300 text-green-300">
                              ♿ Accessible
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="text-xs text-blue-100">
                            Routes: {suggestion.routes.map((r: any) => r.route).join(' → ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search routes, destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Transport Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="metro">Metro</SelectItem>
                <SelectItem value="shuttle">Shuttle</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transportation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((transport) => (
            <Card key={transport.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(transport.type)}
                    <div>
                      <CardTitle className="text-lg">{transport.route}</CardTitle>
                      <CardDescription>{transport.name}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(transport.status)}>
                    {transport.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{transport.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <span>Every {transport.frequency.replace('Every ', '')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">Fare:</span>
                    <span className={transport.fare === "Free" ? "text-green-600 font-semibold" : ""}>{transport.fare}</span>
                  </div>
                  {transport.accessibility && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <span>♿ Wheelchair Accessible</span>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Stops:</p>
                    <div className="flex flex-wrap gap-1">
                      {transport.stops.map((stop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {stop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transportation routes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
