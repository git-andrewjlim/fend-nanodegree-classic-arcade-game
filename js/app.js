// AUTHOR: ANDREW LIM
// GITHUB: https://git-andrewjlim.github.io/fend-nanodegree-classic-arcade-game


// ===============
// GLOBAL VARIABLES
// ===============
const global = this;
const arr_characterChoices = document.querySelectorAll('#choose-character img');
const startBtn = document.querySelector('#start-game');
const restartBtn = document.querySelector('#restart-game');
const startPanel = document.querySelector('#choose-character');
const endPanel = document.querySelector('#end-screen');
const characterImage = document.querySelector('#character-winner');
let chosenCharacter = 'boy';
let player;


// ===============
// EVENT HANDLERS
// ===============


document.addEventListener('keyup', handleKeys);


// Start the game by invoking the engine (engine.js)
startBtn.addEventListener('click', function(){
    player = new Player();
    Engine(global);
    startPanel.style.display = 'none';
});


// Restart the game
restartBtn.addEventListener('click', function(){
    endPanel.style.display = 'none';
    document.addEventListener('keyup', handleKeys);
    player.resetCharacter();
});


// Highlight the chosen character on the start panel
arr_characterChoices.forEach(function(e) {
    e.addEventListener('click', function(){
        chosenCharacter = e.getAttribute('alt');
        resetCharacterGlow();
        e.setAttribute('src', `images/char-${chosenCharacter}-glow.png`);
    })
});


// Handle key functions, extracted so this can also be disabled using removeEventListner
function handleKeys(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
}


// Remove the character glows from the other characters on the start panel
function resetCharacterGlow() {
    arr_characterChoices.forEach(function(e){
        glowImageName = e.getAttribute('src');
        if(glowImageName.indexOf('-glow') != -1){
            let regularImageName = glowImageName.slice(0, glowImageName.indexOf('-glow'));
            regularImageName += '.png';
            e.setAttribute('src', regularImageName);
        }
    })
}


// Additional game properties 
// TODO: Add this to the engine.js
class GameProperties {
    constructor() {
        this.scoreText = document.querySelector('#score');
        this.characterStartingRow = 5; // Starting x point for character
        this.characterStartingCol = 2; // Starting y point for character
        this.startingCoordinatesX =  this.covertColToX(this.characterStartingCol);
        this.startingCoordinatesY =  this.convertRowToY(this.characterStartingRow,);
        this.soundWalk1 = new Audio('audio/walk.wav');
        this.soundWalk2 = new Audio('audio/walk.wav');
        this.soundWalk3 = new Audio('audio/walk.wav');
        this.soundWalk4 = new Audio('audio/walk.wav');
        this.soundHit = new Audio('audio/hit.wav');
        this.soundAchievement = new Audio('audio/achievement.wav');
        this.soundToggle = 1;

        // Define boundaries of board and also elements of map
        this.assetMap = [
            [2,2,2,2,2],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ];

        // asset Items include a name, the image reference and whether they block the character
        // TODO: add height, width and subdivision of images so that it can easily be placed on the board
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


    // Add assets to board depending upon assetMap array and assetItems object
    // TODO: Update so assets are added to board automatically, will need to add height, width and offsets for this to work correctly
    loadAssetsToBoard() {
        for(let i = 0; i<this.assetMap.length; i++){
            for(let j = 0; j<this.assetMap[i].length; j++){
                if(this.assetItems[this.assetMap[i][j]][1]) {
                    // console.log(this.assetItems[this.assetMap[i][j]][1]);
                }
            }
        }
    }


    // Show a panel for completion of game
    showGameComplete() {
        player.resetCharacter();
        gameProperties.soundAchievement.play();
        endPanel.style.display = 'block';
        document.removeEventListener('keyup', handleKeys);
        characterImage.setAttribute('src', `images/char-${chosenCharacter}.png`);
    }

    // compensate for sound overlap when keys/sounds trigger faster than length of sound
    soundOverlap() {
        if(this.soundToggle == 1) {
            this.soundWalk1.play();
            this.soundToggle++;
        } else if(this.soundToggle == 2) {
            this.soundWalk2.play();
            this.soundToggle++
        } else if(this.soundToggle == 3) {
            this.soundWalk3.play();
            this.soundToggle++
        } else if(this.soundToggle == 4) {
            this.soundWalk4.play();
            this.soundToggle = 1;
        }
    }


    // Convert assetMap row locations to Y coordinates
    // TODO: Update so it is standardised for characters of different heights
    convertRowToY(mapRow) {
        return mapRow*86 + 24;
    }


    // Convert assetMap column locations to X coordinates
    // TODO: Update so it can read the size of the image tiles within engine.js
    covertColToX(mapCol) {
        return mapCol*100.5 +20;
    }
}



// Enemies our player must avoid
var Enemy = function(speed=1) {
    this.speeds = ['slow', 'normal', 'fast'];
    this.sprite = 'images/enemy-red-bug.png';
    this.x = -120; // starting off screen position for bugs
    this.y;
    this.speed;
    this.width = 97;
    this.height = 80;


    // dynamically change which road to run on
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


    // dynamically change the speed of the bug and change the color to reflect the speed
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


    // change the color of the bugs, this is dependent upon speed
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


// Enemy update is continuously run
Enemy.prototype.update = function(dt) {
    if(this.isOffScreen()) {
        this.x = -120;  
        this.randomiseProperties();
    }
    this.x = this.x + 10 * (dt * this.speed);
    this.render();
};


// Check to see if bug is on screen and if not return to offscreen location
Enemy.prototype.isOffScreen = function() {
    let offscreen = false;
    if(this.x >= 500) {
        offscreen = true;
    }
    return offscreen;
};


// Randomise the enemy position on the road and vary their speed
Enemy.prototype.randomiseProperties = function() {
    this.changePosition(this.getRandomInt(3));
    this.changeSpeed(this.speeds[this.getRandomInt(3)]);
}


// provide a random number based under a passed limit argument
Enemy.prototype.getRandomInt = function(max) {
    return Math.floor(Math.random() * Math.floor(max));
}


// Draw the enemy on the screen, required method for game, supply with subdimensions to eliminate transparency of image
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), 3, 76, this.width, this.height, this.x, this.y, this.width, this.height);
};


