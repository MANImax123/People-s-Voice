'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2, 
  X,
  HelpCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-reply' | 'contact';
}

interface QuickReply {
  text: string;
  action: string;
}

export default function LiveChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your civic platform assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies: QuickReply[] = [
    { text: "How to report an issue?", action: "report_issue" },
    { text: "Check my applications", action: "check_applications" },
    { text: "Government programs", action: "programs" },
    { text: "Contact support", action: "contact" },
    { text: "Technical help", action: "tech_help" },
    { text: "Payment assistance", action: "payment_help" }
  ];

  const handleQuickReply = async (action: string, text: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Get bot response based on action
    await getBotResponse(action);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    await getBotResponse(input);
  };

  const getBotResponse = async (query: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.response || "I'm sorry, I couldn't process that request. Please try again or contact support.",
        sender: 'bot',
        timestamp: new Date(),
        type: data.type || 'text'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm experiencing technical difficulties. Please try again later or contact our support team.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -left-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="w-full h-full shadow-xl border-2">
        {/* Header */}
        <CardHeader className="pb-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Civic Assistant</CardTitle>
                <p className="text-xs text-blue-100">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Online - Here to help!
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-blue-700 p-1"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            <div className="p-3 border-t bg-gray-50">
              <div className="flex flex-wrap gap-1 mb-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply.action, reply.text)}
                    className="text-xs h-7 rounded-full"
                    disabled={isLoading}
                  >
                    {reply.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Help Links */}
              <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
                <a href="tel:+91-1234567890" className="flex items-center gap-1 hover:text-blue-600">
                  <Phone className="w-3 h-3" />
                  Call Support
                </a>
                <a href="mailto:support@civicplatform.com" className="flex items-center gap-1 hover:text-blue-600">
                  <Mail className="w-3 h-3" />
                  Email
                </a>
                <a href="/help" className="flex items-center gap-1 hover:text-blue-600">
                  <HelpCircle className="w-3 h-3" />
                  Help Center
                </a>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
