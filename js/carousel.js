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

function goToSlide(index, animate = true) {
    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.4s ease-in-out';

    track.style.transform = `translateX(-${index * 100}%)`;
    dots[currentIndex].classList.remove('active');
    dots[index].classList.add('active');
    currentIndex = index;
}

function nextSlide() {
    if (currentIndex == slides.length - 1) 
        goToSlide(0, false);
    else
        goToSlide(currentIndex + 1);
}

function prevSlide() {
    if (currentIndex == 0) 
        goToSlide(slides.length - 1, false);
    else
        goToSlide(currentIndex - 1);
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
        nextSlide(); 
    } else if (endX - startX > 50) {
        prevSlide();
    }
}, {passive: true});