# Job Pool Feature - Implementation Documentation

Complete guide for building a Job Pool page with Firebase. Implement this after Firebase setup is complete.

---

## 📋 Feature Overview

### What is the Job Pool?
A public-facing page that displays all job postings submitted by companies/partners. Candidates can browse, search, filter, and apply to jobs.

### User Flow:
```
Partner Submits Job
        ↓
Job Stored in Firestore
        ↓
Job Published in Job Pool
        ↓
Candidates Browse Jobs
        ↓
Candidates Apply to Jobs
        ↓
Admin Tracks Applications
```

---

## 🏗️ Architecture

### Database Collections:

```
Firestore Database Structure:

├── submissions (existing)
│   └── [Candidate & Partner forms]
│
├── jobs (NEW)
│   ├── job_001
│   │   ├── id: "job_001"
│   │   ├── title: "Senior React Developer"
│   │   ├── company: "TechCorp Inc"
│   │   ├── description: "We're looking for..."
│   │   ├── requirements: ["React", "Node.js", "MongoDB"]
│   │   ├── salary_min: 80000
│   │   ├── salary_max: 120000
│   │   ├── location: "New York, NY"
│   │   ├── job_type: "Full-time"
│   │   ├── experience_level: "Senior"
│   │   ├── status: "published" | "draft" | "closed"
│   │   ├── posted_date: timestamp
│   │   ├── deadline: timestamp
│   │   ├── applications: 5
│   │   ├── views: 150
│   │   └── company_id: "company_xyz"
│   │
│   └── job_002
│       └── [similar structure]
│
├── job_applications (NEW)
│   ├── app_001
│   │   ├── job_id: "job_001"
│   │   ├── candidate_email: "john@email.com"
│   │   ├── candidate_name: "John Doe"
│   │   ├── status: "pending" | "reviewed" | "shortlisted" | "rejected"
│   │   ├── applied_date: timestamp
│   │   ├── resume_url: "gs://..."
│   │   └── notes: "admin notes"
│   │
│   └── app_002
│       └── [similar structure]
│
└── companies (OPTIONAL)
    ├── company_xyz
    │   ├── name: "TechCorp Inc"
    │   ├── logo_url: "gs://..."
    │   ├── website: "www.techcorp.com"
    │   ├── description: "Leading tech company..."
    │   ├── industry: "Technology"
    │   ├── size: "500-1000"
    │   ├── contact_email: "hr@techcorp.com"
    │   └── verified: true
    │
    └── company_abc
        └── [similar structure]
```

---

## 📁 Files to Create

### 1. **`jobs.html`** - Job Pool Display Page
Main public page showing all available jobs with search/filter capabilities.

### 2. **`js/job-pool.js`** - Job Display Logic
JavaScript for loading, filtering, and displaying jobs from Firebase.

### 3. **`js/job-submit.js`** - Job Submission Handler
Handles job posting submission from partner form.

### 4. **`css/job-pool.css`** (OPTIONAL)
Custom styling for job pool page (or add to existing style.css).

### 5. **Modified `contact-partner.html`**
Add job posting fields to partner form.

### 6. **Modified `admin.html`**
Add job management section to admin dashboard.

---

## 🔧 Implementation Steps

### Step 1: Update Firestore Security Rules

