const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let shootingStar = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars(100);
}

function generateStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            opacity: Math.random(),
            speed: Math.random() * 2 + 1,
            phase: Math.random() * Math.PI * 2
        });
    }
}

function createShootingStar() {
    shootingStar = {
        x: Math.random() * canvas.width,  // Start somewhere at random X position
        y: Math.random() * (canvas.height / 2),  // Start in the upper half
        length: 200,  // Tail length
        speed: 8,  // How fast it moves
        opacity: 1,
        angle: Math.PI / 4,  // 45-degree diagonal angle
        active: true
    };
}

function drawShootingStar(star) {
    if (!star || !star.active) return;

    const tailX = star.x - Math.cos(star.angle) * star.length;
    const tailY = star.y - Math.sin(star.angle) * star.length;

    // Create a gradient for the tail effect
    const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    // Move the shooting star
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;

    // Fade out and deactivate when out of bounds
    star.opacity -= 0.02;
    if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
        star.active = false;
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const time = Date.now() * 0.002;

    stars.forEach(star => {
        const twinkle = (Math.sin(time * star.speed + star.phase) + 1) / 2;
        ctx.globalAlpha = twinkle * 0.7 + 0.3;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    drawShootingStar(shootingStar);

    requestAnimationFrame(drawStars);
}

// Initialize
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
drawStars();

// Create a shooting star every 15 seconds
setInterval(createShootingStar, 15000);