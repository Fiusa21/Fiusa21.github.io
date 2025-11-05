//all touch (input) events handled here
import { triggerNudge } from './game.mjs';

const inputState = {
    // Single-finger drag properties (isDragging, startDragX, startPaddleX)
    isDragging: false, // This will now *only* be for single-finger drag
    startDragX: 0,
    startPaddleX: 0,
    // Note: No startPaddleY for single drag, as it's X-only

    // Multi-finger (two-finger) drag and rotate properties
    isInteractingMulti: false,
    startPaddleXMulti: 0, // Initial paddle X for multi-touch drag
    startPaddleAngleMulti: 0, // Initial paddle angle for multi-touch rotate (renamed for clarity)

    startMidPointX: 0, // Initial X-coordinate of the midpoint of two touches for drag
    // Note: No startMidPointY for multi-touch drag, as it's X-only

    startTouchAngle: 0, // Initial angle between two touches for rotation
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
        // Handle mouse events as a single touch/point for compatibility
        return [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
    }
}

function getAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

//the main function that attaches all listeners
export function initInputHandler(canvas, paddle, gameState) {
    const handleStart = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault();

        // --- DOUBLE TAP LOGIC (UNCHANGED) ---
        const currentTime = performance.now();
        if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
            triggerNudge(gameState);
            lastTapTime = 0; //prevent tripple tap
        } else {
            lastTapTime = currentTime;
        }
        // --- END DOUBLE TAP LOGIC ---


        const points = getTouchPositions(e, canvas);

        if (points.length === 1) {
            // Start single-finger drag
            inputState.isDragging = true;
            inputState.startDragX = points[0].x;
            inputState.startPaddleX = paddle.x;

            // Ensure multi-touch is off
            inputState.isInteractingMulti = false;

        } else if (points.length >= 2) {
            // Start multi-finger interaction
            inputState.isInteractingMulti = true;
            inputState.isDragging = false; // Turn off single-drag if multi-touch starts

            // Store initial paddle state for multi-touch reference
            inputState.startPaddleXMulti = paddle.x;
            inputState.startPaddleAngleMulti = paddle.angle;

            // Calculate and store the initial midpoint X for dragging
            inputState.startMidPointX = (points[0].x + points[1].x) / 2;
            // No need for startMidPointY as drag is X-only

            // Calculate and store the initial angle between the first two touches for rotation
            inputState.startTouchAngle = getAngle(points[0], points[1]);
        }
    };

    const handleMove = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault();

        const points = getTouchPositions(e, canvas);

        if (inputState.isInteractingMulti && points.length >= 2) {
            // --- COMBINED TWO-FINGER DRAG (X-ONLY) AND ROTATE LOGIC ---

            // 1. Handle X-direction Drag
            const currentMidPointX = (points[0].x + points[1].x) / 2;
            const dx = currentMidPointX - inputState.startMidPointX;
            paddle.x = inputState.startPaddleXMulti + dx;

            // 2. Handle Rotation
            const currentAngle = getAngle(points[0], points[1]);
            const dAngle = currentAngle - inputState.startTouchAngle;
            paddle.angle = inputState.startPaddleAngleMulti + dAngle;

        } else if (inputState.isDragging && points.length === 1) {
            // --- SINGLE-FINGER DRAG (X-ONLY) LOGIC (UNCHANGED) ---
            const dx = points[0].x - inputState.startDragX;
            paddle.x = inputState.startPaddleX + dx;
        }
    };

    const handleEnd = (e) => {
        // We need to ensure state is reset when fingers are lifted,
        // especially when ALL fingers are lifted or for mouse events.
        // This addresses the issue where `handleEnd` was too simplistic for multi-touch.

        // If it's a touch event and no touches remain, or if it's a mouse event.
        if ((e.touches && e.touches.length === 0) || (!e.touches && (e.type === 'mouseup' || e.type === 'mouseleave'))) {
            inputState.isDragging = false;
            inputState.isInteractingMulti = false;
        }
        // If e.touches.length > 0 (for touch events), it means some fingers are still down,
        // so we don't reset the flags yet, allowing for a transition from multi to single touch
        // if a finger lifts, or continued multi-touch if more than one remain.
        // For this specific setup where isDragging is for single and isInteractingMulti for multi,
        // resetting both when any finger lifts could simplify things but might lead to lost context.
        // The current logic tries to be more robust.
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