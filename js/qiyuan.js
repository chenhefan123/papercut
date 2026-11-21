
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');
const navItems = document.querySelectorAll('.nav-item');

hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});

overlay.addEventListener('click', function () {
    closeMenu();
});

navItems.forEach(function (item) {
    item.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    });
});

function closeMenu() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

let touchStartX = 0;
let touchEndX = 0;

mobileNav.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

mobileNav.addEventListener('touchend', function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > 50) {
        closeMenu();
    }
}

mobileNav.addEventListener('touchmove', function (e) {
    e.stopPropagation();
}, { passive: true });
