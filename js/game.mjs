// js/game.js

import { drawBall, updateBall } from './ball.mjs';
import { drawPaddle } from './paddle.mjs';
import { drawObstacles, updateObstacles } from './obstacle.mjs';
import { checkCollisions } from './physics.mjs';



const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreElement = document.getElementById('final-score');


export function triggerNudge(gameState) {
    // Verhindern, dass man rüttelt, während schon gerüttelt wird
    if (gameState.isNudging) return;

    gameState.isNudging = true;

    // Dem Ball einen kleinen, zufälligen Stoß geben
    // Hauptsächlich ein kleiner Stoß nach oben, um den Ball zu retten
    gameState.ball.vy *= -1;

    // Den Nudge-Zustand nach kurzer Zeit wieder zurücksetzen
    setTimeout(() => {
        gameState.isNudging = false;
    }, 150); // Der Rüttel-Effekt dauert 150ms
}




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
    // Speichert den aktuellen Zustand des Canvas (ohne Transformationen)
    ctx.save();

    // NEU: Wenn genudged wird, wird der ganze Canvas leicht verschoben
    if (gameState.isNudging) {
        const shakeIntensity = 8; // Wie stark der Bildschirm wackelt
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(shakeX, shakeY);
    }

    // Die eigentliche Zeichenlogik
    ctx.clearRect(0, 0, gameState.canvas.width, gameState.canvas.height);
    drawObstacles(ctx, gameState.obstacles);
    drawBall(ctx, gameState.ball);
    drawPaddle(ctx, gameState.paddle);

    // Setzt den Canvas in den Zustand vor dem ctx.save() zurück
    ctx.restore();
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
        const finalScore = Math.floor(gameState.score);
        scoreElement.textContent = `Game Over! Score: ${finalScore}`;

        finalScoreElement.textContent = finalScore;
        gameOverOverlay.style.display = 'flex';
    }
}