// Character that the user controls
class Player {
    constructor() {
        this.character = chosenCharacter; // character type chosen from start panel
        this.sprite = `images/char-${chosenCharacter}.png`;
        this.currentMapCol = gameProperties.characterStartingCol; // maps the x position to the asset map
        this.currentMapRow =  gameProperties.characterStartingRow; // maps the y position to the asset map
        this.x = gameProperties.covertColToX(this.currentMapCol); // current x position for character - required for collision detection
        this.y = gameProperties.convertRowToY(this.currentMapRow); // current y position for character - required for collision detection

        //character details are required because characters are of different heights and may overlap onto tiles
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
    }


    // check to see if target collides with user character
    checkCollisionWithPlayer(target) {
        let hit = false;
            //check sides of target
            if (target.x+target.width >= this.x+this.characterDetails[this.character].offsetSides && target.x+target.width <= this.x+this.characterDetails[this.character].width || target.x >= this.x+this.characterDetails[this.character].offsetSides && target.x <= this.x+this.characterDetails[this.character].width) {
                // do not need full height of target to check for collision - use middle instead
                if(target.y+(target.height/2) >= this.y+this.characterDetails[this.character].offsetTop && target.y+(target.height/2) <= this.y+this.characterDetails[this.character].height) {
                    hit = true;
                }
            }
        return hit;
    } 


    // actions to take if character is hit by enemy
    characterHit(enemy) {
        gameProperties.soundHit.play();
        this.resetCharacter();
    }


    // return character to initial position after collision
    resetCharacter() {
        this.x = gameProperties.startingCoordinatesX;
        this.y = gameProperties.startingCoordinatesY;
        this.currentMapRow = gameProperties.characterStartingRow;
        this.currentMapCol = gameProperties.characterStartingCol;
    }


    // continuous updates associated with character (controlled by engine.js)
    update() {
        //check for collision
        for (let i = 0; i< allEnemies.length; i++) { 
            if(this.checkCollisionWithPlayer(allEnemies[i])) {
                this.characterHit(allEnemies[i]);
            }
        }
    }


    // render character on board, use location from assetMap
    render() {
        this.x = gameProperties.covertColToX(this.currentMapCol);
        ctx.drawImage(Resources.get(this.sprite), this.characterDetails[this.character].imageSubsetX, this.characterDetails[this.character].imageSubsetY, this.characterDetails[this.character].width, this.characterDetails[this.character].height, this.x, this.y, this.characterDetails[this.character].width, this.characterDetails[this.character].height);
    }


    // take user input for direction, check the map for blocker elements or assets if nothing blocking then move in the required direction
    // A 1 represents a blocker asset (e.g. Rock) - TODO: Add assets to page
    handleInput(inputCode) {
        switch(inputCode) {
            case 'down':
                if(this.currentMapRow < gameProperties.assetMap.length-1) {
                    if(gameProperties.assetMap[this.currentMapRow+1][this.currentMapCol]!=1) {
                        this.currentMapRow = this.currentMapRow+1;
                        this.y = gameProperties.convertRowToY(this.currentMapRow);
                        gameProperties.soundOverlap();
                    }
                }
            this.render(); 
                break;
            case 'up':
                if(this.currentMapRow >0) {
                    if(gameProperties.assetMap[this.currentMapRow-1][this.currentMapCol]!=1) {
                        // check to see if it this move will complete the game (2 is the goal area)
                        // TODO: change this so that there is a single tile for completion of game, and apply to other directions
                        if(gameProperties.assetMap[this.currentMapRow-1][this.currentMapCol]==2) {
                            gameProperties.showGameComplete();
                        } else {
                            this.currentMapRow = this.currentMapRow-1;
                            this.y = gameProperties.convertRowToY(this.currentMapRow);
                            gameProperties.soundOverlap();
                        }
                    }
                }
                this.render();
                break;
            case 'right':
                if(this.currentMapCol < gameProperties.assetMap[0].length-1) {
                    if(gameProperties.assetMap[this.currentMapRow][this.currentMapCol+1]!=1) {
                        this.currentMapCol = this.currentMapCol+1;
                        this.x = gameProperties.covertColToX(this.currentMapCol);
                        gameProperties.soundOverlap();
                    }
                }
                this.render();
                break;
            case 'left':
                if(this.currentMapCol >0) {
                    if(gameProperties.assetMap[this.currentMapRow][this.currentMapCol-1]!=1) {
                        this.currentMapCol = this.currentMapCol-1;
                        this.x = gameProperties.covertColToX(this.currentMapCol);
                        gameProperties.soundOverlap();
                    }
                }
                this.render();
                break;
            default:
                console.log('key not recognised');
                break;
        }
    }
}


// Now instantiate your objects.
const gameProperties = new GameProperties();
let objEnemy1 = new Enemy();
let objEnemy2 = new Enemy();
let objEnemy3 = new Enemy();
objEnemy1.changePosition(0);
objEnemy1.changeSpeed('slow');
objEnemy2.changePosition(1);
objEnemy2.changeSpeed('normal');
objEnemy3.changePosition(2);
objEnemy3.changeSpeed('fast');

// Place all enemy objects in an array called allEnemies
let allEnemies = [objEnemy1, objEnemy2, objEnemy3];