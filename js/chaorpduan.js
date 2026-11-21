
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

const videoPoster = document.getElementById('videoPoster');
const mainVideo = document.getElementById('mainVideo');

videoPoster.addEventListener('click', function () {
    videoPoster.classList.add('hidden');
    mainVideo.play();
});

mainVideo.addEventListener('ended', function () {
    videoPoster.classList.remove('hidden');
    mainVideo.currentTime = 0;
});

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobileDevice()) {
    mainVideo.setAttribute('playsinline', '');
    mainVideo.setAttribute('webkit-playsinline', '');
}

document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        mainVideo.pause();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        if (mainVideo.paused) {
            videoPoster.classList.add('hidden');
            mainVideo.play();
        } else {
            mainVideo.pause();
        }
    }

    if (e.code === 'Escape') {
        closeMenu();
    }

    if (e.code === 'ArrowRight') {
        mainVideo.currentTime += 5;
    }
    if (e.code === 'ArrowLeft') {
        mainVideo.currentTime -= 5;
    }

    if (e.code === 'ArrowUp') {
        e.preventDefault();
        mainVideo.volume = Math.min(1, mainVideo.volume + 0.1);
    }
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        mainVideo.volume = Math.max(0, mainVideo.volume - 0.1);
    }
});

mainVideo.addEventListener('error', function (e) {
    console.error('Video failed to load:', e);
    videoPoster.innerHTML = `
        <div style="text-align: center; color: #ffe7dc;">
            <p style="font-size: 24px; margin-bottom: 15px;">⚠️</p>
            <p style="font-size: 16px;">The video could not be loaded</p>
            <p style="font-size: 14px; opacity: 0.7; margin-top: 10px;">Please check your network connection or refresh the page and try again</p>
        </div>
    `;
});
