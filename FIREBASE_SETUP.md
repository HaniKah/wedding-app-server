# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your Wedding App with support for Google, Apple, and Phone authentication.

## Table of Contents
1. [Firebase Project Setup](#firebase-project-setup)
2. [Enable Authentication Methods](#enable-authentication-methods)
3. [Backend Configuration](#backend-configuration)
4. [Frontend Integration](#frontend-integration)
5. [Deployment](#deployment)
6. [Testing](#testing)

---

## Firebase Project Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "wedding-app")
   - Enable Google Analytics (optional)
   - Accept terms and create project

### 2. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" and select your platform (Web, iOS, Android)
4. Register your app and copy the configuration

### 3. Generate Service Account Key

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (DO NOT commit to git)
4. You'll need these values:
   - `project_id`
   - `client_email`
   - `private_key`

---

## Enable Authentication Methods

### Google Sign-In

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Click "Google" → Enable
3. Add your project support email
4. For production:
   - Add authorized domains (your production domain)
   - Configure OAuth consent screen in Google Cloud Console

### Apple Sign-In

1. Go to "Authentication" → "Sign-in method"
2. Click "Apple" → Enable
3. You'll need:
   - Apple Developer account
   - Services ID (create in Apple Developer Console)
   - Team ID
   - Key ID
   - Private key (.p8 file)
4. Follow Firebase's Apple Sign-In setup guide

### Phone Authentication

1. Go to "Authentication" → "Sign-in method"
2. Click "Phone" → Enable
3. Configure:
   - **Test phone numbers** (for development)
   - **reCAPTCHA** (required for web apps)
   - **Phone number verification** quota limits

**Important:** Firebase free tier includes:
- 10,000 phone verifications/month (free)
- Additional charges apply beyond this limit

---

## Backend Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# App Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (for Railway/Render)
DATABASE_URL=postgresql://user:password@host:5432/database
```

**Important Notes:**
- Keep the `\n` characters in `FIREBASE_PRIVATE_KEY`
- Never commit `.env` to git (add to `.gitignore`)
- Use different Firebase projects for dev/staging/production

### 2. Update .gitignore

Add to your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Firebase credentials
firebase-adminsdk-*.json
serviceAccountKey.json
```

### 3. Install Dependencies

Already installed via:
```bash
npm install firebase-admin
```

### 4. Project Structure

Your auth module is now set up with:

```
src/
├── auth/
│   ├── auth.module.ts              # Auth module configuration
│   ├── auth.controller.ts          # Auth endpoints
│   ├── firebase.service.ts         # Firebase Admin SDK wrapper
│   ├── firebase-auth.guard.ts      # Authentication guard
│   └── decorators/
│       ├── current-user.decorator.ts  # Extract user from request
│       └── public.decorator.ts        # Mark routes as public
└── types/
    └── auth/
        └── auth.dto.ts             # Auth DTOs including Firebase types
```

---

## Frontend Integration

### Web (React/Vue/Angular)

1. **Install Firebase SDK:**
```bash
npm install firebase
```

2. **Initialize Firebase:**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

3. **Google Sign-In Example:**
```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();

    // Send token to your backend
    await fetch('http://localhost:3000/api/auth/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firebaseUid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoUrl: result.user.photoURL,
        role: 'User'
      })
    });
  } catch (error) {
    console.error('Google sign-in error:', error);
  }
}
```

4. **Phone Sign-In Example:**
```typescript
import {
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';

// Setup reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  'recaptcha-container',
  { size: 'invisible' },
  auth
);

async function signInWithPhone(phoneNumber: string) {
  const appVerifier = window.recaptchaVerifier;

  try {
    // Send verification code
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );

    // Save for later verification
    window.confirmationResult = confirmationResult;

    // Get code from user
    const code = prompt('Enter verification code:');
    const result = await confirmationResult.confirm(code);

    const idToken = await result.user.getIdToken();
    // Send to backend...
  } catch (error) {
    console.error('Phone sign-in error:', error);
  }
}
```

5. **Apple Sign-In Example:**
```typescript
import { signInWithPopup, OAuthProvider } from 'firebase/auth';

async function signInWithApple() {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    // Send to backend...
  } catch (error) {
    console.error('Apple sign-in error:', error);
  }
}
```

### Mobile (iOS/Android)

**iOS (Swift):**
```swift
// Install Firebase SDK via CocoaPods or SPM
import FirebaseAuth

// Google Sign-In
GIDSignIn.sharedInstance.signIn(with: config, presenting: self) { user, error in
    guard let authentication = user?.authentication,
          let idToken = authentication.idToken else { return }

    let credential = GoogleAuthProvider.credential(
        withIDToken: idToken,
        accessToken: authentication.accessToken
    )

    Auth.auth().signIn(with: credential) { result, error in
        // Get ID token and send to backend
    }
}
```

**Android (Kotlin):**
```kotlin
// Google Sign-In
val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
    .requestIdToken(getString(R.string.default_web_client_id))
    .requestEmail()
    .build()

val googleSignInClient = GoogleSignIn.getClient(this, gso)

// After successful Google sign-in
val credential = GoogleAuthProvider.getCredential(idToken, null)
FirebaseAuth.getInstance().signInWithCredential(credential)
    .addOnCompleteListener { task ->
        if (task.isSuccessful) {
            val user = task.result?.user
            user?.getIdToken(true)?.addOnSuccessListener { result ->
                // Send result.token to backend
            }
        }
    }
```

---

## Protecting Routes

### Option 1: Protect Individual Routes

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';
import { CurrentUser, FirebaseUser } from './auth/decorators/current-user.decorator';

@Controller('protected')
export class ProtectedController {
  @UseGuards(FirebaseAuthGuard)
  @Get('data')
  getProtectedData(@CurrentUser() user: FirebaseUser) {
    return {
      message: 'This is protected data',
      user: user.email
    };
  }
}
```

### Option 2: Global Authentication (Recommended for Production)

In `src/auth/auth.module.ts`, uncomment:

```typescript
{
  provide: APP_GUARD,
  useClass: FirebaseAuthGuard,
}
```

Then mark public routes with `@Public()`:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Public()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

---

## Deployment

### Railway (Recommended)

1. **Create Railway Account:**
   - Go to [Railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub:**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect NestJS

3. **Add PostgreSQL:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-inject `DATABASE_URL`

4. **Set Environment Variables:**
   - Go to your service → Variables
   - Add all variables from `.env`:
     ```
     FIREBASE_PROJECT_ID
     FIREBASE_CLIENT_EMAIL
     FIREBASE_PRIVATE_KEY
     NODE_ENV=production
     ```

5. **Configure Build & Start Commands:**
   Railway auto-detects from `package.json`:
   - Build: `npm run build`
   - Start: `npm run start:prod`

6. **Generate Domain:**
   - Settings → Generate Domain
   - Or add custom domain

**Cost:** ~$5-10/month (includes PostgreSQL)

### Render

1. **Create Account:** [Render.com](https://render.com)
2. **New Web Service:**
   - Connect GitHub repo
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
3. **Add PostgreSQL:**
   - Create new PostgreSQL database
   - Copy connection string to environment variables
4. **Environment Variables:**
   - Add Firebase credentials
   - Add `DATABASE_URL`

**Cost:** Free tier available (spins down after inactivity), PostgreSQL $7/month after 90 days

### Google Cloud Run (Best for Firebase Integration)

```bash
# 1. Install gcloud CLI
# 2. Build Docker container
docker build -t wedding-app .

# 3. Push to Google Container Registry
gcloud auth configure-docker
docker tag wedding-app gcr.io/YOUR_PROJECT_ID/wedding-app
docker push gcr.io/YOUR_PROJECT_ID/wedding-app

# 4. Deploy to Cloud Run
gcloud run deploy wedding-app \
  --image gcr.io/YOUR_PROJECT_ID/wedding-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=xxx,FIREBASE_CLIENT_EMAIL=xxx \
  --set-secrets FIREBASE_PRIVATE_KEY=firebase-key:latest
```

**Cost:** Pay-per-use (can be very cheap with low traffic)

---

## Testing

### Test with cURL

1. **Get ID Token from Frontend:**
```javascript
const idToken = await firebase.auth().currentUser.getIdToken();
console.log(idToken);
```

2. **Test Protected Endpoint:**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ID_TOKEN"
```

3. **Expected Response:**
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "emailVerified": true,
  "name": "John Doe",
  "picture": "https://..."
}
```

### Test Phone Authentication

1. **Add Test Phone Number in Firebase Console:**
   - Authentication → Sign-in method → Phone
   - Add test phone number: `+1 555-555-5555`
   - Add verification code: `123456`

2. **Use in Development:**
```typescript
// No SMS will be sent for test numbers
await signInWithPhoneNumber(auth, '+15555555555', appVerifier);
await confirmationResult.confirm('123456'); // Use test code
```

---

## Common Issues & Solutions

### Issue: "Invalid token" Error

**Solution:**
- Ensure clock sync on server
- Check if token is expired (tokens expire after 1 hour)
- Verify Firebase project ID matches

### Issue: "CORS Error"

**Solution:**
In `main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'https://your-frontend.com'],
  credentials: true,
});
```

### Issue: Phone Authentication Not Working

**Solutions:**
- Enable reCAPTCHA in Firebase Console
- Add authorized domains
- Check quota limits (10K/month free)
- For testing, use test phone numbers

### Issue: Private Key Format Error

**Solution:**
Ensure private key has proper newlines:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\nYour-Key-Here...\n-----END PRIVATE KEY-----\n"
```

---

## Security Best Practices

1. **Never expose service account keys:**
   - Use environment variables
   - Never commit to git
   - Use different keys for dev/prod

2. **Implement rate limiting:**
```bash
npm install @nestjs/throttler
```

3. **Add role-based authorization:**
```typescript
// Set custom claims
await firebaseService.setCustomUserClaims(uid, { role: 'admin' });

// Check in guard
if (user.customClaims.role !== 'admin') {
  throw new ForbiddenException();
}
```

4. **Enable Firebase App Check** (prevents abuse):
   - Protects against unauthorized clients
   - Available in Firebase Console

5. **Monitor authentication:**
   - Enable Cloud Logging
   - Set up alerts for suspicious activity

---

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Enable authentication methods
3. ✅ Configure backend environment variables
4. ✅ Integrate frontend authentication
5. ✅ Test authentication flow
6. ✅ Deploy to hosting provider
7. ⬜ Set up database user sync
8. ⬜ Implement role-based access control
9. ⬜ Add rate limiting
10. ⬜ Configure production security

---

## Resources

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [Railway Deployment Guide](https://docs.railway.app/)
- [Render Deployment Guide](https://render.com/docs)

---

## Support

For issues or questions:
- Check Firebase Console logs
- Review NestJS application logs
- Check hosting platform logs
- Firebase Support: https://firebase.google.com/support

Good luck with your wedding app! 🎉