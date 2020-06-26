import utils from './utils';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];


// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
})

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
})

// Objects
class Star {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: (Math.random() -0.5) * 10, 
      y:3
    };
    this.gravity = 1;
    this.friction = 0.8;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.shadowColor = '#e3eaef';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
  }

  shatter(){
    this.radius -= 3;
    for(let i=0; i<8; i++){
      ministars.push(new Ministar(this.x, this.y, 2));
    }
  }

  update() {
    if(this.y + this.radius + this.velocity.y > canvas.height - groundHeight){
      this.velocity.y = -this.velocity.y * this.friction;
      this.shatter();
    } else {
      this.velocity.y += this.gravity;
    }
    if(this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0){
      this.velocity.x = -this.velocity.x* this.friction;
      this.shatter();
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw();
  }
}

class Ministar extends Star {
  constructor(x,y,radius,color){
    super(x,y,radius,color);
    this.velocity = {
      x: utils.randomIntFromRange(-5,5), 
      y: utils.randomIntFromRange(-15,15)
    };
    this.gravity = 0.1;
    this.friction = 0.8;
    this.ttl = 100 //time to live
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(227,234,239, ${this.opacity})`;
    c.shadowColor = '#e3eaef';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    if(this.y + this.radius + this.velocity.y > canvas.height - groundHeight){
      this.velocity.y = -this.velocity.y * this.friction;
    } else {
      this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.ttl -= 1;
    this.opacity -= 1/this.ttl;

    this.draw();
  }
}
function createMountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    c.beginPath();
    const mountainWidth = canvas.width/mountainAmount;
    c.moveTo(i * mountainWidth, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
    c.lineTo(i * mountainWidth + mountainWidth/2, canvas.height - height);
    c.lineTo(i * mountainWidth - 325, canvas.height);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

// Implementation
const backgroundGradiant = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradiant.addColorStop(0, 'rgba(23, 30, 38, 0.7)');
backgroundGradiant.addColorStop(1, 'rgba(63, 88, 107, 0.7)');

let stars;
let ministars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
let groundHeight  = 100;

function init() {
  stars = [];
  ministars = [];
  backgroundStars = [];

  for (let i = 0; i < 150; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 3;
    backgroundStars.push(new Star(x, y, radius, 'white'));
  }
}  

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = backgroundGradiant;
  c.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach(backgroundStar => {
    backgroundStar.draw();
  });
  
  createMountainRange(1,canvas.height - 50,'#384551');
  createMountainRange(2,canvas.height - 200,'#283843');
  createMountainRange(3,canvas.height - 400,'#26333E');

  c.fillStyle = '#182028';
  c.fillRect(0,canvas.height - groundHeight, canvas.width, groundHeight);

  stars.forEach( (star, index) => {
    star.update();
    if(star.radius <= 0){
      stars.splice(index, 1);
    }
  });

  ministars.forEach((ministar, index) => {
    ministar.update();
    if(ministar.ttl == 0){
      ministars.splice(index, 1);
    }
  });

  ticker++;

  if(ticker % randomSpawnRate == 0){
    const radius = 15;
    const x = Math.max(radius, Math.random() * canvas.width - radius);
    stars.push(new Star(x, -100, radius , 'white'));
    randomSpawnRate = utils.randomIntFromRange(75, 200);
  }
}

init();
animate();
