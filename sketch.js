let rectangles = [];
let images = [], currentImage;
let settings = {
  numRects: 20,
  minW: 60,
  maxW: 160,
  rectH: 30,
  animationType: 'sine',
  animationSpeed: 0.01,
  useRandomColor: true,
  showBackground: true,
  useCircles: false
};

function preload() {
  const imageNames = [
    'cloud1.png', 'cloud2.png', 'cloud3.png',
    'cloud4.png', 'cloud5.png', 'cloud6.png', 'cloud7.png'
  ];
  images = preloadImages(imageNames);
}

function setup() {
  createCanvas(960, 720).parent(document.body);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  setupUI();
  randomizeAll();
}

function draw() {
  if (settings.showBackground && currentImage) {
    image(currentImage, 0, 0, width, height);
  } else {
    background(0);
  }
  rectangles.forEach(r => {
    r.update();
    r.display();
  });
}

function randomizeAll() {
  currentImage = random(images);
  Object.assign(settings, {
    numRects: int(random(10, 50)),
    minW: int(random(20, 80)),
    maxW: int(random(settings.minW + 40, settings.minW + 200)),
    rectH: int(random(10, 100)),
    animationSpeed: random(0.005, 0.03),
    animationType: random(['sine', 'wander']),
    useRandomColor: random([true, false])
  });
  initRectangles();
}

function initRectangles() {
  rectangles = [];
  let tries = 0;
  while (rectangles.length < settings.numRects && tries < 1000) {
    let w = random(settings.minW, settings.maxW);
    let x = random(0, width - w);
    let y = random(0, height - settings.rectH);
    let r = new AnimatedRect(x, y, w, settings.rectH);
    if (!rectangles.some(existing => r.overlaps(existing))) {
      rectangles.push(r);
    }
    tries++;
  }
}

class AnimatedRect {
  constructor(x, y, w, h) {
    Object.assign(this, {
      baseX: x, baseY: y, x, y, w, h,
      offset: random(TWO_PI),
      speed: settings.animationSpeed,
      color1: settings.useRandomColor ? randomColorHSB() : color(0, 0, 100),
      color2: settings.useRandomColor ? randomColorHSB() : color(0, 0, 80),
      noiseSeedX: random(1000),
      noiseSeedY: random(1000)
    });
  }

  update() {
    if (settings.animationType === 'sine') {
      this.y = this.baseY + sin(frameCount * this.speed + this.offset) * 10;
    } else {
      this.x = this.baseX + noise(this.noiseSeedX + frameCount * this.speed) * 20 - 10;
      this.y = this.baseY + noise(this.noiseSeedY + frameCount * this.speed) * 10 - 5;
    }
  }

  display() {
    for (let i = 0; i < this.w; i++) {
      let inter = map(i, 0, this.w, 0, 1);
      let c = lerpColor(this.color1, this.color2, inter);
      fill(c);
      if (settings.useCircles) {
        ellipse(this.x + i, this.y + this.h / 2, 2, this.h);
      } else {
        rect(this.x + i, this.y, 1, this.h);
      }
    }
  }

  overlaps(other) {
    return !(this.x + this.w < other.x || this.x > other.x + other.w ||
             this.y + this.h < other.y || this.y > other.y + other.h);
  }
}