import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatbotResponse {
  response: string;
  type: 'text' | 'quick-reply' | 'contact';
  suggestions?: string[];
}

// Initialize Google AI
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await generateChatbotResponse(query.toLowerCase());
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { 
        response: "I'm experiencing technical difficulties. Please contact our support team for immediate assistance at 1800-CIVIC-HELP.",
        type: 'text'
      },
      { status: 500 }
    );
  }
}

// Hyderabad locations database
const hyderabadLocations = [
  // Major landmarks
  'Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Ramoji Film City', 
  'Birla Mandir', 'Salar Jung Museum', 'Chowmahalla Palace', 'Qutb Shahi Tombs',
  
  // IT and Business areas
  'HITEC City', 'Gachibowli', 'Kondapur', 'Madhapur', 'Financial District',
  'Miyapur', 'Kukatpally', 'Begumpet', 'Somajiguda', 'Jubilee Hills',
  
  // Transportation hubs
  'Secunderabad Railway Station', 'Hyderabad Railway Station', 'Shamshabad Airport', 'Airport',
  'MGBS Bus Station', 'JBS Bus Station', 'Kacheguda Railway Station',
  
  // Educational institutions
  'University of Hyderabad', 'BITS Pilani Hyderabad', 'ISB Hyderabad',
  'Osmania University', 'JNTU Hyderabad', 'IIT Hyderabad',
  
  // Commercial areas
  'Abids', 'Sultan Bazaar', 'Laad Bazaar', 'Begum Bazaar', 'General Bazaar',
  'Forum Sujana Mall', 'Inorbit Mall', 'GVK One Mall', 'Sarath City Capital Mall',
  
  // Government offices
  'Secretariat', 'GHMC Head Office', 'Collectorate', 'Assembly', 'High Court',
  
  // Residential areas
  'Banjara Hills', 'Hitech City', 'Gachibowli', 'Kompally', 'Uppal',
  'LB Nagar', 'Dilsukhnagar', 'Ameerpet', 'SR Nagar', 'Mehdipatnam'
];

function handleRoutePlanning(query: string): ChatbotResponse {
  // Extract potential location names from the query
  const mentionedLocations = hyderabadLocations.filter(location => 
    query.toLowerCase().includes(location.toLowerCase())
  );

  // Check if user mentioned specific locations
  if (mentionedLocations.length >= 2) {
    const from = mentionedLocations[0];
    const to = mentionedLocations[1];
    return {
      response: `🗺️ **Route: ${from} → ${to}**

**Transportation Options:**
🚇 **Metro Route:** ${getMetroRoute(from, to)}
🚌 **Bus Route:** Available via TSRTC - Check app for real-time schedules
� **By Car:** Estimated ${getEstimatedTime(from, to)} via main roads
� **Auto/Cab:** Available throughout - Use Ola/Uber for live pricing

**Quick Tips:**
• Peak hours: 8-10 AM, 6-8 PM (expect delays)
• Metro is fastest during rush hours
• Use ORR for longer distances
• Check Google Maps for live traffic

**Need alternative routes or specific directions?**
Let me know and I'll provide more options!`,
      type: 'quick-reply',
      suggestions: [
        `Metro route ${from} to ${to}`,
        `Bus timings ${from} to ${to}`,
        'Alternative routes',
        'Live traffic update',
        'Cost comparison'
      ]
    };
  }

  // If only one location mentioned, suggest destinations
  if (mentionedLocations.length === 1) {
    const location = mentionedLocations[0];
    const nearbyPlaces = getNearbyPlaces(location);
    
    return {
      response: `🗺️ **Routes from ${location}**

**Popular destinations from ${location}:**
${nearbyPlaces.join(' • ')}

**Transportation from ${location}:**
🚇 **Metro Access:** ${getMetroAccess(location)}
🚌 **Bus Connectivity:** Well connected via TSRTC network
🚗 **Major Roads:** ${getMajorRoads(location)}

**Tell me your destination** or choose from:`,
      type: 'quick-reply',
      suggestions: nearbyPlaces.slice(0, 4).concat(['Manual entry'])
    };
  }

  // Default comprehensive Hyderabad route planner
  return {
    response: `🗺️ **Hyderabad AI Route Planner**

**🏛️ Major Areas & Landmarks:**
${hyderabadLocations.slice(0, 12).join(' • ')}

**🚇 Metro Line Coverage:**
• **Red Line:** LB Nagar ↔ Miyapur
• **Blue Line:** Nagole ↔ Raidurg  
• **Green Line:** JBS ↔ MGBS

**🎯 Quick Route Planning:**
Just tell me: "Route from [Start] to [End]"

**📍 Popular Routes:**
• Airport ↔ HITEC City: 45-60 mins
• Charminar ↔ Gachibowli: 60-90 mins  
• Secunderabad ↔ Jubilee Hills: 30-45 mins
• Ameerpet ↔ Kukatpally: 20-30 mins

**💡 Pro Tips:**
• Use Metro during peak hours (8-10 AM, 6-8 PM)
• ORR is fastest for cross-city travel
• Check TSRTC app for bus timings
• Ola/Uber available 24/7

**Where do you want to go?** 🚀`,
    type: 'quick-reply',
    suggestions: [
      'Airport to HITEC City',
      'Charminar to Gachibowli', 
      'Secunderabad to Banjara Hills',
      'Metro routes only',
      'Manual location entry'
    ]
  };
}

