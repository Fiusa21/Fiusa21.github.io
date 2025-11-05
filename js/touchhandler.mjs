//all touch (input) events handled here
import { triggerNudge } from './game.mjs';

const inputState = {
    // Single-finger drag properties
    isDraggingSingle: false, // Renamed for clarity
    startDragX: 0,
    startPaddleX: 0,
    startPaddleY: 0, // Added for potential single-finger vertical drag

    // Multi-finger (two-finger) drag and rotate properties
    isInteractingMulti: false,
    startPaddleXMulti: 0,   // Initial paddle X for multi-touch drag
    startPaddleYMulti: 0,   // Initial paddle Y for multi-touch drag (if you want Y-axis drag)
    startPaddleAngle: 0,    // Initial paddle angle for multi-touch rotate

    startMidPointX: 0,      // Initial X-coordinate of the midpoint of two touches
    startMidPointY: 0,      // Initial Y-coordinate of the midpoint of two touches

    startTouchAngle: 0,     // Initial angle between two touches
};

let lastTapTime = 0;
const DOUBLE_TAP_DELAY = 300;

function getTouchPositions(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
        return Array.from(e.touches).map(touch => ({
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
            id: touch.identifier // Keep touch ID for better multi-touch tracking if needed
        }));
    } else {
        // Handle mouse events as a single touch/point for compatibility
        return [{ x: e.clientX - rect.left, y: e.clientY - rect.top, id: 0 }];
    }
}

function getAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

//the main function that attaches all listeners
export function initInputHandler(canvas, paddle, gameState) {
    const handleStart = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault(); // Prevent default browser touch behavior

        const points = getTouchPositions(e, canvas);

        // --- Double Tap Check (only on first touch if multiple) ---
        if (points.length === 1 && e.touches && e.touches.length === 1) { // Only check double tap for actual single touchstart
            const currentTime = performance.now();
            if (currentTime - lastTapTime < DOUBLE_TAP_DELAY) {
                triggerNudge(gameState);
                lastTapTime = 0; // Prevent triple tap
            } else {
                lastTapTime = currentTime;
            }
        }


        // --- Input State Logic ---
        if (points.length === 1) {
            // If currently only one finger, assume single-finger drag
            inputState.isDraggingSingle = true;
            inputState.startDragX = points[0].x;
            inputState.startPaddleX = paddle.x;
            inputState.startPaddleY = paddle.y; // Store Y for single-finger drag if needed

            // Ensure multi-touch flags are off if only one touch
            inputState.isInteractingMulti = false;

        } else if (points.length >= 2) {
            // If two or more fingers, start multi-touch interaction
            inputState.isInteractingMulti = true;
            inputState.isDraggingSingle = false; // Turn off single-drag if multi-touch starts

            // Store initial paddle state for multi-touch reference
            inputState.startPaddleXMulti = paddle.x;
            inputState.startPaddleYMulti = paddle.y;
            inputState.startPaddleAngle = paddle.angle;

            // Store the initial midpoint of the first two touches for dragging
            inputState.startMidPointX = (points[0].x + points[1].x) / 2;
            inputState.startMidPointY = (points[0].y + points[1].y) / 2;

            // Store the initial angle between the first two touches for rotation
            inputState.startTouchAngle = getAngle(points[0], points[1]);
        }
    };

    const handleMove = (e) => {
        if (gameState.gameOver) return;
        e.preventDefault(); // Prevent default browser touch behavior (e.g., scrolling)

        const points = getTouchPositions(e, canvas);

        if (inputState.isInteractingMulti && points.length >= 2) {
            // --- COMBINED DRAG AND ROTATE LOGIC ---

            // Calculate current midpoint for dragging
            const currentMidPointX = (points[0].x + points[1].x) / 2;
            const currentMidPointY = (points[0].y + points[1].y) / 2;

            // Calculate drag displacement
            const dx = currentMidPointX - inputState.startMidPointX;
            const dy = currentMidPointY - inputState.startMidPointY;

            // Apply drag to paddle position
            paddle.x = inputState.startPaddleXMulti + dx;
            paddle.y = inputState.startPaddleYMulti + dy; // Update Y for vertical multi-touch drag

            // Calculate current angle for rotation
            const currentAngle = getAngle(points[0], points[1]);

            // Calculate angular displacement
            const dAngle = currentAngle - inputState.startTouchAngle;

            // Apply rotation to paddle angle
            paddle.angle = inputState.startPaddleAngle + dAngle;

        } else if (inputState.isDraggingSingle && points.length === 1) {
            // --- SINGLE-FINGER DRAG LOGIC ---
            // This is your original single-finger drag, still useful!
            const dx = points[0].x - inputState.startDragX;
            paddle.x = inputState.startPaddleX + dx;
            // If you want single-finger vertical drag too:
            // const dy = points[0].y - inputState.startDragY; // assuming startDragY is stored
            // paddle.y = inputState.startPaddleY + dy;
        }
        // Mouse move when a mouse button is down would fall under isDraggingSingle here
    };

    const handleEnd = (e) => {
        // Reset all interaction flags
        inputState.isDraggingSingle = false;
        inputState.isInteractingMulti = false;

        // This is important for multi-touch:
        // touchend has `changedTouches` which are the fingers that lifted.
        // `e.touches` still contains fingers that are *still down*.
        // If `e.touches.length` is 0, all fingers are up.
        // If it's 1, then we might transition to a single-finger drag.
        // For simplicity, we'll reset both flags on any end for now.
        // More robust solutions might track individual touch IDs to manage transitions.
    };

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd); // Treat touchcancel like touchend

    // Mouse events for desktop interaction (mimicking single touch)
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd); // Important for mouse events if drag leaves canvas
}