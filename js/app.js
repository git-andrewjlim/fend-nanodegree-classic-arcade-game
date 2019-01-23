class GameProperties {
    constructor() {
        this.scoreText = document.querySelector('#score');
        this.score = 0;
        this.goalHeight;
        this.goalWidth;
        this.goalX = 0;
        this.goalY = 0;
    }

    displayScore(){
        this.scoreText.innerHTML = this.score;
    }

    addScore(points) {
        this.score += points;
    }
}



// Enemies our player must avoid
var Enemy = function(speed=1) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.speeds = ['slow', 'normal', 'fast'];
    this.sprite = 'images/enemy-red-bug.png';
    this.x = -120;
    this.y;
    this.speed;
    this.width = 97;
    this.height = 80;


    this.changePosition = function(position = 1) {

        //change position of bug;
        if(position === 0) {
            this.y = 135;
        } else if(position === 1) {
            this.y = 220;
        } else if(position === 2) {
            this.y = 305;
        }
    }

    this.changeSpeed = function(speed = 'normal') {
        if(speed === 'slow') {
            this.speed = 15;
            this.changeColor('blue');
        } else if(speed === 'normal') {
            this.speed = 30;
            this.changeColor('red');
        } else if(speed === 'fast') {
            this.speed = 45;
            this.changeColor('yellow');
        }
    }

    this.changeColor = function(color) {
        if(color === 'red') {
            this.sprite = 'images/enemy-red-bug.png';
        } else if(color === 'blue') {
            this.sprite = 'images/enemy-blue-bug.png';
        } else if(color === 'yellow') {
            this.sprite = 'images/enemy-yellow-bug.png';
        }
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log('enemy update');
    if(this.isOffScreen()) {
        this.x = -120;  
        this.randomiseProperties();
    }
    this.x = this.x + 10 * (dt * this.speed);
    this.render();
};

Enemy.prototype.isOffScreen = function() {
    let offscreen = false;
    if(this.x >= 500) {
        offscreen = true;
    }
    return offscreen;
};

Enemy.prototype.randomiseProperties = function() {

    this.changePosition(this.getRandomInt(3));
    this.changeSpeed(this.speeds[this.getRandomInt(3)]);
}

Enemy.prototype.getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 3, 76, this.width, this.height, this.x, this.y, this.width, this.height);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 220; // starting X point for character
        this.y = 454; // starting Y point for character
        this.offsetY = 20; // accounts for the head overlapping over the next tile (ignore overlap)
        this.width = 66;
        this.height = 86;
        this.canvasBoundryTop = 101;
        this.canvasBoundryBottom = 18 + (this.height*5);
        this.canvasBoundryLeft = 50;
        this.canvasBoundryRight = 404;
        this.scored = false;
    }

    checkCollisionWithPlayer(target) {
        //return true if width and x && height and y, is the same as this x+ width && height + y
        let hit = false;
            //check sides of target
            if (target.x+target.width >= this.x && target.x+target.width <= this.x+this.width || target.x >= this.x && target.x <= this.x+this.width) {
                //check top and bottom of target
                if(target.y+target.height >= this.y+this.offsetY && target.y+target.height <= this.y+this.height || target.y >= this.y+this.offsetY && target.y <= this.y+this.height) {
                    hit = true;
                }
            }
        return hit;
        
    } 

    characterHit(enemy) {
        // console.log(' CRASH!!!');
        // console.log('PLAYER DATA \n player.x: ' + this.x + '\n player.x+player.width: ' + (this.x+this.width) + '\n player.y: ' + this.y + '\n player.y+player.height: ' + (this.y+this.height) + '\n player.y+player.offsetY: ' + this.y+this.offsetY);
        // console.log('ENEMY DATA \n enemy.x: ' + enemy.x + '\n enemy.x+enemy.width: ' + (enemy.x+enemy.width) + '\n enemy.y: ' + enemy.y + '\n enemy.y+enemy.height: ' + (enemy.y+enemy.height));
        this.resetCharacter();
    }

    resetCharacter() {
        this.x = 220; // starting X point for character
        this.y = 454; // starting Y point for character
    }

    checkSuccess() {
        if(this.y < this.canvasBoundryTop) {
            gameProperties.addScore(1);
            gameProperties.displayScore();
        }
    }

    update() {
        //check for collision
        for (let i = 0; i< allEnemies.length; i++) { 
            if(this.checkCollisionWithPlayer(allEnemies[i])) {
                this.characterHit(allEnemies[i]);
                // allEnemies[i].speed = 0; // debug to see collision stop
            }
        }


    }

    render(x = this.x, y = this.y) {
        this.x = x;
        this.y = y;
        ctx.drawImage(Resources.get(this.sprite), 18, 64, this.width, this.height, x, y, this.width, this.height);
    }

    handleInput(inputCode) {
        console.log('handleInput:' + inputCode);
        
        switch(inputCode) {
            // debugger;
            case 'down': 
                if (this.y <= this.canvasBoundryBottom) {
                    this.render(this.x, this.y + this.height);
                }
                break;
            case 'up':
                if (this.y >= this.canvasBoundryTop) {
                    this.render(this.x, this.y - this.height);
                    this.checkSuccess();
                }
                break;
            case 'right':
            if (this.x <= this.canvasBoundryRight) {
                    this.render(this.x + 101, this.y);
                }
                break;
            case 'left':
                if (this.x >= this.canvasBoundryLeft) {
                    this.render(this.x - 101, this.y);
                }
                break;
            default:
                console.log('key not recognised');
                break;
        }
    }
}


// Now instantiate your objects.
let objEnemy1 = new Enemy();
let objEnemy2 = new Enemy();
let objEnemy3 = new Enemy();
objEnemy1.changePosition(0);
objEnemy1.changeSpeed('slow');
objEnemy2.changePosition(1);
objEnemy2.changeSpeed('normal');
objEnemy3.changePosition(2);
objEnemy3.changeSpeed('fast');
const gameProperties = new GameProperties();

// Place all enemy objects in an array called allEnemies
let allEnemies = [objEnemy1, objEnemy2, objEnemy3];


// Place the player object in a variable called player
const player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
