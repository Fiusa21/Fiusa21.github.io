

import { drawBall, updateBall } from './ball.mjs';
import { drawPaddle } from './paddle.mjs';
import { drawObstacles, updateObstacles } from './obstacle.mjs';
import { checkCollisions } from './physics.mjs';



const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreElement = document.getElementById('final-score');

//nudge animation in draw game
export function triggerNudge(gameState) {

    if (gameState.isNudging) return;

    gameState.isNudging = true;


    gameState.ball.vy *= -1;


    setTimeout(() => {
        gameState.isNudging = false;
    }, 150);
}





export function updateGame(gameState, deltaTime) {
    if (gameState.gameOver) return;

    gameState.score += deltaTime;


    updateBall(gameState.ball, gameState.canvas);
    updateObstacles(gameState.obstacles, gameState.canvas);

    checkCollisions(gameState.ball, gameState.paddle, gameState.obstacles);


    if (gameState.ball.y - gameState.ball.radius > gameState.canvas.height) {
        gameState.gameOver = true;
    }
}


export function drawGame(ctx, gameState) {

    ctx.save();

    //nudge screen animation
    if (gameState.isNudging) {
        const shakeIntensity = 8;
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(shakeX, shakeY);
    }


    ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    drawObstacles(ctx, gameState.obstacles);
    drawBall(ctx, gameState.ball);
    drawPaddle(ctx, gameState.paddle);


    ctx.restore();
}


export function gameLoop(timestamp, ctx, gameState, scoreElement) {
    const deltaTime = ((timestamp - gameState.lastTime) / 1000)*gameState.difficulty;
    gameState.lastTime = timestamp;

    updateGame(gameState, deltaTime || 0);
    drawGame(ctx, gameState);

    if (!gameState.gameOver) {
        scoreElement.textContent = `Score: ${Math.floor(gameState.score)}`;
        requestAnimationFrame((ts) => gameLoop(ts, ctx, gameState, scoreElement));
    } else {
        const finalScore = Math.floor(gameState.score);
        scoreElement.textContent = `Game Over! Score: ${finalScore}`;

        finalScoreElement.textContent = finalScore;
        gameOverOverlay.style.display = 'flex';

    }
}