var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "'height='" + CANVAS_HEIGHT + "'></canvas>");

var canvas = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');

var FPS = 30;

var playerBullets = [];
var enemies = [];

function Enemy(I) {
    I = I || {};
    I.active = true;
    I.age = Math.floor(Math.random() * 128);
    I.color = "#A2B";
    I.x = Math.random() * CANVAS_WIDTH;
    I.y = 0;
    I.xVelocity = 0;
    I.yVelocity = 2;
    I.width = 32;
    I.height = 32;

    I.inBounds = function () {
        return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.draw = function () {
        //canvas.fillStyle = this.color;
        //canvas.fillRect(this.x, this.y, this.width, this.height);
        canvas.drawImage(invaders, this.x, this.y, this.width, this.height);
    };

    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;
        I.age++;
        //randomizing the speed at which the objects move horizontally as they fall
        I.xVelocity = 3 * Math.sin(I.age * Math.PI / 64);

        I.active = I.active && I.inBounds();
    };

    I.explode = function () {
        this.active = false;
    }

    return I;
};

function Bullet(I) {
    I.active = true;

    I.xVelocity = 0;
    I.yVelocity = -I.speed;
    I.width = 3;
    I.height = 3;
    I.color = "red";

    I.inBounds = function () {
        return I.x >= 0 && I.x <= CANVAS_WIDTH && I.y >= 0 && I.y <= CANVAS_HEIGHT;
    };

    I.draw = function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    };

    I.update = function () {
        I.x += I.xVelocity;
        I.y += I.yVelocity;
        I.active = I.active && I.inBounds();
    };
    return I;
}

var player = {
    color: "red",
    x: 220,
    y: 270,
    width: 32,
    active: true,
    height: 32,
    draw: function () {
        /*canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);*/
        if (this.active) {
            canvas.drawImage(ship, this.x, this.y, this.width, this.height);
        } else {
            gameOver();
        }
    },
    shoot: function () {
        //console.log("PEW PEW");
        var bulletPosition = this.midpoint();

        playerBullets.push(Bullet({
            speed: 5,
            x: bulletPosition.x,
            y: bulletPosition.y
        }));
    },
    midpoint: function () {
        return {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    },
    explode: function () {
        this.active = false;
    }
};

setInterval(function () {
    update();
    draw();
}, 1000 / FPS);

function update() {
    if (keydown.space) {
        player.shoot();
    }
    if (keydown.left && player.x > 0) {
        player.x -= 5;
    }
    if (keydown.right && player.x < (CANVAS_WIDTH - player.width)) {
        player.x += 5;
    }

    playerBullets.forEach(function (bullet) {
        bullet.update();
    });

    playerBullets = playerBullets.filter(function (bullet) {
        return bullet.active;
    });

    enemies.forEach(function (enemy) {
        enemy.update();
    });
    enemies = enemies.filter(function (enemy) {
        return enemy.active;
    });
    if (Math.random() < 0.1) {
        enemies.push(Enemy());
    }
    handleCollisions();
};

function collides(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function gameOver() {
    alert("Game Over");
}

function handleCollisions() {
    playerBullets.forEach(function (bullet) {
        enemies.forEach(function (enemy) {
            if (collides(bullet, enemy)) {
                enemy.explode();
                bullet.active = false;
            }
        });
    });
    enemies.forEach(function (enemy) {
        if (collides(enemy, player)) {
            enemy.explode();
            player.explode();
        }
    });
}

function draw() {
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    player.draw();
    playerBullets.forEach(function (bullet) {
        bullet.draw();
    });
    enemies.forEach(function (enemy) {
        enemy.draw();
    });
}

$(document).ready(function () {
    $("#btnClose").click(function (evt) {
        $("#dvNotify").slideUp('fast');
    });
    $("#btnShow").click(function (evt) {
        $("#dvNotify").slideDown('fast');
    })
});
