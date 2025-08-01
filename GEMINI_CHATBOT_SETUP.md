# Gemini AI Chatbot Setup Guide

## 🤖 Free AI-Powered Chatbot with Google Gemini

### 🚀 Get Your Free Gemini API Key (2 minutes)

1. **Go to Google AI Studio**: https://aistudio.google.com/app/apikey
2. **Sign in** with your Google account
3. **Click "Create API Key"** 
4. **Copy the generated key** (starts with `AIza...`)

### 🔧 Add to Your Project

1. **Open your `.env.local` file**
2. **Replace this line**:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
3. **With your actual key**:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_from_google_ai_studio
   ```

4. **Restart your server**:
   ```powershell
   # Stop with Ctrl+C, then:
   npm run dev
   ```

## ✨ Chatbot Features

### **🎯 Smart AI Responses**
- Powered by Google's Gemini 1.5 Flash model
- Understands natural language questions
- Context-aware responses about civic services
- Falls back to rule-based responses if AI unavailable

### **⚡ Quick Reply Buttons**
- "How to report an issue?"
- "Check my applications"  
- "Government programs"
- "Contact support"
- "Technical help"
- "Payment assistance"

### **🎨 Professional UI**
- Floating chat button (bottom-right corner)
- Minimize/maximize functionality
- Typing indicators
- Message timestamps
- Quick action buttons

### **📱 Responsive Design**
- Works on desktop and mobile
- Touch-friendly interface
- Smooth animations
- Professional appearance

## 🔒 Free Tier Limits

### **Google AI Studio Free Tier:**
- **15 requests per minute**
- **1,500 requests per day** 
- **1 million tokens per month**
- **Perfect for development and testing**

### **Fallback System:**
- If AI quota exceeded → Rule-based responses
- If no API key → Rule-based responses only
- Always functional, never breaks

## 🎉 What Users Can Ask

### **Government Services:**
- "How do I apply for education scholarships?"
- "What documents do I need for housing assistance?"
- "How to check my application status?"

### **Civic Issues:**
- "How do I report a pothole?"
- "What categories can I report issues under?"
- "How to track my complaint?"

### **Technical Help:**
- "I can't upload my documents"
- "Payment is not working"
- "How to reset my password?"

### **Emergency Assistance:**
- "I need emergency help"
- "How to report urgent issues?"
- Emergency contact information

## 🛠️ Customization Options

### **Message Templates:**
All response templates are in `/api/chatbot/route.ts` and can be customized:

- Quick reply responses
- Contact information
- Emergency numbers
- Help documentation links

### **AI Prompt Engineering:**
The AI prompt in `generateAIResponse()` can be modified to:
- Change personality/tone
- Add specific knowledge
- Include local information
- Customize for your region

### **UI Customization:**
The chatbot component (`/components/live-chatbot.tsx`) can be styled:
- Colors and branding
- Position and size
- Button styles
- Message appearance

## 📊 Analytics & Monitoring

### **Built-in Logging:**
- All conversations logged to console
- Error tracking for API failures
- Response time monitoring
- Fallback usage statistics

### **Usage Patterns:**
Monitor in terminal to see:
- Most common questions
- AI vs rule-based response usage
- Error rates and types

## 🎯 Current Status

### ✅ **Implemented:**
- Complete chatbot UI with professional design
- AI-powered responses using Google Gemini
- Rule-based fallback system
- Quick reply buttons
- Emergency detection
- Contact information
- Help page integration

### 🔄 **Ready for:**
- Gemini API key addition
- Customization for local civic services
- Integration with user authentication
- Analytics and monitoring

## 💡 Pro Tips

### **For Best AI Responses:**
1. **Use specific prompts** in the AI system prompt
2. **Include local civic information** in prompts
3. **Test with various question types**
4. **Monitor and improve based on user feedback**

### **For Production:**
1. **Monitor API usage** to stay within limits
2. **Consider upgrading** to paid tier if needed
3. **Add user authentication** for personalized responses
4. **Implement conversation logging** for improvements

Your AI chatbot is now ready! 🚀

**Just add your Gemini API key and restart the server to activate intelligent responses!**