// Helper functions for route planning
function getMetroRoute(from: string, to: string): string {
  const metroRoutes = {
    'HITEC City': 'Blue Line (Raidurg)',
    'Gachibowli': 'Blue Line',
    'Ameerpet': 'Blue & Red Line Junction',
    'Secunderabad Railway Station': 'Blue Line',
    'LB Nagar': 'Red Line',
    'Miyapur': 'Red Line',
    'Kukatpally': 'Red Line',
    'Nagole': 'Blue Line'
  };
  
  const fromLine = metroRoutes[from] || 'Check metro map';
  const toLine = metroRoutes[to] || 'Check metro map';
  
  if (fromLine.includes('Blue') && toLine.includes('Blue')) {
    return 'Direct Blue Line connection';
  } else if (fromLine.includes('Red') && toLine.includes('Red')) {
    return 'Direct Red Line connection';  
  } else if ((fromLine.includes('Blue') || fromLine.includes('Red')) && 
             (toLine.includes('Blue') || toLine.includes('Red'))) {
    return 'Change at Ameerpet Junction';
  }
  return 'Metro connection available - check map for routes';
}

function getEstimatedTime(from: string, to: string): string {
  // Simplified time estimation based on common routes
  const longDistanceLocations = ['Airport', 'Shamshabad', 'Ramoji Film City'];
  const isLongDistance = longDistanceLocations.some(loc => 
    from.includes(loc) || to.includes(loc)
  );
  
  if (isLongDistance) return '60-90 minutes';
  
  const crossCityRoutes = [
    ['Charminar', 'HITEC City'], ['Secunderabad', 'Gachibowli'],
    ['LB Nagar', 'Miyapur'], ['Uppal', 'Kukatpally']
  ];
  
  const isCrossCity = crossCityRoutes.some(route => 
    (from.includes(route[0]) && to.includes(route[1])) ||
    (from.includes(route[1]) && to.includes(route[0]))
  );
  
  if (isCrossCity) return '45-75 minutes';
  return '20-45 minutes';
}

function getNearbyPlaces(location: string): string[] {
  const nearbyMap: {[key: string]: string[]} = {
    'HITEC City': ['Gachibowli', 'Madhapur', 'Financial District', 'Kondapur'],
    'Charminar': ['Laad Bazaar', 'Mecca Masjid', 'Salar Jung Museum', 'Abids'],
    'Secunderabad Railway Station': ['Begumpet', 'Somajiguda', 'Ameerpet', 'SR Nagar'],
    'Gachibowli': ['HITEC City', 'Madhapur', 'Kondapur', 'Miyapur'],
    'Jubilee Hills': ['Banjara Hills', 'Begumpet', 'Somajiguda', 'Mehdipatnam']
  };
  
  return nearbyMap[location] || ['HITEC City', 'Gachibowli', 'Secunderabad', 'Charminar'];
}

function getMetroAccess(location: string): string {
  const metroStations: {[key: string]: string} = {
    'HITEC City': 'Raidurg Metro Station (Blue Line)',
    'Gachibowli': 'Gachibowli Metro Station (Blue Line)', 
    'Ameerpet': 'Ameerpet Metro Station (Red & Blue Line Junction)',
    'Secunderabad Railway Station': 'Secunderabad Metro Station (Blue Line)',
    'LB Nagar': 'LB Nagar Metro Station (Red Line)',
    'Kukatpally': 'Kukatpally Metro Station (Red Line)',
    'Miyapur': 'Miyapur Metro Station (Red Line)'
  };
  
  return metroStations[location] || 'Nearest metro station within 2-3 km';
}

