// ===== FIREBASE CONFIGURATION =====
// Replace these values with your Firebase project details from:
// Firebase Console > Project Settings > General

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ===== FIREBASE FORM SUBMISSION FUNCTIONS =====

async function submitCandidateForm(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Get form data
    const name = document.getElementById("candidate_name").value;
    const email = document.getElementById("candidate_email").value;
    const phone = document.getElementById("candidate_phone").value || "";
    const careerField = document.getElementById("career_field").value;
    const careerGoals = document.getElementById("career_goals").value;
    const fileInput = document.getElementById("candidate_cv");

    // Validate file size (5MB)
    if (fileInput.files.length > 0) {
      const fileSizeMB = fileInput.files[0].size / (1024 * 1024);
      if (fileSizeMB > 5) {
        alert("File size exceeds 5MB limit");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
    }

    let fileUrl = "";
    let fileName = "";

    // Upload file if selected
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileName = file.name;
      const filePath = `uploads/candidates/${Date.now()}_${file.name}`;
      const storageRef = storage.ref(filePath);
      
      const snapshot = await storageRef.put(file);
      fileUrl = await snapshot.ref.getDownloadURL();
    }

    // Add to Firestore
    const submissionRef = await db.collection("submissions").add({
      type: "Candidate",
      name: name,
      email: email,
      phone: phone,
      career_field: careerField,
      career_goals: careerGoals,
      fileName: fileName,
      fileUrl: fileUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Show success message
    const form = document.getElementById("candidate-form");
    const successMessage = document.getElementById("success-message");
    form.style.display = "none";
    if (successMessage) {
      successMessage.style.display = "block";
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      form.style.display = "block";
      if (successMessage) successMessage.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 3000);

    console.log("Candidate submission successful:", submissionRef.id);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

async function submitPartnerForm(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // Get form data
    const name = document.getElementById("partner_name").value;
    const company = document.getElementById("partner_company").value;
    const email = document.getElementById("partner_email").value;
    const partnerType = document.getElementById("partner_type").value;
    const needs = document.getElementById("partner_needs").value;
    const fileInput = document.getElementById("partner_doc");

    // Validate file size (10MB) if file exists
    if (fileInput.files.length > 0) {
      const fileSizeMB = fileInput.files[0].size / (1024 * 1024);
      if (fileSizeMB > 10) {
        alert("File size exceeds 10MB limit");
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
    }

    let fileUrl = "";
    let fileName = "";

    // Upload file if selected
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileName = file.name;
      const filePath = `uploads/partners/${Date.now()}_${file.name}`;
      const storageRef = storage.ref(filePath);
      
      const snapshot = await storageRef.put(file);
      fileUrl = await snapshot.ref.getDownloadURL();
    }

    // Add to Firestore
    const submissionRef = await db.collection("submissions").add({
      type: "Partner",
      name: name,
      company: company,
      email: email,
      partner_type: partnerType,
      needs: needs,
      fileName: fileName,
      fileUrl: fileUrl,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Show success message
    const form = document.getElementById("partner-form");
    const successMessage = document.getElementById("success-message");
    form.style.display = "none";
    if (successMessage) {
      successMessage.style.display = "block";
    }

    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      form.style.display = "block";
      if (successMessage) successMessage.style.display = "none";
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }, 3000);

    console.log("Partner submission successful:", submissionRef.id);
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}
