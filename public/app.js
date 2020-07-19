/* No arrow functions, classes use (this) keyword */

// the player, enemies & levels
let character;
let enemies = [];
let backImg;
let levelCounter = 0;

// adjust file name & path for images & uncomment
function preload() {
    /* we can get pretty granular here, preloading images for
        all potential enemies (will need new classes for each) */
    charImg = loadImage('./images/player/smile.gif');
    enemyGrImg = loadImage('./images/enemies/devil.gif');
    enemyAirImg = loadImage('./images/enemies/ghost.gif');
    backImg = loadImage('./images/backgrounds/mystic-forest.jpg');
    digital = loadFont('./fonts/digital-7.ttf');
};

/* called first in draw, run backgrounds, check where they are in scroll,
    call levelSwitch() to see when to change */
function levelScroll() {
    // create two background images
    image(backImg, x, 0, width, height);
    image(backImg, x2, 0, width, height);
    // decrement values along x axis (move right to left)
    x -= scroll;
    x2 -= scroll;
    // once the images have scrolled complete off, reset
    if (x < -width) {
        x = width;
        levelCounter++;
        console.log(levelCounter);
        levelSwitch();
    }
    if (x2 < -width) {
        x2 = width;
        levelCounter++;
        console.log(levelCounter);
        levelSwitch();
    }
}

// switch case to change levels and enemies!
function levelSwitch() {
    switch (true) {
        case (levelCounter >= 9 && levelCounter < 19):
            backImg = loadImage('./images/backgrounds/pink-mountains.jpg');
            enemyGrImg = loadImage('./images/enemies/robot.gif');
            enemyAirImg = loadImage('./images/enemies/ghost.gif');
            lev++;
            i++;
            levelBanner();
            break;
        case (levelCounter >= 19 && levelCounter < 29):
            backImg = loadImage('./images/backgrounds/winter.jpg');
            enemyGrImg = loadImage('./images/enemies/poo.gif');
            enemyAirImg = loadImage('./images/enemies/robot.gif');
            lev++;
            i++;
            levelBanner();
            break;
        case (levelCounter >= 29 && levelCounter < 39):
            backImg = loadImage('./images/backgrounds/ocean.jpg');
            enemyGrImg = loadImage('./images/enemies/ghost.gif');
            enemyAirImg = loadImage('./images/enemies/poo.gif');
            lev++;
            i++;
            levelBanner();
            break;
        // for now, at 49+ it just keeps playing indefinitely
        case (levelCounter >= 39 && levelCounter < 49):
            backImg = loadImage('./images/backgrounds/lava.jpg');
            enemyGrImg = loadImage('./images/enemies/devil.gif');
            enemyAirImg = loadImage('./images/enemies/ghost.gif');
            lev++;
            i++;
            levelBanner();
            break;
        /* HERE could trigger win with some function? */
        // case (levelCounter >= 49):
        //     writeYouWonFunc();
        //     break;
        // OR...
        /* RESTART from level one and keep scoring points! */
        // case (levelCounter >= 49):
        //     levelCounter = 0;
        //     backImg = loadImage('./images/backgrounds/mystic-forest.jpg');
        //     enemyGrImg = loadImage('./images/enemies/devil.gif');
        //     enemyAirImg = loadImage('./images/enemies/ghost.gif');
        //     lev = 1;
        //     i = 0;
        //     levelBanner();
        //     break;
    }
};

// level banner
let lev = 1;
let i = 0;
const levMsg = ["Yeah!", "Woo!", "Cool!", "Nice!", "Hot!"];
function levelBanner() {
    let levelNum = select("#levelNum");
    /* the levMsg stuff might be dumb. if cut, also remove let i = 0;
        and the i++; in each switch/case */
    levelNum.html(`Level ${lev} - ${levMsg[i]}`);
}

// lives banner
let lives = 3;
function livesCounter() {
    let livesNum = select("#livesNum");
    livesNum.html(`Lives : ${lives}`)
}

// setup our game arena
function setup() {
    // adjust canvas size according to background gif
    createCanvas(900, 450);
    character = new Character();
    // scoreboard counter in var for start/stop
    runScore = setInterval(scoreCounter, 100);
    // line up our second image, see below
    x2 = width;
};


// scoreboard
let counter = 0; // send to database at gameover
function scoreCounter() {
    let userScore = select("#scoreboard");
    counter++;
    userScore.html(counter);
}

function resetSketch() {
    /* blank for now, future home of more complex functions? like score saving,
        options to redirect to home etc. see playAgain() below */
};

// player controls
function keyPressed() {
    // spacebar or up arrow jump
    if (key === ` ` || keyCode === UP_ARROW) {
        character.jump()
    }
    // fire projectiles??
    if (keyCode === 70) {
        character.shoot() // not real yet
    }
};

// vars for background scroll & lives
let x = 0;
let x2;
let scroll = 4;
// draws the scene in a loop, p5 functionality
function draw() {
    // run background & check level status
    levelScroll();
    // add character
    character.show();
    character.move();
    // fill array with some randomly generated enemies
    enemyCreator();
    // then send our array of badguys
    for (let i of enemies) {
        // random millisecond value between 2 & 3k
        let rando = Math.floor(Math.random() * (3250 - 2250 + 1) + 2250);
        setTimeout(i.show(), i.move(), rando);
        // if you get hit, lose life. if out of lives, kill loop & playAgain()
        if (character.hits(i)) {
            lives--;
            livesCounter();
            i.hide();
            if (lives === 0) {
                noLoop();
                clearInterval(runScore);
                playAgain();
            }
            else {
                // make the got-hit sound? firey explosions??
            }
        }
    }
};

// enemy logic: first, random chance at having enemy
function enemyCreator() {
    // random() is p5 method: add more EnemyGround than EnemyAir
    if (random(0, 1) < 0.007) {
        enemies.push(enemy = new EnemyGround());
    }
    if (random(0, 1) < 0.003) {
        enemies.push(new EnemyAir());
    }
};

// temporary death function, use something nice like a Bootstrap modal
function playAgain() {
    // modal: OK reloads, Cancel should eventually take user to homescreen
    if (confirm(`Would you like to play again?`)) {
        // resetSketch(); make if fancy? just reload for now
        location.reload();
    }
    else {
        console.log(`Game Over`);
    }
};