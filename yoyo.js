// select canvas element
const canvas = document.getElementById("yoyo");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');
// time step and also referesh step
const dt = 1/100;

const yoyo_string_len = 100;
const gravity = 9.8;
const mass = 1 ; //kg but should cancel out

var display_1_param = 0;
var display_2_param = 0;

// Ball object
const ball = {
    x : 300,
    y : 200,
    radius : 10,
    velocityX : 0,
    velocityY : 0,
    accelX : 0,
    accelY : 0,
    color : "WHITE",
    total_energy : 0,
    kinetic_energy : 0,
    potential_energy : 0
}

// Rope object
const rope = {
    tension_force : 0,
    tension_force_x : 0,
    tension_force_y : 0,
    free_length : yoyo_string_len,
    stiffness : 1,
}


// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    var new_x = x;
    var new_y = 400 - y;
    ctx.arc(new_x,new_y,r,0,Math.PI*2,true);
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
  user.y = 400 - (evt.pageY - rect.top);
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

function textUpdate(){
  document.getElementById("kinetic_energy_text").textContent=ball.kinetic_energy.toFixed(2);
  document.getElementById("potential_energy_text").textContent=ball.potential_energy.toFixed(2);
  document.getElementById("ball_pos_text").textContent=("X: " + ball.x.toFixed(2) + "   Y: " + ball.y.toFixed(2));
  document.getElementById("user_pos_text").textContent=("X: " + user.x.toFixed(2) + "   Y: " + user.y.toFixed(2));
  document.getElementById("rope_tension_text").textContent=("X: " +
  rope.tension_force_x.toFixed(2) + "   Y: " + rope.tension_force_y.toFixed(2));

}


function update(){
  // time peorid passes is 1/50 seconds per update
  // ball.x = user.x;
  // ball.y = user.y;
  textUpdate();


  // update distance and angles
  var distance_to_user = Math.sqrt(Math.pow(ball.x-user.x,2) + Math.pow(ball.y-user.y,2));
  var vector_to_user_x = - (user.x - ball.x) / distance_to_user;
  var vector_to_user_y = - (user.y - ball.y) / distance_to_user;

  var sign_user_to_yoyo_x = Math.sign(user.x - ball.x);
  var sign_user_to_yoyo_y = Math.sign(user.y - ball.y);

  var theta = Math.abs(Math.tan(vector_to_user_x / vector_to_user_y));

  // update energies
  var velocity_mag = Math.sqrt(Math.pow(ball.velocityX,2) + Math.pow(ball.velocityY,2));

  ball.kinetic_energy = 0.5 * mass * Math.pow(velocity_mag,2);
  ball.potential_energy = mass * gravity * ball.y; // need to figure out reference
  ball.total_energy = ball.kinetic_energy + ball.potential_energy;

  display_1_param = distance_to_user;

  if (distance_to_user < yoyo_string_len){
    var force_x = 0;
    var force_y = -gravity * mass;
  }

  else{

    // rope.tension_force = ball.kinetic_energy / mass;
    // try modeling the string as a string
    rope.tension_force = Math.abs(distance_to_user - rope.free_length) * rope.stiffness;

    rope.tension_force_x = rope.tension_force * Math.sin(theta) * sign_user_to_yoyo_x;
    rope.tension_force_y = rope.tension_force * Math.cos(theta) * sign_user_to_yoyo_y;

    var force_x = rope.tension_force_x;
    var force_y = rope.tension_force_y - gravity * mass;

  }

  ball.accelX = force_x / mass;
  ball.accelY = force_y / mass;

  ball.velocityX += ball.accelX * dt;
  ball.velocityY += ball.accelY * dt;

  ball.x += ball.velocityX * dt; // direction of canvas
  ball.y += ball.velocityY * dt;

}

// render function, the function that does al the drawing
function render(){
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

      // draw the user score to the left
    //drawText(display_1_param, canvas.width/4, canvas.height/5);

    // draw the COM score to the right
    //drawText(display_2_param, 3*canvas.width/4, canvas.height/5);

    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

// number of frames per second
let framePerSecond = 1 / dt;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);
