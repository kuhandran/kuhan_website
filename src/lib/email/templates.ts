// ============================================
// FILE: src/lib/email/templates.ts
// Email Templates Module - Organized & Reusable
// ============================================

interface EmailTemplateData {
  name: string;
  email: string;
  subject: string;
  message: string;
  hasFile?: boolean;
  fileName?: string;
  fileSize?: number;
  timestamp?: Date;
}

// Common email styles matching website design
const emailStyles = `
  <style>
    /* Reset & Base Styles */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #0f172a;
      background: #f8fafc;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    /* Header with Gradient (matches website hero) */
    .email-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%);
      padding: 48px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    
    /* Logo (matches website navbar) */
    .email-logo {
      font-size: 42px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
      letter-spacing: -1px;
    }
    
    .logo-dot {
      color: #fbbf24;
      animation: blink 2s ease-in-out infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .email-title {
      color: #ffffff;
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }
    
    .email-subtitle {
      color: rgba(255, 255, 255, 0.85);
      font-size: 15px;
      position: relative;
      z-index: 1;
    }
    
    /* Content Area */
    .email-content {
      padding: 40px 32px;
      background: #ffffff;
    }
    
    /* Alert Box (matches website badges) */
    .alert-banner {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-left: 4px solid #f59e0b;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .alert-icon {
      font-size: 28px;
      flex-shrink: 0;
    }
    
    .alert-content {
      flex: 1;
    }
    
    .alert-title {
      color: #92400e;
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 4px;
    }
    
    .alert-text {
      color: #b45309;
      font-size: 14px;
    }
    
    /* Field Groups (similar to website cards) */
    .field-section {
      margin-bottom: 24px;
    }
    
    .field-label {
      color: #64748b;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .field-box {
      background: #f8fafc;
      padding: 18px 20px;
      border-radius: 10px;
      border-left: 3px solid #3b82f6;
      color: #0f172a;
      font-size: 15px;
      line-height: 1.6;
      word-wrap: break-word;
    }
    
    .field-box a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
    
    .field-box a:hover {
      text-decoration: underline;
    }
    
    /* Message Box (matches website text areas) */
    .message-container {
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      white-space: pre-wrap;
      line-height: 1.8;
      color: #475569;
    }
    
    /* File Attachment Display */
    .file-display {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 2px dashed #3b82f6;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .file-icon {
      font-size: 36px;
      flex-shrink: 0;
    }
    
    .file-details {
      flex: 1;
    }
    
    .file-name {
      font-weight: 700;
      color: #1e40af;
      font-size: 15px;
      margin-bottom: 4px;
    }
    
    .file-size {
      color: #64748b;
      font-size: 13px;
    }
    
    .file-badge {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    /* Button Styles (matches website buttons) */
    .button-group {
      margin: 32px 0;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn {
      display: inline-block;
      padding: 14px 28px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      text-align: center;
      transition: all 0.3s;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .btn-secondary {
      background: #ffffff;
      color: #3b82f6;
      border: 2px solid #3b82f6;
    }
    
    /* Stats Grid (matches website stats) */
    .stats-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 32px 0;
    }
    
    .stat-box {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 24px 16px;
      border-radius: 12px;
      text-align: center;
      border: 2px solid #e2e8f0;
    }
    
    .stat-number {
      font-size: 32px;
      font-weight: 800;
      background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 6px;
    }
    
    .stat-label {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    
    /* Info Box */
    .info-panel {
      background: #f8fafc;
      padding: 24px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin: 24px 0;
    }
    
    .info-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-list {
      list-style: none;
      padding: 0;
    }
    
    .info-list li {
      padding: 10px 0;
      color: #475569;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .info-list li:last-child {
      border-bottom: none;
    }
    
    .info-list li::before {
      content: '✓';
      color: #10b981;
      font-weight: 900;
      font-size: 16px;
      flex-shrink: 0;
    }
    
    /* Contact Card (matches website contact section) */
    .contact-panel {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
      padding: 28px;
      border-radius: 12px;
      margin: 32px 0;
    }
    
    .contact-heading {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    .contact-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .contact-row:last-child {
      border-bottom: none;
    }
    
    .contact-icon {
      font-size: 22px;
      flex-shrink: 0;
    }
    
    .contact-link {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 600;
    }
    
    /* Timestamp */
    .timestamp-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 16px;
      border-radius: 10px;
      text-align: center;
      color: #78350f;
      font-size: 13px;
      font-weight: 600;
      margin-top: 24px;
    }
    
    /* Footer (matches website footer) */
    .email-footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 40px 32px;
      text-align: center;
    }
    
    .footer-logo {
      font-size: 36px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -1px;
    }
    
    .footer-tagline {
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
    }
    
    .footer-divider {
      height: 1px;
      background: #334155;
      margin: 24px 0;
    }
    
    .footer-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    
    .footer-link {
      color: #64748b;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      background: #1e293b;
      border-radius: 6px;
      transition: all 0.3s;
    }
    
    .footer-link:hover {
      color: #3b82f6;
      background: #334155;
    }
    
    .footer-info {
      font-size: 13px;
      color: #64748b;
      margin: 8px 0;
    }
    
    .footer-info a {
      color: #3b82f6;
      text-decoration: none;
    }
    
    .footer-note {
      font-size: 12px;
      color: #475569;
      margin-top: 24px;
      line-height: 1.6;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-header { padding: 32px 20px; }
      .email-content { padding: 28px 20px; }
      .stats-container { grid-template-columns: 1fr; }
      .button-group { flex-direction: column; }
      .btn { width: 100%; }
    }
  </style>
`;

