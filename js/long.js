

const modalOverlay = document.getElementById('modalOverlay');
const openModalBtn = document.querySelector('.open-modal-btn');
const closeBtn = document.getElementById('closeBtn');
const loginForm = document.getElementById('loginForm');
const successMessage = document.getElementById('successMessage');
const registerLink = document.getElementById('registerLink');
const welcomeUser = document.getElementById('welcomeUser');

const correctUsername = 'admin';
const correctPassword = '123456';

function checkCredentials(username, password) {
    return username === correctUsername && password === correctPassword;
}

function initLabelAnimation() {
    const labels = document.querySelectorAll('.hez1 label');
    labels.forEach(label => {
        const text = label.innerText.trim();
        label.innerHTML = text
            .split('')
            .map((letter, idx) => {
                if (letter === ' ') {
                    return `<span style="transition-delay:${idx * 50}ms">&nbsp;</span>`;
                }
                return `<span style="transition-delay:${idx * 50}ms">${letter}</span>`;
            })
            .join('');
    });
}

function resetLabels() {
    const inputs = document.querySelectorAll('.hez1 input');
    inputs.forEach(input => {
        input.value = '';
        input.blur();
    });
}

openModalBtn.addEventListener('click', function () {
    modalOverlay.style.display = 'flex';
    loginForm.reset();
    resetLabels();
    successMessage.style.display = 'none';
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 300);
});

closeBtn.addEventListener('click', function () {
    modalOverlay.style.display = 'none';
});

modalOverlay.addEventListener('click', function (event) {
    if (event.target === modalOverlay) {
        modalOverlay.style.display = 'none';
    }
});

registerLink.addEventListener('click', function (event) {
    event.preventDefault();
    alert('Registration is not available yet.\nPlease sign in with the demo account: admin / 123456');
});

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (checkCredentials(username, password)) {
        modalOverlay.style.display = 'none';
        welcomeUser.textContent = username;
        successMessage.style.display = 'block';
        window.location.href = 'index.html';
        setTimeout(function () {
            successMessage.style.display = 'none';
        }, 3000);
    } else {
        alert('Incorrect username or password. Please try again.\nHint: use admin / 123456');
        document.getElementById('password').value = '';
        document.getElementById('password').focus();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modalOverlay.style.display === 'flex') {
        modalOverlay.style.display = 'none';
    }
});

initLabelAnimation();
