var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "'height='" + CANVAS_HEIGHT + "'></canvas>");

var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

var FPS = 30;
var x = 50;
var y = 50;
var dx = 2;
var dy = 2;

var player = {
    color: "red",
    x: 220,
    y: 270,
    width: 32,
    height: 32,
    draw: function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};

setInterval(function () {
    update();
    draw();
}, 1000 / FPS);

function update() {
    x += dx;
    y += dy;
}

function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    /*canvas.font = "bold 20px cursive";
    canvas.fillStyle = "black";
    canvas.fillText("Hello, World.", x, y);*/
    player.draw();

}
