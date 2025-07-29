import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { sendIssueResolvedEmail } from '@/lib/email';
import { sendIssueResolvedEmailResend } from '@/lib/email-resend';
import { sendIssueResolvedWebhook, sendIssueResolvedSimple } from '@/lib/email-webhook';
import { sendIssueResolvedEmailJS, sendEmailViaWebhook } from '@/lib/email-emailjs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Import working model after database connection
    const { default: Issue } = await import('@/models/IssueFull');
    
    const body = await request.json();
    const { status } = body;
    const { id: issueId } = await params;

    // Validate status
    const validStatuses = ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Find and update the issue
    const updateData: any = { status };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    } else if (status === 'reported') {
      // Clear resolvedAt when marking as not resolved
      updateData.resolvedAt = null;
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      issueId,
      updateData,
      { new: true }
    );

    if (!updatedIssue) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    // Send email notification if issue is resolved
    if (status === 'resolved' && updatedIssue.reportedBy?.email) {
      console.log('🔔 Issue resolved, attempting email notification via multiple methods...');
      console.log('📋 Issue Details:');
      console.log('   - Issue ID:', issueId);
      console.log('   - Issue Title:', updatedIssue.title);
      console.log('   - Reported By Name:', updatedIssue.reportedBy.name);
      console.log('   - Reported By Email:', updatedIssue.reportedBy.email);
      console.log('   - 🎯 EMAIL WILL BE SENT TO THE USER WHO REPORTED THE ISSUE');
      console.log('   - 🚫 EMAIL WILL NOT BE SENT TO THE TECH WHO RESOLVED IT');
      
      try {
        // Method 1: Try Resend (most reliable)
        console.log('📧 Trying Method 1: Resend');
        const resendResult = await sendIssueResolvedEmailResend(
          updatedIssue.reportedBy.email,
          updatedIssue.title,
          issueId
        );

        if (resendResult.success && !resendResult.testMode) {
          console.log('✅ Email sent successfully via Resend');
        } else {
          console.log('📧 Trying Method 2: EmailJS');
          // Method 2: Try EmailJS
          const emailjsResult = await sendIssueResolvedEmailJS(
            updatedIssue.reportedBy.email,
            updatedIssue.title,
            issueId
          );

          if (emailjsResult.success && !emailjsResult.testMode) {
            console.log('✅ Email sent successfully via EmailJS');
          } else {
            console.log('📧 Trying Method 3: Gmail');
            // Method 3: Try Gmail as backup
            const gmailResult = await sendIssueResolvedEmail(
              updatedIssue.reportedBy.email,
              updatedIssue.title,
              issueId
            );

            if (gmailResult.success && !gmailResult.testMode) {
              console.log('✅ Email sent successfully via Gmail');
            } else {
              console.log('📧 Trying Method 4: Console');
              // Method 4: Console notification (always works)
              const simpleResult = await sendIssueResolvedSimple(
                updatedIssue.reportedBy.email,
                updatedIssue.title,
                issueId
              );

              console.log('✅ Notification completed via console method');
            }
          }
        }
      } catch (emailError) {
        console.error('❌ All email methods failed:', emailError);
        
        // Fallback: Simple console notification
        await sendIssueResolvedSimple(
          updatedIssue.reportedBy.email,
          updatedIssue.title,
          issueId
        );
        console.log('✅ Fallback notification completed via console');
      }
    } else if (status === 'resolved') {
      console.log('⚠️ Issue resolved but no email found for user');
    }

    return NextResponse.json({
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error updating issue:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Import working model after database connection
    const { default: Issue } = await import('@/models/IssueFull');
    
    const issueId = params.id;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return NextResponse.json(
        { message: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      issue
    });

  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
