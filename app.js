// Portfolio Website JavaScript

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const contactForm = document.getElementById('contact-form');

// Mobile Navigation Toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// Smooth scrolling for navigation links and CTA buttons
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    
    if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    closeMobileMenu();
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Navbar background opacity on scroll
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(19, 52, 59, 0.98)';
    } else {
        navbar.style.background = 'rgba(19, 52, 59, 0.95)';
    }
}

// Contact form validation and submission
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get('name') || formData.get('name').trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    // Email validation
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }
    
    // Subject validation
    if (!formData.get('subject') || formData.get('subject').trim().length < 3) {
        errors.push('Please enter a subject (at least 3 characters)');
    }
    
    // Message validation
    if (!formData.get('message') || formData.get('message').trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    return errors;
}

// Show form feedback
function showFormFeedback(message, isError = false) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback ${isError ? 'error' : 'success'}`;
    feedback.style.cssText = `
        margin-top: 16px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        animation: slideInFade 0.3s ease-out;
        ${isError 
            ? 'background-color: rgba(255, 84, 89, 0.1); color: var(--color-error); border: 1px solid rgba(255, 84, 89, 0.3);' 
            : 'background-color: rgba(33, 128, 141, 0.1); color: var(--color-success); border: 1px solid rgba(33, 128, 141, 0.3);'
        }
    `;
    feedback.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
    
    // Insert feedback after the form button
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.parentNode.appendChild(feedback);
    
    // Scroll feedback into view
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-remove after 7 seconds
    setTimeout(() => {
        if (feedback && feedback.parentNode) {
            feedback.style.animation = 'slideOutFade 0.3s ease-out';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 7000);
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormFeedback(errors[0], true);
        return;
    }
    
    // Get form elements
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        showFormFeedback('Thank you for your message! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
        
        // Create mailto link as fallback
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        const mailtoLink = `mailto:chinmaymahajan9998@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
        
        // Open default email client after a short delay
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 1000);
        
    }, 2000);
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.skill-card, .timeline-item, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Scroll to top functionality
function createScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-primary);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Toggle visibility on scroll
    window.addEventListener('scroll', toggleScrollToTop);
}

// Initialize typing effect for hero subtitle
function initTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const skills = ['Python', 'SQL', 'Power BI', 'Excel', 'Data Analysis'];
    let skillIndex = 0;
    
    // Only run typing effect on larger screens
    if (window.innerWidth > 768) {
        heroSubtitle.innerHTML = 'Data Analyst | <span class="typing-text"></span>';
        const typingElement = document.querySelector('.typing-text');
        
        function typeSkill() {
            const currentSkill = skills[skillIndex];
            let charIndex = 0;
            
            const typeInterval = setInterval(() => {
                typingElement.textContent = currentSkill.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentSkill.length) {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        eraseSkill();
                    }, 2000);
                }
            }, 100);
        }
        
        function eraseSkill() {
            const currentSkill = skills[skillIndex];
            let charIndex = currentSkill.length;
            
            const eraseInterval = setInterval(() => {
                typingElement.textContent = currentSkill.substring(0, charIndex);
                charIndex--;
                
                if (charIndex < 0) {
                    clearInterval(eraseInterval);
                    skillIndex = (skillIndex + 1) % skills.length;
                    setTimeout(typeSkill, 500);
                }
            }, 50);
        }
        
        // Start typing effect after page load
        setTimeout(() => {
            typeSkill();
        }, 2000);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Navigation events - attach to all navigation links and CTA buttons
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Attach smooth scroll to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Attach smooth scroll to CTA buttons
    const ctaButtons = document.querySelectorAll('a[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', smoothScroll);
    });
    
    // Contact form events
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNavLink();
                handleNavbarScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Initialize features
    createIntersectionObserver();
    createScrollToTop();
    initTypingEffect();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    // Add CSS animations for form feedback
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInFade {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideOutFade {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Prevent form submission on Enter key in input fields (except textarea)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.preventDefault();
        // Move to next field or submit if it's the last field
        const form = e.target.closest('form');
        if (form) {
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement && nextElement.type !== 'submit') {
                nextElement.focus();
            } else if (nextElement && nextElement.type === 'submit') {
                nextElement.click();
            }
        }
    }
});

// Add loading state to external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.hasAttribute('target')) {
        const link = e.target;
        
        // Only add loading state to specific external links
        if (link.href.includes('linkedin.com')) {
            link.style.opacity = '0.7';
            setTimeout(() => {
                link.style.opacity = '1';
            }, 300);
        }
    }
});

// Console welcome message
console.log('👋 Hello! Thanks for checking out my portfolio website.');
console.log('🚀 Built with vanilla HTML, CSS, and JavaScript');
console.log('💼 Contact me at: chinmaymahajan9998@gmail.com');

// Export functions for potential future use
window.portfolioApp = {
    updateActiveNavLink,
    handleNavbarScroll,
    toggleMobileMenu,
    closeMobileMenu,
    smoothScroll
};