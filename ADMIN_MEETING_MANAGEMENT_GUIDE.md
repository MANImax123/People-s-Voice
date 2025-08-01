# Admin Meeting Management Guide

## 🏛️ How to Access Meeting Requests in Admin Dashboard

### **Option 1: Direct URL Access**
Navigate directly to: `http://localhost:3000/admin/meetings`

### **Option 2: Through Admin Dashboard**
1. Go to: `http://localhost:3000/admin/dashboard`
2. Look for the **"Quick Access"** section
3. Click on the **"Meeting Requests"** card with the blue calendar icon
4. This will take you to the dedicated meeting management page

---

## 📋 Admin Meeting Management Features

### **Main Dashboard View**
- **Quick Stats**: Shows pending, approved, scheduled, and total monthly meetings
- **Back to Dashboard**: Easy navigation back to main admin dashboard
- **Real-time Updates**: Automatically refreshes meeting request data

### **Meeting Request Management**

#### **Pending Requests Section**
- 📋 **View All Pending Requests**: See all citizen requests awaiting admin review
- 👤 **Citizen Information**: Name, email, phone number displayed
- 📅 **Request Details**: Meeting type, priority level, request date
- 💬 **Initial Description**: Citizen's reason for meeting request

#### **Admin Actions**
- ✅ **Approve Request**: 
  - Click "Approve" button
  - Add optional admin message/instructions
  - System sends approval email to citizen
  - Citizen can then schedule their meeting
  
- ❌ **Reject Request**:
  - Click "Reject" button  
  - **Required**: Provide reason for rejection
  - System sends rejection email with reason
  - Citizen is informed of alternative options

#### **Meeting History**
- 📊 **All Requests View**: See complete history of all meeting requests
- 🏷️ **Status Tracking**: pending → approved → scheduled → completed
- 🗓️ **Scheduled Meetings**: View citizen-selected dates and times
- 📝 **Meeting Details**: Full descriptions and admin notes

---

## 🔄 Complete Meeting Request Workflow

### **1. Citizen Submits Request**
- User fills out meeting request form at `/meetings`
- Selects meeting type (general, complaint, suggestion, project proposal, other)
- Sets priority level (low, medium, high, urgent)
- Provides optional initial description
- System creates pending request in database

### **2. Admin Reviews Request**  
- Admin sees request in `/admin/meetings` dashboard
- Reviews citizen information and request details
- Makes approval/rejection decision
- Adds admin response message

### **3. Email Notification**
- System automatically sends email to citizen
- **If Approved**: Instructions to schedule meeting + admin message
- **If Rejected**: Reason for rejection + alternative options

### **4. Citizen Schedules Meeting** (if approved)
- Citizen returns to `/meetings` page
- Sees "Ready to Schedule" section
- Selects date from calendar (weekdays only)
- Chooses time slot from available options
- Adds detailed meeting description (optional)
- Confirms meeting

### **5. Final Confirmation**
- System sends confirmation emails to both citizen and admin
- Meeting shows as "Scheduled" in admin dashboard
- Includes meeting location and preparation instructions

---

## 📊 Meeting Types & Priorities

### **Meeting Types**
- **General Inquiry**: Basic information requests
- **Complaint**: Service or infrastructure complaints  
- **Suggestion/Feedback**: Citizen suggestions for improvements
- **Project Proposal**: New project or initiative proposals
- **Other**: Miscellaneous meeting purposes

### **Priority Levels**
- **Low**: Routine matters, non-urgent
- **Medium**: Standard priority (default)
- **High**: Important issues requiring attention
- **Urgent**: Critical matters needing immediate review

---

## ⚙️ Admin Configuration

### **Admin Authentication**
- Admin must be logged in to access meeting management
- Authentication checked via localStorage 'adminAuth'
- Redirects to `/admin/login` if not authenticated

### **Email Notifications**
- Uses nodemailer with Gmail SMTP
- Configured via environment variables:
  - `EMAIL_USER`: Gmail address
  - `EMAIL_PASS`: Gmail app password
- Professional HTML email templates included

### **Database Integration**
- Uses MongoDB with Mongoose ODM
- MeetingRequest model with full schema validation
- Automatic indexing for performance
- Population of user and admin references

---

## 🛠️ Technical Features

### **Real-time Updates**
- Admin dashboard automatically refreshes data
- Status changes immediately visible
- Real-time request counting

### **Input Validation**
- Required field validation
- Date/time availability checking
- Duplicate request prevention
- User existence verification (optional for demo)

### **Error Handling**
- Comprehensive try-catch blocks
- User-friendly error messages
- Detailed server-side logging
- Graceful failure handling

### **Security Features**
- Admin authentication required
- Request ownership verification
- Input sanitization
- SQL injection prevention

---

## 🎯 Quick Start Guide

1. **Access Admin Dashboard**: Go to `http://localhost:3000/admin/dashboard`
2. **Click Meeting Requests**: Use the blue calendar card in Quick Access
3. **Review Pending Requests**: See all citizen requests awaiting review  
4. **Approve/Reject**: Click appropriate buttons and add admin messages
5. **Monitor Progress**: Track requests through approval → scheduling → completion

The system is now fully integrated and ready to handle municipal meeting requests efficiently! 🏛️✨
