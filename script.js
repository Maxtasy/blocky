const cvs = document.querySelector("#blocky");
const ctx = cvs.getContext("2d");
const gameOverMessage = document.querySelector("#gameOverMessage");
const gameOverDialogue = document.querySelector("#gameOverDialogue");
const restartButton = document.querySelector("#restartButton");
// Game update rate
const framesPerSecond = 60;
// Array for all squares
let squares = [];
// Numbers of Squares to spawn
const NUM_SQUARES = 30;
const SQ_COLORS = ["#022c7a", "#700460", "#a02c5d", "#ec0f47", 
                    "#ee6b3b", "#fbbf54", "#abd96d", "#15c286",
                    "#087353", "#045459", "#262949", "#1a1333", "#000000"];

class Square {
    constructor() {
        this.posX = Math.floor(Math.random() * (560));
        this.posY = Math.floor(Math.random() * (560));
        this.size = 40;
        this.hitpoints = SQ_COLORS.length;
        this.color = SQ_COLORS[this.hitpoints - 1];
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.posY, this.size, this.size);
        ctx.closePath();
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(this.hitpoints, this.posX + 19, this.posY + 21);
    }
}

class Ball {
    constructor() {
        this.posX = 300;
        this.posY = 300;
        this.radius = 20;
        this.color = "#fc4e03";
        this.dX = 5;
        this.dY = 4;
    }

    update() {
        this.posX += this.dX;
        this.posY += this.dY;
    }

    collisionWalls() {
        if (this.posX > 600 - this.radius || this.posX < 20) {
            this.dX *= -1;
        }

        if (this.posY > 600 - this.radius || this.posY < 20) {
            this.dY *= -1;
        }
    }

    collisionSquares() {
        for (let i = 0; i < squares.length; i++) {
            let xDistance = Math.abs(this.posX - squares[i].posX);
            let yDistance = Math.abs(this.posY - squares[i].posY);

            if (this.posX > squares[i].posX) {
                xDistance -= 20;
            } else {
                xDistance += 20;
            }

            if (this.posY > squares[i].posY) {
                yDistance -= 20;
            } else {
                yDistance += 20;
            }

            if (xDistance <= 40 && yDistance <= 40) {
                if (xDistance > yDistance) {
                    this.dX *= -1;
                } else {
                    this.dY *= -1;
                }
                squares[i].hitpoints -= 1;
                squares[i].color = SQ_COLORS[squares[i].hitpoints - 1]

                if (squares[i].hitpoints <= 0) {
                    squares.splice(i, 1);
                    break;
                }
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function runGame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    b.update();
    b.collisionWalls();
    b.collisionSquares();
    if (squares.length < 1) {
        gameOverDialogue.classList.add("show");
        clearInterval(gameLoop);
    }
    for (let i = 0; i < squares.length; i++) {
        squares[i].draw();
    }
    b.draw();
}

function newGame() {
    gameOverDialogue.classList.remove("show");
    squares = [];

    for (let i = 0; i < NUM_SQUARES; i++) {
        squares.push(new Square());
    }
    
    gameLoop = setInterval(runGame, 1000 / framesPerSecond);
}

restartButton.addEventListener("click", newGame);

// Create Ball
const b = new Ball();

// Run Game
newGame();
runGame();