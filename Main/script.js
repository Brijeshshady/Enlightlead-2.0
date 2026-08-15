// 1. Intersection Observer for Scroll Reveals
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.05
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            
            // Trigger nested count-ups
            if (entry.target.classList.contains('counter-trigger') || entry.target.querySelector('.counter-stat')) {
                animateCounters(entry.target);
            }
            
            // Trigger radial SVG load
            if (entry.target.querySelector('.radial-progress-bar')) {
                animateRadialProgress(entry.target);
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Observe all reveal blocks
    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Auto trigger top-of-page elements in case observer misses
    setTimeout(() => {
        document.querySelectorAll('header, main .reveal-left, main .reveal-right').forEach(el => {
            el.classList.add('revealed');
        });
        // Trigger Hero counter immediately
        const heroCounterTrigger = document.querySelector('main .counter-trigger');
        if (heroCounterTrigger) {
            animateCounters(heroCounterTrigger);
            animateRadialProgress(heroCounterTrigger);
        }
    }, 300);
});

// 2. Typewriter Subheading text rotation carousel
const words = ["Career.", "Skills.", "Future.", "Success."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter-text');

function typeEffect() {
    if (!typewriterEl) return;
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 60 : 120;
    
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at complete word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 400; // Pause before typing next
    }
    
    setTimeout(typeEffect, typeSpeed);
}
if (typewriterEl) {
    setTimeout(typeEffect, 1200);
}

// 3. Stats Counter Animator
function animateCounters(container) {
    const counters = container.querySelectorAll('.counter-stat');
    counters.forEach(counter => {
        if (counter.classList.contains('counting-done')) return;
        counter.classList.add('counting-done');
        
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 1800; // 1.8 seconds duration
        const startTime = performance.now();
        const startValue = 0;
        
        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= duration) {
                counter.textContent = target;
                return;
            }
            const progress = elapsedTime / duration;
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
            counter.textContent = currentValue;
            requestAnimationFrame(updateCount);
        }
        requestAnimationFrame(updateCount);
    });
}

// 4. Circular Progress SVG Animator
function animateRadialProgress(container) {
    const progressBars = container.querySelectorAll('.radial-progress-bar');
    progressBars.forEach(bar => {
        if (bar.classList.contains('loaded')) return;
        bar.classList.add('loaded');
        
        const targetPercentage = parseFloat(bar.getAttribute('data-target-percentage')) || 92;
        const maxOffset = parseFloat(bar.getAttribute('data-offset-target')) || 201.06;
        
        // stroke-dashoffset = maxOffset - (maxOffset * percentage / 100)
        const finalOffset = maxOffset - (maxOffset * targetPercentage / 100);
        
        setTimeout(() => {
            bar.style.strokeDashoffset = finalOffset;
        }, 200);
    });
}

// 5. Ambient Mouse Glow Tracking Effect
document.addEventListener('mousemove', e => {
    document.querySelectorAll('.glow-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 6. Mobile Menu Toggle
const menuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuPath = document.getElementById('hamburger-icon-path');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } else {
            mobileMenu.classList.add('hidden');
            menuPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
        }
    });

    // Close menu when navigation links are clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (menuPath) {
                menuPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });
    });
}
