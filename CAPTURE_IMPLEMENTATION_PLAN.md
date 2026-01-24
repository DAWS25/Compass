# Capture Route Implementation Plan

## Overview
Implement the `/capture` route with camera functionality and AWS-based image categorization.

---

## Phase 1: AWS Service Selection & Setup

### AWS Rekognition for Image Categorization
**Service:** AWS Rekognition - DetectLabels API
**Purpose:** Categorize captured images to identify place types (restaurant, park, building, etc.)

**Free Tier Details (First 12 months):**
- **5,000 images/month** free for DetectLabels API
- After free tier: $1.00 per 1,000 images
- Each image can return up to 10 labels with confidence scores

**Why Rekognition?**
- Specifically designed for image recognition and labeling
- Returns structured data (labels, confidence scores, categories)
- No infrastructure management required
- Easy integration via AWS SDK

**Alternative Consideration:**
- **AWS Textract** (for text extraction) - Not suitable for categorization
- **Custom ML Models** - More complex, requires infrastructure
- **Mock Implementation First** - Recommended for initial development

### AWS S3 for Image Storage (Optional - Future Phase)
**Service:** Amazon S3
**Free Tier:**
- 5 GB standard storage
- 20,000 GET requests
- 2,000 PUT requests/month

**Note:** For Phase 5 (Capture), we'll focus on categorization only. Storage can be added later.

---

## Phase 2: Architecture & Component Structure

### Components to Create:
```
client/src/components/
├── Capture/
│   ├── CameraView.tsx          # Camera stream component
│   ├── CameraView.module.css
│   ├── ImagePreview.tsx        # Preview captured image
│   ├── ImagePreview.module.css
│   ├── CategoryResults.tsx     # Display AI categorization results
│   ├── CategoryResults.module.css
│   └── PlaceConfirmationForm.tsx # Form to confirm/add place details
├── Button/
│   ├── PrimaryButton.tsx       # Reusable primary button
│   └── PrimaryButton.module.css
└── LoadingSpinner/
    ├── LoadingSpinner.tsx
    └── LoadingSpinner.module.css
```

### API Route Structure:
```
client/src/app/api/
└── categorize-image/
    └── route.ts                # Next.js API route for AWS Rekognition
```

---

## Phase 3: Implementation Steps

### Step 1: UI/UX Design & Component Structure

**Page Layout:**
1. **Camera View Section** (Initial State)
   - Full-screen camera preview
   - Capture button (centered, large, floating)
   - Flip camera button (front/back)
   - Close/cancel button (top-left)
   - Permission request UI (if camera not granted)

2. **Image Preview Section** (After Capture)
   - Display captured image
   - Retake button
   - Confirm button (triggers categorization)
   - Loading state during processing

3. **Category Results Section** (After Processing)
   - Display top 3-5 suggested categories
   - Confidence scores for each category
   - Place name input field (pre-filled with highest confidence)
   - Place description/notes field (optional)
   - Location capture (using Geolocation API)
   - Confirm & Save button
   - Back to retake option

**User Flow:**
```
Camera View → Capture Photo → Preview → Categorize → Results → Confirm → Success
     ↓            ↓            ↓           ↓           ↓         ↓
  Cancel      Retake       Retake      Loading    Edit      Navigate
```

### Step 2: Camera Integration (MediaDevices API)

**Features:**
- Request camera permissions
- Start/stop video stream
- Capture frame to canvas
- Support front/back camera switch (mobile)
- Handle errors (no camera, permission denied, etc.)
- Handle mobile vs desktop differences

**Technical Implementation:**
- Use `navigator.mediaDevices.getUserMedia({ video: true })`
- Convert video stream to canvas
- Convert canvas to Blob/File
- Clean up streams on unmount

### Step 3: Image Processing & Categorization

**Approach A: Mock Implementation (Recommended First)**
- Create mock API that returns fake categorization results
- Simulate 1-2 second delay
- Return structured data matching AWS Rekognition format
- Allows UI/UX development without AWS setup

**Approach B: AWS Rekognition Integration**
- Set up AWS credentials (environment variables)
- Install AWS SDK: `@aws-sdk/client-rekognition`
- Create Next.js API route to handle categorization
- Upload image buffer to Rekognition DetectLabels API
- Process and return formatted results

**Mock Response Structure:**
```typescript
{
  labels: [
    {
      Name: "Restaurant",
      Confidence: 95.5,
      Categories: [{ Name: "Food and Dining" }]
    },
    {
      Name: "Building",
      Confidence: 87.2,
      Categories: [{ Name: "Architecture" }]
    },
    // ... more labels
  ],
  suggestedPlaceName: "Restaurant",
  suggestedCategory: "Food and Dining"
}
```

### Step 4: Location Capture (Geolocation API)

**Features:**
- Request location permission
- Get current coordinates (lat/lng)
- Handle errors (permission denied, timeout, etc.)
- Display location accuracy
- Optional: Reverse geocoding for address

**Technical Implementation:**
- Use `navigator.geolocation.getCurrentPosition()`
- Store coordinates with place data
- Handle async permission requests

### Step 5: State Management

**State Structure:**
```typescript
{
  // Camera state
  isCameraActive: boolean
  stream: MediaStream | null
  error: string | null
  
  // Capture state
  capturedImage: Blob | null
  imagePreviewUrl: string | null
  
  // Processing state
  isProcessing: boolean
  categorizationResults: RekognitionResponse | null
  
  // Form state
  placeName: string
  placeDescription: string
  location: { lat: number; lng: number } | null
  
  // UI state
  currentStep: 'camera' | 'preview' | 'results' | 'success'
}
```

