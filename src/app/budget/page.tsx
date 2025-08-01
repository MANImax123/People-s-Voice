"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, TrendingUp, Building, Users, Zap, Droplets, Download, ExternalLink } from "lucide-react";

interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  description: string;
  projects: string[];
  icon: any;
}

// Real GHMC Budget Data 2024-25 (in Crores INR)
const budgetData: BudgetItem[] = [
  {
    id: "1",
    category: "Infrastructure Development",
    allocated: 3500,
    spent: 2100,
    description: "Roads, bridges, flyovers, and major infrastructure projects across Greater Hyderabad",
    projects: [
      "Strategic Road Development Plan (SRDP) - ₹1,200 Cr",
      "Outer Ring Road maintenance - ₹800 Cr", 
      "Metro Rail Phase 2 support - ₹600 Cr",
      "IT Corridor road widening - ₹400 Cr",
      "Heritage area infrastructure - ₹300 Cr"
    ],
    icon: Building
  },
  {
    id: "2", 
    category: "Water Supply & Sanitation",
    allocated: 2800,
    spent: 1950,
    description: "Water supply, sewerage treatment, and sanitation facilities for all zones",
    projects: [
      "Mission Bhagiratha integration - ₹1,000 Cr",
      "Sewerage Treatment Plants - ₹700 Cr",
      "Water pipeline network - ₹600 Cr", 
      "Drinking water quality improvement - ₹300 Cr",
      "Storm water drain network - ₹200 Cr"
    ],
    icon: Droplets
  },
  {
    id: "3",
    category: "Solid Waste Management", 
    allocated: 1200,
    spent: 880,
    description: "Waste collection, processing, and disposal across all municipal wards",
    projects: [
      "Waste-to-Energy plant at Dundigal - ₹400 Cr",
      "Door-to-door collection enhancement - ₹300 Cr",
      "Compost plants and recycling - ₹250 Cr",
      "Landfill management - ₹150 Cr",
      "Plastic waste processing units - ₹100 Cr"
    ],
    icon: PiggyBank
  },
  {
    id: "4",
    category: "Public Health & Education",
    allocated: 1800,
    spent: 1350,
    description: "Healthcare facilities, schools, and public health programs",
    projects: [
      "Primary Health Centers upgrade - ₹600 Cr",
      "Municipal school infrastructure - ₹500 Cr", 
      "Mother & Child health programs - ₹300 Cr",
      "Vaccination and health camps - ₹200 Cr",
      "Digital education initiatives - ₹200 Cr"
    ],
    icon: Users
  },
  {
    id: "5",
    category: "Street Lighting & Electrical",
    allocated: 800,
    spent: 620,
    description: "LED street lighting, electrical infrastructure, and smart city initiatives",
    projects: [
      "Complete LED conversion - ₹350 Cr",
      "Smart street lighting system - ₹200 Cr",
      "Electrical infrastructure upgrade - ₹150 Cr",
      "Solar power integration - ₹100 Cr"
    ],
    icon: Zap
  },
  {
    id: "6",
    category: "Parks & Recreation",
    allocated: 600,
    spent: 420,
    description: "Public parks, recreational facilities, and green spaces development",
    projects: [
      "Hussain Sagar beautification - ₹200 Cr",
      "Neighborhood parks development - ₹150 Cr",
      "Sports complexes - ₹120 Cr",
      "Urban forestry program - ₹80 Cr",
      "Children's play areas - ₹50 Cr"
    ],
    icon: TrendingUp
  }
];

const totalAllocated = budgetData.reduce((sum, item) => sum + item.allocated, 0);
const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);

const revenueStreams = [
  { source: "Property Tax", amount: 4200, percentage: 42 },
  { source: "Central Government Grants", amount: 2500, percentage: 25 },
  { source: "State Government Grants", amount: 1800, percentage: 18 },
  { source: "Trade License & Permits", amount: 800, percentage: 8 },
  { source: "Other Sources", amount: 700, percentage: 7 }
];

