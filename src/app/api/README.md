# src/app/api/ - API Routes

Server-side endpoints and backend logic for the application.

## 📁 Structure

```
api/
├── README.md (this file)
└── contact/
    └── route.ts          # Contact form submission endpoint
```

## 🎯 Overview

API routes are serverless functions that handle:
- Form submissions
- Email notifications
- Data validation
- File uploads
- Authentication
- Third-party integrations

## 📋 Endpoint Reference

### POST /api/contact
Contact form submission endpoint with email notifications and auto-reply.

**Endpoint:** `POST /api/contact`

**Content-Type:** `multipart/form-data`

#### Request

**Form Fields:**
```typescript
{
  name: string          // Sender's name (required)
  email: string         // Sender's email (required)
  subject: string       // Message subject (required)
  message: string       // Message body (required)
  phoneNumber?: string  // Optional phone number
  file?: File          // Optional file attachment
}
```

**Example Request:**
```typescript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('email', 'john@example.com')
formData.append('subject', 'Collaboration Inquiry')
formData.append('message', 'I would like to discuss a potential project...')
formData.append('phoneNumber', '+1 (555) 123-4567')

const response = await fetch('/api/contact', {
  method: 'POST',
  body: formData
})
```

#### Response

**Success (200):**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

**Error (400):**
```json
{
  "error": "All fields are required",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

**Error (500):**
```json
{
  "error": "Failed to send email",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

#### Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Email sent successfully |
| 400 | Bad Request | Missing required fields |
| 422 | Unprocessable Entity | Invalid email format |
| 500 | Server Error | Email service failure |

#### Validation

The endpoint validates:
- **Required fields:** name, email, subject, message
- **Email format:** Valid email address format
- **Message length:** Not empty
- **File size:** Maximum 5MB (if file provided)
- **File type:** Safe file types only

#### Features

1. **Email Notifications**
   - Admin notification to portfolio owner
   - Auto-reply to sender
   - HTML and plain text versions

2. **File Handling**
   - Optional file attachment support
   - File size validation
   - File type whitelist
   - Secure file upload

3. **Error Handling**
   - Comprehensive validation
   - Detailed error messages
   - Request logging
   - Graceful failure

4. **Security**
   - Rate limiting (optional)
   - CSRF protection
   - Input sanitization
   - Email verification

5. **Performance**
   - Async/await pattern
   - Non-blocking operations
   - Timeout handling
   - Connection pooling

#### Email Templates

**Admin Notification Email**
- Sender details
- Full message content
- File attachment (if provided)
- Reply instructions
- Portfolio footer

**Auto-Reply to Sender**
- Thank you message
- Confirmation of receipt
- Expected response time
- Contact information
- Portfolio branding

#### Implementation Details

**Environment Variables Required:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@example.com
```

**Nodemailer Configuration:**
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
})
```

**File Upload Handling:**
```typescript
const file = formData.get('file') as File | null

if (file) {
  // Validate file
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
  
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'File too large' },
      { status: 400 }
    )
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'File type not allowed' },
      { status: 400 }
    )
  }
}
```

#### Usage in Frontend

**React Hook Form Example:**
```typescript
import { useForm } from 'react-hook-form'

function ContactForm() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('subject', data.subject)
    formData.append('message', data.message)
    
    if (data.file?.[0]) {
      formData.append('file', data.file[0])
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const result = await response.json()
      alert('Message sent successfully!')
    } catch (error) {
      alert('Error sending message: ' + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', { required: true })}
        placeholder="Your Name"
        required
      />
      <input
        {...register('email', { required: true, type: 'email' })}
        placeholder="Your Email"
        required
      />
      <input
        {...register('subject', { required: true })}
        placeholder="Subject"
        required
      />
      <textarea
        {...register('message', { required: true })}
        placeholder="Your Message"
        required
      />
      <input
        {...register('file')}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

**Fetch Example:**
```typescript
async function sendContactMessage(data) {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const response = await fetch('/api/contact', {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return await response.json()
}

// Usage
try {
  await sendContactMessage({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'Hello, I would like to...'
  })
  console.log('Message sent successfully')
} catch (error) {
  console.error('Error:', error)
}
```

#### Error Handling

**Common Errors:**

```typescript
// Missing required fields
if (!name || !email || !subject || !message) {
  return NextResponse.json(
    { error: 'All fields are required' },
    { status: 400 }
  )
}

// Invalid email format
if (!emailRegex.test(email)) {
  return NextResponse.json(
    { error: 'Invalid email format' },
    { status: 422 }
  )
}

// Email service error
try {
  await transporter.sendMail({...})
} catch (error) {
  console.error('Email error:', error)
  return NextResponse.json(
    { error: 'Failed to send email' },
    { status: 500 }
  )
}
```

#### Logging

Comprehensive logging for debugging:
```typescript
console.log('📨 Processing contact form submission...')
console.log('✅ Form data validated')
console.log('📧 Sending admin notification...')
console.log('📧 Sending auto-reply...')
console.log('✅ Emails sent successfully')
console.error('❌ Validation failed: Missing required fields')
```

#### Rate Limiting (Optional)

Prevent spam with rate limiting:

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // Limit each IP to 5 requests per windowMs
})

export const middleware = [limiter]
```

## 🔒 Security Considerations

### CORS
API routes are same-origin by default. CORS headers only if needed:

```typescript
const headers = new Headers()
headers.set('Access-Control-Allow-Origin', '*')
headers.set('Access-Control-Allow-Methods', 'POST')
headers.set('Access-Control-Allow-Headers', 'Content-Type')
```

### CSRF Protection
Next.js provides built-in CSRF protection with cookies.

### Input Sanitization
Always validate and sanitize user input:

```typescript
import { sanitizeHtml } from 'sanitize-html'

const cleanMessage = sanitizeHtml(message, {
  allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br'],
  allowedAttributes: {}
})
```

### Rate Limiting
Prevent abuse with rate limiting middleware.

### HTTPS Only
Ensure API endpoints are only accessible via HTTPS in production.

## 📊 Monitoring

### Request Logging
Track all API requests:

```typescript
console.log({
  timestamp: new Date().toISOString(),
  method: request.method,
  pathname: request.nextUrl.pathname,
  status: response.status
})
```

### Error Tracking
Integrate with error tracking service:

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  // API logic
} catch (error) {
  Sentry.captureException(error)
  // Send error response
}
```

### Analytics
Track successful submissions:

```typescript
// Track to analytics service
await analytics.track('contact_form_submitted', {
  email: sender's domain,
  subject: message.subject,
  timestamp: new Date().toISOString()
})
```

## 🚀 Deployment

### Environment Variables
Set in `.env.local` (development) or hosting platform:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@example.com
```

### Vercel Deployment
Environment variables are set in Vercel dashboard:
- Project Settings → Environment Variables

### Function Timeout
Default: 10 seconds (free tier)
Pro/higher: 900 seconds (15 minutes)

Monitor function execution time:
```typescript
const startTime = Date.now()

// ... API logic ...

const duration = Date.now() - startTime
console.log(`Request completed in ${duration}ms`)
```

## 📚 Testing

### Unit Tests
```typescript
describe('POST /api/contact', () => {
  it('returns 400 for missing fields', async () => {
    const res = await POST(
      new NextRequest(new URL('http://localhost:3000/api/contact'), {
        method: 'POST'
      })
    )
    expect(res.status).toBe(400)
  })

  it('returns 200 on success', async () => {
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test@example.com')
    formData.append('subject', 'Test')
    formData.append('message', 'Test message')

    const res = await POST(
      new NextRequest(new URL('http://localhost:3000/api/contact'), {
        method: 'POST',
        body: formData
      })
    )
    expect(res.status).toBe(200)
  })
})
```

### Integration Tests
Test with actual email service in staging.

## 🔗 Related Documentation

- [Parent: README.md](../../README.md) - Project overview
- [Contact Section: components/sections/Contact.tsx](../components/sections/README.md) - Frontend form
- [Email Templates: lib/email/templates.ts](../lib/README.md) - Email templates
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - Official docs
