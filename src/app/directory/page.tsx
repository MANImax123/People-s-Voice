"use client";

import { useState } from "react";
import { Building, Clock, MapPin, Phone, Globe, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const businessData = [
  {
    id: 1,
    name: "City Hospital",
    category: "Healthcare",
    description: "Full-service hospital with 24/7 emergency services",
    address: "123 Medical Drive",
    phone: "(555) 123-4567",
    hours: "Open 24/7",
    website: "www.cityhospital.com",
    rating: 4.5,
    services: ["Emergency Care", "Surgery", "Pediatrics", "Cardiology"],
    accessibility: true,
    parking: true
  },
  {
    id: 2,
    name: "Central Library",
    category: "Education",
    description: "Main public library with books, study rooms, and free WiFi",
    address: "456 Knowledge Avenue",
    phone: "(555) 234-5678",
    hours: "Mon-Sat: 9 AM - 8 PM, Sun: 12 PM - 6 PM",
    website: "www.centrallibrary.gov",
    rating: 4.8,
    services: ["Books", "Study Rooms", "WiFi", "Computer Access", "Programs"],
    accessibility: true,
    parking: true
  },
  {
    id: 3,
    name: "DMV Office",
    category: "Government",
    description: "Department of Motor Vehicles - License renewal and vehicle registration",
    address: "789 Government Plaza",
    phone: "(555) 345-6789",
    hours: "Mon-Fri: 8 AM - 5 PM",
    website: "www.dmv.gov",
    rating: 3.2,
    services: ["License Renewal", "Vehicle Registration", "Road Tests", "ID Cards"],
    accessibility: true,
    parking: true
  },
  {
    id: 4,
    name: "Post Office",
    category: "Government",
    description: "Full postal services including mail, packages, and PO boxes",
    address: "321 Mail Street",
    phone: "(555) 456-7890",
    hours: "Mon-Fri: 9 AM - 6 PM, Sat: 9 AM - 3 PM",
    website: "www.usps.com",
    rating: 4.0,
    services: ["Mail Services", "Package Shipping", "PO Boxes", "Passport Services"],
    accessibility: true,
    parking: true
  },
  {
    id: 5,
    name: "City Police Department",
    category: "Safety",
    description: "Main police station providing law enforcement and community safety",
    address: "555 Safety Boulevard",
    phone: "(555) 567-8901",
    hours: "Open 24/7",
    website: "www.citypolice.gov",
    rating: 4.3,
    services: ["Emergency Response", "Crime Prevention", "Traffic Enforcement", "Community Programs"],
    accessibility: true,
    parking: true
  },
  {
    id: 6,
    name: "Fire Department Station 1",
    category: "Safety",
    description: "Main fire station providing emergency fire and rescue services",
    address: "777 Hero Street",
    phone: "(555) 678-9012",
    hours: "Open 24/7",
    website: "www.cityfire.gov",
    rating: 4.9,
    services: ["Fire Response", "Emergency Medical", "Rescue Operations", "Safety Education"],
    accessibility: true,
    parking: true
  },
  {
    id: 7,
    name: "City Hall",
    category: "Government",
    description: "Municipal government offices and public services",
    address: "100 Civic Center Plaza",
    phone: "(555) 789-0123",
    hours: "Mon-Fri: 8 AM - 5 PM",
    website: "www.citygovt.gov",
    rating: 3.8,
    services: ["Permits", "Licenses", "Tax Services", "Public Records", "City Council"],
    accessibility: true,
    parking: true
  },
  {
    id: 8,
    name: "Community Recreation Center",
    category: "Recreation",
    description: "Public recreation facility with gym, pool, and activity programs",
    address: "888 Wellness Way",
    phone: "(555) 890-1234",
    hours: "Mon-Fri: 6 AM - 10 PM, Weekends: 8 AM - 8 PM",
    website: "www.cityrecreation.gov",
    rating: 4.6,
    services: ["Fitness Center", "Swimming Pool", "Sports Courts", "Classes", "Events"],
    accessibility: true,
    parking: true
  },
  {
    id: 9,
    name: "Public Works Department",
    category: "Utilities",
    description: "City services including water, sewer, and road maintenance",
    address: "999 Infrastructure Drive",
    phone: "(555) 901-2345",
    hours: "Mon-Fri: 7 AM - 4 PM",
    website: "www.citypublicworks.gov",
    rating: 3.5,
    services: ["Water Services", "Sewer Maintenance", "Road Repair", "Waste Management"],
    accessibility: true,
    parking: true
  },
  {
    id: 10,
    name: "Senior Community Center",
    category: "Community",
    description: "Programs and services for senior citizens and elderly residents",
    address: "222 Golden Years Avenue",
    phone: "(555) 012-3456",
    hours: "Mon-Fri: 9 AM - 5 PM",
    website: "www.seniorcenter.gov",
    rating: 4.7,
    services: ["Senior Programs", "Meals", "Transportation", "Health Services", "Social Activities"],
    accessibility: true,
    parking: true
  }
];

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterHours, setFilterHours] = useState("all");

  const filteredBusinesses = businessData.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === "all" || business.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesHours = filterHours === "all" || 
                        (filterHours === "24/7" && business.hours.includes("24/7")) ||
                        (filterHours === "weekends" && business.hours.toLowerCase().includes("sat"));
    
    return matchesSearch && matchesCategory && matchesHours;
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "healthcare": return "bg-red-100 text-red-800";
      case "education": return "bg-blue-100 text-blue-800";
      case "government": return "bg-purple-100 text-purple-800";
      case "safety": return "bg-orange-100 text-orange-800";
      case "recreation": return "bg-green-100 text-green-800";
      case "utilities": return "bg-gray-100 text-gray-800";
      case "community": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Directory</h1>
          <p className="text-xl text-gray-600">Find local businesses, services, and government offices with operating hours</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search businesses, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="recreation">Recreation</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterHours} onValueChange={setFilterHours}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hours</SelectItem>
                <SelectItem value="24/7">24/7 Services</SelectItem>
                <SelectItem value="weekends">Weekend Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(business.category)}>
                    {business.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {renderStars(business.rating)}
                    <span className="text-sm text-gray-600 ml-1">({business.rating})</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription className="text-sm">{business.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{business.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className={business.hours.includes("24/7") ? "text-green-600 font-semibold" : ""}>
                      {business.hours}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <a href={`https://${business.website}`} className="text-blue-600 hover:underline">
                      {business.website}
                    </a>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {business.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {business.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{business.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {business.accessibility && (
                      <Badge variant="outline" className="text-xs text-green-600">
                        ♿ Accessible
                      </Badge>
                    )}
                    {business.parking && (
                      <Badge variant="outline" className="text-xs text-blue-600">
                        🅿️ Parking
                      </Badge>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      Contact Business
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No businesses found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
