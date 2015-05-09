var animFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            null;

var tics = 0;
var _timeToBeAlive = 30;

//Canvas
var divArena;
var canArena;
var canScore;
var conArena;
var conScore;
var ArenaWidth = 500;
var ArenaHeight = 300;

//Background
var imgBackground;
var xBackgroundOffset = 0;
var xBackgroundSpeed = 1;
var backgroundWidth = 1782;
var backgroundHeight = 600;
//une modification

///////////////////////////////////
//Keys
var keys = {
    UP: 38,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13
};

var keyStatus = {};

function keyDownHandler(event) {
    "use strict"; 
    var keycode = event.keyCode, 
        key; 
    for (key in keys) {
        if (keys[key] === keycode) {
            keyStatus[keycode] = true;
            event.preventDefault();
        }
    }
}
function keyUpHandler(event) {
   var keycode = event.keyCode,
            key;
    for (key in keys) 
        if (keys[key] == keycode) {
            keyStatus[keycode] = false;
        }
        
    }
///////////////////////////////////

imgPlayer = new Image();
imgPlayer.src = "./assets/Ship/Spritesheet_64x29.png";
imgPlayer.onload = function(){
    
};

//Animation
Animation = function(url, length, width, height){
    this.tabOffscreenCanvas = new Array();
    this.width = width;
    this.height = height; 
    this.length = length;
    this.ready = false;
    this.cpt = 0;
    var image = new Image();
    image.src = url;
    var that = this;
    image.onload = function(){
        that.ready = true;
        var offscreenCanvas, offscreenContext;
        for(var j=0;j<that.length;j++){ 
			offscreenCanvas = document.createElement("canvas");
			offscreenCanvas.width = that.width;
			offscreenCanvas.height = that.height;
			offscreenContext = offscreenCanvas.getContext("2d");
         offscreenContext.drawImage(image,0,j*that.height,that.width,that.height,0,0,that.width,that.height);
			that.tabOffscreenCanvas.push(offscreenCanvas);
        }
    }
}

Animation.prototype.clear = function(x,y){
    conArena.clearRect(x,y,this.width,this.height);
}
Animation.prototype.update = function(){
    if(tics % 5 == 1) {
        this.cpt = (this.cpt + 1) % this.length;
    }
}
Animation.prototype.draw = function(x,y){
    if(this.ready){
        conArena.drawImage(this.tabOffscreenCanvas[this.cpt],x,y);
    }
}

//Perso
Perso = function (x, y, speed) {
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.explode = false;
	this.exists = true;
};

Perso.prototype.getSpeed = function() {
	return this.speed;
}

Perso.prototype.setSpeed = function(speed) {
	this.speed = speed;
}

Perso.prototype.getX = function() {
	return this.x;
}

Perso.prototype.setX = function(x) {
	this.x = x;
}

Perso.prototype.getY = function() {
	return this.y;
}

Perso.prototype.setY = function(x) {
	this.y = y;
}

Perso.prototype.fires = function() {
	var Tir = new Projectile(this.x, this.y, 4*this.speed, this.side);
	Projectiles.add(Tir);
}

Perso.prototype.collision = function() {
	this.explodes;
}

Perso.prototype.explodes = function() {
	this.explode = true;
	this.exists = false;
}

Perso.prototype.draw = function() {
	if(this.explode == true)
    {
    	this.explosion.draw(this.x, this.y);
    }
    else
    {
    	this.animation.draw(this.x, this.y);
    }
}

Perso.prototype.update = function(){
    this.animation.update();  
    this.x=this.x+this.speed;
};

Perso.prototype.clear = function(){
    this.animation.clear(this.x, this.y);
};

//Player
Player = function(x, y, speed) {
	Perso.call(this, x, y, speed);
	this.animation = new Animation("./assets/Ship/Spritesheet_64x29.png", 4, 29, 64);
	this.explosion = new Animation("./assets/Explosion/explosionSpritesheet_128x1280.png",10,128,128);
	this.nbOfLives = 2;
	this.nbhits = 0;
	this.side = -1; //Sens du projectile
}

