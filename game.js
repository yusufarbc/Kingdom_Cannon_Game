const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

//Welcome message
alert("WELCOME TO THE GAME\nUse the arrow keys to adjust the direction and power of the cannon, and the space key to shoot.")

// load sounds
let shot = new Audio();
let miss = new Audio();
let hit = new Audio();

shot.src = "sounds/strike.mp3";
miss.src = "sounds/miss.mp3";
hit.src = "sounds/hit.mp3";

//load images
let bg = new drawImg(1100, 550,  "images/bg.png", -10, -10);
let sun = new drawImg(500, 500, "images/sun.png", 70, 70);
let ship = new drawImg(220, 220, "images/ship.png", 1050, 60);
let wave = new drawImg(1100, 200, "images/wave.png", 0,  250);
let cannon = new drawImg(300, 170, "images/cannon.png", canvas.width/2,  canvas.height-50);

//game score
let score = 0;

// Cannon ball declare
let ballFlag = "False";
const ball = {
    x : canvas.width/2,
    y : (canvas.height-50),
    radius : 7,
    color : "BLACK"
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = (canvas.height-50);
}

function resetShip(){
    ship.x = 1050;
    ship.y = 60;
}

function drawBall(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function drawScore(){
    ctx.font = "30px Arial";
    ctx.fillText(score, canvas.width/2, 40);
}

function drawRect(width, height, color, x, y){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawImg(width, height, src, x, y) {

    this.image = new Image();
    this.image.src = src;
    
    this.width = width;
    this.height = height;
    this.angle = 0;    
    this.x = x;
    this.y = y;

    this.update = function(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
    }

    this.turn = function() {
        this.angle += 1 * Math.PI / 180;

        ctx.save();
        ctx.translate(this.x, this.y);        
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height); 
        ctx.restore();
    }

    this.move = function() {
        this.x -= 1;      
    }

    var wcount = 9;
    var swap1 = 0.2;
    this.wave1 = function(){
        if(wcount >= 10 | wcount <= -10){
            swap1 = swap1 * -1;
        }
        wcount += swap1;
        this.x += swap1;
    }

    var swap2 = 0.1;
    this.wave2 = function(){
        if(wcount >= 10 | wcount <= -10){
            swap2 = swap2 * -1;
        }
        wcount -= swap2;
        this.x -= swap2;
    }
    
    this.redirect = function(){
        ctx.save();
        ctx.translate(this.x, this.y);        
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.width / -2, this.height / -2, this.width, this.height); 
        ctx.restore();
    }
}

// update function checks the game rules
let count = (position.y);
function update(){
    if(ballFlag == "True"){
        count--;

        if(ball.x >= (ship.x+40) && ball.x <= (ship.x+ship.width-20) && ball.y >= (ship.y+150) && ball.y <= (ship.y+ ship.height)){
            hit.play();
            score += 10;
            resetShip();
            resetBall();
            ballFlag = "False";
        }

        if(position.x!=0){
            ball.x += position.x;
            ball.y -= 1/(Math.tan(position.x*6*Math.PI/180))*position.x;        
        }else{
            ball.y -= 10;
        }
        if(count == 0){
            miss.play();
            resetBall();
            ballFlag="False";
        }
    }

    if((ship.x+ship.width)<=0){
        resetShip();
        score-=10;
    }
}

// render function does all the drawing
function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bg.wave2()
    bg.update();
    sun.turn();
    ship.move();
    ship.update();
    wave.wave1();
    wave.update();
    if(ballFlag == "True"){
        drawBall(ball.x,ball.y,ball.radius,ball.color);
    }
    cannon.redirect();
    drawScore();
    // power bar
    for(i=0 ; i<((position.y/5)-2) ; ++i){
        drawRect(20,20,"#555555",950, canvas.height-40 - i*30);
    }
}

// recurring game function
function game(){
    update();
    render();
}

// game loop
let loop = setInterval(game,200);

// position of cannon
const position = {
    x : 0,
    y : 25
}
// Cannon redirect process
window.onkeydown = function(event){
    
    switch(event.keyCode){
        //arrowLeft
        case 37:
            moveLeft();
            break;
        //arrowUp
        case 38:
            moveUp();
            break;
        //arrowRight
        case 39:
            moveRight();
            break;
        //arrowDown
        case 40:
            moveDown();
            break;
        case 32:
            strike();
            break;
    }


}
//power is around 1-5
function moveUp(){
    if(position.y<40)
    position.y += 5;
}
function moveDown(){
    if(position.y>15)
        position.y -= 5;
}

//cannon turns +-60 degree
function moveRight(){
    if(position.x<10){
        position.x += 1;
        cannon.angle += 6 * Math.PI / 180;
    }
}
function moveLeft(){
    if(position.x>-10){
        position.x -= 1;
        cannon.angle -= 6 * Math.PI / 180;
    }
}
// strike function is started to move the ball
function strike(){
    count = position.y;
    ballFlag="True";
    shot.play();
}