
const slide = document.querySelector('#slide');
const items = Array.from(document.querySelectorAll('#slide .item'));
const container = document.querySelector('.container');
const s_buttons = document.querySelectorAll('.s_buttton');

let currentIndex = 0;
let timer = null;

function updateCarousel() {
    const total = items.length;
    items.forEach((item) => {
        item.classList.remove('main', 'next-1', 'next-2', 'next-3');
    });

    const main = items[currentIndex];
    const next1 = items[(currentIndex + 1) % total];
    const next2 = items[(currentIndex + 2) % total];
    const next3 = items[(currentIndex + 3) % total];

    main.classList.add('main');
    next1.classList.add('next-1');
    next2.classList.add('next-2');
    next3.classList.add('next-3');
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
}

function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, 2600);
}

function stopAuto() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

s_buttons[1].addEventListener('click', nextSlide);
s_buttons[0].addEventListener('click', prevSlide);

container.addEventListener('mouseenter', stopAuto);
container.addEventListener('mouseleave', startAuto);
container.addEventListener('touchstart', stopAuto, { passive: true });
container.addEventListener('touchend', startAuto, { passive: true });

updateCarousel();
startAuto();

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('.nav-item');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

overlay.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

const paperCuttingRoot = document.querySelector('.paper-cutting');
if (paperCuttingRoot) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = paperCuttingRoot.querySelectorAll(
        '.timeline-item, .craft-card, .gallery-item'
    );

    animatedElements.forEach(function (el) {
        observer.observe(el);
    });

    const galleryItems = paperCuttingRoot.querySelectorAll('.gallery-item');
    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            console.log('Gallery item selected:', this.querySelector('.gallery-item-text').textContent);
        });
    });

    const parallaxSections = paperCuttingRoot.querySelectorAll('.parallax-section');

    function handleParallax() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

        parallaxSections.forEach(section => {
            const bg = section.querySelector('.parallax-bg');
            if (!bg) return;

            const rect = section.getBoundingClientRect();
            const offsetTop = rect.top + scrollY;
            const height = rect.height || section.offsetHeight || 1;
            const speed = parseFloat(bg.getAttribute('data-speed')) || 0.3;

            const progress = (scrollY - offsetTop + height) / (height * 2);
            const clamped = Math.max(0, Math.min(1, progress));
            const translateY = (clamped - 0.5) * height * speed;

            bg.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });
    }

    window.addEventListener('scroll', handleParallax, { passive: true });
    window.addEventListener('load', handleParallax);
    window.addEventListener('resize', () => {
        setTimeout(handleParallax, 100);
    });
}
