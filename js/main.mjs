// js/main.js

import { createPaddle } from './paddle.mjs';
import { createBall } from './ball.mjs';
import { createObstacles } from './obstacle.mjs';
import { initInputHandler } from './touchhandler.mjs';
import { gameLoop } from './game.mjs';

window.addEventListener('load', function() {
    // Get HTML Elements
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = Math.min(window.innerHeight * 0.8, 700);

    // This is the single source of truth for the game's state
    const gameState = {
        canvas: canvas,
        score: 0,
        gameOver: false,
        lastTime: 0,
        paddle: createPaddle(canvas),
        ball: createBall(canvas), // CHANGED
        obstacles: createObstacles(canvas) // CHANGED
    };

    // Initialize the input listeners
    initInputHandler(canvas, gameState.paddle, gameState);

    // Start the game
    gameLoop(0, ctx, gameState, scoreElement);
});