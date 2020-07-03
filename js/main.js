"use strict";

var canvas = document.getElementById ('gameCanvas');
var context = canvas.getContext ('2d');
var timeout = 10;

var ball = {
    x: (canvas.width / 2), y: (canvas.height - 30), 
    radius: 10, 
    startAngle: 0, endAngle: Math.PI * 2,
    color: '#0095DD'
};

var screenLimits = {
    top: 0,
    left: 0,
    right: canvas.width,
    bottom: canvas.height,
};

var incrementer = {
    x: 2, y: -2
};

function draw () {

    context.clearRect (0, 0, canvas.width, canvas.height);
    
    drawBall();

    ball.x += incrementer.x;
    ball.y += incrementer.y;

    // checks top / bottom edges
    if (ball.y + incrementer.y < ball.radius || 
        ball.y + incrementer.y > screenLimits.bottom - ball.radius) {
        incrementer.y *= -1;
    }

    // checks left / right edges
    if (ball.x + incrementer.x < ball.radius ||
        ball.x + incrementer.x > screenLimits.right - ball.radius) {
        incrementer.x *= -1;
    }
}

// draws the ball
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, ball.startAngle, ball.endAngle);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

setInterval (draw, timeout);


