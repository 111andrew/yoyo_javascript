// select canvas element
const canvas = document.getElementById("yoyo");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

const yoyo_string_len = 50;
const gravity = 9.8;
const mass = 1 ; //kg but should cancel out

// Ball object
const ball = {
    x : 0,
    y : 0,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    accelX : 0,
    accelY : 0,
    color : "WHITE"
}


// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

const user = {
  x : 0,
  y : 0
}

// listening to the mouse
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  user.x = evt.pageX - rect.left;
  user.y = evt.pageY - rect.top;
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw text
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function update(){
  // time peorid passes is 1/50 seconds per update
  // ball.x = user.x;
  // ball.y = user.y;
  const dt = 1/50;

  var distance_to_user = Math.sqrt(Math.pow(ball.x-user.x,2) + Math.pow(ball.y-user.y,2));
  var vector_to_user_x = (user.x - ball.x) / distance_to_user;
  var vector_to_user_y = (user.y - ball.y) / distance_to_user;

  var theta = Math.tan(vector_to_user_x / vector_to_user_y);

  if (distance_to_user < yoyo_string_len){
    ball.accelY = gravity;
  }
  else{
    var mgcos = mass * gravity * Math.cos(theta);

    var tension_force_x = -mgcos * Math.sin(theta);
    var tension_force_y = mgcos * Math.cos(theta);
    ball.accelX = tension_force_x / mass;
    ball.accelY = (-mass * gravity + tension_force_y) / mass;
  }

  ball.velocityX += ball.accelX * dt;
  ball.velocityY += ball.accelY * dt;

  ball.x += ball.velocityX * dt;
  ball.y += ball.velocityY * dt;

}

// render function, the function that does al the drawing
function render(){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

      // draw the user score to the left
    drawText(user.y,canvas.width/4,canvas.height/5);

    // draw the COM score to the right
    drawText(ball.y,3*canvas.width/4,canvas.height/5);

    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}
// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);
