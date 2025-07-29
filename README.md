
# Civic Management & Reporting System

An AI-powered platform for civic issue reporting and management with technician dashboard and analytics.

## Features

- 🤖 AI-powered issue analysis and priority scoring (1-10)
- 📊 Tech dashboard with analytics and visualizations
- 📧 Email notifications for resolved issues
- 🗂️ Issue categorization and status tracking
- 📱 Mobile-responsive design
- 🔐 Dual authentication (users and technicians)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Update `.env.local` with your configurations:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/civic-platform

# Next.js configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001

# Email configuration for notifications
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Email Setup
For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Go to Google Account Settings > Security > App passwords
3. Use the generated 16-character password in `EMAIL_PASS`

### 4. Start Development Server
```bash
npm run dev
```

## Tech Dashboard Features

- **Two-tab system**: Not Resolved and Resolved issues
- **Visual Analytics**: 
  - Bar chart showing daily resolution progress
  - Pie chart for monthly/yearly statistics
- **Color-coded status**: Orange for pending, Green for resolved
- **Email notifications**: Automatic emails sent when issues are resolved

## Usage

1. **Users**: Report civic issues with photos and descriptions
2. **Techs**: Login to dashboard, view assigned issues, mark as resolved
3. **Automatic notifications**: Users receive email when their issues are resolved

To get started, take a look at src/app/page.tsx.
