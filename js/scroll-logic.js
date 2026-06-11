// Fade effect logic
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
        else entry.target.classList.remove('show');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Navigation links hide-on-scroll logic for mobile
let lastScrollY = window.scrollY;
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    // Only apply this logic on screens smaller than 768px
    if (window.innerWidth <= 768) {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // Scrolling down - hide only links
            navLinks.classList.add('header-hidden');
        } else {
            // Scrolling up - show links
            navLinks.classList.remove('header-hidden');
        }
        lastScrollY = currentScrollY;
    } else {
        // Ensure links are visible on desktop
        navLinks.classList.remove('header-hidden');
    }
});