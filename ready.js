let body = document.getElementById("body");

window.onload = function test() {
    console.log("Pay no attention to the man behind the curtain!");
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let width = canvas.width;
    let height = canvas.height;
    context.clearRect(0,0,width, height);
    ready(context, width, height);
}

function ready(context, width, height) {
    context.font = "30px Courier";
    context.fillText("Ready?", 250, 150, 200);
}
