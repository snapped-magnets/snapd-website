// Fade effect logic
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// Carousel Logic
const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');

let slides = [];
let dots = [];
let currentIndex = 0;

function imageExists(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
}


let loopResetIndex = null;

async function createCarousel() {
    let i = 1;
    
    while (true) {
        const exists = await imageExists(`pics/img${i}.jpg`);
        if (!exists) break;

        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        const img = document.createElement('img');
        img.src = `pics/img${i}.jpg`;
        img.alt = `תמונה ${i}`;
        img.draggable = false;

        slide.appendChild(img);
        track.appendChild(slide);
        
        i++; // Move to next image
    }

    slides = Array.from(track.children);
    if (slides.length === 0) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    track.style.transition = 'none';
    track.style.transform = 'translateX(-100%)';

    createDots();
}

function createDots() {
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    dots = Array.from(dotsContainer.children);
}

createCarousel();

function goToSlide(index) {
    currentIndex = index;
    track.style.transition = 'transform 0.4s ease-in-out';
    track.style.transform = `translateX(${-(currentIndex + 1) * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
}

function nextSlide() {
    if (currentIndex < slides.length - 1) {
        goToSlide(currentIndex + 1);
    } else {
        currentIndex = 0;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        loopResetIndex = 0;
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(${-(slides.length + 1) * 100}%)`;
    }
}

function prevSlide() {
    if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
    } else {
        currentIndex = slides.length - 1;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
        loopResetIndex = slides.length - 1;
        track.style.transition = 'transform 0.4s ease-in-out';
        track.style.transform = 'translateX(0%)';
    }
}

track.addEventListener('transitionend', () => {
    if (loopResetIndex === null) return;

    track.style.transition = 'none';
    track.style.transform = `translateX(${-(loopResetIndex + 1) * 100}%)`;
    loopResetIndex = null;
});

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
