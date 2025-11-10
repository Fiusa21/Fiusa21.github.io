// index.js

import { createPaddle } from './paddle.mjs';
import { createBall } from './ball.mjs'; // Updated import
import { createObstacles } from './obstacle.mjs';
import { initInputHandler } from './touchhandler.mjs';
import { gameLoop } from './game.mjs';

window.addEventListener('load', function() {

    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');
    const ctx = canvas.getContext('2d');
    const startOverlay = document.getElementById('start-overlay');
    const startButton = document.getElementById('start-button');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn'); // Get buttons

    canvas.width = Math.min(window.innerWidth * 0.9, 400);
    canvas.height = Math.min(window.innerHeight * 0.8, 700);

    //initial game state
    const gameState = {
        canvas: canvas,
        difficulty: 7,
        score: 0,
        gameOver: false,
        lastTime: 0,
        paddle: createPaddle(canvas),
        ball: null, // Ball created on start, after difficulty is chosen
        obstacles: [], // Obstacles created on start
        isNudging: false
    };


    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all buttons
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' to the clicked button
            button.classList.add('active');
            // Update gameState with the new difficulty
            gameState.difficulty = parseInt(button.dataset.difficulty, 10);
        });
    });

    //display start menu
    startOverlay.style.display = 'flex';
    //initialize the input listeners
    initInputHandler(canvas, gameState.paddle, gameState);

    //start game when clicked and close overlay
    startButton.addEventListener('click', () => {
        //reset state
        gameState.gameOver = false;
        gameState.score = 0;
        gameState.lastTime = performance.now();

        //CREATE AFTER DIFFICULTY IS CHOSEN!!!!
        gameState.ball = createBall(canvas, gameState.difficulty); // <--- Pass difficulty here
        gameState.obstacles = createObstacles(canvas, gameState.difficulty);

        //start the game loop
        requestAnimationFrame((ts) => gameLoop(ts, ctx, gameState, scoreElement));
        startOverlay.style.display = 'none';
    });

    const howToPlayButton = document.getElementById('how-to-play-button');
    const modalOverlay = document.getElementById('modal-overlay');

    const restartButton = document.getElementById('restart-button');
    const closeButton = document.getElementById('close-button');


    howToPlayButton.addEventListener('click', () => {
        modalOverlay.style.display = 'flex';
    });


    const closeModal = () => {
        modalOverlay.style.display = 'none';
    };

    closeButton.addEventListener('click', (e) => {
        e.preventDefault(); //prevents jumping
        closeModal();
    });

    //close when clicked on background
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    restartButton.addEventListener('click', () => {
        window.location.reload();
    });
});