# Firebase Setup Checklist

Use this checklist to track your Firebase setup progress.

## Phase 1: Firebase Project Creation

- [ ] 1. Go to [firebase.google.com](https://firebase.google.com)
- [ ] 2. Sign in with Google account
- [ ] 3. Click "Get Started"
- [ ] 4. Click "Create a project"
- [ ] 5. Enter project name: "GIANT MINDS"
- [ ] 6. Select your country/region
- [ ] 7. Click "Create project"
- [ ] 8. Wait for project to finish creating (1-2 min)

**Status:** ⏳ Waiting

---

## Phase 2: Enable Firebase Services

### Firestore Database
- [ ] 1. In Firebase console, click "Firestore Database" (left sidebar)
- [ ] 2. Click "Create database"
- [ ] 3. Select location closest to you
- [ ] 4. Click "Next"
- [ ] 5. Select "Production mode" (not test mode)
- [ ] 6. Click "Enable"
- [ ] 7. Database created successfully ✅

### Authentication
- [ ] 1. Click "Authentication" (left sidebar)
- [ ] 2. Click "Get started"
- [ ] 3. Click "Email/Password"
- [ ] 4. Toggle "Enable"
- [ ] 5. Click "Save"
- [ ] 6. Go to "Users" tab
- [ ] 7. Click "Add user"
- [ ] 8. Enter your email address
- [ ] 9. Enter a strong password (8+ characters)
- [ ] 10. Click "Add user"
- [ ] 11. User created successfully ✅

### Cloud Storage
- [ ] 1. Click "Storage" (left sidebar)
- [ ] 2. Click "Get started"
- [ ] 3. Select same location as Firestore
- [ ] 4. Click "Done"
- [ ] 5. Storage bucket created ✅

**Status:** ⏳ Services enabled

---

## Phase 3: Set Security Rules

### Firestore Rules
- [ ] 1. Click "Firestore Database"
- [ ] 2. Click "Rules" tab
- [ ] 3. Delete all existing text
- [ ] 4. Copy-paste this:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{document=**} {
      allow read, write, delete: if request.auth != null;
    }
  }
}
```
- [ ] 5. Click "Publish"
- [ ] 6. Wait for "Rules updated" message ✅

### Storage Rules
- [ ] 1. Click "Storage"
- [ ] 2. Click "Rules" tab
- [ ] 3. Delete all existing text
- [ ] 4. Copy-paste this:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write, delete: if request.auth != null;
    }
  }
}
```
- [ ] 5. Click "Publish"
- [ ] 6. Wait for "Rules updated" message ✅

**Status:** ⏳ Rules configured

---

## Phase 4: Get Firebase Config

- [ ] 1. Click gear icon (⚙️) in top right
- [ ] 2. Click "Project Settings"
- [ ] 3. Scroll down to "Your apps" section
- [ ] 4. Click `</>` icon (Web app)
- [ ] 5. Enter app name: "GIANT MINDS Web"
- [ ] 6. Check "Also set up Firebase Hosting" (optional but recommended)
- [ ] 7. Click "Register app"
- [ ] 8. Copy the entire `firebaseConfig` object
- [ ] 9. **IMPORTANT:** Save this config somewhere safe (you need it in next phase)

