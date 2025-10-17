/*
  ============================================
  LET'S TALK SOLUTIONS — MOBILE MENU
  ============================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNavList = document.querySelector('.main-nav__list');
  
  if (mobileMenuToggle && mainNavList) {
    mobileMenuToggle.addEventListener('click', () => {
      // Toggle aria-expanded attribute
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      
      // Toggle data-visible attribute on nav list
      mainNavList.setAttribute('data-visible', !isExpanded);
      
      // Trap focus when menu is open
      if (!isExpanded) {
        // Focus first link when menu opens
        const firstLink = mainNavList.querySelector('.main-nav__link');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const isClickInsideMenu = mainNavList.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      
      if (!isClickInsideMenu && !isClickOnToggle && isExpanded) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNavList.setAttribute('data-visible', 'false');
      }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (event) => {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      
      if (event.key === 'Escape' && isExpanded) {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNavList.setAttribute('data-visible', 'false');
        mobileMenuToggle.focus();
      }
    });
    
    // Close menu when clicking a nav link
    const navLinks = mainNavList.querySelectorAll('.main-nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mainNavList.setAttribute('data-visible', 'false');
      });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth > 768) {
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
          mainNavList.setAttribute('data-visible', 'false');
        }
      }, 250);
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80; // Height of sticky header
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add scroll-based header shadow
  const siteHeader = document.querySelector('.site-header');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      siteHeader.style.boxShadow = 'var(--shadow-md)';
    } else {
      siteHeader.style.boxShadow = 'var(--shadow-sm)';
    }
    
    lastScroll = currentScroll;
  });
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right').forEach(el => {
    el.style.opacity = '0';
    if (el.classList.contains('slide-up')) {
      el.style.transform = 'translateY(20px)';
    } else if (el.classList.contains('slide-in-left')) {
      el.style.transform = 'translateX(-20px)';
    } else if (el.classList.contains('slide-in-right')) {
      el.style.transform = 'translateX(20px)';
    }
    observer.observe(el);
  });
});