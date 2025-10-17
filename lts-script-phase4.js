/* ============================================
   LT.Solutions Website JavaScript - Phase 4
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  /* ============================================
     1. MOBILE MENU TOGGLE
     ============================================ */
// Mobile Navigation (supports both .nav__* and your existing .site-nav*)
const navToggle = document.querySelector('.nav__toggle, .mobile-menu-toggle');
const navMenu   = document.querySelector('.nav__menu, #site-nav-list, .site-nav__list');

if (navToggle && navMenu) {
  const setExpanded = (on) => {
    navToggle.setAttribute('aria-expanded', on ? 'true' : 'false');
    navMenu.classList.toggle('active', on);
  };
  navToggle.addEventListener('click', () => setExpanded(!navMenu.classList.contains('active')));

  // Close on link click
  navMenu.querySelectorAll('.nav__link, .site-nav__link').forEach(a =>
    a.addEventListener('click', () => setExpanded(false))
  );

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('active')) return;
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) setExpanded(false);
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) setExpanded(false);
  });

  // Close on resize to desktop
  const mq = window.matchMedia('(min-width: 992px)');
  (mq.addEventListener ? mq.addEventListener : mq.addListener).call(mq, 'change', () => setExpanded(false));
}
  
  /* ============================================
     2. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Don't prevent default for empty hash or just "#"
      if (href === '#' || href === '') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  /* ============================================
     3. SCROLL REVEAL ANIMATION
     ============================================ */
  const revealElements = document.querySelectorAll('.reveal');
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optionally unobserve after revealing
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // If reduced motion preferred, show all elements immediately
    revealElements.forEach(el => el.classList.add('active'));
  }
  
  /* ============================================
     4. ACTIVE NAV HIGHLIGHTING
     ============================================ */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__link');
  
  function highlightNavOnScroll() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('nav__link--active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('nav__link--active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);
  
  /* ============================================
     5. HEADER SHADOW ON SCROLL
     ============================================ */
  const header = document.querySelector('.site-header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  /* ============================================
     6. FORM VALIDATION
     ============================================ */
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    // Real-time validation
    const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Clear error on input
      input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
          this.classList.remove('error');
          const errorElement = this.parentElement.querySelector('.form-error');
          if (errorElement) {
            errorElement.classList.remove('visible');
          }
        }
      });
    });
    
    // Validate on submit
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      formInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        // Form is valid - show success message
        showFormSuccess();
        
        // In Phase 5, this will be replaced with actual form submission
        console.log('Form would be submitted with data:', new FormData(contactForm));
      } else {
        // Focus first error field
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
        }
      }
    });
  }
  
  /* ============================================
     FORM VALIDATION HELPER FUNCTIONS
     ============================================ */
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (optional - if field has name="phone")
    else if (field.name === 'phone' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    // Minimum length check for textareas
    else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Please provide more detail (minimum 10 characters)';
    }
    
    // Show/hide error
    if (!isValid) {
      field.classList.add('error');
      showFieldError(field, errorMessage);
    } else {
      field.classList.remove('error');
      hideFieldError(field);
    }
    
    return isValid;
  }
  
  function showFieldError(field, message) {
    let errorElement = field.parentElement.querySelector('.form-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
  
  function hideFieldError(field) {
    const errorElement = field.parentElement.querySelector('.form-error');
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
  }
  
  function showFormSuccess() {
    const form = document.querySelector('.contact-form');
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div style="
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        text-align: center;
      ">
        <strong>Thank you!</strong> Your message has been received. We'll get back to you soon.
      </div>
    `;
    
    // Insert at top of form
    form.insertBefore(successMessage, form.firstChild);
    
    // Reset form
    form.reset();
    
    // Remove success message after 5 seconds
    setTimeout(function() {
      successMessage.remove();
    }, 5000);
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  
  /* ============================================
     7. ADD SCROLL REVEAL CLASSES TO ELEMENTS
     ============================================ */
  // Automatically add 'reveal' class to main content sections
  // This can be customized based on which elements you want to animate
  
  const elementsToReveal = [
    '.service-card',
    '.value-card',
    '.phase-card',
    '.project-highlight',
    '.principle-card',
    '.industry-card',
    '.content-block',
    '.feature-box'
  ];
  
  elementsToReveal.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      // Add reveal class if not already present
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        // Add stagger delay for multiple items
        el.style.transitionDelay = `${index * 0.1}s`;
      }
    });
  });
  
  /* ============================================
     8. INITIALIZE EVERYTHING
     ============================================ */
  console.log('LT.Solutions website initialized! 🚀');
  
});