Add these rules to allow job data storage:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Existing submissions collection
    match /submissions/{document=**} {
      allow read, write, delete: if request.auth != null;
    }
    
    // NEW: Jobs collection (public read, authenticated write)
    match /jobs/{document=**} {
      allow read: if true; // Everyone can read published jobs
      allow write, delete: if request.auth != null; // Only authenticated users can write
    }
    
    // NEW: Job applications (authenticated only)
    match /job_applications/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // NEW: Companies directory (public read)
    match /companies/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 2: Create `jobs.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GIANT MINDS - Job Pool</title>
  <link rel="stylesheet" href="style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <style>
    /* See "jobs.html CSS" section below for full styling */
  </style>
</head>
<body>
  <!-- Navigation (reuse from index.html) -->
  <!-- Header section -->
  
  <!-- Hero Section -->
  <section class="hero job-pool-hero">
    <div class="container">
      <h1>Job Opportunities</h1>
      <p>Browse open positions from top companies</p>
    </div>
  </section>

  <!-- Main Content -->
  <div class="container job-pool-container">
    <!-- Sidebar: Filters -->
    <aside class="job-filters">
      <h3>Filter Jobs</h3>
      
      <!-- Search Bar -->
      <div class="filter-group">
        <label>Search</label>
        <input type="text" id="searchInput" placeholder="Job title or company..." />
      </div>

      <!-- Job Type Filter -->
      <div class="filter-group">
        <label>Job Type</label>
        <label><input type="checkbox" value="Full-time" class="filter-checkbox" data-filter="job_type" /> Full-time</label>
        <label><input type="checkbox" value="Part-time" class="filter-checkbox" data-filter="job_type" /> Part-time</label>
        <label><input type="checkbox" value="Contract" class="filter-checkbox" data-filter="job_type" /> Contract</label>
        <label><input type="checkbox" value="Internship" class="filter-checkbox" data-filter="job_type" /> Internship</label>
      </div>

      <!-- Experience Level Filter -->
      <div class="filter-group">
        <label>Experience Level</label>
        <label><input type="checkbox" value="Entry" class="filter-checkbox" data-filter="experience_level" /> Entry Level</label>
        <label><input type="checkbox" value="Mid" class="filter-checkbox" data-filter="experience_level" /> Mid Level</label>
        <label><input type="checkbox" value="Senior" class="filter-checkbox" data-filter="experience_level" /> Senior</label>
        <label><input type="checkbox" value="Executive" class="filter-checkbox" data-filter="experience_level" /> Executive</label>
      </div>

      <!-- Salary Range Filter -->
      <div class="filter-group">
        <label>Salary Range</label>
        <input type="range" id="salaryMin" min="0" max="200000" step="10000" value="0" />
        <input type="range" id="salaryMax" min="0" max="200000" step="10000" value="200000" />
        <p>$<span id="salaryMinDisplay">0</span> - $<span id="salaryMaxDisplay">200000</span></p>
      </div>

      <!-- Location Filter (if applicable) -->
      <div class="filter-group">
        <label>Location</label>
        <label><input type="checkbox" value="Remote" class="filter-checkbox" data-filter="location" /> Remote</label>
        <label><input type="checkbox" value="On-site" class="filter-checkbox" data-filter="location" /> On-site</label>
        <label><input type="checkbox" value="Hybrid" class="filter-checkbox" data-filter="location" /> Hybrid</label>
      </div>

      <!-- Reset Filters -->
      <button id="resetFilters" class="reset-btn">Reset Filters</button>
    </aside>

    <!-- Main Content: Job Listings -->
    <main class="job-listings">
      <!-- Sort Options -->
      <div class="sort-options">
        <label>Sort by:</label>
        <select id="sortBy">
          <option value="recent">Most Recent</option>
          <option value="applications">Most Applied</option>
          <option value="salary">Highest Salary</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      <!-- Jobs Container -->
      <div id="jobsContainer" class="jobs-grid">
        <!-- Jobs will be loaded here by JavaScript -->
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      </div>

      <!-- No Results Message -->
      <div id="noResults" class="no-results" style="display: none;">
        <i class="fas fa-search"></i>
        <h3>No jobs found</h3>
        <p>Try adjusting your filters</p>
      </div>
    </main>
  </div>

  <!-- Job Details Modal -->
  <div id="jobModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2 id="modalJobTitle"></h2>
        <button class="close-btn">&times;</button>
      </div>
      <div id="modalBody"></div>
      <div class="modal-footer">
        <button id="applyBtn" class="apply-btn">Apply Now</button>
        <button class="close-modal-btn">Close</button>
      </div>
    </div>
  </div>

  <!-- Footer (reuse from index.html) -->

  <!-- Firebase Scripts -->
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
  <script src="firebase-forms.js"></script>
  
  <!-- Job Pool Logic -->
  <script src="js/job-pool.js"></script>
</body>
</html>
```

### Step 3: Create `js/job-pool.js`