function getMajorRoads(location: string): string {
  const roadAccess: {[key: string]: string} = {
    'HITEC City': 'ORR, Cyberabad Road',
    'Charminar': 'MJ Road, Nizam Street',
    'Secunderabad Railway Station': 'Sardar Patel Road, Tank Bund Road',
    'Gachibowli': 'ORR, Gachibowli Road',
    'Airport': 'ORR, Airport Road, PV Narasimha Rao Expressway'
  };
  
  return roadAccess[location] || 'Well connected via major city roads';
}

// Enhanced route parsing function
function parseRouteQuery(query: string): {from?: string, to?: string, type: 'specific_route' | 'from_location' | 'general'} {
  // Match "from X to Y" pattern - more flexible matching
  const fromToMatch = query.match(/(?:route\s+)?from\s+(.+?)\s+to\s+(.+)/i);
  if (fromToMatch) {
    const fromQuery = fromToMatch[1].trim().toLowerCase();
    const toQuery = fromToMatch[2].trim().toLowerCase();
    
    // Priority matching - exact matches first, then partial
    let fromLocation = hyderabadLocations.find(loc => {
      const locLower = loc.toLowerCase();
      return fromQuery === locLower || 
             (fromQuery.includes('airport') && locLower.includes('airport')) ||
             (fromQuery.includes('hitec') && locLower.includes('hitec'));
    });
    
    if (!fromLocation) {
      fromLocation = hyderabadLocations.find(loc => {
        const locLower = loc.toLowerCase();
        return fromQuery.includes(locLower) || locLower.includes(fromQuery);
      });
    }
    
    let toLocation = hyderabadLocations.find(loc => {
      const locLower = loc.toLowerCase();
      return toQuery === locLower || 
             (toQuery.includes('airport') && locLower.includes('airport')) ||
             (toQuery.includes('hitec') && locLower.includes('hitec'));
    });
    
    if (!toLocation) {
      toLocation = hyderabadLocations.find(loc => {
        const locLower = loc.toLowerCase();
        return toQuery.includes(locLower) || locLower.includes(toQuery);
      });
    }
    
    if (fromLocation && toLocation && fromLocation !== toLocation) {
      return {from: fromLocation, to: toLocation, type: 'specific_route'};
    }
  }

  // Match "routes from X" or "from X" pattern - only if not part of a "to" phrase
  if (!query.includes(' to ')) {
    const fromMatch = query.match(/(?:routes\s+)?from\s+(.+)/i);
    if (fromMatch) {
      const fromQuery = fromMatch[1].trim().toLowerCase();
      let location = hyderabadLocations.find(loc => {
        const locLower = loc.toLowerCase();
        return fromQuery === locLower || 
               (fromQuery.includes('airport') && locLower.includes('airport')) ||
               (fromQuery.includes('hitec') && locLower.includes('hitec'));
      });
      
      if (!location) {
        location = hyderabadLocations.find(loc => {
          const locLower = loc.toLowerCase();
          return fromQuery.includes(locLower) || locLower.includes(fromQuery);
        });
      }
      
      if (location) {
        return {from: location, type: 'from_location'};
      }
    }
  }

  return {type: 'general'};
}