Player.prototype = Object.create(Perso.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = function() {
	this.draw();
}

Player.prototype.explodes = function() {
	this.explodes = true;
	this.nbhits ++;
	this.nbOfLives --;
	if(this.nbhits == nbOfLives)
	{
		this.exists = false;
	}
}

Player.prototype.draw = function() {
	if(this.explode == true)
    {
    	this.explosion.draw(this.x, this.y);
    	this.explode = false;
    }
    else
    {
    	this.animation.draw(this.x, this.y);
    }
}

Player.prototype.update = function() {
	var keycode;
        if(tics % 10 == 1) {
                this.cpt = (this.cpt + 1) % 4;
            }
        if(this.timeToBeAlive>0) {
            this.timeToBeAlive --;
        }else{
            for (keycode in keyStatus) {
                if(keyStatus[keycode] == true){
                    if(keycode == keys.UP) {
                        this.y -= this.speed;
                        if(this.y<0) this.y=0;
                    }
                    if(keycode == keys.DOWN) {
                        this.y += this.speed;
                        if(this.y>ArenaHeight-this.height) this.y=ArenaHeight-this.height;
                    }
                    if(keycode == keys.SPACE) {
                        //shoot
                        this.fires();
                    }
                }
             keyStatus[keycode] = false;
            }
        }
}

//Enemy
Enemy = function(x, y, speed) {
	Perso.call(this, x, y, speed);
	this.yOrigine = y;
	this.animation = new Animation("./assets/Enemy/eSpritesheet_40x30.png",6,40,30);
   this.explosion = new Animation("./assets/Explosion/explosionSpritesheet_128x1280.png",10,128,128);
   this.side = 1; //Sens du projectile
}

Enemy.prototype = Object.create(Perso.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
	 if(this.explode == false){//is not exploding
            this.x +=   this.speed ;
            this.y = this.yOrigine+ ArenaHeight/3 * Math.sin(this.x / 100);
            /*var tmp = this.collision([Player]);
                if(tmp != null){
                    tmp.explodes();
                    this.exists = false;
                }*/

            if(tics % 5 == 1) {
                    this.cpt = (this.cpt + 1) % 6;
            }
            if(tics % 50 == 1) this.fires();
       }else{
            if(tics % 3 == 1) {
                this.cptExplosion++;
            }
            if(this.cptExplosion>10){//end of animation
                this.cptExplosion=0;
                this.exists = false;
            }
        }
}

//Tab enemies
enemies = {
    init : function(){
        this.tabEnemies = new Array();
    },
    add : function (enemy) {
        this.tabEnemies.push(enemy);
    },
    remove : function () {  
        this.tabEnemies.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<-50){
                  delete array[index];
            }
        });
    },
    draw : function(){ 
        this.tabEnemies.map(function(obj){
            obj.draw();
        });
    },
    clear : function(){
       this.tabEnemies.map(function(obj){
            obj.clear();
        });
    },
    update : function(){
        if(tics % 100 == 1) {
            var rand = Math.floor(Math.random() * ArenaHeight);
            this.add(new Enemy(ArenaWidth, rand,-2));
        }
        this.tabEnemies.map(function(obj){
            obj.update();
        });
         this.remove();
    }
};

//Projectile
Projectile = function (x, y, speed, side){
	Perso.call(this, x, y, speed);
	this.animation = new Animation("./assets/Ship/Spritesheet_64x29.png", 4, 29, 64);
	this.explosion = new Animation("./assets/Explosion/explosionSpritesheet_128x1280.png",10,128,128);
}

Projectile.prototype = Object.create(Perso.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function(){
    this.animation.update();  
    this.x=this.x+this.side*this.speed;
};

//Tab Projectiles
Projectiles = {
    init : function(){
        this.tabProjectiles = new Array();
    },
    add : function (Projectile) {
        this.tabProjectiles.push(Projectile);
    },
    remove : function () {  
        this.tabProjectiles.map(function(obj,index,array){
            if(obj.exists == false ||obj.x >ArenaWidth || obj.x<-50){
                  delete array[index];
            }
        });
    },
    draw : function(){ 
        this.tabProjectiles.map(function(obj){
            obj.draw();
        });
    },
    clear : function(){
       this.tabProjectiles.map(function(obj){
            obj.clear();
        });
    },
    update : function(){
         this.remove();
         this.tabProjectiles.map(function(obj){
            obj.update();
            /*if(obj.exists == false) {//hit
                score = score +1;
            }*/
        })
    }
};

function updateScene() {
    "use strict"; 
    xBackgroundOffset = (xBackgroundOffset - xBackgroundSpeed) % backgroundWidth;
}
function updateItems() {
    "use strict"; 
    Player.update();
    tics++;
     if(tics % 100 == 1) {
         var rand = Math.floor(Math.random() * ArenaHeight);
			enemies.add(new Enemy(ArenaWidth, rand,-2));
	}
    enemies.update();
}
function drawScene() {
    "use strict"; 
    canArena.style.backgroundPosition = xBackgroundOffset + "px 0px" ;
}
function drawItems() {
    "use strict"; 
    Player.draw();
    enemies.draw();
}
function clearItems() {
    "use strict"; 
    Player.clear(); 
    enemies.clear();
}

function clearScore() {
    conScore.clearRect(0,0,300,50);
}
function drawScore() {
    conScore.fillText("life : "+Player.nbOfLives, 10, 25);
    //conScore.fillText("score : "+Player.projectileSet.score, 150,25);
}
function updateGame() {
    "use strict"; 
    updateScene();
    updateItems();
}
function clearGame() {
    "use strict"; 
    clearItems();
    clearScore();
}

function drawGame() {
    "use strict"; 
    drawScene();
    drawScore();
    drawItems();    
}


function mainloop () {
    "use strict"; 
    clearGame();
    updateGame();
    drawGame();
}

function recursiveAnim () {
    "use strict"; 
    mainloop();
    animFrame( recursiveAnim );
}
 
function init() {
    "use strict";
    divArena = document.getElementById("arena");
    canArena = document.createElement("canvas");
    canArena.setAttribute("id", "canArena");
    canArena.setAttribute("height", ArenaHeight);
    canArena.setAttribute("width", ArenaWidth);
    conArena = canArena.getContext("2d");
    divArena.appendChild(canArena);

    canScore = document.createElement("canvas");
    canScore.setAttribute("id","canScore");
    canScore.setAttribute("height", ArenaHeight);
    canScore.setAttribute("width", ArenaWidth);
    conScore = canScore.getContext("2d");
    conScore.fillStyle = "rgb(200,0,0)";
    conScore.font = 'bold 12pt Courier';
    divArena.appendChild(canScore);

 
    Player = new Player(20, 100, 10);
    Player.init();
    enemies.init();
    Projectiles.init();
    
window.addEventListener("keydown", keyDownHandler, false);
window.addEventListener("keyup", keyUpHandler, false);
    
    animFrame( recursiveAnim );
    
}

window.addEventListener("load", init, false);