**Your config looks like:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "giant-minds-xxx.firebaseapp.com",
  projectId: "giant-minds-xxx",
  storageBucket: "giant-minds-xxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxx"
};
```

**Status:** ✅ Config copied

---

## Phase 5: Update Project Files

### Update firebase-forms.js
- [ ] 1. Open `firebase-forms.js` in text editor
- [ ] 2. Find line with `const firebaseConfig = {`
- [ ] 3. Select the entire config object (from `{` to `}`; lines with `apiKey` through `appId`)
- [ ] 4. Delete the old config
- [ ] 5. Paste YOUR config from Phase 4
- [ ] 6. Save the file (Ctrl+S)
- [ ] 7. Verify your config is there ✅

### Update admin.html
- [ ] 1. Open `admin.html` in text editor
- [ ] 2. Find line with `const firebaseConfig = {`  (should be near line 218)
- [ ] 3. Select the entire config object (same as above)
- [ ] 4. Delete the old config
- [ ] 5. Paste SAME config from Phase 4
- [ ] 6. Save the file (Ctrl+S)
- [ ] 7. Verify your config is there ✅

**Status:** ✅ Both files updated

---

## Phase 6: Test Everything

### Test Candidate Form
- [ ] 1. Open your website in browser
- [ ] 2. Navigate to "Contact Candidates" page
- [ ] 3. Fill out all required fields:
  - [ ] Full Name: (your name)
  - [ ] Email: (your email)
  - [ ] Phone: (your phone)
  - [ ] Career Field: (select one)
  - [ ] Career Goals: (write something)
  - [ ] Resume: (upload a test file - PDF, DOC, or DOCX)
- [ ] 4. Click "Submit Your Profile"
- [ ] 5. See success message "Application Received!" ✅
- [ ] 6. Form should reset after 3 seconds ✅

### Test Partner Form
- [ ] 1. Navigate to "Contact Partners" page
- [ ] 2. Fill out all required fields:
  - [ ] Your Name: (your name)
  - [ ] Company: (test company)
  - [ ] Email: (your email)
  - [ ] Partner Type: (select one)
  - [ ] Needs: (write something)
  - [ ] Document: (optional - upload test file)
- [ ] 3. Click "Submit Partnership Inquiry"
- [ ] 4. See success message ✅

### Check Firebase Console
- [ ] 1. Go back to Firebase Console in browser
- [ ] 2. Click "Firestore Database"
- [ ] 3. You should see a "submissions" collection ✅
- [ ] 4. Click on submissions to see your test data ✅
- [ ] 5. Expand one submission to verify all fields ✅

### Test Admin Panel
- [ ] 1. Open `admin.html` in browser (or `yoursite.com/admin.html`)
- [ ] 2. You should see login screen
- [ ] 3. Enter your email (from Phase 2)
- [ ] 4. Enter your password (from Phase 2)
- [ ] 5. Click "Sign In"
- [ ] 6. Should see admin dashboard ✅
- [ ] 7. Statistics should show:
  - [ ] Total: 2 (or more if you submitted multiple)
  - [ ] Candidates: 1 (or more)
  - [ ] Partners: 1 (or more)
- [ ] 8. Table should show your submissions ✅

### Test Admin Features
- [ ] 1. Click "View" button on a submission ✅
- [ ] 2. Modal opens showing all details ✅
- [ ] 3. If file was uploaded, click "Download" ✅
- [ ] 4. File downloads successfully ✅
- [ ] 5. Close modal (click X button) ✅
- [ ] 6. Click "Refresh" button ✅
- [ ] 7. Data refreshes ✅
- [ ] 8. Try filtering by type (Candidate/Partner) ✅
- [ ] 9. Click "Export CSV" ✅
- [ ] 10. CSV file downloads ✅
- [ ] 11. Click "Export JSON" ✅
- [ ] 12. JSON file downloads ✅
- [ ] 13. Try deleting a submission (click Delete) ✅
- [ ] 14. Click OK to confirm delete ✅
- [ ] 15. Submission removed from table ✅
- [ ] 16. Click "Logout" ✅
- [ ] 17. Back to login screen ✅

**Status:** ✅ All tests passed!

---

## ✅ Setup Complete!

You're now ready to:
- ✅ Collect candidate applications
- ✅ Collect partner inquiries
- ✅ Store documents securely
- ✅ Manage submissions in admin panel
- ✅ Export data to CSV/JSON
- ✅ Scale up to 1000+ submissions/month

---

## 🔐 Important Notes

- **Keep your Firebase config secure** - Don't share it publicly
- **Strong password** - Use 8+ characters with mix of letters/numbers/symbols
- **Backup data** - Export your data monthly as backup
- **Review regularly** - Check admin panel at least weekly
- **Security rules** - Keep them as-is unless you know Firebase well

---

## 📞 Troubleshooting

**Stuck on a step?** Check these:

1. **Can't create project?**
   - Use a personal Google account (not work email sometimes blocked)
   - Try in private browser window
   - Check internet connection

2. **Services not appearing?**
   - Refresh browser (F5)
   - Make sure you're in correct project (check project name at top)
   - Wait 1-2 minutes, Firebase can be slow

3. **Config not working in files?**
   - Double-check you copied ENTIRE config object
   - Make sure both files have exact same config
   - Verify no extra/missing commas or quotes
   - Try copying config again

4. **Forms not submitting?**
   - Check browser console (F12 > Console tab) for errors
   - Verify Firebase config is correct
   - Make sure all Firebase services are enabled
   - Try test submission with form validation OFF (remove required)

5. **Admin panel not loading?**
   - Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Check browser console for errors
   - Verify you're using email/password from Phase 2
   - Clear browser cookies (Settings > Clear browsing data)

---

**See documentation files for more detailed help:**
- FIREBASE_SETUP.md
- FIREBASE_IMPLEMENTATION.md
- BACKEND_OPTIONS.md