async function generateChatbotResponse(query: string): Promise<ChatbotResponse> {
  // Handle route planning queries with enhanced parsing
  if (query.includes('route') || query.includes('direction') || query.includes('travel') || query.includes('navigate') || query.includes('from')) {
    const routeInfo = parseRouteQuery(query);
    
    if (routeInfo.type === 'specific_route' && routeInfo.from && routeInfo.to) {
      return {
        response: `🗺️ **Route: ${routeInfo.from} → ${routeInfo.to}**

**Transportation Options:**
🚇 **Metro Route:** ${getMetroRoute(routeInfo.from, routeInfo.to)}
🚌 **Bus Route:** Available via TSRTC - Check app for real-time schedules
🚗 **By Car:** Estimated ${getEstimatedTime(routeInfo.from, routeInfo.to)} via main roads
🛺 **Auto/Cab:** Available throughout - Use Ola/Uber for live pricing

**Quick Tips:**
• Peak hours: 8-10 AM, 6-8 PM (expect delays)
• Metro is fastest during rush hours
• Use ORR for longer distances
• Check Google Maps for live traffic

**Need alternative routes or specific directions?**
Let me know and I'll provide more options!`,
        type: 'quick-reply',
        suggestions: [
          `Metro route ${routeInfo.from} to ${routeInfo.to}`,
          `Bus timings ${routeInfo.from} to ${routeInfo.to}`,
          'Alternative routes',
          'Live traffic update',
          'Cost comparison'
        ]
      };
    }
    
    if (routeInfo.type === 'from_location' && routeInfo.from) {
      const nearbyPlaces = getNearbyPlaces(routeInfo.from);
      
      return {
        response: `🗺️ **Routes from ${routeInfo.from}**

**Popular destinations from ${routeInfo.from}:**
${nearbyPlaces.join(' • ')}

**Transportation from ${routeInfo.from}:**
🚇 **Metro Access:** ${getMetroAccess(routeInfo.from)}
🚌 **Bus Connectivity:** Well connected via TSRTC network
🚗 **Major Roads:** ${getMajorRoads(routeInfo.from)}

**Tell me your destination** or choose from popular options:`,
        type: 'quick-reply',
        suggestions: nearbyPlaces.slice(0, 4).concat(['Manual entry'])
      };
    }
    
    // Fall back to general route planning
    return handleRoutePlanning(query);
  }

  // Handle specific actions from quick replies first
  if (query.includes('report_issue')) {
    return {
      response: `📝 **How to Report an Issue:**

1. Go to the "Report Issue" page
2. Select the category (Infrastructure, Public Health, etc.)
3. Provide detailed description
4. Add photos if available
5. **NEW!** 📍 Use Google Maps to pinpoint exact location OR enter manually
6. Submit your report

**Location Features:**
🗺️ **Google Maps Integration:** Click exact location on interactive map
📍 **GPS Coordinates:** Automatic latitude/longitude capture
✏️ **Manual Entry:** Traditional address input still available

Your issue will be assigned to the relevant department and you'll receive updates via email and WhatsApp.

**Need immediate help?** Call our emergency line: 📞 1800-CIVIC-HELP`,
      type: 'text'
    };
  }

  if (query.includes('check_applications')) {
    return {
      response: `📋 **Check Your Applications:**

1. Go to your Profile page
2. Click on "My Applications" tab
3. View status of all submitted applications
4. Track progress in real-time

**Application Status Types:**
• 🟡 Pending Review
• 🔵 Under Processing  
• 🟢 Approved
• 🔴 Additional Info Required

Need help with a specific application? Please provide your application ID.`,
      type: 'text'
    };
  }

  if (query.includes('programs')) {
    return {
      response: `🏛️ **Government Programs Available:**

**Popular Programs:**
• Education Scholarships
• Healthcare Subsidies  
• Housing Assistance
• Employment Support
• Senior Citizen Benefits

**How to Apply:**
1. Browse programs in the "Programs" section
2. Check eligibility criteria
3. Submit online application
4. Upload required documents
5. Track application status

**Need help finding the right program?** Tell me your category of interest!`,
      type: 'text'
    };
  }

  if (query.includes('contact')) {
    return {
      response: `📞 **Contact Support:**

**Emergency Issues:** 🚨
Call: 1800-CIVIC-HELP (24/7)

**General Support:** 💬
Email: support@civicplatform.com
Phone: +91-1234567890
Hours: 9 AM - 6 PM (Mon-Fri)

**Technical Issues:** 💻
Email: tech@civicplatform.com
Live Chat: Available now!

**Office Visit:** 🏢
Address: Civic Center, Main Street
City: Your City, State - 123456
Hours: 10 AM - 5 PM (Mon-Fri)`,
      type: 'contact'
    };
  }

  if (query.includes('tech_help')) {
    return {
      response: `💻 **Technical Help:**

**Common Issues & Solutions:**

**Login Problems:**
• Reset password using "Forgot Password"
• Clear browser cache and cookies
• Try a different browser

**Upload Issues:**
• File size should be under 5MB
• Accepted formats: PDF, JPG, PNG
• Check your internet connection

**Payment Problems:**
• Verify card details are correct
• Check if your bank allows online payments
• Try UPI or Net Banking alternatives

**Still having issues?** Contact tech support: tech@civicplatform.com`,
      type: 'text'
    };
  }

  if (query.includes('payment_help')) {
    return {
      response: `💳 **Payment Assistance:**

**Accepted Payment Methods:**
• Credit/Debit Cards (Visa, Mastercard, RuPay)
• UPI (Google Pay, PhonePe, Paytm)
• Net Banking (All major banks)
• Digital Wallets

**Payment Issues:**
• Check card expiry date
• Ensure sufficient balance
• Verify CVV and OTP
• Try different payment method

**Need a refund?** 
Email: payments@civicplatform.com with transaction ID

**Payment Security:** 🔒
All payments are secured with 256-bit SSL encryption`,
      type: 'text'
    };
  }

  // Emergency detection
  if (query.includes('emergency') || query.includes('urgent')) {
    return {
      response: `🚨 **EMERGENCY ASSISTANCE**

**Immediate Help:**
📞 Emergency Helpline: 1800-CIVIC-HELP (24/7)
🚨 Police: 100
🚑 Ambulance: 108
🔥 Fire: 101

**Report Emergency Issues:**
• Infrastructure collapse
• Public health hazards
• Safety concerns
• Utility failures

**For non-emergency issues**, please use the regular reporting system.

**Stay safe and get immediate help when needed!**`,
      type: 'text'
    };
  }

  // Try AI-powered response for complex queries
  if (genAI && !isSimpleQuery(query)) {
    try {
      const aiResponse = await generateAIResponse(query);
      if (aiResponse) {
        return {
          response: aiResponse,
          type: 'text'
        };
      }
    } catch (error) {
      console.error('AI response error:', error);
      // Fall through to rule-based responses
    }
  }

  // Rule-based responses for common queries
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return {
      response: `Hello! 👋 Welcome to the Civic Platform. I'm here to help you with:

• Reporting civic issues
• Government program applications  
• Payment assistance
• Technical support
• General inquiries

What would you like help with today?`,
      type: 'text'
    };
  }

  if (query.includes('help') || query.includes('assist')) {
    return {
      response: `🆘 **I'm here to help!** Here's what I can assist you with:

**🏛️ Government Services:**
• Program applications
• Document verification
• Status tracking

**📝 Civic Issues:**
• Report problems
• Track complaints
• Emergency services

**💻 Technical Support:**
• Login help
• Payment issues
• File uploads

**📞 Contact Information:**
• Support numbers
• Office locations
• Email contacts

Choose a topic or ask me anything specific!`,
      type: 'text'
    };
  }

  // Default response with helpful guidance
  return {
    response: `I understand you're asking about "${query}". While I'm here to help with civic platform services, I might need more specific information.

**I can help you with:**
• 🏛️ Government programs and applications
• 📝 Reporting civic issues  
• 💳 Payment assistance
• 📄 Document uploads
• 📞 Contact information
• 💻 Technical support

Could you please be more specific about what you need help with? Or choose one of the quick options above!

**For immediate assistance:** Call 1800-CIVIC-HELP`,
    type: 'text'
  };
}

