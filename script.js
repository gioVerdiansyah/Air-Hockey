const canvas = document.getElementById('main');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const player = {
    r: 40,
    x: canvas.width / 2,
    y: canvas.height - 50,
}

const comp = {
    r: 40,
    x: canvas.width / 2,
    y: 0 + 50 + 10
}

const time = {
    second: 0,
    minute: 0
}

const score = {
    player: 0,
    comp: 0
}

const ringPosition = {
    sx: (canvas.width / 2) - (canvas.width / 2) / 2,
    sy: canvas.height / 2,
    ex: ((canvas.width / 2) - (canvas.width / 2) / 2) + canvas.width / 2,
    ey: canvas.height / 2
}

const speed = {
    maxSpeed: 10,
    constant: 45,
    sx: 0,
    sy: 0
}

const ball = {
    r: 50 / 2,
    x: canvas.width / 2,
    y: canvas.height / 2
}

const keyboard = {
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false
}

const drawBackground = () => {
    ctx.beginPath();
    ctx.rect((canvas.width / 2) - (canvas.width / 2) / 2, 0, canvas.width / 2, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

const drawRing = () => {
    ctx.beginPath();
    ctx.moveTo(ringPosition.sx, ringPosition.sy);
    ctx.lineTo(ringPosition.ex, ringPosition.ey);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, ball.r * 2, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

const drawPlayerAndComputer = () => {
    // player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // computer
    ctx.beginPath();
    ctx.arc(comp.x, comp.y, comp.r, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

const drawBall = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

const drawOffset = () => {
    ctx.beginPath();
    ctx.arc(ringPosition.sx, 0, 40, 0, Math.PI / 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(ringPosition.ex, 0, 40, Math.PI, Math.PI / 2, true);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(ringPosition.sx, canvas.height, 40, Math.PI * 6 / 4, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(ringPosition.ex, canvas.height, 40, Math.PI * 2, Math.PI * 6 / 4);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

const drawGoals = () => {
    ctx.beginPath();
    ctx.moveTo((canvas.width / 2) - ringPosition.sx / 3 - 15, 20);
    ctx.lineTo((canvas.width / 2) + ringPosition.sx / 3 + 15, 20);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo((canvas.width / 2) - ringPosition.sx / 3 - 15, canvas.height - 15);
    ctx.lineTo((canvas.width / 2) + ringPosition.sx / 3 + 15, canvas.height - 15);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath();
}

const drawScoreAndTime = () => {
    ctx.beginPath();
    ctx.font = "20px sans-serif";
    ctx.fillText(`Score`, 20, 50);
    ctx.fillText(`Computer: ${score.comp}`, 20, 75);
    ctx.fillText(`Player: ${score.player}`, 20, 100);
    ctx.fillText(`Time: ${time.minute.toString().padStart(2, '0')}:${time.second.toString().padStart(2, '0') }`, 20, 125);
    ctx.fillStyle = "black";
    ctx.fill();
}

const init = () => {
    drawBackground();
    drawScoreAndTime();
    drawOffset();
    drawRing();
    drawPlayerAndComputer();
    drawGoals();
    drawBall();
}

const reset = () => {
    player.r = 50;
    player.x = canvas.width / 2;
    player.y = canvas.height - 50;

    comp.r = 50;
    comp.x = canvas.width / 2;
    comp.y = 0 + 50 + 3;

    ringPosition.sx = (canvas.width / 2) - (canvas.width / 2) / 2;
    ringPosition.sy = canvas.height / 2;
    ringPosition.ex = ((canvas.width / 2) - (canvas.width / 2) / 2) + canvas.width / 2;
    ringPosition.ey = canvas.height / 2;

    ball.r = 50 / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    speed.maxSpeed = 10;
    speed.constant = 45;
    speed.sx = 0;
    speed.sy = 0;

    keyboard.KeyW = false;
    keyboard.KeyS = false;
    keyboard.KeyA = false;
    keyboard.KeyD = false;
}

document.addEventListener('keydown', function(e) {
    keyboard[e.code] = true;
});

document.addEventListener('keyup', function(e) {
    keyboard[e.code] = false;
});

const collision = (nx, ny, mx, my) => {
    const rsx = Math.pow((mx - nx), 2);
    const rsy = Math.pow((ny - my), 2);
    return Math.sqrt(rsx + rsy);
}

const controller = () => {
    // controller keyboard
    if (keyboard.KeyW && player.y >= ringPosition.sy + (player.r + 7)) {
        player.y -= 10;
    }

    if (keyboard.KeyS && player.y <= canvas.height - (player.r + 22)) {
        player.y += 5;
    }

    if (keyboard.KeyD && player.x <= ringPosition.ex + (player.r - 105)) {
        player.x += 7;
    }

    if (keyboard.KeyA && player.x >= ringPosition.sx + (player.r + 5)) {
        player.x -= 7;
    }

    // collision
    if (collision(player.x, player.y, ball.x, ball.y) <= ball.r + 50) {
        let tpx = ball.x - player.x;
        let tpy = ball.y - player.y;
        tpx /= speed.constant;
        tpy /= speed.constant;
        speed.sx = tpx * speed.maxSpeed;
        speed.sy = tpy * speed.maxSpeed;
    }

    if (collision(comp.x, comp.y, ball.x, ball.y) <= ball.r + 50) {
        let tpx = ball.x - comp.x;
        let tpy = ball.y - comp.y;
        tpx /= speed.constant;
        tpy /= speed.constant;
        speed.sx = tpx * speed.maxSpeed;
        speed.sy = tpy * speed.maxSpeed;
    }

    // top wall
    if ((ball.y + speed.sy) < (ball.r)) {
        speed.sy *= -1;
    }

    // bottom wall
    if ((ball.y + speed.sy) > (canvas.height - (ball.r + 10))) {
        speed.sy *= -1;
    }

    // right wall
    if ((ball.x + speed.sx) >= (ringPosition.ex - 20)) {
        speed.sx *= -1;
    }

    // left wall
    if ((ball.x + speed.sx) <= (ringPosition.sx + 20)) {
        speed.sx *= -1;
    }
    ball.x += speed.sx;
    ball.y += speed.sy;

    speed.sx *= 99 / 100;
    speed.sy *= 99 / 100;

    // computer AUTO
    if (ball.y <= (ringPosition.ey - 20)) {
        if ((ball.y - 20) >= comp.y && comp.y <= ringPosition.sy + (comp.r + 7)) {
            comp.y += 3;
        } else if ((ball.y + 20) <= comp.y && comp.y >= 0 - (comp.r + 22)) {
            comp.y -= 1.5;
        }

        if ((ball.x - 20) >= comp.x && comp.x <= ringPosition.ex + (comp.r - 105)) {
            comp.x += 2;
        } else if ((ball.x + 20) <= comp.x && comp.x >= ringPosition.sx + (comp.r + 5)) {
            comp.x -= 2.5;
        }
    } else if (ball.y >= (ringPosition.ey - 20)) {
        if (comp.y < 50) {
            comp.y += 3;
        } else if (comp.y > 55) {
            comp.y -= 1.5;
        }

        if (comp.x < ball.x && comp.x <= ringPosition.ex + (comp.r - 105)) {
            comp.x += 2;
        } else if (comp.x > ball.x && comp.x >= ringPosition.sx + (comp.r + 5)) {
            comp.x -= 2.5;
        }
    }

    // if ball offset
    if (collision(ball.x, ball.y, ringPosition.sx, 0) <= 65) {
        reset();
    }

    if (collision(ball.x, ball.y, ringPosition.ex, 0) <= 65) {
        reset();
    }

    if (collision(ball.x, ball.y, ringPosition.sx, canvas.height) <= 65) {
        reset();
    }

    if (collision(ball.x, ball.y, ringPosition.ex, canvas.height) <= 65) {
        reset();
    }

    // if goal
    if (ball.y <= 43 && ball.x >= (canvas.width / 2) - ringPosition.sx / 3 - 15 && ball.x <= (canvas.width / 2) + ringPosition.sx / 3 + 15) {
        score.player++;
        reset();
    }

    if (ball.y >= (canvas.height - 43) && ball.x >= (canvas.width / 2) - ringPosition.sx / 3 - 15 && ball.x <= (canvas.width / 2) + ringPosition.sx / 3 + 15) {
        score.comp++;
        reset();
    }
}

setInterval(() => {
    if (time.second >= 60) {
        time.second = 0;
        time.minute++;
    }
    time.second++;
}, 1000)

const main = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    init();
    controller();
    requestAnimationFrame(main);
}

main();