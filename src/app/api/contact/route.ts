// ============================================
// FILE: src/app/api/contact/route.ts
// Clean API Route Using Organized Templates
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import { getAdminNotificationEmail, getSenderAutoReplyEmail } from '../../../lib/email/templates';
import { getErrorMessageSync } from '../../../lib/config/loaders';

export async function POST(request: NextRequest) {
  try {
    console.log('[Contact] POST: Processing form submission');
    
    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      console.error('[Contact] POST: Failed to parse form data', parseError);
      return NextResponse.json(
        { error: getErrorMessageSync('contact.submission.invalid', 'Invalid form data') },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('[Contact] POST: Validation failed - missing required fields');
      return NextResponse.json(
        { error: getErrorMessageSync('contact.validation.missingFields', 'All fields are required') },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('[Contact] POST: Validation failed - invalid email format');
      return NextResponse.json(
        { error: getErrorMessageSync('contact.validation.invalidEmail', 'Invalid email format') },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      );
    }
    
    // Process file attachment if present
    let fileBuffer: Buffer | null = null;
    let fileName: string | null = null;
    let fileMimeType: string | null = null;
    let fileSize: number = 0;
    
    if (file) {
      console.log('[Contact] POST: Processing file attachment');
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !['pdf', 'docx'].includes(fileExtension || '')) {
        console.error('[Contact] POST: File validation failed - invalid file type');
        return NextResponse.json(
          { error: getErrorMessageSync('contact.file.invalidType', 'Only PDF and DOCX files are allowed') },
          { 
            status: 400,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          }
        );
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error('[Contact] POST: File validation failed - file too large');
        return NextResponse.json(
          { error: getErrorMessageSync('contact.file.invalidSize', 'File size must be less than 5MB') },
          { 
            status: 400,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          }
        );
      }
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name;
      fileMimeType = file.type;
      fileSize = Math.round(file.size / 1024); // Convert to KB
      
      console.log('[Contact] POST: File processed', { fileName, fileSize: `${fileSize}KB` });
    }
    
    // Prepare email data object
    const emailData = {
      name,
      email,
      subject,
      message,
      hasFile: !!fileBuffer,
      fileName: fileName || undefined,
      fileSize: fileSize || undefined,
      timestamp: new Date(),
    };
    
    // Create email transporter
    // FIX: Changed createTransporter to createTransport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    // Prepare file attachments
    const attachments = fileBuffer && fileName && fileMimeType
      ? [{
          filename: fileName,
          content: fileBuffer,
          contentType: fileMimeType,
        }]
      : [];
    
    // Email 1: Send notification to admin (you)
    console.log('[Contact] POST: Sending admin notification email');
    
    const adminEmail = {
      from: {
        name: 'Portfolio Contact Form',
        address: process.env.EMAIL_USER as string,
      },
      to: 'skuhandran@yahoo.com',
      subject: `🎯 New Portfolio Contact: ${subject}`,
      html: getAdminNotificationEmail(emailData),
      attachments,
      priority: 'high' as const,
    };
    
    await transporter.sendMail(adminEmail);
    console.log('[Contact] POST: Admin notification sent');
    
    // Email 2: Send auto-reply to sender
    console.log('[Contact] POST: Sending auto-reply email');
    
    const senderEmail = {
      from: {
        name: 'Kuhandran SamudraPandiyan',
        address: process.env.EMAIL_USER as string,
      },
      to: email,
      subject: '✨ Thank You for Contacting Kuhandran SamudraPandiyan',
      html: getSenderAutoReplyEmail(emailData),
      replyTo: 'skuhandran@yahoo.com',
    };
    
    await transporter.sendMail(senderEmail);
    console.log('[Contact] POST: Auto-reply sent', { to: email });
    
    console.log('[Contact] POST: Submission successful', { name, email, subject });
    
    return NextResponse.json(
      { 
        success: true, 
        message: getErrorMessageSync('contact.submission.success', 'Your message has been sent successfully! I will respond within 24-48 hours.') 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
    
  } catch (error) {
    console.error('[Contact] POST: Error', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        error: getErrorMessageSync('contact.submission.failed', 'Failed to send message. Please try again later or contact me directly.'),
        details: error instanceof Error ? error.message : getErrorMessageSync('common.unknownError', 'Unknown error')
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  }
}

// Health check endpoint
export async function GET() {
  console.log('[Contact] GET: Health check');
  return NextResponse.json({ 
    status: 'online',
    service: 'Contact Form API',
    version: '2.0',
    timestamp: new Date().toISOString(),
  },
  {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
