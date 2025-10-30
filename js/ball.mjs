

//creates and returns a new ball object
export function createBall(canvas) {
    return {
        x: canvas.width / 2,
        y: 50,
        radius: 8,
        vx: (Math.random() - 0.5) * 4,
        vy: 4,
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
    console.log('Zeichne Ball:', ball);
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