// ============================================
// TEMPLATE 1: Admin Notification Email
// ============================================
export const getAdminNotificationEmail = (data: EmailTemplateData): string => {
  const timestamp = data.timestamp || new Date();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Contact - ${data.name}</title>
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div class="email-logo">KS<span class="logo-dot">.</span></div>
      <div class="email-title">🎯 New Portfolio Contact</div>
      <div class="email-subtitle">Action required: Please respond to this inquiry</div>
    </div>

    <!-- Content -->
    <div class="email-content">
      <!-- Priority Alert -->
      <div class="alert-banner">
        <div class="alert-icon">⚡</div>
        <div class="alert-content">
          <div class="alert-title">High Priority Message</div>
          <div class="alert-text">Please respond within 24-48 hours to maintain professional standards</div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="field-section">
        <div class="field-label">
          <span>👤</span> SENDER NAME
        </div>
        <div class="field-box">${data.name}</div>
      </div>

      <div class="field-section">
        <div class="field-label">
          <span>✉️</span> EMAIL ADDRESS
        </div>
        <div class="field-box">
          <a href="mailto:${data.email}">${data.email}</a>
        </div>
      </div>

      <div class="field-section">
        <div class="field-label">
          <span>📌</span> SUBJECT LINE
        </div>
        <div class="field-box">${data.subject}</div>
      </div>

      <div class="field-section">
        <div class="field-label">
          <span>💬</span> MESSAGE CONTENT
        </div>
        <div class="message-container">${data.message}</div>
      </div>

      ${data.hasFile ? `
      <div class="field-section">
        <div class="field-label">
          <span>📎</span> FILE ATTACHMENT
        </div>
        <div class="file-display">
          <div class="file-icon">📄</div>
          <div class="file-details">
            <div class="file-name">${data.fileName}</div>
            <div class="file-size">${data.fileSize} KB</div>
          </div>
          <div class="file-badge">Attached</div>
        </div>
      </div>
      ` : ''}

      <!-- Quick Actions -->
      <div class="field-section">
        <div class="field-label">
          <span>⚡</span> QUICK RESPONSE OPTIONS
        </div>
        <div class="button-group">
          <a href="mailto:${data.email}" class="btn btn-primary">
            📧 Reply via Email
          </a>
          <a href="tel:+60149337280" class="btn btn-secondary">
            📞 Call Back
          </a>
        </div>
      </div>

      <!-- Timestamp -->
      <div class="timestamp-box">
        📅 Received: ${timestamp.toLocaleString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })}
      </div>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <div class="footer-logo">KS<span class="logo-dot">.</span></div>
      <div class="footer-tagline">
        Kuhandran SamudraPandiyan | Technical Delivery Manager
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-info">
        📧 <a href="mailto:skuhandran@yahoo.com">skuhandran@yahoo.com</a>
      </div>
      <div class="footer-info">
        📱 +60 14 933 7280 | 📍 Kuala Lumpur, Malaysia
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-links">
        <a href="https://linkedin.com/in/kuhandran-samudrapandiyan" class="footer-link">LinkedIn</a>
        <a href="https://github.com" class="footer-link">GitHub</a>
        <a href="https://yourportfolio.com" class="footer-link">Portfolio</a>
      </div>
      
      <div class="footer-note">
        This email was automatically generated from your portfolio contact form.<br>
        For best results, please respond within 24-48 business hours.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// ============================================
