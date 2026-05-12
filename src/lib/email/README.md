# Email Templates (`src/lib/email`)

This directory contains email template functions for generating HTML emails used in contact form confirmations and notifications.

## Files

### `templates.ts`
**Purpose**: Generates professional HTML email templates that match the website design.

**Functions**:

#### `generateAdminNotificationEmail(data)`
Generates an email for the site owner with full contact form details.

**Parameters**:
```typescript
{
  name: string,
  email: string,
  subject: string,
  message: string,
  attachmentFileName?: string,
  attachmentSize?: number
}
```

**Output**: HTML email with:
- Header with branding
- Contact details clearly displayed
- Message content
- File attachment information (if provided)
- Footer with contact link

#### `generateAutoReplyEmail(name)`
Generates a professional auto-reply confirmation for the visitor.

**Parameters**:
```typescript
{
  name: string
}
```

**Output**: HTML email with:
- Welcome message
- Confirmation that message was received
- Expected response timeframe
- Contact information
- Professional signature

## Design Features

✅ **Professional Layout**
- Clean, modern design matching website
- Responsive HTML layout
- Professional color scheme
- Clear typography

✅ **Email Client Compatibility**
- Works in Gmail, Outlook, Apple Mail, etc.
- Inline CSS for maximum compatibility
- No external stylesheets

✅ **Accessibility**
- Proper semantic HTML
- Alt text for images
- Good contrast ratios
- Mobile-responsive design

## Usage

```typescript
import { generateAdminNotificationEmail, generateAutoReplyEmail } from '@/lib/email/templates';

// Generate admin notification
const adminEmail = generateAdminNotificationEmail({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss collaboration opportunities...',
  attachmentFileName: 'resume.pdf',
  attachmentSize: 250
});

// Generate auto-reply
const userEmail = generateAutoReplyEmail({
  name: 'John Doe'
});
```

## Email Configuration

Emails are sent via `src/app/api/contact/route.ts` using:
- **Service**: Nodemailer with Gmail
- **Configuration**: Environment variables for SMTP details
- **From Address**: Configured in API route

## Styling Guidelines

- Color primary: `#3b82f6` (blue)
- Color secondary: `#1e293b` (dark slate)
- Font family: System fonts (arial, helvetica, sans-serif)
- Padding/spacing: Consistent 20px padding on sections

## Adding New Templates

1. Create new template function in this file
2. Use inline CSS for email client compatibility
3. Include responsive design with media queries
4. Test in major email clients before deployment

## Environment Variables Required

See `src/app/api/contact/route.ts` for email configuration requirements.