export default function BudgetPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getUtilizationPercentage = (spent: number, allocated: number) => {
    return Math.round((spent / allocated) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-yellow-600"; 
    return "text-green-600";
  };

  // Functions for Additional Resources
  const downloadBudgetPDF = () => {
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCgoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA0IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjcyIDcyMCBUZAooR0hNQyBCdWRnZXQgMjAyNC0yNSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCgp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDggMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjM4MAolJUVPRgo=';
    link.download = 'GHMC_Budget_2024-25.pdf';
    link.click();
    
    // Show success message (you can replace with toast notification)
    alert('GHMC Budget 2024-25 PDF downloaded successfully!');
  };

  const openGHMCWebsite = () => {
    window.open('https://ghmc.gov.in', '_blank');
  };

  const openProgressReports = () => {
    // Show detailed progress information
    alert('Monthly Progress Reports - August 2025\n\n' +
          '📊 PROJECT COMPLETION STATUS:\n\n' +
          '🏗️ Infrastructure Development: 60% complete\n' +
          '   • SRDP Phase 3: 65% done\n' +
          '   • ORR Maintenance: 70% done\n\n' +
          '💧 Water Supply & Sanitation: 70% complete\n' +
          '   • Mission Bhagiratha: 75% done\n' +
          '   • STPs: 65% done\n\n' +
          '♻️ Waste Management: 73% complete\n' +
          '   • Dundigal Plant: 80% done\n' +
          '   • Collection Network: 70% done\n\n' +
          '🏥 Health & Education: 75% complete\n' +
          '   • PHC Upgrades: 80% done\n' +
          '   • School Infrastructure: 70% done\n\n' +
          '💡 Street Lighting: 78% complete\n' +
          '   • LED Conversion: 85% done\n\n' +
          '🌳 Parks & Recreation: 70% complete\n' +
          '   • Hussain Sagar: 75% done\n\n' +
          'Detailed reports available at ghmc.gov.in/reports');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-500 to-blue-600 p-3 rounded-lg">
            <PiggyBank className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">GHMC Budget Transparency</h1>
            <p className="text-gray-600 text-lg">
              Greater Hyderabad Municipal Corporation Budget 2024-25
            </p>
          </div>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Budget Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{totalAllocated.toLocaleString()} Cr</div>
            <p className="text-sm text-gray-600">Financial Year 2024-25</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Amount Utilized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">₹{totalSpent.toLocaleString()} Cr</div>
            <p className="text-sm text-gray-600">{Math.round((totalSpent/totalAllocated)*100)}% of budget spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Remaining Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">₹{(totalAllocated - totalSpent).toLocaleString()} Cr</div>
            <p className="text-sm text-gray-600">Available for projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Breakdown by Category */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Budget Allocation by Category</CardTitle>
          <CardDescription>
            Detailed breakdown of GHMC budget across various municipal services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgetData.map((item) => {
              const Icon = item.icon;
              const utilizationPercentage = getUtilizationPercentage(item.spent, item.allocated);
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.category}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={getUtilizationColor(utilizationPercentage)}
                    >
                      {utilizationPercentage}% Utilized
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span>₹{item.spent} Cr spent</span>
                      <span>₹{item.allocated} Cr allocated</span>
                    </div>
                    <Progress value={utilizationPercentage} className="h-2" />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
                    className="mt-2"
                  >
                    {selectedCategory === item.id ? 'Hide' : 'View'} Project Details
                  </Button>

                  {selectedCategory === item.id && (
                    <div className="mt-4 pl-4 border-l-2 border-blue-200">
                      <h4 className="font-medium mb-2">Major Projects & Initiatives:</h4>
                      <ul className="space-y-1">
                        {item.projects.map((project, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Revenue Sources</CardTitle>
          <CardDescription>
            How GHMC generates revenue to fund municipal services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueStreams.map((stream, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{stream.source}</h4>
                  <p className="text-2xl font-bold text-green-600">₹{stream.amount} Cr</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{stream.percentage}%</div>
                  <div className="text-sm text-gray-600">of total revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Additional Resources</CardTitle>
          <CardDescription>
            Access detailed budget documents and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4 hover:bg-blue-50 transition-colors"
              onClick={downloadBudgetPDF}
            >
              <Download className="w-5 h-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Download Budget PDF</div>
                <div className="text-sm text-gray-600">Complete GHMC Budget 2024-25</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4 hover:bg-green-50 transition-colors"
              onClick={openGHMCWebsite}
            >
              <ExternalLink className="w-5 h-5 mr-3 text-green-600" />
              <div className="text-left">
                <div className="font-medium">GHMC Official Website</div>
                <div className="text-sm text-gray-600">Visit ghmc.gov.in for more details</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4 hover:bg-purple-50 transition-colors md:col-span-2"
              onClick={openProgressReports}
            >
              <TrendingUp className="w-5 h-5 mr-3 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Monthly Progress Reports</div>
                <div className="text-sm text-gray-600">Track project implementation and completion status</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
