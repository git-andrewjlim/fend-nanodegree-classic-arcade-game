const arr_characterChoices = document.querySelectorAll('#choose-character img');
const startBtn = document.querySelector('#start-game');
const startPanel = document.querySelector('#choose-character');
let chosenCharacter = 'boy';
const global = this;
let player;

arr_characterChoices.forEach(function(e) {
    e.addEventListener('click', function(){
        chosenCharacter = e.getAttribute('alt');
        resetCharacterGlow();
        e.setAttribute('src', `images/char-${chosenCharacter}-glow.png`);
    })
});

startBtn.addEventListener('click', function(){
    player = new Player();
    Engine(global);
    startPanel.style.display = 'none';
});

function resetCharacterGlow() {
    arr_characterChoices.forEach(function(e){
        
        glowImageName = e.getAttribute('src');
        
        if(glowImageName.indexOf('-glow') != -1){
            let regularName = glowImageName.slice(0, glowImageName.indexOf('-glow'));
            regularName += '.png';
            e.setAttribute('src', regularName);
        }
    })
}



class GameProperties {
    constructor() {
        this.scoreText = document.querySelector('#score');
        this.score = 0;
        this.canvasBoundryTop = 110;
        this.canvasBoundryBottom = 368; 
        this.canvasBoundryLeft = 19;
        this.canvasBoundryRight = 421;
        this.assetMap = [
            [2,2,2,2,2],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ];
        this.characterStartingRow = 5; //starting at 0
        this.characterStartingCol = 2; //starting at 0

        this.startingCoordinatesX =  this.covertColToX(this.characterStartingCol);
        this.startingCoordinatesY =  this.convertRowToY(this.characterStartingRow,);
        // this.startingCoordinates = this.calculateCoordinates(this.characterStartingRow,this.characterStartingCol);
        // asset Items include a name, the image reference and whether they block the character
        this.assetItems = {
            0: ['clear', '' ,false],
            1: ['rock', 'images/Rock.png', true],
            2: ['goal', 'images/Selector.png', false],
            3: ['green gem','images/Gem Green.png', false],
            4: ['blue gem','images/Gem Blue.png', false],
            5: ['orange gem','images/Gem Orange.png', false],
            6: ['star','images/Star.png', false],
            7: ['key','images/Key.png', false],
            8: ['heart','images/Heart.png', false]
        }
    }

    // calculateCoordinates(mapRow, mapCol) {
    //     return {
    //         x: mapCol*100.5 +20,
    //         y: mapRow*86 + 24
    //     }
    // }

    loadAssetsToBoard() {
        for(let i = 0; i<this.assetMap.length; i++){
            for(let j = 0; j<this.assetMap[i].length; j++){
                // console.log('i: ' + i + ' j: ' + j);
                // console.log(this.assetMap[i][j]);
                // console.log(this.assetItems[this.assetMap[i][j]][1]);
                if(this.assetItems[this.assetMap[i][j]][1]) {
                    console.log(this.assetItems[this.assetMap[i][j]][1]);
                }
            }
        }
    }

    showGameComplete() {
        const endPanel = document.querySelector('#end-screen');
        console.log(endPanel);
        endPanel.style.display = 'block';
    }

    convertRowToY(mapRow) {
        return mapRow*86 + 24;
    }

    covertColToX(mapCol) {
        return mapCol*100.5 +20;
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
    // this.changePosition(1); // debug
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
        this.characterDetails = {
            /* 
                height: the height of the character after subset is removed (used for collision detection)
                width: the height of the character after subset is removed (used for collision detection)
                offsetTop: accounts for the head overlapping over the next tile (ignore overlap)
                offsetSides: accounts for space of curve of head (ignore overlap)
                imageSubsetX: the x coordinates of the subset of the usable image of the character (ignores the transparency)
                imageSubsetY: the y coordinates of the subset of the usable image of the character (ignores the transparency)

            */
            'boy': {height: 86, width:66, offsetSides:5, offsetTop: 26, imageSubsetX: 18, imageSubsetY: 63},
            'cat-girl': {height: 89,width:66, offsetSides:5, offsetTop: 29, imageSubsetX: 18, imageSubsetY: 61},
            'horn-girl': {height: 89, width:66, offsetSides:5, offsetTop: 29, imageSubsetX: 18, imageSubsetY: 61},
            'pink-girl': {height: 86, width:66, offsetSides:5, offsetTop: 20, imageSubsetX: 18, imageSubsetY: 63},
            'princess-girl': {height: 96, width:66, offsetSides:5, offsetTop: 20, imageSubsetX: 18, imageSubsetY: 52}
        }
        this.character = chosenCharacter;
        this.sprite = `images/char-${chosenCharacter}.png`;
        // this.x = gameProperties.startingCoordinates.x; // starting X point for character
        // this.y = gameProperties.startingCoordinates.y; // starting Y point for character

        this.currentMapCol = gameProperties.characterStartingCol; // maps the x position to the asset map
        this.currentMapRow =  gameProperties.characterStartingRow; // maps the y position to the asset map
        this.x = gameProperties.covertColToX(this.currentMapCol);
        this.y = gameProperties.convertRowToY(this.currentMapRow);
        this.scored = false;
    }

