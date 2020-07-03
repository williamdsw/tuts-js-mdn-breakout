"use strict";

function start () {
    var canvas = document.getElementById ('gameCanvas');
    var context = canvas.getContext ('2d');

    var redSquare = {
        x: 20, y: 40, width: 50, height: 50,
        color: '#FF0000'
    };

    var greenCircle = {
        x: 240, y: 160, radius: 20, 
        startAngle: 20, endAngle: Math.PI * 2,
        anticlockwise: false,
        color: 'green'
    };

    var blueRect = {
        x: 160, y: 10, width: 100, height: 40,
        strokeColor: 'rgba(0, 0, 255, 0.5)'
    };

    // draws a red square
    context.beginPath ();
    context.rect (redSquare.x, redSquare.y, redSquare.width, redSquare.height);
    context.fillStyle = redSquare.color;
    context.fill ();
    context.closePath ();

    // draws a green circle
    context.beginPath ();
    context.arc (greenCircle.x, greenCircle.y, greenCircle.radius, greenCircle.startAngle, greenCircle.endAngle, greenCircle.anticlockwise);
    context.fillStyle = greenCircle.color;
    context.fill ();
    context.closePath ();

    // draws a blue rect
    context.beginPath ();
    context.rect (blueRect.x, blueRect.y, blueRect.width, blueRect.height);
    context.strokeStyle = blueRect.strokeColor;
    context.stroke ();
    context.closePath ();
}

start ();
