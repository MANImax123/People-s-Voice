import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      icon: <Users className="w-6 h-6" />,
      items: [
        "How to create an account",
        "Setting up your profile", 
        "Navigating the platform",
        "Understanding user roles"
      ]
    },
    {
      title: "Reporting Issues",
      icon: <AlertTriangle className="w-6 h-6" />,
      items: [
        "How to report civic issues",
        "Adding photos and details",
        "Tracking issue status",
        "Emergency reporting"
      ]
    },
    {
      title: "Government Programs",
      icon: <FileText className="w-6 h-6" />,
      items: [
        "Finding eligible programs",
        "Application process",
        "Required documents",
        "Status tracking"
      ]
    },
    {
      title: "Payments",
      icon: <CreditCard className="w-6 h-6" />,
      items: [
        "Making payments online",
        "Supported payment methods",
        "Payment security",
        "Refund process"
      ]
    }
  ];

  const quickActions = [
    {
      title: "Start Live Chat",
      description: "Get instant help from our AI assistant",
      action: "Open Chatbot",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-blue-600"
    },
    {
      title: "Call Support",
      description: "Speak with our support team",
      action: "1800-CIVIC-HELP",
      icon: <Phone className="w-5 h-5" />,
      color: "bg-green-600"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      action: "support@civicplatform.com",
      icon: <Mail className="w-5 h-5" />,
      color: "bg-orange-600"
    }
  ];

  const faqItems = [
    {
      question: "How do I report a civic issue?",
      answer: "Go to the 'Report Issue' page, select the appropriate category, provide a detailed description, add photos if available, and submit. You'll receive a tracking ID to monitor progress."
    },
    {
      question: "How can I track my government program application?",
      answer: "Visit your profile page and click on 'My Applications'. You'll see real-time status updates for all your submitted applications."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept credit/debit cards, UPI payments, net banking, and digital wallets. All transactions are secured with SSL encryption."
    },
    {
      question: "How do I get WhatsApp notifications?",
      answer: "Ensure your phone number is verified in your profile. You'll automatically receive WhatsApp updates for new programs, application status changes, and important announcements."
    },
    {
      question: "What if I forgot my password?",
      answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
    },
    {
      question: "How do I update my profile information?",
      answer: "Go to your profile page, click 'Edit Profile', make your changes, and save. Some changes may require verification."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <HelpCircle className="text-blue-600" />
          Help Center
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions and get the support you need to make the most of our civic platform.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`${action.color} text-white p-3 rounded-lg`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{action.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    {action.action}
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {helpCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-blue-900">Contact Information</CardTitle>
          <CardDescription>
            Multiple ways to reach our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Phone Support</h4>
                <p className="text-sm text-gray-600">1800-CIVIC-HELP</p>
                <p className="text-xs text-gray-500">24/7 Emergency Line</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Email Support</h4>
                <p className="text-sm text-gray-600">support@civicplatform.com</p>
                <p className="text-xs text-gray-500">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Visit Office</h4>
                <p className="text-sm text-gray-600">Civic Center, Main Street</p>
                <p className="text-xs text-gray-500">Mon-Fri, 10 AM - 5 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Business Hours</h4>
                <p className="text-sm text-gray-600">Mon-Fri: 9 AM - 6 PM</p>
                <p className="text-xs text-gray-500">Weekend: Emergency only</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Chat Reminder */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">
            Need immediate help? Our AI chatbot is available 24/7 in the bottom-right corner!
          </span>
        </div>
      </div>
    </div>
  );
}
