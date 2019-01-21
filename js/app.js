// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 18; // starting X point for character
        this.y = 24; // starting Y point for character
        this.charWidth = 66;
        this.charHeight = 86;
        this.canvasBoundryTop = 104;
        this.canvasBoundryBottom = 18 + (this.charHeight*5);
        this.canvasBoundryLeft = 50;
        this.canvasBoundryRight = 404;
    }

    update(){
        console.log('update');
    }

    render(x = this.x, y = this.y) {
        console.log('render');
        this.x = x;
        this.y = y;
        ctx.drawImage(Resources.get(this.sprite), 18, 64, this.charWidth, this.charHeight, x, y, this.charWidth, this.charHeight);
    }

    handleInput(inputCode) {
        console.log('handleInput:' + inputCode);
        
        switch(inputCode) {
            case 'down': 
                // debugger;
                
                if (this.y <= this.canvasBoundryBottom) {
                    //move down
                    this.render(this.x, this.y + this.charHeight);
                }
                break;
            case 'up':
                if (this.y >= this.canvasBoundryTop) {
                    //move up
                    this.render(this.x, this.y - this.charHeight);
                }
                break;
            case 'right':
            if (this.x <= this.canvasBoundryRight) {
                    //move right
                    this.render(this.x + 101, this.y);
                }
                break;
            case 'left':
                if (this.x >= this.canvasBoundryLeft) {
                    //move left
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
let objEnemy = new Enemy();
// Place all enemy objects in an array called allEnemies
let allEnemies = [];
allEnemies.push(objEnemy);
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
