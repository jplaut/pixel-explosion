var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var FRAME_RATE = 60;
var ACCEL = 0.1;
var RADIUS_MULTIPLIER = 1;
var RADIUS = 50;
var VELOCITY_MULTIPLIER = 1;
var canvas;
var context;
var pixels = [];
var interval;
var pixel_size = 3;
var num_pixels = 40;
var tail_length = 1;
var mouseX;
var mouseY;
var mouseIsDown;

init();

function init() {
  canvas = document.getElementById('c');
  mouseX = window.innerWidth-CANVAS_WIDTH;
  mouseY = window.innerHeight-CANVAS_HEIGHT;

  if (canvas && canvas.getContext) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener('mouseup', handleMouseUp, false);

    handleWindowResize();

    context = canvas.getContext('2d');
    createPixel();

    interval = setInterval(draw, 1000/FRAME_RATE);
  }
}

function handleWindowResize() {
  canvas.style.left = ((window.innerWidth-CANVAS_WIDTH) / 2) + 'px';
  canvas.style.top = ((window.innerHeight-CANVAS_HEIGHT) / 2) + 'px';
}


function handleMouseMove(event) {
  mouseX = event.clientX - (window.innerWidth - CANVAS_WIDTH) * .5;
  mouseY = event.clientY - (window.innerHeight - CANVAS_HEIGHT) * .5;
}

function handleMouseDown(event) {
  mouseIsDown = true;
}

function handleMouseUp(event) {
  mouseIsDown = false;
}

function handleInput(param) {
  switch(param.name) {
    case "quantity":
      num_pixels = param.value;
      break;
    case "size":
      pixel_size = param.value;
      break;
    case "length":
      tail_length = param.value;
      break;
    default:
      break;
  }
}

function createPixel() {
  var angle = Math.random() * Math.PI + Math.PI; 
  var originX = Math.round(mouseX + RADIUS * Math.cos(angle));
  var originY = Math.round(mouseY + RADIUS * Math.sin(angle));

  var pixel = {
    position: {
      x: originX,
      y: originY
    },
    tail: {
      x: originX,
      y: originY
    },
    velocity: {
      x: Math.random() * 3 * VELOCITY_MULTIPLIER * Math.cos(angle),
      y: Math.random() * 2 * VELOCITY_MULTIPLIER - 2 * VELOCITY_MULTIPLIER
    },
    color: '#' + (Math.random() * 0x404040 + 0xaaaaaa | 0).toString(16)
  }

  pixels.push(pixel);
  drawPixel(pixel);
}

function drawPixel(pixel) {
  if (tail_length == 1) {
    context.fillStyle = pixel.color;
    context.fillRect(pixel.position.x, pixel.position.y, pixel_size, pixel_size);
  } else {
    context.beginPath();
    context.strokeStyle = pixel.color;
    context.lineWidth = pixel_size;
    context.moveTo(pixel.tail.x, pixel.tail.y);
    context.lineTo(pixel.position.x, pixel.position.y);
    context.stroke();
  }
}

function draw() {
  handleWindowResize();
  context.fillStyle = '#000';
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (mouseIsDown) {
    RADIUS_MULTIPLIER = 3;
    VELOCITY_MULTIPLIER = 4;
  } else {
    RADIUS_MULTIPLIER = 1;
    VELOCITY_MULTIPLIER = 1;
  }

  for (var i=0; i < pixels.length; i++) {
    var pixel = pixels[i];
    pixel.velocity.y += ACCEL;
    pixel.position.x += pixel.velocity.x;
    pixel.position.y += pixel.velocity.y;
    pixel.tail.x += pixel.velocity.x / tail_length;
    pixel.tail.y += pixel.velocity.y / tail_length;

    if (pixel.tail.y > CANVAS_HEIGHT) {
      pixels.splice(i, 1);
    } else {
      drawPixel(pixel);
    }
  }

  for (var i=0; i < num_pixels; i++) {
    createPixel();
  }
}