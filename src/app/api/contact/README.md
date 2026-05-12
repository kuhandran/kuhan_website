# Contact API Route

## Purpose
Handles the contact form submission endpoint that processes form data, validates inputs, and sends emails to both the admin and the user.

## Files

### `route.ts`
Main API route handler for POST requests from the contact form.

**Functionality**:
- ✅ Validates incoming form data
- ✅ Checks for required fields (name, email, subject, message)
- ✅ Validates email format
- ✅ Processes file uploads (PDF/DOCX only, max 5MB)
- ✅ Sends admin notification email with contact details
- ✅ Sends auto-reply email to visitor
- ✅ Handles errors and returns appropriate status codes

**Endpoint**: `POST /api/contact`

**Request Body**:
```typescript
{
  name: string,
  email: string,
  subject: string,
  message: string,
  file?: File  // Optional file upload
}
```

**Response Success (200)**:
```typescript
{
  success: true,
  message: "Email sent successfully"
}
```

**Response Error (400/500)**:
```typescript
{
  error: string  // Error message from errorMessages.json
}
```

## Error Handling

All errors use standardized messages from `public/data/errorMessages.json`:

- `contact.validation.missingFields` - Required fields missing
- `contact.validation.invalidEmail` - Invalid email format
- `contact.file.invalidType` - Wrong file type
- `contact.file.invalidSize` - File too large
- `contact.submission.failed` - Email send failure
- `contact.submission.success` - Success message

## Email Templates

Generated via `src/lib/email/templates.ts`:
1. **Admin Notification** - Full contact details with file info
2. **Auto-Reply** - Confirmation to visitor

## Environment Variables Required

```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Related Files

- `src/components/sections/Contact.tsx` - Frontend form component
- `src/lib/email/templates.ts` - Email template generators
- `public/data/errorMessages.json` - Error messages
- `public/config/urlConfig.json` - Configuration URLs