```javascript
// ===== JOB POOL FUNCTIONALITY =====

// State
let allJobs = [];
let filteredJobs = [];
let currentFilters = {
  search: "",
  job_type: [],
  experience_level: [],
  location: [],
  salary_min: 0,
  salary_max: 200000
};

// DOM Elements
const jobsContainer = document.getElementById("jobsContainer");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const sortBy = document.getElementById("sortBy");
const resetFiltersBtn = document.getElementById("resetFilters");
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");
const salaryMinInput = document.getElementById("salaryMin");
const salaryMaxInput = document.getElementById("salaryMax");
const salaryMinDisplay = document.getElementById("salaryMinDisplay");
const salaryMaxDisplay = document.getElementById("salaryMaxDisplay");
const jobModal = document.getElementById("jobModal");
const modalBody = document.getElementById("modalBody");
const applyBtn = document.getElementById("applyBtn");
const closeModalBtn = document.querySelector(".close-btn");

// ===== LOAD JOBS =====
async function loadJobs() {
  try {
    jobsContainer.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    const snapshot = await db.collection("jobs")
      .where("status", "==", "published")
      .orderBy("posted_date", "desc")
      .get();

    allJobs = [];
    snapshot.forEach(doc => {
      allJobs.push({ id: doc.id, ...doc.data() });
    });

    filteredJobs = [...allJobs];
    displayJobs();
  } catch (error) {
    console.error("Error loading jobs:", error);
    jobsContainer.innerHTML = '<p>Error loading jobs. Please try again.</p>';
  }
}

// ===== DISPLAY JOBS =====
function displayJobs() {
  if (filteredJobs.length === 0) {
    jobsContainer.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  
  jobsContainer.innerHTML = filteredJobs.map(job => `
    <div class="job-card" onclick="openJobModal('${job.id}')">
      <div class="job-header">
        <h3>${escapeHtml(job.title)}</h3>
        <span class="job-type ${job.job_type.toLowerCase()}">${job.job_type}</span>
      </div>
      
      <p class="job-company">
        <i class="fas fa-building"></i> ${escapeHtml(job.company)}
      </p>
      
      <p class="job-description">${escapeHtml(job.description.substring(0, 150))}...</p>
      
      <div class="job-meta">
        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        <span><i class="fas fa-briefcase"></i> ${job.experience_level}</span>
      </div>
      
      <div class="job-footer">
        <p class="job-salary">$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}</p>
        <p class="job-applications">
          <i class="fas fa-users"></i> ${job.applications || 0} applications
        </p>
      </div>
      
      <button class="job-apply-btn">View & Apply</button>
    </div>
  `).join("");
}

// ===== FILTER LOGIC =====
function applyFilters() {
  filteredJobs = allJobs.filter(job => {
    // Search filter
    const searchLower = currentFilters.search.toLowerCase();
    if (searchLower && 
        !job.title.toLowerCase().includes(searchLower) &&
        !job.company.toLowerCase().includes(searchLower) &&
        !job.description.toLowerCase().includes(searchLower)) {
      return false;
    }

    // Job type filter
    if (currentFilters.job_type.length > 0 && 
        !currentFilters.job_type.includes(job.job_type)) {
      return false;
    }

    // Experience level filter
    if (currentFilters.experience_level.length > 0 && 
        !currentFilters.experience_level.includes(job.experience_level)) {
      return false;
    }

    // Location filter
    if (currentFilters.location.length > 0 && 
        !currentFilters.location.includes(job.location)) {
      return false;
    }

    // Salary filter
    if (job.salary_min > currentFilters.salary_max || 
        job.salary_max < currentFilters.salary_min) {
      return false;
    }

    return true;
  });

  // Sort
  const sortValue = sortBy.value;
  if (sortValue === "salary") {
    filteredJobs.sort((a, b) => b.salary_max - a.salary_max);
  } else if (sortValue === "applications") {
    filteredJobs.sort((a, b) => (b.applications || 0) - (a.applications || 0));
  } else if (sortValue === "views") {
    filteredJobs.sort((a, b) => (b.views || 0) - (a.views || 0));
  }
  // Default: recent (already sorted by posted_date)

  displayJobs();
}

// ===== EVENT LISTENERS =====
searchInput.addEventListener("input", (e) => {
  currentFilters.search = e.target.value;
  applyFilters();
});

filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", (e) => {
    const filterType = e.target.dataset.filter;
    const value = e.target.value;

    if (e.target.checked) {
      currentFilters[filterType].push(value);
    } else {
      currentFilters[filterType] = currentFilters[filterType].filter(v => v !== value);
    }

    applyFilters();
  });
});

salaryMinInput.addEventListener("input", (e) => {
  currentFilters.salary_min = parseInt(e.target.value);
  salaryMinDisplay.textContent = parseInt(e.target.value).toLocaleString();
  applyFilters();
});

salaryMaxInput.addEventListener("input", (e) => {
  currentFilters.salary_max = parseInt(e.target.value);
  salaryMaxDisplay.textContent = parseInt(e.target.value).toLocaleString();
  applyFilters();
});

sortBy.addEventListener("change", () => {
  applyFilters();
});

resetFiltersBtn.addEventListener("click", () => {
  currentFilters = {
    search: "",
    job_type: [],
    experience_level: [],
    location: [],
    salary_min: 0,
    salary_max: 200000
  };

  searchInput.value = "";
  filterCheckboxes.forEach(cb => cb.checked = false);
  salaryMinInput.value = 0;
  salaryMaxInput.value = 200000;
  salaryMinDisplay.textContent = "0";
  salaryMaxDisplay.textContent = "200000";
  sortBy.value = "recent";

  applyFilters();
});

// ===== JOB DETAILS MODAL =====
async function openJobModal(jobId) {
  const job = allJobs.find(j => j.id === jobId);
  if (!job) return;

  // Increment view count
  try {
    await db.collection("jobs").doc(jobId).update({
      views: firebase.firestore.FieldValue.increment(1)
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }

  // Populate modal
  document.getElementById("modalJobTitle").textContent = job.title;
  
  modalBody.innerHTML = `
    <div class="job-detail">
      <div class="job-detail-header">
        <div>
          <h3>${escapeHtml(job.company)}</h3>
          <p class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
        </div>
        <div class="job-badges">
          <span class="badge ${job.job_type.toLowerCase()}">${job.job_type}</span>
          <span class="badge">${job.experience_level}</span>
        </div>
      </div>

      <div class="job-salary-section">
        <h4>Salary Range</h4>
        <p class="salary">$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()} per year</p>
      </div>

      <div class="job-description-section">
        <h4>Description</h4>
        <p>${escapeHtml(job.description).replace(/\n/g, "<br>")}</p>
      </div>

      <div class="job-requirements-section">
        <h4>Requirements</h4>
        <ul>
          ${job.requirements.map(req => `<li>${escapeHtml(req)}</li>`).join("")}
        </ul>
      </div>

      ${job.benefits ? `
        <div class="job-benefits-section">
          <h4>Benefits</h4>
          <ul>
            ${job.benefits.map(benefit => `<li>${escapeHtml(benefit)}</li>`).join("")}
          </ul>
        </div>
      ` : ""}

      <div class="job-info-section">
        <p><strong>Posted:</strong> ${new Date(job.posted_date.toDate()).toLocaleDateString()}</p>
        <p><strong>Applications:</strong> ${job.applications || 0}</p>
      </div>
    </div>
  `;

  // Set apply button to redirect to candidate form
  applyBtn.onclick = () => {
    // Pre-fill candidate form with job details
    localStorage.setItem("selectedJob", JSON.stringify({
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      description: job.description
    }));
    window.location.href = "contact-candidate.html?job=" + job.id;
  };

  jobModal.style.display = "flex";
}

// Close modal
closeModalBtn.addEventListener("click", () => {
  jobModal.style.display = "none";
});

jobModal.addEventListener("click", (e) => {
  if (e.target === jobModal) {
    jobModal.style.display = "none";
  }
});

document.querySelector(".close-modal-btn").addEventListener("click", () => {
  jobModal.style.display = "none";
});

// ===== UTILITY FUNCTIONS =====
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
loadJobs();
```

