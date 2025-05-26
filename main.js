// Main JavaScript for Worthy Advisors Website

// Global state
let currentTestimonial = 0;
let testimonialsInterval;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonialCards.length;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupNavigation();
    setupMobileMenu();
    setupScrollAnimations();
    setupTestimonialsCarousel();
    setupSmoothScrolling();
    setupFormValidation();
    handlePageLoad();
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    // Set active nav link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath ||
            (currentPath === '/' && href === 'index.html') ||
            (currentPath.includes(href.replace('.html', '')))) {
            link.classList.add('active');
        }
    });

    // Handle scroll effect on navigation
    let lastScrollTop = 0;
    const nav = document.getElementById('navigation');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class
        if (scrollTop > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerLines = mobileMenuBtn.querySelectorAll('.hamburger');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', function() {
        const isActive = mobileMenu.classList.contains('active');

        if (isActive) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            mobileMenu.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Scroll animations using Intersection Observer
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-up');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Testimonials carousel functionality
function setupTestimonialsCarousel() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');

    if (!track || !prevBtn || !nextBtn) return;

    // Initialize first testimonial
    showTestimonial(0);

    // Previous button
    prevBtn.addEventListener('click', function() {
        currentTestimonial = currentTestimonial === 0 ? totalTestimonials - 1 : currentTestimonial - 1;
        showTestimonial(currentTestimonial);
        restartAutoPlay();
    });

    // Next button
    nextBtn.addEventListener('click', function() {
        currentTestimonial = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
        showTestimonial(currentTestimonial);
        restartAutoPlay();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            restartAutoPlay();
        });
    });

    // Auto-play functionality
    startAutoPlay();

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
}

function showTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');

    // Hide all testimonials
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });

    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    // Show current testimonial
    if (testimonialCards[index]) {
        testimonialCards[index].classList.add('active');
    }

    // Activate current dot
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function startAutoPlay() {
    testimonialsInterval = setInterval(function() {
        currentTestimonial = currentTestimonial === totalTestimonials - 1 ? 0 : currentTestimonial + 1;
        showTestimonial(currentTestimonial);
    }, 5000);
}

function stopAutoPlay() {
    if (testimonialsInterval) {
        clearInterval(testimonialsInterval);
    }
}

function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form validation (for contact forms)
function setupFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(field);
                }
            });

            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            });

            if (isValid) {
                handleFormSubmission(form, data);
            }
        });
    });
}

function showFieldError(field, message) {
    clearFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';

    field.style.borderColor = '#dc3545';
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function handleFormSubmission(form, data) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#28a745';
            break;
        case 'error':
            notification.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.backgroundColor = '#154F75';
    }

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Handle page load
function handlePageLoad() {
    // Remove loading spinner if exists
    const loader = document.querySelector('.loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }

    // Initialize page-specific functionality
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'services.html':
            initializeServicesPage();
            break;
        case 'contact.html':
            initializeContactPage();
            break;
        case 'blogs.html':
            initializeBlogsPage();
            break;
        case 'careers.html':
            initializeCareersPage();
            break;
    }
}

// Page-specific initializations
function initializeHomePage() {
    // Add any homepage-specific functionality
    console.log('Home page initialized');
}

function initializeServicesPage() {
    // Add any services page-specific functionality
    console.log('Services page initialized');
}

function initializeContactPage() {
    // Add any contact page-specific functionality
    console.log('Contact page initialized');
}

function initializeBlogsPage() {
    // Add any blogs page-specific functionality
    console.log('Blogs page initialized');
}

function initializeCareersPage() {
    // Add any careers page-specific functionality
    console.log('Careers page initialized');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Analytics and tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // Add your analytics tracking code here
    console.log('Event tracked:', eventName, properties);
}

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send error reports to your analytics service here
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send error reports to your analytics service here
});

// Export functions for potential use in other scripts
window.WorthyAdvisors = {
    showNotification,
    trackEvent,
    showTestimonial,
    startAutoPlay,
    stopAutoPlay
};