// Check if query is simple enough for rule-based response
function isSimpleQuery(query: string): boolean {
  const simplePatterns = [
    'hello', 'hi', 'hey', 'help', 'thanks', 'thank you', 'bye', 'goodbye'
  ];
  return simplePatterns.some(pattern => query.includes(pattern));
}

// Generate AI-powered response using Google Gemini
async function generateAIResponse(query: string): Promise<string | null> {
  // If no API key is configured or it's invalid, return null to fall back to predefined responses
  if (!genAI || !process.env.GEMINI_API_KEY) {
    console.warn('Google AI API key not configured or invalid');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a helpful AI assistant for a civic engagement platform called "People's Voice". 
    
Platform Features:
- Citizens can report civic issues (infrastructure, public health, safety, etc.)
- Government program applications and tracking
- Payment processing for civic services
- WhatsApp notifications for updates
- Document uploads and verification
- User profiles and application management

Your role:
- Provide helpful, accurate information about the platform
- Guide users through processes step-by-step
- Be friendly, professional, and concise
- Focus on civic services and government-related help
- If you don't know something specific, direct users to contact support

User Question: "${query}"

Provide a helpful response in 2-3 paragraphs max. Use emojis sparingly and professionally. If it's not related to civic services, politely redirect to platform features.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Google AI error:', error);
    // Return null to fall back to predefined responses instead of throwing error
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Civic Chatbot API is running',
    capabilities: [
      'Issue reporting guidance',
      'Application status tracking', 
      'Government program information',
      'Payment assistance',
      'Technical support',
      'Contact information',
      'Emergency assistance',
      'Hyderabad route planning'
    ],
    availableActions: [
      'report_issue',
      'check_applications', 
      'programs',
      'contact',
      'tech_help',
      'payment_help',
      'route_planning'
    ]
  });
}