### Step 4: Add Job Submission to Partner Form

Update `contact-partner.html` form to include job posting section:

```html
<!-- Add this fieldset to contact-partner.html form -->
<fieldset class="form-fieldset">
  <legend class="form-legend">Post a Job Opportunity (Optional)</legend>
  
  <div class="form-group">
    <label for="is_posting_job">
      <input type="checkbox" id="is_posting_job" name="is_posting_job" />
      I want to post a job opportunity
    </label>
  </div>

  <!-- Job fields (hidden by default) -->
  <div id="jobFields" style="display: none;">
    <div class="form-group">
      <label for="job_title">Job Title <span class="required">*</span></label>
      <input type="text" id="job_title" name="job_title" placeholder="e.g., Senior React Developer" />
    </div>

    <div class="form-group">
      <label for="job_description">Job Description <span class="required">*</span></label>
      <textarea id="job_description" name="job_description" placeholder="Describe the role, responsibilities, etc." required></textarea>
    </div>

    <div class="form-group">
      <label for="job_type">Job Type <span class="required">*</span></label>
      <select id="job_type" name="job_type" required>
        <option value="">-- Select --</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
      </select>
    </div>

    <div class="form-group">
      <label for="experience_level">Experience Level <span class="required">*</span></label>
      <select id="experience_level" name="experience_level" required>
        <option value="">-- Select --</option>
        <option value="Entry">Entry Level</option>
        <option value="Mid">Mid Level</option>
        <option value="Senior">Senior</option>
        <option value="Executive">Executive</option>
      </select>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="salary_min">Minimum Salary <span class="required">*</span></label>
        <input type="number" id="salary_min" name="salary_min" placeholder="50000" required />
      </div>
      <div class="form-group">
        <label for="salary_max">Maximum Salary <span class="required">*</span></label>
        <input type="number" id="salary_max" name="salary_max" placeholder="150000" required />
      </div>
    </div>

    <div class="form-group">
      <label for="job_location">Location <span class="required">*</span></label>
      <input type="text" id="job_location" name="job_location" placeholder="e.g., New York, NY or Remote" required />
    </div>

    <div class="form-group">
      <label for="job_requirements">Required Skills (comma-separated) <span class="required">*</span></label>
      <input type="text" id="job_requirements" name="job_requirements" placeholder="e.g., React, Node.js, MongoDB" required />
    </div>

    <div class="form-group">
      <label for="job_benefits">Benefits (comma-separated, optional)</label>
      <input type="text" id="job_benefits" name="job_benefits" placeholder="e.g., Health insurance, Remote work, 401k" />
    </div>

    <div class="form-group">
      <label for="job_deadline">Application Deadline <span class="required">*</span></label>
      <input type="date" id="job_deadline" name="job_deadline" required />
    </div>
  </div>
</fieldset>

<!-- JavaScript to show/hide job fields -->
<script>
  const isPostingCheckbox = document.getElementById("is_posting_job");
  const jobFields = document.getElementById("jobFields");

  isPostingCheckbox.addEventListener("change", (e) => {
    jobFields.style.display = e.target.checked ? "block" : "none";
  });
</script>
```

