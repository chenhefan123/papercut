
const segments = [
    { name: 'Home', subtitle: 'Gallery', color: '#c94a3a', url: './jies.html' },
    { name: 'Highlights', subtitle: 'Video', color: '#e6c45a', url: './chaorpduan.html' },
    { name: 'Origin', subtitle: 'History', color: '#2a7a8c', url: './qiyuan.html' },
    { name: 'Login', subtitle: 'Account', color: '#7a4a8a', url: './long.html' }
];

let currentIndex = 0;
let alignedIndex = -1;
let rotation = 0;
let isAnimating = false;

const donutWheel = document.getElementById('donutWheel');
const segmentsContainer = document.getElementById('segments');
const centerTitle = document.getElementById('centerTitle');
const centerSubtitle = document.getElementById('centerSubtitle');

const cx = 200, cy = 200;
const innerRadius = 72;
const outerRadius = 180;
const gap = 4;

function createSegmentPath(index) {
    const anglePerSegment = 90;
    const startAngle = -135 + index * anglePerSegment + gap / 2;
    const endAngle = -135 + (index + 1) * anglePerSegment - gap / 2;

    const startRad = startAngle * Math.PI / 180;
    const endRad = endAngle * Math.PI / 180;

    const outerStartX = cx + outerRadius * Math.cos(startRad);
    const outerStartY = cy + outerRadius * Math.sin(startRad);
    const outerEndX = cx + outerRadius * Math.cos(endRad);
    const outerEndY = cy + outerRadius * Math.sin(endRad);

    const innerStartX = cx + innerRadius * Math.cos(startRad);
    const innerStartY = cy + innerRadius * Math.sin(startRad);
    const innerEndX = cx + innerRadius * Math.cos(endRad);
    const innerEndY = cy + innerRadius * Math.sin(endRad);

    return `
        M ${outerStartX} ${outerStartY}
        A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}
        L ${innerEndX} ${innerEndY}
        A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}
        Z
    `;
}

function getTextPosition(index) {
    const anglePerSegment = 90;
    const midAngle = -135 + index * anglePerSegment + anglePerSegment / 2;
    const midRad = midAngle * Math.PI / 180;
    const textRadius = (innerRadius + outerRadius) / 2;

    let textAngle = midAngle + 90;
    if (midAngle >= 90 && midAngle < 270) {
        textAngle -= 180;
    }

    return {
        x: cx + textRadius * Math.cos(midRad),
        y: cy + textRadius * Math.sin(midRad),
        angle: textAngle
    };
}

function generateSegments() {
    segmentsContainer.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        const path = createSegmentPath(i);
        const textPos = getTextPosition(i);

        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.classList.add('segment');
        g.setAttribute('data-index', i);

        const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainPath.classList.add('segment-main');
        mainPath.setAttribute('d', path);
        mainPath.setAttribute('fill', `url(#img${i})`);
        mainPath.setAttribute('filter', 'url(#bevel)');

        const overlayPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        overlayPath.setAttribute('d', path);
        overlayPath.setAttribute('fill', 'rgba(0, 0, 0, 0.3)');
        overlayPath.setAttribute('pointer-events', 'none');

        const highlightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        highlightPath.setAttribute('d', path);
        highlightPath.setAttribute('fill', 'url(#highlight)');
        highlightPath.setAttribute('opacity', '0.4');
        highlightPath.setAttribute('pointer-events', 'none');

        const edgePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        edgePath.classList.add('segment-edge');
        edgePath.setAttribute('d', path);
        edgePath.setAttribute('fill', 'none');
        edgePath.setAttribute('stroke', 'url(#edge)');
        edgePath.setAttribute('stroke-width', '2.5');
        edgePath.setAttribute('pointer-events', 'none');

        const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        textGroup.setAttribute('transform', `rotate(${textPos.angle}, ${textPos.x}, ${textPos.y})`);
        textGroup.setAttribute('pointer-events', 'none');

        const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        textBg.setAttribute('cx', textPos.x);
        textBg.setAttribute('cy', textPos.y + 3);
        textBg.setAttribute('rx', '38');
        textBg.setAttribute('ry', '22');
        textBg.setAttribute('fill', 'rgba(0, 0, 0, 0.4)');
        textBg.setAttribute('filter', 'blur(8px)');

        const mainText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        mainText.classList.add('segment-text');
        mainText.setAttribute('x', textPos.x);
        mainText.setAttribute('y', textPos.y - 5);
        mainText.setAttribute('text-anchor', 'middle');
        mainText.setAttribute('dominant-baseline', 'middle');
        mainText.textContent = segments[i].name;

        const subText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        subText.classList.add('segment-text-sub');
        subText.setAttribute('x', textPos.x);
        subText.setAttribute('y', textPos.y + 14);
        subText.setAttribute('text-anchor', 'middle');
        subText.setAttribute('dominant-baseline', 'middle');
        subText.textContent = segments[i].subtitle;

        textGroup.appendChild(textBg);
        textGroup.appendChild(mainText);
        textGroup.appendChild(subText);

        g.appendChild(mainPath);
        g.appendChild(overlayPath);
        g.appendChild(highlightPath);
        g.appendChild(edgePath);
        g.appendChild(textGroup);

        g.addEventListener('click', (e) => {
            e.preventDefault();
            handleSegmentClick(i);
        });

        g.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleSegmentClick(i);
        });

        segmentsContainer.appendChild(g);
    }
}

function handleSegmentClick(index) {
    if (isAnimating) return;

    if (index === alignedIndex) {
        window.location.href = segments[index].url;
        return;
    }

    isAnimating = true;

    const segmentAngle = 90;
    const targetRotation = -index * segmentAngle;

    let diff = targetRotation - rotation;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;

    rotation += diff;
    donutWheel.style.transform = `rotate(${rotation}deg)`;

    currentIndex = index;

    setTimeout(() => {
        alignedIndex = index;
        isAnimating = false;
        updateUI();
    }, 800);

    updateBackground();
    updateSegmentStyles();
}

function updateBackground() {
    document.querySelectorAll('.bg-image').forEach((bg, i) => {
        bg.classList.toggle('active', i === currentIndex);
    });
}

function updateSegmentStyles() {
    document.querySelectorAll('.segment').forEach((seg) => {
        const segIndex = parseInt(seg.getAttribute('data-index'));
        if (segIndex === currentIndex) {
            seg.classList.add('active');
        } else {
            seg.classList.remove('active');
        }
    });
}

function updateUI() {
    updateBackground();

    updateSegmentStyles();

    centerTitle.textContent = segments[currentIndex].name;
    centerTitle.style.color = segments[currentIndex].color;

    if (alignedIndex === currentIndex) {
        centerSubtitle.textContent = 'Click Again to Enter';
        centerSubtitle.classList.add('ready');
    } else {
        centerSubtitle.textContent = 'Select';
        centerSubtitle.classList.remove('ready');
    }
}

function init() {
    generateSegments();

    currentIndex = 0;
    alignedIndex = 0;

    updateUI();
}

init();
