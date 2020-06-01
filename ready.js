let cString = "#F08080";
let cNum = 0;
let body = document.getElementById("body");

let redNum = 0;
let blueNum = 0;

window.onload = function test() {
    console.log("Pay no attention to the man behind the curtain!");
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    context.clearRect(0,0,width, height);
    ready(context, width, height);
    body.style.backgroundColor = cString;
    fade();
}

function ready(context, width, height) {
    context.font = "30px Courier";
    context.fillText("Ready?", 250, 150, 200);
}

function fade() {
    let theta = performance.now() / 5000;
    redNum = Math.cos(theta + Math.PI / 3) * 127 + 127;
    redNum = redNum - redNum % 1;
    if (redNum < 16) {
        redNum = 16;
    }
    blueNum = Math.sin(theta) * 63 + 192;
    blueNum = blueNum - blueNum % 1;
    cNum = 65536 * redNum + 32768 + blueNum;
    cString = "#" + cNum.toString(16);
    body.style.backgroundColor = cString;
    window.requestAnimationFrame(fade);
}
