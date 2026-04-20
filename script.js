document.addEventListener("DOMContentLoaded", () => {
  // --- Vision/Mission Carousel Functionality ---
  const carouselTrack = document.getElementById("carouselTrack");
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot:not([data-testimonial])");
  const prevBtn = document.getElementById("carouselPrev");
  const nextBtn = document.getElementById("carouselNext");
  
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Dot click navigation
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      currentSlide = parseInt(e.target.dataset.slide);
      updateCarousel();
    });
  });

  // --- Testimonials Carousel Functionality ---
  const testimonialsTrack = document.getElementById("testimonialsTrack");
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const testimonialDots = document.querySelectorAll(".dot[data-testimonial]");
  const testimonialsPrevBtn = document.getElementById("testimonialsPrev");
  const testimonialsNextBtn = document.getElementById("testimonialsNext");
  
  let currentTestimonial = 0;
  const totalTestimonials = testimonialSlides.length;

  function updateTestimonialsCarousel() {
    const offset = -currentTestimonial * 100;
    if (testimonialsTrack) {
      testimonialsTrack.style.transform = `translateX(${offset}%)`;
    }
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentTestimonial);
    });
  }

  function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
    updateTestimonialsCarousel();
  }

  function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
    updateTestimonialsCarousel();
  }

  if (testimonialsPrevBtn) testimonialsPrevBtn.addEventListener("click", prevTestimonial);
  if (testimonialsNextBtn) testimonialsNextBtn.addEventListener("click", nextTestimonial);

  // Testimonial dot click navigation
  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      currentTestimonial = parseInt(e.target.dataset.testimonial);
      updateTestimonialsCarousel();
    });
  });

  // --- NEW: Hamburger Menu Toggle ---
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.getElementById("main-nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when a link is clicked (crucial for mobile UX)
    document.querySelectorAll("#main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // 1. Sticky Navigation Bar Functionality
  const header = document.querySelector(".navbar");

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll);

  // 2. Scroll Reveal Animation for Sections
  const revealElements = document.querySelectorAll(
    ".section, .feature-card, .spoke-card, .benefit-col"
  );

  const observerOptions = {
    root: null, // relative to the viewport
    threshold: 0.1,
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((element) => {
    if (element.id !== "hero") {
      scrollObserver.observe(element);
    }
  });

  // 3. Active Navigation Highlighting
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar nav ul li a");

  const activeNavObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `.navbar nav ul li a[href="#${entry.target.id}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    },
    {
      root: null,
      threshold: 0.5,
      rootMargin: "-20% 0px -30% 0px",
    }
  );

  sections.forEach((section) => {
    activeNavObserver.observe(section);
  });

  // 4. File Size Validation (5MB for candidate, 10MB for partner)
  function validateFileSize(input, maxSizeMB) {
    if (input.files.length > 0) {
      const fileSizeMB = input.files[0].size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        alert(`File size exceeds ${maxSizeMB}MB limit. Please choose a smaller file.`);
        input.value = ""; // Clear the input
        return false;
      }
    }
    return true;
  }

  // Validate candidate resume (5MB)
  const candidateCV = document.getElementById("candidate_cv");
  if (candidateCV) {
    candidateCV.addEventListener("change", function () {
      validateFileSize(this, 5);
    });
  }

  // Validate partner document (10MB)
  const partnerDoc = document.getElementById("partner_doc");
  if (partnerDoc) {
    partnerDoc.addEventListener("change", function () {
      validateFileSize(this, 10);
    });
  }

  // 5. Unified Form Submission Handler (with Formspree integration)
  const successMessage = document.getElementById("success-message");

  // Check for CANDIDATE form
  const candidateForm = document.getElementById("candidate-form");
  if (candidateForm) {
    candidateForm.addEventListener("submit", function (e) {
      // Validate file before submission
      if (candidateCV && candidateCV.files.length > 0) {
        if (!validateFileSize(candidateCV, 5)) {
          e.preventDefault();
          return false;
        }
      }
      // Allow form to submit to Formspree (no preventDefault)
      // Form will redirect after successful submission
    });
  }

  // Check for PARTNER form
  const partnerForm = document.getElementById("partner-form");
  if (partnerForm) {
    partnerForm.addEventListener("submit", function (e) {
      // Validate file before submission (if present)
      if (partnerDoc && partnerDoc.files.length > 0) {
        if (!validateFileSize(partnerDoc, 10)) {
          e.preventDefault();
          return false;
        }
      }
      // Allow form to submit to Formspree (no preventDefault)
      // Form will redirect after successful submission
    });
  }

  // 5. File Input Display Enhancement
  const fileInputs = document.querySelectorAll("input[type='file']");
  fileInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const fileLabel = this.parentElement.querySelector(".file-input-label");
      if (this.files.length > 0) {
        // Show filename and file size
        const file = this.files[0];
        const fileSize = (file.size / 1024).toFixed(2); // Convert to KB
        fileLabel.textContent = `✓ ${file.name} (${fileSize} KB)`;
        fileLabel.style.color = "var(--color-primary)";
        this.parentElement.style.borderColor = "var(--color-primary)";
      } else {
        fileLabel.textContent = "Choose file";
        fileLabel.style.color = "#666";
        this.parentElement.style.borderColor = "#ddd";
      }
    });

    // Make file input clickable from label area
    const wrapper = input.parentElement;
    wrapper.addEventListener("click", function (e) {
      if (e.target !== input) {
        input.click();
      }
    });
  });

  // 6. Auto-update Copyright Year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
