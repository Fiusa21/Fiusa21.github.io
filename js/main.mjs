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
        ball: createBall(canvas),
        obstacles: createObstacles(canvas),
        isNudging: false
    };

    // Initialize the input listeners
    initInputHandler(canvas, gameState.paddle, gameState);

    // Start the game
    gameLoop(0, ctx, gameState, scoreElement);

    const howToPlayButton = document.getElementById('how-to-play-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeButton = document.getElementById('close-button');

    // Funktion zum Öffnen des Modals
    howToPlayButton.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
    });

    // Funktion zum Schließen des Modals
    const closeModal = () => {
        modalOverlay.style.display = 'none';
    };

    closeButton.addEventListener('click', (e) => {
        e.preventDefault(); // Verhindert, dass die Seite nach oben springt
        closeModal();
    });

    // Schließt das Modal auch, wenn man auf den dunklen Hintergrund klickt
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
});