"use client";

import { useState } from "react";
import { Building, Clock, MapPin, Phone, Globe, Search, Star, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Real Hyderabad business directory data
const businessData = [
  {
    id: 1,
    name: "Apollo Hospitals",
    category: "Healthcare",
    description: "Multi-specialty hospital with 24/7 emergency services, advanced cardiac care, and organ transplant facilities",
    address: "Jubilee Hills, Road No 72, Hyderabad, Telangana 500033",
    phone: "040-2360-7777",
    hours: "Open 24/7",
    website: "www.apollohospitals.com",
    rating: 4.3,
    services: ["Emergency Care", "Cardiology", "Oncology", "Neurology", "Organ Transplant"],
    accessibility: true,
    parking: true
  },
  {
    id: 2,
    name: "State Central Library",
    category: "Education",
    description: "Historic public library in Afzalgunj with vast collection of books, manuscripts, and digital resources",
    address: "Afzalgunj, Hyderabad, Telangana 500012",
    phone: "040-2452-4969",
    hours: "Mon-Sat: 8 AM - 8 PM, Sun: 10 AM - 6 PM",
    website: "www.statelibrarytelangana.gov.in",
    rating: 4.1,
    services: ["Books", "Research Facilities", "Digital Library", "Reading Rooms", "Manuscripts"],
    accessibility: true,
    parking: false
  },
  {
    id: 3,
    name: "RTO Khairatabad",
    category: "Government",
    description: "Regional Transport Office for driving license, vehicle registration, and transport-related services",
    address: "Khairatabad, Hyderabad, Telangana 500004",
    phone: "040-2332-4455",
    hours: "Mon-Sat: 10 AM - 5 PM",
    website: "www.transport.telangana.gov.in",
    rating: 3.2,
    services: ["Driving License", "Vehicle Registration", "RC Transfer", "Fitness Certificate"],
    accessibility: true,
    parking: true
  },
  {
    id: 4,
    name: "GPO Abids",
    category: "Government",
    description: "General Post Office providing comprehensive postal services, passports, and courier facilities",
    address: "Abids Road, Hyderabad, Telangana 500001",
    phone: "040-2475-5555",
    hours: "Mon-Sat: 9 AM - 6 PM",
    website: "www.indiapost.gov.in",
    rating: 3.8,
    services: ["Mail Services", "Speed Post", "Passport Services", "Money Orders", "Insurance"],
    accessibility: true,
    parking: false
  },
  {
    id: 5,
    name: "Cyberabad Police Commissionerate",
    category: "Safety",
    description: "Police headquarters for Cyberabad covering HITEC City, Gachibowli, and surrounding IT areas",
    address: "Gachibowli, Hyderabad, Telangana 500032",
    phone: "040-2743-0100",
    hours: "Open 24/7",
    website: "www.cyberabadpolice.gov.in",
    rating: 4.0,
    services: ["Emergency Response", "Cyber Crime Cell", "Traffic Management", "Women Safety"],
    accessibility: true,
    parking: true
  },
  {
    id: 6,
    name: "Fire Station Begumpet",
    category: "Safety",
    description: "Central fire station serving Secunderabad, Begumpet, and surrounding areas with rapid response",
    address: "Begumpet, Secunderabad, Telangana 500016",
    phone: "040-2781-2345",
    hours: "Open 24/7",
    website: "www.tsfiredepartment.gov.in",
    rating: 4.5,
    services: ["Fire Response", "Emergency Medical", "Rescue Operations", "Fire Safety Training"],
    accessibility: true,
    parking: true
  },
  {
    id: 7,
    name: "GHMC Head Office",
    category: "Government",
    description: "Greater Hyderabad Municipal Corporation headquarters for civic services and administration",
    address: "Abids, Hyderabad, Telangana 500001",
    phone: "040-2421-5555",
    hours: "Mon-Sat: 10 AM - 5 PM",
    website: "www.ghmc.gov.in",
    rating: 3.5,
    services: ["Property Tax", "Building Permits", "Water Connections", "Sanitation", "Birth/Death Certificates"],
    accessibility: true,
    parking: true
  },
  {
    id: 8,
    name: "HITEC City",
    category: "Technology",
    description: "Premier IT hub housing major tech companies like Microsoft, Google, Amazon, and local startups",
    address: "HITEC City, Madhapur, Hyderabad, Telangana 500081",
    phone: "040-2311-0000",
    hours: "24/7 Business District",
    website: "www.hitecindia.org",
    rating: 4.7,
    services: ["IT Services", "Software Development", "Co-working Spaces", "Business Centers"],
    accessibility: true,
    parking: true
  },
  {
    id: 9,
    name: "Charminar Heritage Walk",
    category: "Tourism",
    description: "Historic monument and surrounding old city area with guided tours and cultural experiences",
    address: "Charminar, Hyderabad, Telangana 500002",
    phone: "040-2452-0035",
    hours: "Daily: 9 AM - 5:30 PM",
    website: "www.telanganatourism.gov.in",
    rating: 4.6,
    services: ["Guided Tours", "Heritage Walks", "Cultural Programs", "Photography"],
    accessibility: false,
    parking: false
  },
  {
    id: 10,
    name: "T-Hub",
    category: "Technology",
    description: "India's largest startup incubator supporting entrepreneurs and innovation ecosystem",
    address: "Raidurg, HITEC City, Hyderabad, Telangana 500081",
    phone: "040-2311-2233",
    hours: "Mon-Fri: 9 AM - 6 PM",
    website: "www.t-hub.co",
    rating: 4.8,
    services: ["Startup Incubation", "Mentorship", "Funding Support", "Co-working Space"],
    accessibility: true,
    parking: true
  },
  {
    id: 11,
    name: "Laad Bazaar",
    category: "Shopping",
    description: "Traditional market famous for bangles, pearls, and Hyderabadi jewelry near Charminar",
    address: "Laad Bazaar, Charminar, Hyderabad, Telangana 500002",
    phone: "040-2452-1234",
    hours: "Daily: 10 AM - 9 PM",
    website: "www.hyderabadshopping.com",
    rating: 4.2,
    services: ["Bangles", "Pearls", "Traditional Jewelry", "Handicrafts", "Perfumes"],
    accessibility: false,
    parking: false
  },
  {
    id: 12,
    name: "Nehru Zoological Park",
    category: "Recreation",
    description: "Large zoo with diverse wildlife, safari park, and conservation programs spread over 380 acres",
    address: "Bahadurpura, Hyderabad, Telangana 500064",
    phone: "040-2415-5402",
    hours: "Tue-Sun: 8:30 AM - 5 PM (Closed Mondays)",
    website: "www.nehruzoopark.com",
    rating: 4.0,
    services: ["Wildlife Viewing", "Safari Rides", "Education Programs", "Conservation"],
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

  const getDirections = (address: string, businessName: string) => {
    // Format the address for Google Maps
    const formattedAddress = encodeURIComponent(address);
    const destination = encodeURIComponent(`${businessName}, ${address}`);
    
    // Create Google Maps directions URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank');
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

                  <div className="pt-3">
                    <Button 
                      size="sm" 
                      className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      onClick={() => getDirections(business.address, business.name)}
                    >
                      <Navigation className="w-4 h-4" />
                      Get Directions
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
