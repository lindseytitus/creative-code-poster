let backgroundImg;
let lenstex;
let cameratex;
let backcamtex;
let highlight;
let font;
let positions = [];
let numSpheres = 6;       // Total number of spheres
let circleRadius = 75;   // How far from the center the spheres sit

async function setup() {
  
  backgroundImg = await loadImage('./assets/background.png');
  lenstex = await loadImage('./assets/lenstex.png');
  backcamtex = await loadImage('./assets/back-camera.png');
  cameratex = await loadImage('./assets/cameratex.png');
  highlight = await loadImage('./assets/highlight.png');

  
  font = await loadFont('./assets/Staatliches-Regular.ttf');

  createCanvas(1470, 830, WEBGL);
  smooth();
  textFont(font);
  textSize(135);
  textAlign(CENTER,CENTER);


  /*
  * Positioning code provided by Google Gemini
  */

  // Populate 5 spheres in a circle, starting from the top-middle
  for (let i = 0; i < numSpheres; i++) {
    // 1. Calculate the angle for this slice
    let angle = (TWO_PI / numSpheres) * i;

    // 2. Subtract HALF_PI (90 degrees) to rotate the starting point to the top center
    let adjustedAngle = angle - HALF_PI;

    // 3. Use the adjusted angle for trigonometry
    let x = cos(adjustedAngle) * circleRadius;
    let y = (sin(adjustedAngle) * circleRadius)+100;

    positions.push({ x: x, y: y });
  }

  noStroke();

  describe('A black stippled flock camera on a red canvas with a series of lenses that track the users mouse movement. White text appears above the camera which states Big brother is watching you');
}

function draw() {
  background(192, 40, 18);
  image(backgroundImg,-740,-415,1480,840);

  //draw the text 
  fill('white');
  textStyle(BOLD);
  text('BIG BROTHER IS WATCHING YOU',0,-215);

  // Translate 2D screen mouse coordinates to WEBGL space centered at (0,0)
  let mX = mouseX - width / 2;
  let mY = mouseY - height / 2;

  //camera body
  texture(backcamtex);
  rect(-350, -200, 700, 800, 400, 400, 10, 5);
  
  //camera front
  texture(cameratex);
  rect(-250, -125, 500, 725, 400, 400, 0, 0);

  //Outer camera sensors curved cone shape
  texture(backcamtex);
  drawSensor();

  // bottom sensor contour 
  texture(backcamtex);
  circle(0,275,50);

  // bottom sensor lens 
  texture(highlight);
  circle(0,275,35);


  //highlight camera outer ring 
  texture(cameratex);
  rect(-130,-30,260,260,300,300,300,300); // rectangle as a circle because they have smoother edges in WEBGL mode


  //camera outer ring
  texture(highlight); 
  rect(-125,-25,250,250,300,300,300,300); // rectangle as a circle because they have smoother edges in WEBGL mode 


  // Outer ring central lens
  circle(0,100,80);
  
  // Inner lens border
  texture(cameratex);
  circle(0,100,70);
  
  // Inner lens
  texture(backcamtex);
  circle(0,100,50);

  // Outer lens flare
  texture(cameratex);
  circle(7,95,14);

  // Lens flare 
  texture(lenstex);
  circle(7,95,7);

  pointLight(255, 255, 255, 0, 0, 300);

  /*
  * Inspiration for tracking segment from p5js sphere reference 
  * https://p5js.org/reference/p5/sphere/
  * 
  * Tracking code provided by Google Gemini
  */ 
  for (let p of positions) {
    push();

    texture(cameratex);
    circle(p.x,p.y,60);
    translate(p.x, p.y, 0);
    
    // Calculate unique tracking angles from this sphere to the mouse
    let angleY = atan2(mX - p.x, 300); 
    let angleX = atan2(p.y - mY, 300);

    rotateY(angleY);
    rotateX(angleX);

    texture(lenstex);

    sphere(25); // Slightly smaller to look balanced in a circle

    pop(); 
  }

}

/*
* Creates a custom curved shape for the inner camera sensor 
*/
function drawSensor() {
  // Isolate styles 
  push(); 

  // Begin drawing the outer heart/teardrop shape
  beginShape();

  // created with help of following sketch: https://editor.p5js.org/squishynotions/sketches/Zpo9pYrg7
  curveVertex(-80, 365); 

  curveVertex(-130, 50);
  curveVertex(2, -30);
  curveVertex(130, 50);
  curveVertex(91, 265);
  curveVertex(10, 315);
  curveVertex(-83, 265);

  curveVertex(-130, 50);
  curveVertex(2, -44); 

  endShape(CLOSE);
  
  // Restore original canvas styles
  pop(); 
}