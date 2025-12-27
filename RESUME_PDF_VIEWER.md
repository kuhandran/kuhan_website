# Resume PDF Viewer Implementation

## Overview
A secure PDF viewer component has been implemented that displays the resume with an embedded iframe and provides download functionality that requires analytics cookie consent.

## Components Created/Modified

### 1. **ResumePDFViewer Component** 
**File:** [src/components/elements/ResumePDFViewer.tsx](src/components/elements/ResumePDFViewer.tsx)

A reusable React component that provides:
- **PDF Viewing**: Embedded PDF viewer using iframe with zoom controls
- **Cookie Consent Integration**: Checks `analytics-consent` cookie before allowing downloads
- **User-Friendly UI**: 
  - Modal dialog with controls
  - Zoom in/out functionality
  - Loading state
  - Clear messaging about cookie requirements
  - Download button that's disabled until cookies are accepted

#### Features:
- ✅ Displays PDF from: `https://static.kuhandranchatbot.info/resume/resume.pdf`
- ✅ Requires `analytics-consent=true` cookie to download
- ✅ Graceful fallback if cookies not accepted with informative message
- ✅ Responsive design works on desktop and mobile
- ✅ Smooth animations and transitions

### 2. **Navbar Component Updates**
**File:** [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)

Changes made:
- Added `isResumePDFOpen` state to manage modal visibility
- Imported `ResumePDFViewer` component
- Updated `handleDownloadResume()` to open the PDF viewer modal instead of direct window.open
- Added ResumePDFViewer modal component at the bottom of the navbar

### 3. **About Section Updates**
**File:** [src/components/sections/About.tsx](src/components/sections/About.tsx)

Changes made:
- Added `isResumePDFOpen` state to manage modal visibility
- Imported `ResumePDFViewer` component
- Updated the "Download Resume" button to open the PDF viewer modal
- Added ResumePDFViewer modal component in the section

## How It Works

### Cookie Consent Flow
1. **User visits site** → Analytics consent banner appears at bottom
2. **User clicks "Accept Analytics"** → `analytics-consent=true` cookie is set
3. **User clicks "Download Resume"** (in Navbar or About) → PDF Viewer modal opens
4. **User can view PDF** in the embedded viewer
5. **User clicks "Download Resume"** button → 
   - If cookie exists: Downloads the PDF as "Kuhandran_Resume.pdf"
   - If cookie missing: Shows alert prompting user to accept analytics cookies

### Without Cookie Consent
- Users can still **view the PDF** in the modal
- The "Download Resume" button will be **disabled** with visual feedback
- A warning message explains: "Accept cookies to download"

## Technical Details

### Dependencies Used
- React hooks: `useState`, `useEffect`
- lucide-react: Icons (Download, X, ZoomIn, ZoomOut)
- Custom Button component from `src/components/elements/Button`

### Cookie Format
```javascript
// Accept analytics
document.cookie = "analytics-consent=true; expires=...; path=/"

// Reject analytics  
document.cookie = "analytics-consent=false; expires=...; path=/"
```

### State Management
- `hasAnalyticsConsent`: Tracks if user accepted cookies
- `isResumePDFOpen`: Controls modal visibility
- `isLoading`: Tracks PDF loading state
- `scale`: Tracks zoom level (50-200%)
- `currentPage`: Tracks current PDF page

## Usage

### In Components
```tsx
import { ResumePDFViewer } from '@/components/elements/ResumePDFViewer';

// Inside your component
const [isResumePDFOpen, setIsResumePDFOpen] = useState(false);

// In JSX
<Button onClick={() => setIsResumePDFOpen(true)}>
  Download Resume
</Button>

<ResumePDFViewer
  isOpen={isResumePDFOpen}
  onClose={() => setIsResumePDFOpen(false)}
  resumeUrl="https://static.kuhandranchatbot.info/resume/resume.pdf"
/>
```

## UI/UX Features

### Modal Styling
- Semi-transparent dark backdrop with blur effect
- White rounded modal with shadow
- Gradient header (blue to purple)
- Responsive layout: full width on mobile, max-width on desktop

### Controls
- **Zoom Controls**: +/- buttons with percentage display
- **Download Button**: Color-coded (primary when enabled, secondary when disabled)
- **Close Button**: Closes modal and returns to page
- **Info Message**: Shows cookie status and download availability

### Visual Feedback
- Loading spinner while PDF loads
- Disabled state styling for download button
- Opacity reduction when download unavailable
- Cursor changes to "not-allowed" when disabled
- Color-coded status indicators (✓ or ⚠)

## Security & Privacy

✅ **Cookie-Based Gating**: Only users who explicitly accept analytics cookies can download
✅ **Client-Side Validation**: No backend verification needed
✅ **Clear Communication**: Users are informed why they can't download
✅ **Privacy Compliant**: Respects user's privacy choices

## Browser Compatibility

- Modern browsers with support for:
  - CSS Grid & Flexbox
  - ES6+ JavaScript
  - Iframe with PDF support
  - Document.cookie API

## Future Enhancements

Possible improvements:
- [ ] PDF text selection and copying
- [ ] Print functionality
- [ ] Page navigation input
- [ ] Full-screen mode
- [ ] PDF search functionality
- [ ] Download progress indicator
- [ ] Analytics logging when PDFs are viewed/downloaded

## Testing

To test the functionality:
1. Clear browser cookies to simulate first-time visitor
2. You should NOT see the accept cookies banner (move that check) or visit in incognito
3. Click "Download Resume" button
4. Modal opens, download button is disabled
5. Message says "Accept cookies to download"
6. Scroll to bottom, accept analytics cookies
7. Open "Download Resume" again
8. Download button now works
9. Click download → PDF downloads as "Kuhandran_Resume.pdf"

