"use strict";

// ---------------------------------------------------------//
// FIELDS

var canvas = document.getElementById ('gameCanvas');
var context = canvas.getContext ('2d');
var timeout = 10;
var pressedButtons = { right: false, left: false };
var interval = null;
var brickColors = ['red', 'green', 'blue', 'gray', 'purple', 'yellow', 'orange'];
var keys = {
    right: ['Right', 'ArrowRight'],
    left: ['Left', 'ArrowLeft']
};

var ball = {
    x: (canvas.width / 2), y: (canvas.height - 30), 
    radius: 10, 
    startAngle: 0, endAngle: Math.PI * 2,
    color: '#0095DD'
};

var paddle = {
    height: 10, width: 75, 
    x: ((canvas.width - 75) / 2),
    y: (canvas.height - 10),
    color: '#0095DD'
};

var brickProperties = {
    rowCount: 3, columnCount: 5,
    width: 75, height: 20,
    padding: 10, offset: 30,
    destroyed: 0
};

var scoreProperties = {
    score: 0,
    fontSize: '16px',
    fontFamily: 'Arial',
    color: '#0095DD',
    x: 8, y: 20
};

var playerProperties = {
    liveInfo: {
        numberOfLives: 3,
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#0095DD',
        x: (canvas.width - 65), y: 20
    }
};

var bricks = [];

var screenLimits = {
    top: 0,
    left: 0,
    right: canvas.width,
    bottom: canvas.height,
};

var incrementer = {
    x: 2, y: -2, paddle: 7
};


// ---------------------------------------------------------//
// FUNCTIONS

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, ball.startAngle, ball.endAngle);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function drawPaddle () {
    context.beginPath ();
    context.rect (paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = paddle.color;
    context.fill ();
    context.closePath ();
}

function drawBricks () {
    for (var column = 0; column < brickProperties.columnCount; column++) {
        for (var row = 0; row < brickProperties.rowCount; row++) {
            if (bricks[column][row].status == 1) {
                var x = (column * (brickProperties.width + brickProperties.padding)) + brickProperties.offset;
                var y = (row * (brickProperties.height + brickProperties.padding)) + brickProperties.offset;

                bricks[column][row].x = x;
                bricks[column][row].y = y;

                // draws a rectangle
                context.beginPath ();
                context.rect (x, y, brickProperties.width, brickProperties.height);
                context.fillStyle = bricks[column][row].color;
                context.fill ();
                context.closePath ();
            }
        }
    }
}

function drawScore () {
    context.font = `${scoreProperties.fontSize}  ${scoreProperties.fontFamily}`;
    context.fillStyle = scoreProperties.color;
    context.fillText (`Score: ${scoreProperties.score}`, scoreProperties.x, scoreProperties.y);
}

function drawLives () {
    context.font = `${playerProperties.liveInfo.fontSize}  ${playerProperties.liveInfo.fontFamily}`;
    context.fillStyle = playerProperties.liveInfo.color;
    context.fillText (`Lives: ${playerProperties.liveInfo.numberOfLives}`, playerProperties.liveInfo.x, playerProperties.liveInfo.y);
}

function checkBrickCollisionWithBall () {
    for (var col = 0; col < brickProperties.columnCount; col++) {
        for (var row = 0; row < brickProperties.rowCount; row++) { 
            var brick = bricks[col][row];

            if (brick.status == 1) {
                if (ball.x > brick.x && ball.x < (brick.x + brickProperties.width) && 
                    ball.y > brick.y && ball.y < (brick.y + brickProperties.height)) {
                    
                    incrementer.y *= -1;
                    brick.status = 0;
                    brickProperties.destroyed++;

                    var randomScore = Math.ceil (Math.random () * 100);
                    scoreProperties.score += randomScore;

                    // winning
                    if (brickProperties.destroyed == (brickProperties.rowCount * brickProperties.columnCount)) {
                        alert (`YOU WIN, CONGRATULATIONS! Score: ${scoreProperties.score}`);
                        document.location.reload ();
                    }
                }
            }
        }
    }
}

function mainLoop () {

    context.clearRect (0, 0, canvas.width, canvas.height);
    
    drawBall ();
    drawPaddle ();
    drawBricks ();
    drawScore ();
    drawLives ();
    checkBrickCollisionWithBall ();

    // checks top / bottom edges
    if ((ball.y + incrementer.y) < ball.radius) {
        incrementer.y *= -1;
    }
    else if ((ball.y + incrementer.y) > (screenLimits.bottom - ball.radius)) {

        if (ball.x > paddle.x && ball.x < (paddle.x + paddle.width)) {
            incrementer.y *= -1;
        }
        else {
            playerProperties.liveInfo.numberOfLives--;
            if (!playerProperties.liveInfo.numberOfLives) {
                alert ('GAME OVER');
                document.location.reload ();
            }
            else {
                ball.x = (canvas.width / 2);
                ball.y = (canvas.height / 30);
                incrementer.x = 2;
                incrementer.y = -2;
                paddle.x = (canvas.width - paddle.width) / 2;
            }
        }
    }

    // checks left / right edges
    if ((ball.x + incrementer.x) < ball.radius ||
        (ball.x + incrementer.x) > (screenLimits.right - ball.radius)) {
        incrementer.x *= -1;
    }

    if (pressedButtons.right) {
        paddle.x += incrementer.paddle;
        if ((paddle.x + paddle.width) > canvas.width) {
            paddle.x = (canvas.width - paddle.width);
        }
    }
    else if (pressedButtons.left) {
        paddle.x -= incrementer.paddle;
        if (paddle.x < 0) {
            paddle.x = 0;
        }
    }
    
    ball.x += incrementer.x;
    ball.y += incrementer.y;

    requestAnimationFrame (mainLoop);
}

function init () {

    bricks = [];
    for (var column = 0; column < brickProperties.columnCount; column++) {
        bricks[column] = [];

        for (var row = 0; row < brickProperties.rowCount; row++) {
            var index = Math.floor (Math.random () * 10);
            bricks[column][row] = { 
                x: 0, y: 0, 
                color: brickColors[index],
                status: 1
            };
        }
    }

    // Listeners
    document.addEventListener ('keydown', onKeyDownHandler, false);
    document.addEventListener ('keyup', onKeyUpHandler, false);
    document.addEventListener ('mousemove', onMouseMoveHandler, false);

    mainLoop ();
}

// checks input

function onKeyDownHandler (ev) {
    if (keys.right.indexOf (ev.key) !== -1) {
        pressedButtons.right = true;
    }
    else if (keys.left.indexOf (ev.key) !== -1) {
        pressedButtons.left = true;
    }
}

function onKeyUpHandler (ev) {
    if (keys.right.indexOf (ev.key) !== -1) {
        pressedButtons.right = false;
    }
    else if (keys.left.indexOf (ev.key) !== -1) {
        pressedButtons.left = false;
    }
}

function onMouseMoveHandler (ev) {
    var relativeX = (ev.clientX - canvas.offsetLeft);
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = (relativeX - paddle.width / 2);
    }
}

init ();