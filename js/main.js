"use strict";

// ---------------------------------------------------------//
// FIELDS

var canvas = document.getElementById ('gameCanvas');
var context = canvas.getContext ('2d');
var timeout = 10;
var pressedButtons = {
    right: false, left: false
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

function draw () {

    context.clearRect (0, 0, canvas.width, canvas.height);
    
    drawBall ();
    drawPaddle ();

    // checks top / bottom edges
    if ((ball.y + incrementer.y) < ball.radius || 
        (ball.y + incrementer.y) > (screenLimits.bottom - ball.radius)) {
        incrementer.y *= -1;
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
}

// checks input

function keydownHandler (ev) {
    if (ev.key == 'Right' || ev.key == 'ArrowRight') {
        pressedButtons.right = true;
    }
    else if (ev.key == 'Left' || ev.key == 'ArrowLeft') {
        pressedButtons.left = true;
    }
}

function keyupHandler (ev) {
    if (ev.key == 'Right' || ev.key == 'ArrowRight') {
        pressedButtons.right = false;
    }
    else if (ev.key == 'Left' || ev.key == 'ArrowLeft') {
        pressedButtons.left = false;
    }
}


document.addEventListener ('keydown', keydownHandler, false);
document.addEventListener ('keyup', keyupHandler, false);

setInterval (draw, timeout);