    checkCollisionWithPlayer(target) {
        //return true if width and x && height and y, is the same as this x+ width && height + y
        let hit = false;
            //check sides of target
            if (target.x+target.width >= this.x+this.characterDetails[this.character].offsetSides && target.x+target.width <= this.x+this.characterDetails[this.character].width || target.x >= this.x+this.characterDetails[this.character].offsetSides && target.x <= this.x+this.characterDetails[this.character].width) {
                // do not need full height of target to check for collision
                if(target.y+(target.height/2) >= this.y+this.characterDetails[this.character].offsetTop && target.y+(target.height/2) <= this.y+this.characterDetails[this.character].height) {
                    console.log('y hit');
                    hit = true;
                }
            }
        return hit;
        
    } 

    characterHit(enemy) {
        this.resetCharacter(); // comment this debug collision detection
    }

    resetCharacter() {
        // this.x = 220; // starting X point for character
        // this.y = 454; // starting Y point for character
        this.x = gameProperties.startingCoordinatesX;
        this.y = gameProperties.startingCoordinatesY;
        this.currentMapRow = gameProperties.characterStartingRow;
        this.currentMapCol = gameProperties.characterStartingCol;
    }

    checkSuccess() {
        if(this.y < gameProperties.canvasBoundryTop) {
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

    movePlayerThroughMap(direction) {
        switch(direction) {
            case 'down': 
            if(this.currentMapRow < gameProperties.assetMap.length-1) {
                console.log('sliding down');
                //assuming 1 is a rock (if more than a rock then put in an array)
                if(gameProperties.assetMap[this.currentMapRow+1][this.currentMapCol]!=1) {
                    this.currentMapRow = this.currentMapRow+1;
                    this.y = gameProperties.convertRowToY(this.currentMapRow);
                } else {
                    console.log('youre blocked');
                }
            }
                break;
            case 'up':
                if(this.currentMapRow >0) {
                    console.log('moving on up');
                    //assuming 1 is a rock (if more than a rock then put in an array)
                    if(gameProperties.assetMap[this.currentMapRow-1][this.currentMapCol]!=1) {
                        if(gameProperties.assetMap[this.currentMapRow-1][this.currentMapCol]==2) {
                            gameProperties.showGameComplete();
                        } else {
                            this.currentMapRow = this.currentMapRow-1;
                            this.y = gameProperties.convertRowToY(this.currentMapRow);
                        }

                        
                    } else {
                        console.log('youre blocked');
                    }
                }
                
                break;
            case 'right':
            
            if(this.currentMapCol < gameProperties.assetMap[0].length-1) {
                console.log('I am right');
                //assuming 1 is a rock (if more than a rock then put in an array)
                if(gameProperties.assetMap[this.currentMapRow][this.currentMapCol+1]!=1) {
                    this.currentMapCol = this.currentMapCol+1;
                    this.x = gameProperties.covertColToX(this.currentMapCol);
                } else {
                    console.log('youre blocked');
                }
            }
            break;
            
                break;
            case 'left':
                if(this.currentMapCol >0) {
                    console.log('moving left');
                    //assuming 1 is a rock (if more than a rock then put in an array)
                    if(gameProperties.assetMap[this.currentMapRow][this.currentMapCol-1]!=1) {
                        this.currentMapCol = this.currentMapCol-1;
                        this.x = gameProperties.covertColToX(this.currentMapCol);
                    } else {
                        console.log('youre blocked');
                    }
                }
                break;
        }
    }

    render() {
        this.x = gameProperties.covertColToX(this.currentMapCol);
        // this.y = gameProperties.convertRowToY(this.currentMapRow);
        ctx.drawImage(Resources.get(this.sprite), this.characterDetails[this.character].imageSubsetX, this.characterDetails[this.character].imageSubsetY, this.characterDetails[this.character].width, this.characterDetails[this.character].height, this.x, this.y, this.characterDetails[this.character].width, this.characterDetails[this.character].height);
    }

    handleInput(inputCode) {
        switch(inputCode) {
            // debugger;
            case 'down':
            this.movePlayerThroughMap('down');
            this.render(); 
                // if (this.y <= gameProperties.canvasBoundryBottom) {
                //     this.render(this.x, this.y + this.characterDetails[this.character].height);
                // }
                break;
            case 'up':
                this.movePlayerThroughMap('up');
                this.render();
                // if (this.y >= gameProperties.canvasBoundryTop) {
                //     // you can check using a map (yet to build) whether the item above is a blocked asset (if it is a rock dont move on it)
                //     this.render(this.x, this.y - this.characterDetails[this.character].height);
                //     this.checkSuccess();
                // }
                break;
            case 'right':
                this.movePlayerThroughMap('right');
                this.render();
            // if (this.x <= gameProperties.canvasBoundryRight) {
            //         this.render(this.x + 101, this.y);
            //     }
                break;
            case 'left':
                this.movePlayerThroughMap('left');
                this.render();
                // if (this.x >= gameProperties.canvasBoundryLeft) {
                //     this.render(this.x - 101, this.y);
                // }
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
gameProperties.loadAssetsToBoard();

// Place all enemy objects in an array called allEnemies
let allEnemies = [objEnemy1, objEnemy2, objEnemy3];


function handleKeys(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// document.addEventListener('keyup', function(e) {
//     var allowedKeys = {
//         37: 'left',
//         38: 'up',
//         39: 'right',
//         40: 'down'
//     };

//     player.handleInput(allowedKeys[e.keyCode]);
// });
document.addEventListener('keyup', handleKeys);
