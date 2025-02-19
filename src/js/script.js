const canvas = document.getElementById("starCanvas");
const ctx = canvas.getContext("2d");

// Resize canvas to fit the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Shooting star properties
let shootingStars = [];

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * 400, // Start near the top-left but randomized
        y: Math.random() * 200, 
        length: Math.random() * 200 + 100, // Tail length between 100px - 300px
        speed: Math.random() * 4 + 6, // Speed between 6px - 10px per frame
        opacity: 1,
        angle: Math.PI / 4, // 45-degree diagonal movement
        fade: false
    });
}

// Draw a single shooting star
function drawShootingStar(star) {
    if (star.opacity <= 0) return;

    const tailX = star.x - Math.cos(star.angle) * star.length;
    const tailY = star.y - Math.sin(star.angle) * star.length;

    // Create a gradient for the glowing tail effect
    const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    // Move the shooting star
    star.x += Math.cos(star.angle) * star.speed;
    star.y += Math.sin(star.angle) * star.speed;

    // Start fading when leaving screen
    if (star.x > canvas.width || star.y > canvas.height) {
        star.fade = true;
    }

    // Reduce opacity for fading effect
    if (star.fade) {
        star.opacity -= 0.02;
    }
}

// Main animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all shooting stars
    shootingStars.forEach((star, index) => {
        drawShootingStar(star);
        if (star.opacity <= 0) shootingStars.splice(index, 1); // Remove faded stars
    });

    requestAnimationFrame(animate);
}

// Start the animation
animate();

// Generate a new shooting star every 10 seconds
setInterval(createShootingStar, 3000);
