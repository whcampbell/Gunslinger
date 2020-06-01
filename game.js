// A Will Campbell production
// thank you for... closely examining my game?

// load in html elements
let button = document.getElementById("butt"); // haha
canvas = document.getElementById("myCanvas");
context = canvas.getContext("2d");

let mouseX = -10;  // mouse X coord
let mouseY = -10;  // mouse Y coord
let started = false;  // game state
let locked = 0;  // holds player's choice
let loaded = 3;  // holds gun state
let outLoaded = 3;  // holds outlaw gun state
let then = 0;  // holds previous time
let timer = 3;  // holds time to display
let won = false;  // player has won
let lost = false;  // player has lost

// load in image elements
//outlaw
let outImg = new Image();
outImg.src = "./Outlaw.png"
// fire states
let fireUns = new Image();
fireUns.src = "./Fire_Uns.png";
let fireSel = new Image();
fireSel.src = "./Fire_Sel.png";
let fireGray = new Image();
fireGray.src = "./Fire_Gray.png";
// loader states
let loadUns = new Image();
loadUns.src = "./Load_Uns.png";
let loadSel = new Image();
loadSel.src = "./Load_Sel.png";
// shield states
let shieldUns = new Image();
shieldUns.src = "./Shield_Uns.png";
let shieldSel = new Image();
shieldSel.src = "./Shield_Sel.png";


/**
 * draws basic scene and runs the loop when
 * button is clicked
 */
button.onclick = function start() {
    if (started) {
        return;
    }
    console.log("Reach for the sky!");
    started = true;
    then = performance.now();
    background();
    cowboy();
    outlaw();
    fire();
    load();
    shield();
    time();
    loop();
}

/**
 * timer loop
 */
function loop() {
    console.log("running");
    let now = performance.now();
    if (now - then > 3000) {
        // timer is up
        then = performance.now();
        outcome();
    } else if (now - then > 2000 && timer == 2) {
        // timer ticks to 1
        timer = 1;
        if (locked == 0)
        reset();
        window.requestAnimationFrame(loop);
    } else if (now - then > 1000 && timer == 3) {
        // timer ticks to 2
        timer = 2;
        if (locked == 0)
        reset();
        window.requestAnimationFrame(loop);
    } else {
        // timer does not change
        window.requestAnimationFrame(loop);
    }
}

/**
 * ascertain the mouse position on the canvas
 * highlights buttons if position is good
 */
canvas.onmousemove = function(event) {
    if (!started || locked != 0) {
        return;
    }
    mouseX = event.clientX;
    mouseY = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    mouseX -= box.left;
    mouseY -= box.top;
    let val = check(mouseX, mouseY);
    switch (val) {
        case 1:  // hover load
            reset();
            context.drawImage(loadSel, 260, 200);
            break;
        case 2:  // hover fire
            reset();
            if (loaded == 0) {
                break;
            }
            context.drawImage(fireSel, 370, 200);
            break;
        case 3:  // hover shield
            reset();
            context.drawImage(shieldSel, 480, 200);
            break;
        case -1:  // no hover
            reset();
            break;
    }
};

/**
 * checks mouse position, then selects a button if position is good
 */
canvas.onclick = function() {
    if (!started || locked != 0) {
        return;
    }
    let val = check(mouseX, mouseY);
    switch (val) {
        case 1:  // select load
            background();
            cowboy();
            outlaw();
            context.drawImage(loadSel, 260, 200);
            locked = 1;
            break;
        case 2:  // select fire
            if (!loaded) {
                break;
            }
            background();
            cowboy();
            outlaw();
            context.drawImage(fireSel, 370, 200);
            locked = 2;
            break;
        case 3:  // select shield
            background();
            cowboy();
            outlaw();
            context.drawImage(shieldSel, 480, 200);
            locked = 3;
            break;
    }
}

/**
 * shows the outcome of the shootout
 */
function outcome() {
    console.log("DRAW!");
    let outMove = genOutlaw();
    let cowFire = false;
    let cowShield = false;
    switch (locked) {  // player's move
        case 0:
            // player couldn't decide what to do
            background();
            cowboy();
            outlaw();
            context.fillText("Not ready!", 50, 50, 150);
            locked = -1;
            break;
        case 1:
            // player loads
            if (loaded < 6) {
                loaded += 1;
                context.fillText("CLICK!", 50, 50, 100);
            } else {
                context.fillText("Full!", 50, 50);
            }
            break;
        case 2:
            // player fires
            loaded -= 1;
            cowFire = true;
            context.fillText("BANG!", 50, 50, 100);
            break;
        case 3:
            // player shields
            cowShield = true;
            context.fillText("Take cover!", 50, 50, 150);
            break;
    }

    switch (outMove) {  // switch for outlaw's move
        case 1:
            // outlaw loads
            outLoaded += 1;
            context.fillText("CLICK!", 450, 50);
            if (cowFire) {
                won = true;
            }
            break;
        case 2:
            // outlaw loads
            outLoaded -= 1;
            context.fillText("BANG!", 450, 50);
            if (cowFire) {
                context.fillText("Draw!", 265, 140);
            } else if (!cowShield) {
                lost = true;
            }
            break;
        case 3:
            // outlaw loads
            context.fillText("Take cover!", 400, 50);
            break;
    }
    
    then = performance.now();
    display();
}

