// js/game.js

import { drawBall, updateBall } from './ball.mjs';
import { drawPaddle } from './paddle.mjs';
import { drawObstacles, updateObstacles } from './obstacle.mjs';
import { checkCollisions } from './physics.mjs';

// The main update function for the entire game state
export function updateGame(gameState, deltaTime) {
    if (gameState.gameOver) return;

    gameState.score += deltaTime;

    // CHANGED: Pass the whole canvas object
    updateBall(gameState.ball, gameState.canvas);
    updateObstacles(gameState.obstacles, gameState.canvas);

    checkCollisions(gameState.ball, gameState.paddle, gameState.obstacles);

    // Check for game over condition
    if (gameState.ball.y - gameState.ball.radius > gameState.canvas.height) {
        gameState.gameOver = true;
    }
}

// The main draw function
export function drawGame(ctx, gameState) {
    ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    drawObstacles(ctx, gameState.obstacles);
    drawBall(ctx, gameState.ball);
    drawPaddle(ctx, gameState.paddle);
}

// The recursive game loop
export function gameLoop(timestamp, ctx, gameState, scoreElement) {
    const deltaTime = (timestamp - gameState.lastTime) / 1000;
    gameState.lastTime = timestamp;

    updateGame(gameState, deltaTime || 0);
    drawGame(ctx, gameState);

    if (!gameState.gameOver) {
        scoreElement.textContent = `Score: ${Math.floor(gameState.score)}`;
        requestAnimationFrame((ts) => gameLoop(ts, ctx, gameState, scoreElement));
    } else {
        scoreElement.textContent = `Game Over! Score: ${Math.floor(gameState.score)}`;
    }
}