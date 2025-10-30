

//creates and returns the initial array of obstacles
export function createObstacles(canvas) {
    return [
        { x: canvas.width / 2 - 50, y: 200, width: 100, height: 20, vx: 1.5 },
        { x: 50, y: 350, width: 80, height: 20, vx: -1 },
        { x: canvas.width - 130, y: 350, width: 80, height: 20, vx: 1 }
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
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}