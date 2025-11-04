

//creates and returns the initial array of obstacles
//added angle for possible further decelopment, but would complicate hitreg and physics
export function createObstacles(canvas) {
    return [
        { x: canvas.width / 2 - 50, y: 200, width: 100, height: 20, vx: 1.5, angle: 0 },
        { x: 50, y: 350, width: 80, height: 20, vx: -1, angle: 0 },
        { x: canvas.width - 130, y: 350, width: 20, height: 80, vx: 1, angle: 0},
        { x: canvas.width - 130, y: 150, width: 80, height: 20, vx: 1, angle: 0 }


    ];

}

//updates the position of all obstacles
export function updateObstacles(obstacles, canvas) {
    obstacles.forEach(obs => {
        obs.x += obs.vx;
        //bounce off the side walls
        if (obs.x < 0 || obs.x + obs.width > canvas.width) {
            obs.vx *= -1;
        }
    });
}

//draws all obstacles
export function drawObstacles(ctx, obstacles) {
    ctx.fillStyle = '#555';

    obstacles.forEach(obs => {
        ctx.save();
        ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
        ctx.rotate(obs.angle);
        ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
        ctx.restore();
    });
}
