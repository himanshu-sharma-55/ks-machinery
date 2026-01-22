// ===================================
// Navigation & Mobile Menu
// ===================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Scroll Animations (AOS-like) - Fast Loading
// ===================================
const observerOptions = {
    threshold: 0.01,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    // Immediately show cards that are in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('aos-animate');
    } else {
        observer.observe(el);
    }
});

// Also check on load in case elements are already visible
window.addEventListener('load', () => {
    document.querySelectorAll('[data-aos]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0 && !el.classList.contains('aos-animate')) {
            el.classList.add('aos-animate');
        }
    });
});

// ===================================
// Parallax Effects
// ===================================
const parallaxElements = document.querySelectorAll('.floating-shapes .shape');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// ===================================
// Simple Scroll Stacking Effect
// ===================================
const stackingSections = Array.from(document.querySelectorAll('section:not(.hero)'));
const sectionZIndices = {
    'services': 10,
    'about': 9,
    'machines': 8,
    'trust': 7,
    'contact': 6
};

const handleScrollStacking = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    stackingSections.forEach((section, index) => {
        // Skip trust section - don't touch it at all
        if (section.classList.contains('trust') || section.getAttribute('id') === 'trust') {
            return; // Skip trust section completely
        }
        
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionId = section.getAttribute('id');
        const baseZIndex = sectionZIndices[sectionId] !== undefined ? sectionZIndices[sectionId] : (10 - index);
        
        // Simple logic: if section is in viewport, it's active
        const isInViewport = sectionTop < windowHeight && sectionTop > -section.offsetHeight;
        
        // Use translateZ(0) for GPU acceleration and prevent layout shifts
        if (isInViewport) {
            // Section is in viewport - full scale, no transform
            section.style.transform = 'translateZ(0) translateY(0)';
            section.style.zIndex = baseZIndex + 5; // Higher z-index when active
        } else if (sectionTop < 0) {
            // Section is above viewport - scrolled past
            section.style.transform = 'translateZ(0) translateY(0)';
            section.style.zIndex = baseZIndex;
        } else {
            // Section is below viewport - coming up (minimal transform to prevent scrollbar glitch)
            section.style.transform = 'translateZ(0) translateY(-10px)';
            section.style.zIndex = baseZIndex;
        }
    });
};

// Initialize stacking effect after page load to prevent glitch
let isPageLoaded = false;
window.addEventListener('load', () => {
    isPageLoaded = true;
    setTimeout(() => {
        handleScrollStacking();
    }, 100);
});

// Optimized scroll handler with debouncing
let ticking = false;
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    if (!isPageLoaded) return;
    
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Only update if scroll changed significantly to reduce glitches
    if (Math.abs(currentScrollTop - lastScrollTop) > 5) {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScrollStacking();
                lastScrollTop = currentScrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }
}, { passive: true });

// Also handle on resize
window.addEventListener('resize', () => {
    if (isPageLoaded) {
        handleScrollStacking();
    }
}, { passive: true });

// ===================================
// Counter Animation
// ===================================
const animateCounter = (element, target, duration = 2000) => {
    // Make element visible when animation starts
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            entry.target.classList.add('counted');
            animateCounter(entry.target, target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Check if stats are already visible on load (they're in hero section)
statNumbers.forEach(stat => {
    const rect = stat.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !stat.classList.contains('counted')) {
        const target = parseInt(stat.getAttribute('data-target'));
        stat.classList.add('counted');
        // Small delay to let page load
        setTimeout(() => {
            animateCounter(stat, target);
        }, 500);
    } else {
        statsObserver.observe(stat);
    }
});

// ===================================
// Form Handling - WhatsApp Integration
// ===================================
const contactForm = document.getElementById('contactForm');

// WhatsApp number - Update this with your actual WhatsApp business number
// Format: Country code + number (e.g., 911234567890 for India)
const WHATSAPP_NUMBER = '919834465930'; // Update this with actual number

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim()
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.service || !formData.message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Get service label
    const serviceOptions = {
        'offset': 'Offset Printing Machines',
        'prepress': 'Pre-Press Solutions',
        'press': 'Press Equipment',
        'postpress': 'Post-Press & Binding',
        'cutting': 'Cutting Machines',
        'bag': 'Bag Printing Machines',
        'other': 'Other'
    };
    const serviceLabel = serviceOptions[formData.service] || formData.service;
    
    // Format message for WhatsApp
    let whatsappMessage = `*New Inquiry from K.S Machinery Website*\n\n`;
    whatsappMessage += `*Name:* ${formData.name}\n`;
    whatsappMessage += `*Email:* ${formData.email}\n`;
    if (formData.phone) {
        whatsappMessage += `*Phone:* ${formData.phone}\n`;
    }
    whatsappMessage += `*Service Required:* ${serviceLabel}\n\n`;
    whatsappMessage += `*Message:*\n${formData.message}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    window.open(whatsappURL, '_blank');
    
    // Show success message
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp...';
    submitButton.style.background = '#25D366';
    submitButton.disabled = true;
    
    // Reset form
    contactForm.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
        submitButton.disabled = false;
    }, 3000);
    
    // Log form data
    console.log('Form submitted to WhatsApp:', formData);
});

// ===================================
// Active Navigation Link
// ===================================
const navSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    navSections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ===================================
// Cursor Effect (Optional Enhancement)
// ===================================
const createCursorEffect = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .machine-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
};

// Uncomment to enable cursor effect
// createCursorEffect();

// ===================================
// Scroll Progress Indicator (Optional)
// ===================================
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Uncomment to enable scroll progress
// createScrollProgress();

// ===================================
// Lazy Loading Images (if images are added later)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Typing Effect for Hero Title (Optional Enhancement)
// ===================================
const createTypingEffect = () => {
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';
        
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, index * 1000);
    });
};

// Uncomment to enable typing effect
// createTypingEffect();

// ===================================
// Service Card Tilt Effect
// ===================================
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===================================
// Initialize on DOM Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize all animations
    console.log('KS Machinery website loaded successfully!');
});

// ===================================
// Performance Optimization
// ===================================
// Throttle scroll events (using different variable name to avoid conflict)
let scrollTicking = false;
const optimizedScroll = () => {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            // All scroll-based animations here
            scrollTicking = false;
        });
        scrollTicking = true;
    }
};

// Use optimized scroll for better performance
window.addEventListener('scroll', optimizedScroll, { passive: true });