### Step 5: Update `firebase-forms.js` to Handle Job Submissions

Add this to `firebase-forms.js`:

```javascript
// Add to the submitPartnerForm function
async function submitPartnerForm(event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // ... existing partner form code ...

    // Check if posting job
    const isPostingJob = document.getElementById("is_posting_job").checked;
    
    if (isPostingJob) {
      // Create job document
      const jobData = {
        title: document.getElementById("job_title").value,
        company: company, // from partner form
        description: document.getElementById("job_description").value,
        job_type: document.getElementById("job_type").value,
        experience_level: document.getElementById("experience_level").value,
        salary_min: parseInt(document.getElementById("salary_min").value),
        salary_max: parseInt(document.getElementById("salary_max").value),
        location: document.getElementById("job_location").value,
        requirements: document.getElementById("job_requirements").value.split(",").map(s => s.trim()),
        benefits: document.getElementById("job_benefits").value 
          ? document.getElementById("job_benefits").value.split(",").map(s => s.trim())
          : [],
        deadline: new Date(document.getElementById("job_deadline").value),
        posted_date: firebase.firestore.FieldValue.serverTimestamp(),
        status: "draft", // Admin must approve before publishing
        applications: 0,
        views: 0,
        company_id: email, // Use email as company identifier for now
        contact_email: email
      };

      // Save job to Firestore
      await db.collection("jobs").add(jobData);
      console.log("Job posted successfully");
    }

    // ... rest of existing code ...
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Error submitting form: " + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}
```

### Step 6: Update Admin Dashboard

Add job management section to `admin.html`:

```html
<!-- Add to admin dashboard tabs -->
<div class="admin-tabs">
  <button class="tab-btn active" data-tab="submissions">Submissions</button>
  <button class="tab-btn" data-tab="jobs">Job Postings</button>
  <button class="tab-btn" data-tab="applications">Job Applications</button>
</div>

<!-- Job Postings Tab -->
<div id="jobs-tab" class="tab-content" style="display: none;">
  <div class="controls">
    <button class="refresh-btn" onclick="loadJobs()">
      <i class="fas fa-sync-alt"></i> Refresh Jobs
    </button>
    <select id="jobStatusFilter">
      <option value="">All Statuses</option>
      <option value="draft">Draft (Pending Review)</option>
      <option value="published">Published</option>
      <option value="closed">Closed</option>
    </select>
  </div>

  <div class="table-container">
    <table id="jobsTable">
      <thead>
        <tr>
          <th>Job Title</th>
          <th>Company</th>
          <th>Status</th>
          <th>Applications</th>
          <th>Posted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="jobsTableBody">
      </tbody>
    </table>
  </div>
</div>
```

