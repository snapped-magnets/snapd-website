// Fade effect logic
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// Carousel Logic
const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const dotsContainer = document.querySelector('.carousel-dots');

// Generate dots
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);
let currentIndex = 0;

function goToSlide(index) {
    currentIndex = index;
    // In RTL, positive translateX moves content right, revealing items on the left
    track.style.transform = `translateX(${currentIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

function prevSlide() {
    if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
    } else {
        goToSlide(0); // חזרה להתחלה
    }
}

function nextSlide() {
    if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else {
        goToSlide(slides.length - 1); // קפיצה לסוף
    }
}

document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Swipe Support for Mobile (Touch Events)
let startX = 0;
track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
}, {passive: true});

track.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        nextSlide(); // החלקה שמאלה - מעבר לתמונה הבאה
    } else if (endX - startX > 50) {
        prevSlide(); // החלקה ימינה - חזרה לתמונה הקודמת
    }
}, {passive: true});