### Step 6: Form Handling & Validation

**Validation:**
- Place name required (min 2 characters)
- Location required (must have coordinates)
- Image required before categorization

**Form Submission:**
- Mock save to local state (no backend yet)
- Show success message
- Navigate to place detail page or home
- Clear all state

---

## Phase 4: AWS Rekognition Setup & Integration

### Prerequisites:
1. AWS Account (free tier eligible)
2. AWS IAM User with Rekognition permissions
3. AWS Access Key ID and Secret Access Key

### Step 1: Install AWS SDK
```bash
npm install @aws-sdk/client-rekognition
```

### Step 2: Environment Variables
Create `.env.local`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### Step 3: Create API Route
**File:** `client/src/app/api/categorize-image/route.ts`

**Implementation:**
- Receive image as base64 or file buffer
- Convert to format Rekognition expects (Uint8Array)
- Call DetectLabels API
- Return formatted results

**Error Handling:**
- Invalid image format
- AWS service errors
- Rate limiting
- Network errors

### Step 4: Client-Side Integration
- Upload image to API route
- Handle loading states
- Display results in UI
- Error handling and retry logic

---

## Phase 5: Error Handling & Edge Cases

### Camera Permissions:
- Permission denied → Show helpful message with instructions
- No camera available → Show fallback file upload option
- Mobile camera limitations → Handle orientation changes

### Image Processing:
- Large images → Compress before upload
- Invalid formats → Validate before processing
- Processing timeout → Show retry option

### AWS Integration:
- Rate limiting → Queue requests or show user-friendly message
- Service unavailable → Fallback to mock or retry
- Cost concerns → Monitor usage, implement rate limiting

### Location:
- Permission denied → Make location optional or show instructions
- Location unavailable → Allow manual entry or skip
- Inaccurate location → Show accuracy indicator

---

## Phase 6: UI/UX Enhancements

### Accessibility:
- Keyboard navigation support
- Screen reader announcements
- Focus management
- ARIA labels and roles

### Visual Feedback:
- Loading animations during processing
- Success/error animations
- Smooth transitions between states
- Responsive design (mobile-first)

### User Experience:
- Clear CTAs at each step
- Undo/back functionality
- Progress indicators
- Helpful error messages

---

## Phase 7: Testing Strategy

### Unit Tests:
- Component rendering
- State management
- Form validation
- Utility functions

### Integration Tests:
- Camera API integration
- Image capture flow
- API route handling
- AWS Rekognition mock responses

### E2E Tests (Playwright):
- Full capture flow
- Permission handling
- Error scenarios
- Mobile device testing

---

## Implementation Order (Recommended)

### Phase A: Core UI & Mock Implementation (Week 1)
1. ✅ Create component structure
2. ✅ Implement camera view UI
3. ✅ Implement camera capture functionality
4. ✅ Implement image preview
5. ✅ Create mock categorization API
6. ✅ Implement results display
7. ✅ Implement confirmation form

### Phase B: AWS Integration (Week 2)
1. ✅ Set up AWS account and credentials
2. ✅ Install AWS SDK
3. ✅ Create API route with Rekognition
4. ✅ Replace mock with real API calls
5. ✅ Add error handling
6. ✅ Test with various images

### Phase C: Polish & Testing (Week 3)
1. ✅ Add location capture
2. ✅ Implement all error cases
3. ✅ Accessibility improvements
4. ✅ Mobile optimization
5. ✅ Testing suite
6. ✅ Performance optimization

---

## File Structure Summary

```
client/src/
├── app/
│   ├── capture/
│   │   └── page.tsx                    # Main capture page (orchestrator)
│   └── api/
│       └── categorize-image/
│           └── route.ts                # AWS Rekognition API route
├── components/
│   ├── Capture/
│   │   ├── CameraView.tsx
│   │   ├── CameraView.module.css
│   │   ├── ImagePreview.tsx
│   │   ├── ImagePreview.module.css
│   │   ├── CategoryResults.tsx
│   │   ├── CategoryResults.module.css
│   │   ├── PlaceConfirmationForm.tsx
│   │   └── PlaceConfirmationForm.module.css
│   ├── Button/
│   │   ├── PrimaryButton.tsx
│   │   └── PrimaryButton.module.css
│   └── LoadingSpinner/
│       ├── LoadingSpinner.tsx
│       └── LoadingSpinner.module.css
└── hooks/
    ├── useCamera.ts                    # Camera stream management
    ├── useImageCapture.ts              # Image capture logic
    └── useGeolocation.ts               # Location capture logic
```

---

## Next Steps

1. **Review and approve this plan**
2. **Start with Phase A (Mock Implementation)**
3. **Set up AWS account when ready for Phase B**
4. **Iterate based on user feedback**

---

## Questions to Consider

1. **Storage:** Do we need to store images now, or can we defer to later?
2. **Place Data:** Where do we store confirmed places? (Local storage for now, database later?)
3. **Image Quality:** What's the target image resolution? (affects AWS costs)
4. **Categories:** Which specific categories are most important for the app?
5. **Location:** How accurate should location be? (GPS only, or manual override?)

---

## Estimated AWS Costs (After Free Tier)

- **Within Free Tier (5,000 images/month):** $0
- **Beyond Free Tier:** ~$0.001 per image
- **Example:** 10,000 images/month = $5/month
- **Recommendation:** Implement rate limiting and usage monitoring

