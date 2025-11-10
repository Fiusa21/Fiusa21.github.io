// ball.mjs

//creates and returns a new ball object
export function createBall(canvas, difficulty) {
    const baseSpeed = 3; // Minimum speed at difficulty 1
    const maxSpeedIncrease = 5; // Max additional speed at difficulty 10 (so total max speed is 3+5=8)

    // Scale speed based on difficulty (1-10)
    // For difficulty 1, scaleFactor = 0.
    // For difficulty 10, scaleFactor = 1.
    const scaleFactor = (difficulty - 1) / 9; // (difficulty - minDifficulty) / (maxDifficulty - minDifficulty)

    const currentSpeed = baseSpeed + (maxSpeedIncrease * scaleFactor);

    return {
        x: canvas.width / 2,
        y: 50,
        radius: 8,
        vx: (Math.random() - 0.5) * 2 * currentSpeed,
        vy: currentSpeed,
        color: '#FFF'
    };
}

//updates the ball's position and handles wall collisions
export function updateBall(ball, canvas) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    //wall collision
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.vx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.vy *= -1;
    }
}

//draws the ball
export function drawBall(ctx, ball) {
    // console.log('Zeichne Ball:', ball);
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}