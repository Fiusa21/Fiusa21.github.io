

//phyisics for obastacle and board collision, hitreg is included in paddle.mjs!!!!!!

import { setPaddleHit } from './paddle.mjs';

export function checkCollisions(ball, paddle, obstacles) {
    // Obstacle collision
    obstacles.forEach(obs => {
        //calculate the closest point on the obstacle to the center of the ball
        let closestX = Math.max(obs.x, Math.min(ball.x, obs.x + obs.width));
        let closestY = Math.max(obs.y, Math.min(ball.y, obs.y + obs.height));

        //calculate the distance between the ball's center and this closest point
        let distanceX = ball.x - closestX;
        let distanceY = ball.y - closestY;
        let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));

        //if the distance is less than the balls radius -> collision
        if (distance < ball.radius) {
            // Determine which side of the obstacle was hit
            let overlapX = (ball.x < obs.x || ball.x > obs.x + obs.width) ? Math.min(Math.abs(ball.x - obs.x), Math.abs(ball.x - (obs.x + obs.width))) : Infinity;
            let overlapY = (ball.y < obs.y || ball.y > obs.y + obs.height) ? Math.min(Math.abs(ball.y - obs.y), Math.abs(ball.y - (obs.y + obs.height))) : Infinity;

            //essential to not have the ball stick on the object if sides are hit
            if (overlapX < overlapY) { //hit from side
                ball.vx *= -1;
                //adjust ball position to prevent sticking
                if (ball.x < obs.x) { // Hit left side
                    ball.x = obs.x - ball.radius;
                } else { // Hit right side
                    ball.x = obs.x + obs.width + ball.radius;
                }
            } else { // Hit from top or bottom
                ball.vy *= -1;
                // Adjust ball position to prevent sticking
                if (ball.y < obs.y) { // Hit top
                    ball.y = obs.y - ball.radius;
                } else { // Hit bottom
                    ball.y = obs.y + obs.height + ball.radius;
                }
            }
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