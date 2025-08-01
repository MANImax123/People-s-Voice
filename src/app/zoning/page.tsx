"use client";

import { useState } from "react";
import { MapPin, Building, Ruler, Search, Home, Factory, Trees, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Real Hyderabad zoning data based on GHMC regulations
const zoningData = [
  {
    id: 1,
    zone: "Residential Zone R1 - Banjara Hills",
    type: "Residential",
    description: "Premium residential area with single-family villas and luxury apartments",
    minLotSize: "500 sq yards (4,500 sq ft)",
    heightLimit: "15 meters (49 ft)",
    maxStories: 4,
    setbacks: { front: "30 ft", side: "15 ft", rear: "20 ft" },
    allowedUses: ["Independent Houses", "Villas", "High-end Apartments", "Guest Houses"],
    parkingReq: "2 spaces per unit",
    coverage: "50%",
    area: "Banjara Hills, Jubilee Hills",
    population: "~45,000"
  },
  {
    id: 2,
    zone: "Residential Zone R2 - Madhapur",
    type: "Residential",
    description: "Mixed residential zone with apartments, gated communities near IT corridor",
    minLotSize: "200 sq yards (1,800 sq ft)",
    heightLimit: "60 meters (197 ft)",
    maxStories: 18,
    setbacks: { front: "20 ft", side: "12 ft", rear: "15 ft" },
    allowedUses: ["Apartments", "Gated Communities", "Service Apartments", "PG Accommodations"],
    parkingReq: "1.5 spaces per unit",
    coverage: "65%",
    area: "Madhapur, Kondapur, Gachibowli",
    population: "~180,000"
  },
  {
    id: 3,
    zone: "Commercial Zone C1 - HITEC City",
    type: "Commercial",
    description: "Information Technology and Financial Services Special Economic Zone",
    minLotSize: "1,000 sq yards (9,000 sq ft)",
    heightLimit: "No limit (subject to airport clearance)",
    maxStories: "Unlimited",
    setbacks: { front: "15 ft", side: "10 ft", rear: "15 ft" },
    allowedUses: ["IT Offices", "Software Parks", "Financial Services", "Data Centers", "R&D Centers"],
    parkingReq: "1 space per 100 sq ft built-up",
    coverage: "70%",
    area: "HITEC City, Financial District",
    population: "~200,000 (working population)"
  },
  {
    id: 4,
    zone: "Mixed Use Zone M1 - Banjara Hills Road No. 12",
    type: "Mixed Use",
    description: "Commercial ground floor with residential upper floors along main roads",
    minLotSize: "150 sq yards (1,350 sq ft)",
    heightLimit: "45 meters (148 ft)",
    maxStories: 12,
    setbacks: { front: "10 ft", side: "8 ft", rear: "12 ft" },
    allowedUses: ["Retail Shops", "Restaurants", "Offices", "Residential Apartments", "Clinics"],
    parkingReq: "Commercial: 1 per 200 sq ft, Residential: 1 per unit",
    coverage: "75%",
    area: "Road No. 12, Road No. 1, Main Roads",
    population: "~25,000"
  },
  {
    id: 5,
    zone: "Industrial Zone I1 - Jeedimetla",
    type: "Industrial",
    description: "Light industrial area for manufacturing, warehousing, and logistics",
    minLotSize: "1 acre (43,560 sq ft)",
    heightLimit: "25 meters (82 ft)",
    maxStories: 6,
    setbacks: { front: "40 ft", side: "25 ft", rear: "30 ft" },
    allowedUses: ["Manufacturing", "Warehousing", "Logistics", "Food Processing", "Textile"],
    parkingReq: "1 space per 5 employees",
    coverage: "60%",
    area: "Jeedimetla, Balanagar, Kukatpally Industrial Area",
    population: "~15,000 (working population)"
  },
  {
    id: 6,
    zone: "Heritage Zone H1 - Old City",
    type: "Heritage",
    description: "Protected heritage area around Charminar with strict construction guidelines",
    minLotSize: "As per existing plot sizes",
    heightLimit: "12 meters (39 ft)",
    maxStories: 3,
    setbacks: { front: "As per existing", side: "As per existing", rear: "5 ft minimum" },
    allowedUses: ["Traditional Shops", "Heritage Hotels", "Restaurants", "Cultural Centers"],
    parkingReq: "Not mandatory due to narrow roads",
    coverage: "80% (existing structures)",
    area: "Charminar, Laad Bazaar, Mecca Masjid surroundings",
    population: "~150,000"
  },
  {
    id: 7,
    zone: "Recreational Zone R - Hussain Sagar",
    type: "Recreational",
    description: "Public recreational space including parks, lakes, and entertainment facilities",
    minLotSize: "Not applicable",
    heightLimit: "15 meters (49 ft)",
    maxStories: 3,
    setbacks: { front: "50 ft from water body", side: "20 ft", rear: "20 ft" },
    allowedUses: ["Parks", "Boating", "Restaurants", "Event Venues", "Sports Facilities"],
    parkingReq: "1 space per 4 visitors capacity",
    coverage: "20%",
    area: "Tank Bund, Necklace Road, Lumbini Park",
    population: "Public recreational space"
  },
  {
    id: 8,
    zone: "Agricultural Zone A1 - Outer Ring Road",
    type: "Agricultural",
    description: "Agricultural land with restrictions on non-farm activities",
    minLotSize: "2 acres minimum (87,120 sq ft)",
    heightLimit: "12 meters (39 ft)",
    maxStories: 2,
    setbacks: { front: "100 ft from ORR", side: "30 ft", rear: "30 ft" },
    allowedUses: ["Farming", "Dairy", "Poultry", "Farm Houses", "Agricultural Processing"],
    parkingReq: "As per requirement",
    coverage: "10%",
    area: "Beyond Outer Ring Road",
    population: "~50,000 (rural population)"
  }
];

export default function ZoningPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterHeight, setFilterHeight] = useState("all");

  const filteredZones = zoningData.filter(zone => {
    const matchesSearch = zone.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         zone.allowedUses.some(use => use.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || zone.type.toLowerCase() === filterType.toLowerCase();
    const matchesHeight = filterHeight === "all" || 
                         (filterHeight === "low" && parseInt(zone.heightLimit) <= 35) ||
                         (filterHeight === "medium" && parseInt(zone.heightLimit) > 35 && parseInt(zone.heightLimit) <= 60) ||
                         (filterHeight === "high" && parseInt(zone.heightLimit) > 60);
    
    return matchesSearch && matchesType && matchesHeight;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "residential": return "bg-green-100 text-green-800";
      case "commercial": return "bg-blue-100 text-blue-800";
      case "industrial": return "bg-gray-100 text-gray-800";
      case "green": return "bg-emerald-100 text-emerald-800";
      case "mixed use": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "residential": return <Home className="w-5 h-5" />;
      case "commercial": return <Store className="w-5 h-5" />;
      case "industrial": return <Factory className="w-5 h-5" />;
      case "green": return <Trees className="w-5 h-5" />;
      case "mixed use": return <Building className="w-5 h-5" />;
      default: return <Building className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Zoning Information</h1>
          <p className="text-xl text-gray-600">Comprehensive zoning codes, property details, and development regulations</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search zones, uses, areas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Zone Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
                <SelectItem value="green">Green Space</SelectItem>
                <SelectItem value="mixed use">Mixed Use</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterHeight} onValueChange={setFilterHeight}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Height Limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Heights</SelectItem>
                <SelectItem value="low">Low (≤35 ft)</SelectItem>
                <SelectItem value="medium">Medium (36-60 ft)</SelectItem>
                <SelectItem value="high">High (&gt;60 ft)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Zoning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zone) => (
            <Card key={zone.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTypeColor(zone.type)}>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(zone.type)}
                      {zone.type}
                    </div>
                  </Badge>
                </div>
                <CardTitle className="text-lg">{zone.zone}</CardTitle>
                <CardDescription className="text-sm">{zone.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Ruler className="w-3 h-3" />
                        <span className="font-medium">Height Limit</span>
                      </div>
                      <div className="font-semibold text-blue-600">{zone.heightLimit}</div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Building className="w-3 h-3" />
                        <span className="font-medium">Max Stories</span>
                      </div>
                      <div className="font-semibold text-blue-600">{zone.maxStories}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Minimum Lot Size:</div>
                    <div className="text-blue-600 font-semibold">{zone.minLotSize}</div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Area Coverage:</div>
                    <div className="text-blue-600 font-semibold">{zone.coverage} max</div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Setback Requirements:</div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="bg-blue-50 p-1 rounded text-center">
                        <div className="text-gray-600">Front</div>
                        <div className="font-semibold">{zone.setbacks.front}</div>
                      </div>
                      <div className="bg-blue-50 p-1 rounded text-center">
                        <div className="text-gray-600">Side</div>
                        <div className="font-semibold">{zone.setbacks.side}</div>
                      </div>
                      <div className="bg-blue-50 p-1 rounded text-center">
                        <div className="text-gray-600">Rear</div>
                        <div className="font-semibold">{zone.setbacks.rear}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Parking Requirement:</div>
                    <div className="text-blue-600 font-semibold">{zone.parkingReq}</div>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">Allowed Uses:</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.allowedUses.slice(0, 3).map((use, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                      {zone.allowedUses.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{zone.allowedUses.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{zone.area}</span>
                    {zone.population !== "N/A" && (
                      <span className="text-blue-600 font-medium">({zone.population})</span>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                      View Zone Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredZones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No zoning information found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
