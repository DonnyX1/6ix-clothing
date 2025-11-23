// 6IX Clothing Brand - Animations JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initial animations for elements above the fold
    setTimeout(function() {
        document.querySelectorAll('.fade-in').forEach(element => {
            element.classList.add('active');
        });
    }, 100);
    
    // Scroll animations
    const fadeUpElements = document.querySelectorAll('.fade-up');
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Animate elements when they enter the viewport
    function animateOnScroll() {
        fadeUpElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        scrollRevealElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('revealed');
            }
        });
    }
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Image hover effect for product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.product-image img');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.product-image img');
            if (img) {
                img.style.transform = '';
            }
        });
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            
            // Only apply parallax if not on mobile
            if (window.innerWidth > 768) {
                hero.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.4}px)`;
            } else {
                hero.style.backgroundPositionY = '';
            }
        });
    }
    
    // Button hover effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const x = e.clientX - button.getBoundingClientRect().left;
            const y = e.clientY - button.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect if it doesn't exist
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Page transition effect
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-exit');
    });
    
    // Counter animation for numbers
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500; // ms
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        if (isInViewport(counter)) {
            updateCounter();
        } else {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            
            observer.observe(counter);
        }
    });
}); 