/**
 * display results of a round for a short time
 * call lose, win, or main loop depending on result
 */
function display() {
    now = performance.now();
    if (now - then < 1000) {  // delay for one second
        window.requestAnimationFrame(display);
    } else { 
        //  check conditions, call correct method
        if (lost) {
            window.requestAnimationFrame(lose);
        } else if (won) {
            window.requestAnimationFrame(win);
        } else {
            // reset and restart main loop
            locked = 0;
            then = performance.now();
            timer = 3;
            reset();
            window.requestAnimationFrame(loop);
        }
    }
}

/**
 * calculates the outlaw's move
 */
function genOutlaw() {
    let rand = Math.random();
    if (outLoaded == 0) {  // outlaw has no bullets
        if (rand < .7) {
            return 1;
        } else {
            return 3;
        }
    } else if (outLoaded < 6) {  // outlaw has some bullets
        if (rand < .3) {
            return 1;
        } else if (rand < .6) {
            return 2;
        } else {
            return 3;
        }
    } else {  // outlaw is full
        if (rand < .7) {
            return 2;
        } else {
            return 3;
        }
    }
}


/**
 * redraw the whole scene in its basic state
 */
function reset() {
    background();
    cowboy();
    outlaw();
    fire();
    load();
    shield();
    time();
}

/**
 * checks if the current position is over one of the buttons
 * 
 * @param {*} x coord of mouse
 * @param {*} y coord of mouse
 */
function check(x, y) {
    if (y > 200 && y < 275) {
        if (x > 260 && x < 360) {  // load button
            return 1;
        } else if (x > 370 && x < 470) {  // fire button
            return 2;
        } else if (x > 480 && x < 580) {  // shield button
            return 3;
        }
    }
    return -1; // no buttons
}


/**
 * draws the dusty desert background
 */
function background() {
    context.save();
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "deepskyblue";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "peru";
    context.fillRect(0, 150, 600, 150);
    context.fillStyle = "yellow";
    context.strokeStyle = "yellow";
    context.arc(300, 50, 20, 0, Math.PI * 2);
    context.fill();
    context.closePath();
    context.beginPath();
    context.arc(300, 50, 30, 0, Math.PI / 3);
    context.stroke();
    context.closePath();
    context.beginPath();
    context.arc(300, 50, 35, Math.PI, 3 * Math.PI / 2);
    context.stroke();
    context.restore();
}

/**
 * draws the cowboy main character
 */
function cowboy() {

    // head
    context.save();
    context.fillStyle = "black";
    context.beginPath();
    context.arc(120, 150, 40, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // body 
    context.fillStyle = "red";
    context.fillRect(60, 180, 120, 120);

    // right arm
    context.beginPath();
    context.moveTo(180, 180);
    context.lineTo(220, 230);
    context.lineTo(220, 270);
    context.lineTo(200, 270);
    context.lineTo(200, 240);
    context.lineTo(180, 210);
    context.closePath();
    context.fill();

    // left arm
    context.beginPath();
    context.moveTo(60, 180);
    context.lineTo(20, 230);
    context.lineTo(20, 270);
    context.lineTo(40, 270);
    context.lineTo(40, 240);
    context.lineTo(60, 210);
    context.closePath();
    context.fill();

    //right hand
    context.beginPath();
    context.fillStyle = "black";
    context.arc(210, 275, 15, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // left hand
    context.beginPath()
    context.arc(30, 275, 15, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // close out
    context.restore();
}

function time() {
    context.font = "30px Courier";
    context.fillText(timer, 450, 50, 50);
}

/**
 * checks for existence, draws the outlaw antagonist
 */
function outlaw() {
    //hello I am f u n c t i o n
    if (outImg) {
        context.drawImage(outImg, 480, 53);
    }
}

/**
 * checks for existence, draws the fire button
 */
function fire() {
    if (loaded) {
        if (fireUns) {
            context.drawImage(fireUns, 370, 200);
        }
    } else {
        if (fireGray) {
            context.drawImage(fireGray, 370, 200);
        }
    }
}

/**
 * checks for existence, draws the load button
 */
function load() {
    if (loadUns) {
        context.drawImage(loadUns, 260, 200);
    }
}

/**
 * checks for existence, draws the shield button
 */
function shield() {
    if (shieldUns) {
        context.drawImage(shieldUns, 480, 200);
    }
}

/**
 * displays win message
 */
function win() {
    console.log("good shootin pardner");
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillText("You Won!", 235, 120);
    context.fillText("Thanks for playing my game!", 70, 200);
}

/**
 * displays lose message
 */
function lose() {
    console.log("get along lil doggie");
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillText("You lost!", 235, 150);
}