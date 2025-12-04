// ============================================
// FILE: src/app/api/contact/route.ts
// Clean API Route Using Organized Templates
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';
import { getAdminNotificationEmail, getSenderAutoReplyEmail } from '../../../lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Processing contact form submission...');
    
    // Parse form data
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;
    const file = formData.get('file') as File | null;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Validation failed: Invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Process file attachment if present
    let fileBuffer: Buffer | null = null;
    let fileName: string | null = null;
    let fileMimeType: string | null = null;
    let fileSize: number = 0;
    
    if (file) {
      console.log('📎 Processing file attachment...');
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(file.type) && !['pdf', 'docx'].includes(fileExtension || '')) {
        console.error('❌ File validation failed: Invalid file type');
        return NextResponse.json(
          { error: 'Only PDF and DOCX files are allowed' },
          { status: 400 }
        );
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error('❌ File validation failed: File too large');
        return NextResponse.json(
          { error: 'File size must be less than 5MB' },
          { status: 400 }
        );
      }
      
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name;
      fileMimeType = file.type;
      fileSize = Math.round(file.size / 1024); // Convert to KB
      
      console.log(`✅ File processed: ${fileName} (${fileSize} KB)`);
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
    console.log('📧 Sending admin notification email...');
    
    const adminEmail = {
      from: {
        name: 'Portfolio Contact Form',
        address: process.env.EMAIL_USER as string,
      },
      to: 'kuhandransamudrapandiyan@gmail.com',
      subject: `🎯 New Portfolio Contact: ${subject}`,
      html: getAdminNotificationEmail(emailData),
      attachments,
      priority: 'high' as const,
    };
    
    await transporter.sendMail(adminEmail);
    console.log('✅ Admin notification sent successfully');
    
    // Email 2: Send auto-reply to sender
    console.log('📧 Sending auto-reply to sender...');
    
    const senderEmail = {
      from: {
        name: 'Kuhandran SamudraPandiyan',
        address: process.env.EMAIL_USER as string,
      },
      to: email,
      subject: '✨ Thank You for Contacting Kuhandran SamudraPandiyan',
      html: getSenderAutoReplyEmail(emailData),
      replyTo: 'kuhandransamudrapandiyan@gmail.com',
    };
    
    await transporter.sendMail(senderEmail);
    console.log('✅ Auto-reply sent successfully');
    
    // Log success summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ Contact Form Submission Complete');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`👤 From: ${name} (${email})`);
    console.log(`📌 Subject: ${subject}`);
    console.log(`📎 Attachment: ${fileName || 'None'}`);
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully! I will respond within 24-48 hours.' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ Contact Form Error');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later or contact me directly.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'online',
    service: 'Contact Form API',
    version: '2.0',
    emailTemplates: 'Organized & Professional',
    timestamp: new Date().toISOString(),
  });
}
