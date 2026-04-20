# FormSubmit.co Integration Setup Guide

Your GIANT MINDS contact forms are now configured to use **FormSubmit.co** for collecting submissions with file uploads. This is a **no-code solution** - forms work immediately without any setup!

## How It Works

FormSubmit.co automatically captures all form submissions and sends them to your email. **No signup required** - just add your email to the form!

## Step 1: Add Your Email to Forms

1. Open `contact-candidate.html`
2. Find the form line starting with `<form id="candidate-form"`
3. Add `email` attribute with your email address:
   ```html
   <form id="candidate-form" action="https://formspree.io/f/meqnwbod" method="POST" enctype="multipart/form-data" email="your-email@gmail.com">
   ```

4. Open `contact-partner.html`
5. Find the form line starting with `<form id="partner-form"`
6. Add same email attribute:
   ```html
   <form id="partner-form" action="https://formspree.io/f/meqnwbod" method="POST" enctype="multipart/form-data" email="your-email@gmail.com">
   ```

**Replace `your-email@gmail.com` with your actual email address**

## Step 2: Test the Forms

1. Open your website in a browser
2. Navigate to "Contact Candidates" page
3. Fill out the form completely
4. Upload a test file
5. Click "Submit Your Profile"
6. You should receive an email with all the data + file attachment

## Features

✅ **File Uploads**
- Candidates upload resume (PDF, DOC, DOCX - max 5MB)
- Partners upload documents (PDF, DOC, DOCX, JPG, PNG - max 10MB)

✅ **Email Notifications**
- Instant email to your inbox with all form data
- Files sent as email attachments
- No spam filtering needed

✅ **Form Validation**
- Required field indicators (*)
- Client-side file size validation
- Email validation

✅ **Mobile Responsive**
- Perfect on all devices
- Custom file input styling

## FormSubmit.co Features

### Completely Free:
- ✅ Unlimited forms
- ✅ Unlimited submissions
- ✅ File attachments
- ✅ Email forwarding
- ✅ No registration needed

### How to Customize (Advanced):

If you want to redirect users to a thank you page after submission, add:
```html
<input type="hidden" name="_next" value="https://yourdomain.com/thank-you.html" />
```

To disable spam protection:
```html
<input type="hidden" name="_captcha" value="false" />
```

## Important: Verify Submissions

When you submit your first form:
1. You'll receive an email from FormSubmit.co
2. Click the **"Verify"** button in the email
3. After verification, future submissions arrive automatically

## Troubleshooting

**Not receiving emails?**
- Check spam/junk folder
- Make sure email attribute is correct in the form tag
- Verify you clicked the confirmation link in the first email

**Files not attaching?**
- File must be under size limit (5MB candidate, 10MB partner)
- Check file format is accepted
- Ensure `enctype="multipart/form-data"` is in form tag

**Form not submitting?**
- Check browser console (F12 → Console) for errors
- Verify email attribute is added to form
- Make sure JavaScript is enabled

## Current Configuration

**Candidate Form:**
- Endpoint: `https://formspree.io/f/meqnwbod`
- Fields: Name, Email, Phone, Career Field, Career Goals, Resume

**Partner Form:**
- Endpoint: `https://formspree.io/f/meqnwbod` 
- Fields: Name, Company, Email, Partner Type, Needs, Document (optional)

## Next Steps

1. Add your email to both form tags (see Step 1 above)
2. Upload your website to your hosting
3. Test both forms with your email
4. Start receiving candidate and partner submissions!

---

**Questions?** Visit [FormSubmit.co](https://formsubmit.co) for more info.

