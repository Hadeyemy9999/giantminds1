# Firebase Setup Guide for GIANT MINDS

This guide will get you set up with Firebase for storing form submissions and managing an admin panel.

## Step 1: Create Firebase Project

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click **"Get Started"** or **"Sign In"** (use your Google account)
3. Click **"Create a project"**
4. Enter project name: `GIANT MINDS` (or your preference)
5. Select your country/region
6. Click **"Create project"**
7. Wait 1-2 minutes for project to be created

## Step 2: Set Up Firestore Database

1. In Firebase console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Choose location closest to you
4. Click **"Next"**
5. Security rules: Select **"Start in production mode"**
6. Click **"Enable"**
7. Database is now created (empty, ready for data)

## Step 3: Set Up Authentication

1. Click **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Click **"Email/Password"** provider
4. Enable it and click **"Save"**
5. Go to **"Users"** tab
6. Click **"Add user"**
7. Enter your email address
8. Create a strong password (you'll use this to log into admin panel)
9. Click **"Add user"**

## Step 4: Get Firebase Config

1. Click **"Project Settings"** (gear icon, top right)
2. Go to **"General"** tab
3. Scroll down to "Your apps" section
4. Click **"</>"** (Web app)
5. App nickname: `GIANT MINDS Web`
6. Check "Also set up Firebase Hosting"
7. Click **"Register app"**
8. Copy the entire config code (you'll paste this into your HTML)

**It will look like:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

Save this config somewhere safe!

## Step 5: Set Up Cloud Storage (for file uploads)

1. In Firebase console, click **"Storage"** (left sidebar)
2. Click **"Get started"**
3. Security rules: Keep defaults (we'll update them)
4. Click **"Done"**
5. Storage bucket created

## Step 6: Update Security Rules

### For Firestore Database:

1. Click **"Firestore Database"**
2. Click **"Rules"** tab
3. Replace all code with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin only - authenticated user can read/write all submissions
    match /submissions/{document=**} {
      allow read, write, delete: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

### For Cloud Storage:

1. Click **"Storage"**
2. Click **"Rules"** tab
3. Replace all code with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Admin only - authenticated user can upload/read files
    match /uploads/{allPaths=**} {
      allow read, write, delete: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

## Step 7: Verify Everything Works

1. Create a test document in Firestore:
   - Click **"Firestore Database"**
   - Click **"+ Start collection"**
   - Collection ID: `test`
   - Click **"Next"**
   - Click **"Auto ID"** to generate document ID
   - Add field: `message` : `"test"` (string)
   - Click **"Save"**

2. You should see the document in your database

## You're Ready!

Firebase is now configured with:
- ✅ Database (Firestore)
- ✅ Authentication (your email/password)
- ✅ File Storage (Cloud Storage)
- ✅ Security Rules (only you can access)

**Keep your Firebase Config safe** - you'll paste it into the admin panel HTML file.

---

## Troubleshooting

**Can't find Firestore?**
- Make sure you're in the correct Firebase project
- Check project name at top left of console

**Authentication not working?**
- Verify you created a user with your email
- Password should be strong (8+ characters)
- Try resetting password in Firebase console

**Need help?**
- Firebase docs: https://firebase.google.com/docs/firestore
- Authentication: https://firebase.google.com/docs/auth

---

## Next Steps

1. Complete all 7 steps above
2. Save your Firebase Config
3. I'll help you set up the admin panel and update forms to use Firebase
