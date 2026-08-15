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

// 7. Interactive Career Analytics Tab Switcher
const careerData = {
    fico: {
        path: "M 0 32 L 20 27 L 40 21 L 60 14 L 80 8 L 100 3",
        dots: [32, 27, 21, 14, 8, 3],
        salary: 165000,
        interviews: 24,
        date: "Monday, April 22nd"
    },
    mm: {
        path: "M 0 34 L 20 29 L 40 23 L 60 17 L 80 12 L 100 6",
        dots: [34, 29, 23, 17, 12, 6],
        salary: 148000,
        interviews: 18,
        date: "Wednesday, April 24th"
    },
    sd: {
        path: "M 0 33 L 20 28 L 40 22 L 60 15 L 80 10 L 100 4",
        dots: [33, 28, 22, 15, 10, 4],
        salary: 158000,
        interviews: 21,
        date: "Friday, April 26th"
    }
};

let currentCareerTab = 'fico';

function animateValue(element, start, end, duration, formatFn) {
    let startTime = null;
    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(start + (end - start) * ease);
        element.textContent = formatFn ? formatFn(current) : current;
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = formatFn ? formatFn(end) : end;
        }
    }
    requestAnimationFrame(step);
}

function switchCareerTab(tabKey) {
    if (currentCareerTab === tabKey) return;
    const data = careerData[tabKey];
    if (!data) return;

    // Toggle button active states
    const btnFico = document.getElementById('btn-fico');
    const btnMm = document.getElementById('btn-mm');
    const btnSd = document.getElementById('btn-sd');
    const buttons = { fico: btnFico, mm: btnMm, sd: btnSd };

    Object.keys(buttons).forEach(key => {
        const btn = buttons[key];
        if (btn) {
            if (key === tabKey) {
                btn.className = "flex-1 py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm bg-white text-[#024d69]";
            } else {
                btn.className = "flex-1 py-2 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all duration-300 text-gray-500 hover:text-gray-900";
            }
        }
    });

    // Morph SVG line path
    const pathEl = document.getElementById('career-chart-path');
    if (pathEl) {
        pathEl.setAttribute('d', data.path);
    }

    // Animate SVG dots
    const dots = document.querySelectorAll('.chart-dot');
    dots.forEach((dot, index) => {
        if (data.dots[index] !== undefined) {
            dot.setAttribute('cy', data.dots[index]);
        }
    });

    // Update date
    const dateEl = document.getElementById('career-stat-date');
    if (dateEl) {
        dateEl.textContent = data.date;
    }

    // Count transitions for salary
    const salaryEl = document.getElementById('career-stat-salary');
    if (salaryEl) {
        const startVal = parseInt(salaryEl.getAttribute('data-val') || '165000');
        salaryEl.setAttribute('data-val', data.salary);
        animateValue(salaryEl, startVal, data.salary, 600, val => '₹' + val.toLocaleString('en-IN'));
    }

    // Count transitions for interviews
    const interviewsEl = document.getElementById('career-stat-interviews');
    if (interviewsEl) {
        const startVal = parseInt(interviewsEl.getAttribute('data-val') || '24');
        interviewsEl.setAttribute('data-val', data.interviews);
        animateValue(interviewsEl, startVal, data.interviews, 600);
    }

    currentCareerTab = tabKey;
}

// =============================================
// ENROLLMENT MODAL & WHATSAPP REDIRECT
// =============================================
const WHATSAPP_NUMBER = '918220227915';

function openEnrollModal(courseName) {
    const modal = document.getElementById('enroll-modal');
    const card = document.getElementById('enroll-modal-card');
    const courseLabel = document.getElementById('enroll-modal-course');
    const courseInput = document.getElementById('enroll-course');

    if (!modal || !card) return;

    courseLabel.textContent = courseName;
    courseInput.value = courseName;

    // Reset form
    const form = document.getElementById('enroll-form');
    if (form) form.reset();

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Animate card in
    requestAnimationFrame(() => {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    });
}

