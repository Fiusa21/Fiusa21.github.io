


//contains paddle creation, paddle draw and hitlogic which is being used by physics engine

export function createPaddle(canvas){
    return {
        width: 100, height: 15, x: canvas.width / 2, y: canvas.height - 50,
        angle: 0, color: 'cyan', hitColor: 'red', isHit: false, hitTimeout: null
    };
}

//sets the paddle to its "hit" state
export function setPaddleHit(paddle) {
    paddle.isHit = true;
    if (paddle.hitTimeout) clearTimeout(paddle.hitTimeout);
    paddle.hitTimeout = setTimeout(() => {
        paddle.isHit = false;
    }, 150);
}

//draws the paddle on the canvas
export function drawPaddle(ctx, paddle) {
    ctx.save();
    ctx.translate(paddle.x, paddle.y);
    ctx.rotate(paddle.angle);
    ctx.fillStyle = paddle.isHit ? paddle.hitColor : paddle.color;
    ctx.fillRect(-paddle.width / 2, -paddle.height / 2, paddle.width, paddle.height);
    ctx.restore();
}