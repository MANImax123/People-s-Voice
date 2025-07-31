"use client";

import { useState } from "react";
import { MapPin, Building, Ruler, Search, Home, Factory, Trees, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const zoningData = [
  {
    id: 1,
    zone: "Residential Zone R1",
    type: "Residential",
    description: "Single-family homes with minimum lot requirements",
    minLotSize: "5,000 sq ft",
    heightLimit: "35 ft",
    maxStories: 2,
    setbacks: { front: "25 ft", side: "10 ft", rear: "20 ft" },
    allowedUses: ["Single-family homes", "Home offices", "Accessory buildings"],
    parkingReq: "2 spaces per unit",
    coverage: "40%",
    area: "North District",
    population: "~15,000"
  },
  {
    id: 2,
    zone: "Residential Zone R2",
    type: "Residential",
    description: "Multi-family residential including duplexes and townhomes",
    minLotSize: "3,000 sq ft",
    heightLimit: "45 ft",
    maxStories: 3,
    setbacks: { front: "20 ft", side: "8 ft", rear: "15 ft" },
    allowedUses: ["Duplexes", "Townhomes", "Small apartments", "Home businesses"],
    parkingReq: "1.5 spaces per unit",
    coverage: "50%",
    area: "East District",
    population: "~22,000"
  },
  {
    id: 3,
    zone: "Commercial Zone C1",
    type: "Commercial",
    description: "Retail, offices, and mixed-use developments",
    minLotSize: "2,000 sq ft",
    heightLimit: "60 ft",
    maxStories: 4,
    setbacks: { front: "0 ft", side: "5 ft", rear: "10 ft" },
    allowedUses: ["Retail stores", "Offices", "Restaurants", "Mixed-use buildings"],
    parkingReq: "1 space per 300 sq ft",
    coverage: "80%",
    area: "Downtown Core",
    population: "~8,000"
  },
  {
    id: 4,
    zone: "Commercial Zone C2",
    type: "Commercial",
    description: "High-intensity commercial and entertainment district",
    minLotSize: "1,500 sq ft",
    heightLimit: "100 ft",
    maxStories: 8,
    setbacks: { front: "0 ft", side: "0 ft", rear: "5 ft" },
    allowedUses: ["Shopping centers", "Hotels", "Entertainment venues", "High-rise offices"],
    parkingReq: "1 space per 250 sq ft",
    coverage: "90%",
    area: "Business District",
    population: "~5,000"
  },
  {
    id: 5,
    zone: "Industrial Zone I1",
    type: "Industrial",
    description: "Light manufacturing and warehouse facilities",
    minLotSize: "10,000 sq ft",
    heightLimit: "45 ft",
    maxStories: 3,
    setbacks: { front: "30 ft", side: "20 ft", rear: "25 ft" },
    allowedUses: ["Light manufacturing", "Warehouses", "Distribution centers", "Tech facilities"],
    parkingReq: "1 space per 500 sq ft",
    coverage: "60%",
    area: "Industrial Park",
    population: "~3,000"
  },
  {
    id: 6,
    zone: "Industrial Zone I2",
    type: "Industrial",
    description: "Heavy industrial and manufacturing",
    minLotSize: "20,000 sq ft",
    heightLimit: "80 ft",
    maxStories: 5,
    setbacks: { front: "50 ft", side: "30 ft", rear: "40 ft" },
    allowedUses: ["Heavy manufacturing", "Processing plants", "Utilities", "Transportation hubs"],
    parkingReq: "1 space per 1000 sq ft",
    coverage: "70%",
    area: "Industrial Corridor",
    population: "~1,500"
  },
  {
    id: 7,
    zone: "Green Zone G1",
    type: "Green",
    description: "Parks, recreation areas, and protected land",
    minLotSize: "N/A",
    heightLimit: "20 ft",
    maxStories: 1,
    setbacks: { front: "50 ft", side: "50 ft", rear: "50 ft" },
    allowedUses: ["Parks", "Recreation facilities", "Nature preserves", "Community gardens"],
    parkingReq: "Varies",
    coverage: "10%",
    area: "Citywide",
    population: "N/A"
  },
  {
    id: 8,
    zone: "Mixed Use Zone MU1",
    type: "Mixed Use",
    description: "Integrated residential and commercial development",
    minLotSize: "3,500 sq ft",
    heightLimit: "75 ft",
    maxStories: 6,
    setbacks: { front: "5 ft", side: "5 ft", rear: "15 ft" },
    allowedUses: ["Mixed-use buildings", "Live-work units", "Ground floor retail", "Upper floor residential"],
    parkingReq: "1.2 spaces per unit",
    coverage: "75%",
    area: "Transit Corridors",
    population: "~12,000"
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
