//all touch (input) events handled here
import { triggerNudge } from './game.mjs';

const inputState = {
    isDragging: false,
    isInteractingMulti: false,
    startDragX: 0,
    startPaddleX: 0,
    startTouchAngle: 0,
    startPaddleAngle: 0,
    startDragXMulti: 0 //for two finger drag
};

let lastTapTime = 0;
const DOUBLE_TAP_DELAY = 300;

function getTouchPositions(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return Array.from(e.touches).map(touch => ({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        }));
    } else {
        return [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
    }
}

function getAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

// The main function that attaches all listeners
export function initInputHandler(canvas, paddle, gameState) {
    const handleStart = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault();
        //doubletap?
        const currentTime = performance.now();
        if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
            triggerNudge(gameState);
            lastTapTime = 0; //reset time
        } else {
            lastTapTime = currentTime;
        }

        const points = getTouchPositions(e, canvas);
        if (points.length === 1) {
            inputState.isDragging = true;
            inputState.startDragX = points[0].x;
            inputState.startPaddleX = paddle.x;
        } else if (points.length >= 2) {
            inputState.isInteractingMulti = true;
            inputState.startTouchAngle = getAngle(points[0], points[1]);
            inputState.startPaddleAngle = paddle.angle;
            //for two finger drag
            inputState.startDragXMulti = (points[0].x + points[1].x) / 2;
            inputState.startPaddleX = paddle.x;
        }
    };

    const handleMove = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault();
        const points = getTouchPositions(e, canvas);
        if (inputState.isDragging && points.length === 1) {
            const dx = points[0].x - inputState.startDragX;
            paddle.x = inputState.startPaddleX + dx;
        } else if (inputState.isInteractingMulti && points.length >= 2) {
            const currentAngle = getAngle(points[0], points[1]);
            paddle.angle = inputState.startPaddleAngle + (currentAngle - inputState.startTouchAngle);
            //for two finger drag
            const currentMidpointX = (points[0].x + points[1].x) / 2;
            const dx = currentMidpointX - inputState.startDragXMulti;
            paddle.x = inputState.startPaddleX + dx;
        }
    };

    const handleEnd = () => {
        inputState.isDragging = false;
        inputState.isInteractingMulti = false;
    };

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd);
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
}