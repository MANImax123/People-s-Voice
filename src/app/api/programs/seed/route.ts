import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // Clear existing programs (for demo purposes)
    await Program.deleteMany({});

    const samplePrograms = [
      {
        title: "Digital Health Initiative",
        description: "A comprehensive program to digitize healthcare services across the city, providing online consultations, digital health records, and telemedicine facilities for citizens. This initiative aims to make healthcare more accessible and efficient for everyone.",
        category: "health",
        priority: "high",
        status: "active",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        budget: 5000000,
        targetBeneficiaries: 100000,
        eligibilityCriteria: "All residents with valid ID proof and registered address in the city",
        applicationProcess: "Visit nearest healthcare center or apply online through municipal website",
        contactInfo: {
          email: "health@municipality.gov",
          phone: "+91-9876543210",
          website: "https://health.municipality.gov"
        },
        tags: ["digital", "healthcare", "telemedicine", "accessibility"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Health Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Health Department"
        }
      },
      {
        title: "Smart City Infrastructure Development",
        description: "Upgrading city infrastructure with smart technologies including IoT sensors, smart traffic lights, intelligent waste management systems, and real-time monitoring of civic amenities.",
        category: "infrastructure",
        priority: "urgent",
        status: "active",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2026-05-31"),
        budget: 50000000,
        targetBeneficiaries: 500000,
        eligibilityCriteria: "Benefits all city residents automatically",
        applicationProcess: "No application required - automatic implementation citywide",
        contactInfo: {
          email: "infrastructure@municipality.gov",
          phone: "+91-9876543211",
          website: "https://smartcity.municipality.gov"
        },
        tags: ["smart city", "IoT", "infrastructure", "technology"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Infrastructure Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Infrastructure Department"
        }
      },
      {
        title: "Green Energy Subsidy Program",
        description: "Financial assistance for installing solar panels, energy-efficient appliances, and renewable energy systems in residential and commercial properties to promote sustainable living.",
        category: "environment",
        priority: "medium",
        status: "active",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-11-30"),
        budget: 10000000,
        targetBeneficiaries: 25000,
        eligibilityCriteria: "Property owners with income below ₹10 lakhs per annum",
        applicationProcess: "Submit application online with property documents and income certificate",
        contactInfo: {
          email: "green@municipality.gov",
          phone: "+91-9876543212",
          website: "https://green.municipality.gov"
        },
        tags: ["renewable energy", "subsidy", "solar", "environment"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Environment Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Environment Department"
        }
      },
      {
        title: "Skill Development & Employment Program",
        description: "Comprehensive training program for youth and unemployed individuals in various skills including digital literacy, vocational training, entrepreneurship, and job placement assistance.",
        category: "employment",
        priority: "high",
        status: "active",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-08-31"),
        budget: 15000000,
        targetBeneficiaries: 50000,
        eligibilityCriteria: "Age 18-35, unemployed or seeking skill upgrade, local residents",
        applicationProcess: "Register at employment centers or apply online with educational certificates",
        contactInfo: {
          email: "employment@municipality.gov",
          phone: "+91-9876543213",
          website: "https://employment.municipality.gov"
        },
        tags: ["skill development", "employment", "training", "youth"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Employment Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Employment Department"
        }
      },
      {
        title: "Affordable Housing Initiative",
        description: "Construction of affordable housing units for low-income families, senior citizens, and first-time homebuyers with subsidized rates and flexible payment options.",
        category: "housing",
        priority: "high",
        status: "active",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2027-02-28"),
        budget: 100000000,
        targetBeneficiaries: 10000,
        eligibilityCriteria: "Annual income below ₹6 lakhs, no existing property ownership, 5+ years local residency",
        applicationProcess: "Apply through housing board with income proof and residential documents",
        contactInfo: {
          email: "housing@municipality.gov",
          phone: "+91-9876543214",
          website: "https://housing.municipality.gov"
        },
        tags: ["affordable housing", "low income", "subsidized", "residential"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Housing Board"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Housing Board"
        }
      },
      {
        title: "Digital Education Enhancement",
        description: "Upgrading public schools with digital classrooms, tablets for students, high-speed internet connectivity, and online learning platforms to improve educational outcomes.",
        category: "education",
        priority: "medium",
        status: "active",
        startDate: new Date("2024-07-01"),
        endDate: new Date("2025-06-30"),
        budget: 25000000,
        targetBeneficiaries: 75000,
        eligibilityCriteria: "All students in municipal schools automatically included",
        applicationProcess: "Schools automatically enrolled, parents can register for additional online resources",
        contactInfo: {
          email: "education@municipality.gov",
          phone: "+91-9876543215",
          website: "https://education.municipality.gov"
        },
        tags: ["digital education", "schools", "online learning", "technology"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Education Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Education Department"
        }
      },
      {
        title: "Public Transportation Modernization",
        description: "Upgrading public bus fleet with electric buses, implementing smart ticketing systems, real-time tracking, and improving bus stop infrastructure for better citizen mobility.",
        category: "transportation",
        priority: "medium",
        status: "active",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2026-03-31"),
        budget: 75000000,
        targetBeneficiaries: 300000,
        eligibilityCriteria: "All public transport users benefit automatically",
        applicationProcess: "Smart cards available at bus stations and online registration",
        contactInfo: {
          email: "transport@municipality.gov",
          phone: "+91-9876543216",
          website: "https://transport.municipality.gov"
        },
        tags: ["public transport", "electric buses", "smart ticketing", "mobility"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Transport Authority"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Transport Authority"
        }
      },
      {
        title: "Senior Citizen Welfare Program",
        description: "Comprehensive welfare program for senior citizens including free healthcare, regular health checkups, recreational activities, digital literacy training, and emergency support services.",
        category: "welfare",
        priority: "medium",
        status: "active",
        startDate: new Date("2024-10-01"),
        endDate: new Date("2025-09-30"),
        budget: 8000000,
        targetBeneficiaries: 20000,
        eligibilityCriteria: "Citizens aged 60 and above with valid age proof and local address",
        applicationProcess: "Visit community centers or apply online with age and address proof",
        contactInfo: {
          email: "welfare@municipality.gov",
          phone: "+91-9876543217",
          website: "https://welfare.municipality.gov"
        },
        tags: ["senior citizens", "healthcare", "welfare", "community"],
        createdBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Welfare Department"
        },
        lastUpdatedBy: {
          adminId: "admin@municipality.gov",
          adminEmail: "admin@municipality.gov",
          adminName: "Municipal Welfare Department"
        }
      }
    ];

    // Add some simulated engagement data
    const programsWithEngagement = samplePrograms.map(program => ({
      ...program,
      likesCount: Math.floor(Math.random() * 500) + 50,
      dislikesCount: Math.floor(Math.random() * 50) + 5,
      commentsCount: Math.floor(Math.random() * 100) + 10,
      viewsCount: Math.floor(Math.random() * 2000) + 500,
      likes: [], // Empty for now, will be populated when users interact
      dislikes: [],
      comments: []
    }));

    await Program.insertMany(programsWithEngagement);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${programsWithEngagement.length} programs`,
      programsCount: programsWithEngagement.length
    });

  } catch (error: any) {
    console.error('Seed programs error:', error);
    return NextResponse.json(
      { error: 'Failed to seed programs' },
      { status: 500 }
    );
  }
}