function closeEnrollModal() {
    const modal = document.getElementById('enroll-modal');
    const card = document.getElementById('enroll-modal-card');

    if (!modal || !card) return;

    // Animate card out
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

function saveLeadToStorage(leadData) {
    try {
        const existingLeads = JSON.parse(localStorage.getItem('enlightlead_leads') || '[]');
        existingLeads.push(leadData);
        localStorage.setItem('enlightlead_leads', JSON.stringify(existingLeads));
    } catch (e) {
        console.error('Failed to save lead:', e);
    }
}

// Bind event listeners on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const btnFico = document.getElementById('btn-fico');
    const btnMm = document.getElementById('btn-mm');
    const btnSd = document.getElementById('btn-sd');

    if (btnFico) btnFico.addEventListener('click', () => switchCareerTab('fico'));
    if (btnMm) btnMm.addEventListener('click', () => switchCareerTab('mm'));
    if (btnSd) btnSd.addEventListener('click', () => switchCareerTab('sd'));

    // =============================================
    // PHONE NUMBER VALIDATION
    // =============================================
    function isDummyPhoneNumber(phone) {
        if (!phone) return false;
        // Must be exactly 10 digits
        if (!/^\d{10}$/.test(phone)) return true;
        // Indian numbers must start with 6, 7, 8, or 9
        if (!/^[6-9]/.test(phone)) return true;
        // Check for common sequential numbers
        const sequential = ['0123456789', '1234567890', '9876543210'];
        if (sequential.includes(phone)) return true;
        // Check for 10 repeating digits (e.g., 0000000000)
        if (/^(\d)\1{9}$/.test(phone)) return true;
        return false;
    }

    function attachPhoneValidation(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.addEventListener('input', () => {
            const val = input.value.replace(/\D/g, ''); // strip non-digits if any
            if (val.length === 10 && isDummyPhoneNumber(val)) {
                input.setCustomValidity('Please enter a valid real mobile number.');
            } else if (val.length > 0 && !/^[6-9]/.test(val)) {
                input.setCustomValidity('Number must start with 6, 7, 8, or 9.');
            } else {
                input.setCustomValidity('');
            }
        });
    }

    attachPhoneValidation('enroll-phone');
    attachPhoneValidation('contact-phone');

    // =============================================
    // ENROLLMENT FORM → WHATSAPP REDIRECT
    // =============================================
    const enrollForm = document.getElementById('enroll-form');
    if (enrollForm) {
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('enroll-name').value.trim();
            const phone = document.getElementById('enroll-phone').value.trim();
            const email = document.getElementById('enroll-email').value.trim();
            const course = document.getElementById('enroll-course').value;

            // Save lead to localStorage
            const leadData = {
                type: 'enrollment',
                name,
                phone: '+91' + phone,
                email,
                course,
                timestamp: new Date().toISOString()
            };
            saveLeadToStorage(leadData);

            // Build WhatsApp message
            const message = `Hi Enlightlead! 👋\n\nI'm interested in the *${course}* course.\n\n📋 My Details:\n• Name: ${name}\n• Phone: +91 ${phone}\n• Email: ${email}\n\nPlease share the course details, upcoming batch schedule, and fee structure. Thank you!`;

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

            // Close modal and redirect
            closeEnrollModal();
            setTimeout(() => {
                window.open(waUrl, '_blank');
            }, 350);
        });
    }

    // Close modal on backdrop click
    const enrollModal = document.getElementById('enroll-modal');
    if (enrollModal) {
        enrollModal.addEventListener('click', (e) => {
            if (e.target === enrollModal) {
                closeEnrollModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEnrollModal();
        }
    });

    // =============================================
    // CONTACT FORM HANDLER (with lead saving)
    // =============================================
    const contactForm = document.getElementById('contact-form');
    const successState = document.getElementById('contact-success');
    const resetBtn = document.getElementById('btn-contact-reset');

    if (contactForm && successState) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Save contact lead data
            const formData = new FormData(contactForm);
            const contactLead = {
                type: 'contact',
                name: formData.get('name') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                subject: formData.get('subject') || '',
                message: formData.get('message') || '',
                timestamp: new Date().toISOString()
            };
            saveLeadToStorage(contactLead);

            // Animate success overlay entrance
            successState.classList.remove('hidden');
            setTimeout(() => {
                successState.classList.remove('scale-95', 'opacity-0');
                successState.classList.add('scale-100', 'opacity-100');
            }, 10);
        });
    }

    if (resetBtn && contactForm && successState) {
        resetBtn.addEventListener('click', () => {
            contactForm.reset();
            successState.classList.remove('scale-100', 'opacity-100');
            successState.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                successState.classList.add('hidden');
            }, 500);
        });
    }

    // =============================================
    // USER REVIEWS / TESTIMONIALS CAROUSEL & FILTERING
    // =============================================
    const reviewTrack = document.getElementById('reviews-track');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    const filterBtns = document.querySelectorAll('.review-filter-btn');

    if (reviewTrack) {
        let currentIndex = 0;

        function getVisibleCardCount() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }

        function updateCarouselPosition() {
            const visibleCards = Array.from(reviewTrack.querySelectorAll('.review-card')).filter(card => !card.classList.contains('hidden'));
            const totalVisible = visibleCards.length;
            const perView = getVisibleCardCount();
            const maxIndex = Math.max(0, totalVisible - perView);

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            if (perView === 1) {
                // On mobile, translate by card width (100%) + gap (24px)
                reviewTrack.style.transform = `translateX(calc(-${currentIndex} * (100% + 24px)))`;
            } else if (perView === 2) {
                // On tablet, translate by card width (50% - 12px) + gap (24px) = 50% + 12px
                reviewTrack.style.transform = `translateX(calc(-${currentIndex} * (50% + 12px)))`;
            } else {
                // On desktop, translate by card width (33.333% - 16px) + gap (24px) = 33.333% + 8px
                reviewTrack.style.transform = `translateX(calc(-${currentIndex} * (33.333% + 8px)))`;
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const visibleCards = Array.from(reviewTrack.querySelectorAll('.review-card')).filter(card => !card.classList.contains('hidden'));
                const perView = getVisibleCardCount();
                const maxIndex = Math.max(0, visibleCards.length - perView);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateCarouselPosition();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const visibleCards = Array.from(reviewTrack.querySelectorAll('.review-card')).filter(card => !card.classList.contains('hidden'));
                const perView = getVisibleCardCount();
                const maxIndex = Math.max(0, visibleCards.length - perView);
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex;
                }
                updateCarouselPosition();
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-[#03688d]', 'text-white', 'shadow-md', 'shadow-[#03688d]/20');
                    b.classList.add('bg-white/70', 'text-gray-600', 'border', 'border-gray-200', 'hover:text-[#03688d]');
                });
                btn.classList.add('active', 'bg-[#03688d]', 'text-white', 'shadow-md', 'shadow-[#03688d]/20');
                btn.classList.remove('bg-white/70', 'text-gray-600', 'border', 'border-gray-200', 'hover:text-[#03688d]');

                const filter = btn.getAttribute('data-filter');
                const cards = reviewTrack.querySelectorAll('.review-card');

                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });

                currentIndex = 0;
                updateCarouselPosition();
            });
        });

        window.addEventListener('resize', updateCarouselPosition);
    }

    // =============================================
    // CUSTOM GLASSMORPHIC DROPDOWN SELECT HANDLER
    // =============================================
    const selectTrigger = document.getElementById('custom-select-trigger');
    const selectMenu = document.getElementById('custom-select-menu');
    const selectArrow = document.getElementById('custom-select-arrow');
    const selectLabel = document.getElementById('custom-select-label');
    const hiddenInput = document.getElementById('contact-subject');
    const selectOptions = document.querySelectorAll('.custom-option');

    if (selectTrigger && selectMenu) {
        selectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !selectMenu.classList.contains('hidden');
            if (isOpen) {
                selectMenu.classList.add('hidden');
                selectArrow?.classList.remove('rotate-180');
            } else {
                selectMenu.classList.remove('hidden');
                selectArrow?.classList.add('rotate-180');
            }
        });

        selectOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = opt.getAttribute('data-value');
                const labelText = opt.querySelector('span')?.textContent || '';

                if (hiddenInput) hiddenInput.value = val;
                if (selectLabel) selectLabel.textContent = labelText;

                selectOptions.forEach(o => {
                    o.classList.remove('bg-[#f0faff]', 'text-[#024d69]');
                    const check = o.querySelector('.check-icon');
                    if (check) check.classList.add('hidden');
                });

                opt.classList.add('bg-[#f0faff]', 'text-[#024d69]');
                const activeCheck = opt.querySelector('.check-icon');
                if (activeCheck) activeCheck.classList.remove('hidden');

                selectMenu.classList.add('hidden');
                selectArrow?.classList.remove('rotate-180');
            });
        });

        document.addEventListener('click', () => {
            selectMenu.classList.add('hidden');
            selectArrow?.classList.remove('rotate-180');
        });
    }
});

function popupCourseCard(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add visual popup effect
        card.classList.add('scale-[1.03]', 'ring-4', 'ring-[#03688d]/50', 'z-50');
        setTimeout(() => {
            card.classList.remove('scale-[1.03]', 'ring-4', 'ring-[#03688d]/50', 'z-50');
        }, 1500);
    }
}
