const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: canvas.width / 2 - 28,
    y: canvas.height - 67,
    width: 56,
    height: 56,
    speed: 6,
    dx: 0
};

const cakeImg = new Image();
cakeImg.src = 'https://img.icons8.com/emoji/48/000000/birthday-cake-emoji.png';
const bombImg = new Image();
bombImg.src = 'https://img.icons8.com/emoji/48/000000/bomb-emoji.png';
const playerImg = new Image();
playerImg.src = 'character.png.png';

let cakes = [];
let bombs = [];
let cakeCount = 0;
let gameOver = false;
let gameWon = false;

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObjects(objects, img) {
    objects.forEach(obj => {
        ctx.drawImage(img, obj.x, obj.y, obj.size, obj.size);
    });
}

function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function newCake() {
    const size = 40;
    cakes.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: 3 + Math.random() * 2
    });
}

function newBomb() {
    const size = 40;
    bombs.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size: size,
        speed: 3 + Math.random() * 2
    });
}

function moveObjects(objects) {
    objects.forEach(obj => {
        obj.y += obj.speed;
    });
}

function checkCollision(a, b) {
    return (
        a.x < b.x + b.size &&
        a.x + a.width > b.x &&
        a.y < b.y + b.size &&
        a.y + a.height > b.y
    );
}

function update() {
    if (gameOver || gameWon) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    moveObjects(cakes);
    moveObjects(bombs);
    drawPlayer();
    drawObjects(cakes, cakeImg);
    drawObjects(bombs, bombImg);

    // Cakes collision
    for (let i = cakes.length - 1; i >= 0; i--) {
        if (checkCollision(player, cakes[i])) {
            cakes.splice(i, 1);
            cakeCount++;
            if (cakeCount >= 25) {
                gameWon = true;
            }
        } else if (cakes[i].y > canvas.height) {
            cakes.splice(i, 1);
        }
    }
    // Bombs collision
    for (let i = bombs.length - 1; i >= 0; i--) {
        if (checkCollision(player, bombs[i])) {
            gameOver = true;
        } else if (bombs[i].y > canvas.height) {
            bombs.splice(i, 1);
        }
    }
    // Score
    ctx.font = '24px Arial';
    ctx.fillStyle = '#d2691e';
    ctx.fillText('Cakes: ' + cakeCount + ' / 25', 10, 30);
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '36px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText('Game Over!', 140, 320);
    }
    if (gameWon) {
        // Create a colorful gradient background
        let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#ffb347');
        gradient.addColorStop(0.25, '#ffccff');
        gradient.addColorStop(0.5, '#87ceeb');
        gradient.addColorStop(0.75, '#ff69b4');
        gradient.addColorStop(1, '#b19cd9');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Add confetti dots
        for (let i = 0; i < 120; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 4 + Math.random() * 6, 0, 2 * Math.PI);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 90%, 60%)`;
            ctx.fill();
        }
        // Draw the birthday wish
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#d2691e';
        ctx.lineWidth = 4;
        ctx.strokeText("Happy B'day Haseebullah!", canvas.width / 2, canvas.height / 2);
        ctx.fillText("Happy B'day Haseebullah!", canvas.width / 2, canvas.height / 2);
    }
// Mobile controls (always active)
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
let leftInterval, rightInterval;
if (leftBtn && rightBtn) {
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.dx = -player.speed;
        leftInterval = setInterval(() => { player.dx = -player.speed; }, 16);
    }, { passive: false });
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        player.dx = 0;
        clearInterval(leftInterval);
    }, { passive: false });
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.dx = player.speed;
        rightInterval = setInterval(() => { player.dx = player.speed; }, 16);
    }, { passive: false });
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        player.dx = 0;
        clearInterval(rightInterval);
    }, { passive: false });
}
// Prevent scrolling on mobile when touching the canvas
canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });
}

let cakeTimer = 0;
let bombTimer = 0;
function gameLoop() {
    if (!gameOver && !gameWon) {
        cakeTimer++;
        bombTimer++;
        if (cakeTimer > 30) {
            newCake();
            cakeTimer = 0;
        }
        if (bombTimer > 50) {
            newBomb();
            bombTimer = 0;
        }
    }
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
});
document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Start game when images are loaded
let imagesLoaded = 0;
[cakeImg, bombImg, playerImg].forEach(img => {
    img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 3) gameLoop();
    };
});