// TEMPLATE 2: Sender Auto-Reply Email
// ============================================
export const getSenderAutoReplyEmail = (data: EmailTemplateData): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You - Kuhandran SamudraPandiyan</title>
  ${emailStyles}
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="email-header">
      <div class="email-logo">KS<span class="logo-dot">.</span></div>
      <div class="email-title">✨ Thank You for Reaching Out!</div>
      <div class="email-subtitle">Your message has been received successfully</div>
    </div>

    <!-- Content -->
    <div class="email-content">
      <!-- Greeting -->
      <h2 style="font-size: 26px; font-weight: 700; color: #0f172a; margin-bottom: 20px;">
        👋 Hi ${data.name},
      </h2>

      <!-- Main Message -->
      <div class="info-panel" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6;">
        <p style="color: #1e40af; font-size: 16px; line-height: 1.8; margin: 0;">
          <strong>Thank you for contacting me!</strong> I've received your message and truly appreciate you taking the time to reach out. Your inquiry is important to me, and I'm excited to connect with you.
        </p>
      </div>

      <p style="color: #475569; font-size: 15px; line-height: 1.8; margin: 24px 0;">
        I review all messages personally and will get back to you as soon as possible. Typically, I respond within <strong>24-48 hours</strong> during business days.
      </p>

      <!-- Stats -->
      <div class="stats-container">
        <div class="stat-box">
          <div class="stat-number">8+</div>
          <div class="stat-label">Years Experience</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">15%</div>
          <div class="stat-label">Efficiency Gains</div>
        </div>
        <div class="stat-box">
          <div class="stat-number">MBA</div>
          <div class="stat-label">Bus. Analytics</div>
        </div>
      </div>

      <!-- What's Next -->
      <div class="info-panel">
        <div class="info-title">
          <span>📋</span> What Happens Next?
        </div>
        <ul class="info-list">
          <li>I'll carefully review your message and any attachments you've sent</li>
          <li>Prepare a detailed and thoughtful response to your inquiry</li>
          <li>Get back to you within 24-48 hours during business days</li>
          <li>Schedule a call or meeting if needed to discuss further</li>
        </ul>
      </div>

      <!-- CTA Buttons -->
      <div class="field-section">
        <div class="field-label">
          <span>🚀</span> EXPLORE MY WORK
        </div>
        <div class="button-group">
          <a href="https://linkedin.com/in/kuhandran-samudrapandiyan" class="btn btn-primary">
            View LinkedIn Profile
          </a>
          <a href="https://yourportfolio.com" class="btn btn-secondary">
            Browse Portfolio
          </a>
        </div>
      </div>

      <!-- Contact Panel -->
      <div class="contact-panel">
        <div class="contact-heading">📞 Need Immediate Assistance?</div>
        <div class="contact-row">
          <span class="contact-icon">📧</span>
          <span style="color: #94a3b8;">Email: <a href="mailto:skuhandran@yahoo.com" class="contact-link">skuhandran@yahoo.com</a></span>
        </div>
        <div class="contact-row">
          <span class="contact-icon">📱</span>
          <span style="color: #94a3b8;">Phone: <a href="tel:+60149337280" class="contact-link">+60 14 933 7280</a></span>
        </div>
        <div class="contact-row">
          <span class="contact-icon">📍</span>
          <span style="color: #94a3b8;">Location: Kuala Lumpur, Malaysia</span>
        </div>
      </div>

      <!-- Signature -->
      <div style="margin-top: 40px; padding-top: 32px; border-top: 2px solid #e2e8f0;">
        <p style="color: #64748b; margin-bottom: 12px; font-size: 14px;">Best regards,</p>
        <p style="font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">Kuhandran SamudraPandiyan</p>
        <p style="color: #475569; font-size: 15px; margin-bottom: 4px;">Technical Delivery Manager | Full-Stack Engineer</p>
        <p style="color: #64748b; font-size: 14px;">MBA in Business Analytics | 8+ Years Experience</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="email-footer">
      <div class="footer-logo">KS<span class="logo-dot">.</span></div>
      <div class="footer-tagline">
        Technical leader with 8+ years of experience in enterprise applications,<br>
        React Native development, and data visualization
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-links">
        <a href="https://linkedin.com/in/kuhandran-samudrapandiyan" class="footer-link">LinkedIn</a>
        <a href="https://github.com" class="footer-link">GitHub</a>
        <a href="https://yourportfolio.com" class="footer-link">Portfolio</a>
        <a href="https://yourportfolio.com/resume" class="footer-link">Resume</a>
      </div>
      
      <div class="footer-divider"></div>
      
      <div class="footer-note">
        This is an automated confirmation email.<br>
        A personal response will follow within 24-48 business hours.<br><br>
        © ${new Date().getFullYear()} Kuhandran SamudraPandiyan. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export default {
  getAdminNotificationEmail,
  getSenderAutoReplyEmail,
};