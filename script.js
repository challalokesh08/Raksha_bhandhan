
const canvas = document.getElementById('mouseTrackCanvas');
const ctx = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;
let trail = []; 
const maxTrailLength = 150;
const initialParticleSize = 5;
const particleExpandRate = 0.8;
const particleFadeRate = 0.008;


const gradientColors = [
    'hsla(330, 80%, 90%, 0.05)', 
    'hsla(210, 80%, 90%, 0.05)',
    'hsla(50, 80%, 90%, 0.05)'
];


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}


window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.push({ x: mouseX, y: mouseY, size: initialParticleSize, opacity: 1 });
});
function animateTrail() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#f7f3e9');
    bgGradient.addColorStop(1, '#ffe0b2');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.opacity -= particleFadeRate;
        p.size += particleExpandRate;

        p.opacity = Math.max(0, p.opacity);

        if (p.opacity > 0) {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.globalCompositeOperation = 'lighter';
            const colorIndex = i % gradientColors.length;
            const baseColor = gradientColors[colorIndex];
            const particleGradient = ctx.createRadialGradient(p.x, p.y, p.size * 0.1, p.x, p.y, p.size);
            
            particleGradient.addColorStop(0, baseColor.replace(/,\s*0\.\d+\)$/, ', 0.5)'));
            particleGradient.addColorStop(0.5, baseColor.replace(/,\s*0\.\d+\)$/, ', 0.2)')); 
            particleGradient.addColorStop(1, baseColor.replace(/,\s*0\.\d+\)$/, ', 0)'));

            ctx.fillStyle = particleGradient;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    trail = trail.filter(p => p.opacity > 0 && p.size < Math.max(canvas.width, canvas.height) / 2); // Also remove if too large
    if (trail.length > maxTrailLength) {
        trail = trail.slice(trail.length - maxTrailLength);
    }

    requestAnimationFrame(animateTrail);
}

window.onload = function() {
    resizeCanvas();
    animateTrail();
};

window.addEventListener('resize', resizeCanvas);
                        