---

## 📊 Database Queries Reference

### Get Published Jobs:
```javascript
db.collection("jobs")
  .where("status", "==", "published")
  .orderBy("posted_date", "desc")
  .get()
```

### Get Jobs by Company:
```javascript
db.collection("jobs")
  .where("company", "==", "CompanyName")
  .get()
```

### Get Pending Jobs (for admin):
```javascript
db.collection("jobs")
  .where("status", "==", "draft")
  .get()
```

### Track Job Application:
```javascript
db.collection("job_applications").add({
  job_id: jobId,
  candidate_email: candidateEmail,
  applied_date: new Date(),
  status: "pending"
})
```

---

## 🎨 CSS Styling Guide

### Job Cards:
```css
.job-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.job-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.job-type {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
}

.job-type.full-time {
  background: #e3f2fd;
  color: #1976d2;
}

.job-type.part-time {
  background: #f3e5f5;
  color: #7b1fa2;
}
```

### Filter Sidebar:
```css
.job-filters {
  position: sticky;
  top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 250px;
}

.filter-group {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.filter-group label {
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
}

.filter-group input[type="checkbox"] {
  margin-right: 8px;
}
```

---

## 🔍 Search & Filter Features

### Implemented Filters:
- ✅ Text search (title, company, description)
- ✅ Job type (Full-time, Part-time, Contract, Internship)
- ✅ Experience level (Entry, Mid, Senior, Executive)
- ✅ Salary range slider
- ✅ Location (Remote, On-site, Hybrid)

### Sort Options:
- ✅ Most Recent
- ✅ Most Applications
- ✅ Highest Salary
- ✅ Most Viewed

### Advanced Features (Optional):
- Add saved jobs functionality
- Compare jobs side-by-side
- Set job alerts by email
- Export jobs as PDF
- Share jobs on social media

---

## 📱 Mobile Responsive Design

### Breakpoints:
```css
/* Tablet (768px and below) */
@media (max-width: 768px) {
  .job-pool-container {
    flex-direction: column;
  }
  
  .job-filters {
    width: 100%;
    position: static;
    margin-bottom: 20px;
  }
}

/* Mobile (576px and below) */
@media (max-width: 576px) {
  .job-card {
    padding: 15px;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📊 Admin Features for Jobs

### Job Management:
- [ ] View all job postings
- [ ] Approve/reject drafts
- [ ] Publish jobs
- [ ] Close/archive jobs
- [ ] Track applications per job
- [ ] View application details
- [ ] Message candidates
- [ ] Delete spam jobs

### Analytics:
- [ ] Total jobs posted
- [ ] Total applications
- [ ] Most applied jobs
- [ ] Most viewed jobs
- [ ] Jobs by company
- [ ] Application status breakdown

---

## 🚀 Implementation Checklist

### When Ready to Implement:
- [ ] Update Firestore security rules
- [ ] Create `jobs.html`
- [ ] Create `js/job-pool.js`
- [ ] Create `js/job-submit.js`
- [ ] Update `contact-partner.html` with job fields
- [ ] Update `firebase-forms.js` with job handling
- [ ] Add job management to `admin.html`
- [ ] Test all filters and search
- [ ] Test job posting workflow
- [ ] Test admin job approval
- [ ] Style and polish UI
- [ ] Mobile test on devices
- [ ] Deploy to production

---

## 📝 Notes

- Jobs start as "draft" and require admin approval before publishing
- View count increments each time a job details modal is opened
- Application count increments when a candidate applies
- Jobs can be soft-deleted (status = "closed") instead of hard-deleted
- Companies can be optional (can be just a name, no separate company collection)
- Future enhancement: Email notifications for job updates

---

## 🔗 Integration Points

### Connect to Existing Systems:
- **Candidate Form:** Pre-fill with job details when applying
- **Admin Dashboard:** Manage jobs alongside submissions
- **Email System:** Send job updates to subscribed candidates (future)
- **Analytics:** Track job pool engagement metrics

---

**Status:** Ready to implement after Firebase setup is complete!

**Estimated Implementation Time:** 4-6 hours for full featured job pool
