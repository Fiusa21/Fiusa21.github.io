

//phyisics for obastacle and board collision, hitreg is included in paddle.mjs!!!!!!

import { setPaddleHit } from './paddle.mjs';

export function checkCollisions(ball, paddle, obstacles) {
    // Obstacle collision
    obstacles.forEach(obs => {
        if (ball.x > obs.x && ball.x < obs.x + obs.width &&
            ball.y + ball.radius > obs.y && ball.y - ball.radius < obs.y + obs.height) {
            ball.vy *= -1;
            ball.y += ball.vy; //Prevent sticking
        }
    });

    //board-collision
    const dx = ball.x - paddle.x;
    const dy = ball.y - paddle.y;
    const rotatedX = dx * Math.cos(-paddle.angle) - dy * Math.sin(-paddle.angle);
    const rotatedY = dx * Math.sin(-paddle.angle) + dy * Math.cos(-paddle.angle);

    if (rotatedX > -paddle.width / 2 - ball.radius && rotatedX < paddle.width / 2 + ball.radius &&
        rotatedY > -paddle.height / 2 - ball.radius && rotatedY < paddle.height / 2 + ball.radius && ball.vy > 0) {

        setPaddleHit(paddle);
        const bounceAngle = paddle.angle - Math.PI / 2;
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        ball.vx = Math.cos(bounceAngle) * speed;
        ball.vy = Math.sin(bounceAngle) * speed;
    }
}