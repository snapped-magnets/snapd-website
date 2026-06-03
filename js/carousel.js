// Carousel Logic
const track = document.querySelector('.carousel-track');
const dotsContainer = document.querySelector('.carousel-dots');

// Create clones for seamless infinite looping
const originalSlides = Array.from(track.children);
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

// Append and prepend clones to DOM
track.appendChild(firstClone);
track.insertBefore(lastClone, originalSlides[0]);

// Update slides array to include clones
const slides = Array.from(track.children);

originalSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index + 1));
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);
let currentIndex = 1;
let startX = 0;
let currentX = 0;
let isDragging = false;
let isTransitioning = false;

track.style.transform = `translateX(-100%)`;

function getBaseTranslation(index = currentIndex) {
    return -(index * 100); 
}

function setActive(index) {
    let dotIndex = index - 1;
    if (index === 0) dotIndex = originalSlides.length - 1;
    else if (index === slides.length - 1) dotIndex = 0;

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[dotIndex]) dots[dotIndex].classList.add('active');
}

function goToSlide(index, animate = true) {
    if (isTransitioning) return;
    
    if (!animate) track.style.transition = 'none';
    else 
    {
        track.style.transition = 'transform 0.4s ease-in-out';
        isTransitioning = true;
    }

    track.style.transform = `translateX(${getBaseTranslation(index)}%)`;
    currentIndex = index;
    setActive(currentIndex);
}

track.addEventListener('transitionend', () => {
    isTransitioning = false;
    if (currentIndex === slides.length - 1) {
        track.style.transition = 'none';
        currentIndex = 1;
        track.style.transform = `translateX(${getBaseTranslation()}%)`;
    }

    if (currentIndex === 0) {
        track.style.transition = 'none';
        currentIndex = slides.length - 2;
        track.style.transform = `translateX(${getBaseTranslation()}%)`;
    }
});

function nextSlide() {
    if (isTransitioning) return;
    goToSlide(currentIndex + 1);
}

function prevSlide() {
    if (isTransitioning) return;
    goToSlide(currentIndex - 1);
}

document.querySelector('.next-btn').addEventListener('click', nextSlide);
document.querySelector('.prev-btn').addEventListener('click', prevSlide);

// Swipe Support for Mobile (Touch Events)
track.addEventListener('touchstart', e => {
    if (isTransitioning) return;
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
}, {passive: true});

track.addEventListener('touchmove', e => {
    if (!isDragging) return;
    
    currentX = e.touches[0].clientX;
    let diffX = currentX - startX;
    
    let trackWidth = track.offsetWidth;
    let dragPercentage = (diffX / trackWidth) * 100;
    
    let finalPercentage = getBaseTranslation() + dragPercentage;
    track.style.transform = `translateX(${finalPercentage}%)`;
});

track.addEventListener('touchend', e => { 
    if (!isDragging) return;
    isDragging = false;
    
    let endX = e.changedTouches[0].clientX; 
    let diffX = startX - endX;
    
    if (diffX > 50) nextSlide(); 
    else if (diffX < -50) prevSlide(); 
    else goToSlide(currentIndex);
});
