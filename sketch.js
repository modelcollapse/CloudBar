// sketch.js

// ... (Keep all existing global variables: shapes, numShapes, etc.) ...
let shapes = [];
let numShapes = 20;
let minPrimarySize = 60;
let maxPrimarySize = 160;
let shapeHeight = 30;
let currentShapeType = 'rectangle';
let animationType = 'sine';
let animationSpeed = 0.01;
let useRandomColor = true; 
let showBackground = true;
let shapeAlpha = 100; 

let fixedColor1_H = 0, fixedColor1_S = 100, fixedColor1_B = 100; 
let fixedColor2_H = 240, fixedColor2_S = 100, fixedColor2_B = 100; 

let prismMode = false; 
let useRandomPerShapeAlpha = false;

let images = []; 
let currentImage;
let anImageHasLoaded = false; 

const CANVAS_SIZE = 720;
// RAINBOW_COLORS array is not used with this direct hue sweep approach for prism.

// --- Color Generation Functions (generateHarmonizedRandomColors, setRandomFixedColors) ---
// These remain the same as in the previous version. I'll include them for completeness.
function generateHarmonizedRandomColors() {
    let c1, c2;
    let strategy = floor(random(5));
    let baseHue = random(360);
    let satRange = [70, 100];
    let briRange = [75, 100];
    if (strategy === 0) {
        c1 = color(random(360), random(satRange[0], satRange[1]), random(briRange[0], briRange[1]));
        c2 = color(random(360), random(satRange[0], satRange[1]), random(briRange[0], briRange[1]));
        if (abs(hue(c1) - hue(c2)) < 30 && abs(saturation(c1) - saturation(c2)) < 20 && abs(brightness(c1) - brightness(c2)) < 20) {
             c2 = color(random(360), random(satRange[0], satRange[1]), random(briRange[0], briRange[1]));
        }
    } else if (strategy === 1) {
        let h1 = baseHue; let s1 = random(satRange[0] + 10, satRange[1]); let b1 = random(briRange[0] + 10, briRange[1]);
        let h2 = (h1 + random(20, 60) * (random() > 0.5 ? 1 : -1) + 360) % 360;
        let s2 = constrain(s1 + random(-20, 20), satRange[0], satRange[1]);
        let b2 = constrain(b1 + random(-15, 15), briRange[0], briRange[1]);
        c1 = color(h1, s1, b1); c2 = color(h2, s2, b2);
    } else if (strategy === 2) {
        let h1 = baseHue; let s1 = random(satRange[0], satRange[1]); let b1 = random(briRange[0], briRange[1]);
        let complementBase = (h1 + 180) % 360;
        let h2_offset = random([-30, 0, 30]);
        let h2 = (complementBase + h2_offset + 360) % 360;
        let s2 = random(satRange[0], satRange[1]); let b2 = random(briRange[0], briRange[1]);
        c1 = color(h1, s1, b1); c2 = color(h2, s2, b2);
    } else if (strategy === 3) {
        let h1 = baseHue; let s1 = random(40, 100); let b1 = random(60, 100);
        let s2 = constrain(s1 + random(-40, 40) * (random() > 0.5 ? 1 : -1), 30, 100);
        let b2 = constrain(b1 + random(-40, 40) * (random() > 0.5 ? 1 : -1), 50, 100);
        if (abs(s1 - s2) < 20 && abs(b1 - b2) < 20) { s2 = constrain(s1 + (random() > 0.5 ? 30 : -30), 30, 100); }
        c1 = color(h1, s1, b1); c2 = color(h1, s2, b2);
    } else {
        let spectralHue = random(360); let lightHue = random(360);
        if (random() > 0.5) {
            c1 = color(lightHue, random(15, 40), 100);
            c2 = color(spectralHue, random(85, 100), random(85, 100));
        } else {
            c1 = color(spectralHue, random(85, 100), random(85, 100));
            c2 = color(lightHue, random(15, 40), 100);
        }
    }
    return { c1: c1, c2: c2 };
}

function setRandomFixedColors() {
    fixedColor1_H = floor(random(360)); fixedColor1_S = floor(random(50, 101)); fixedColor1_B = floor(random(50, 101));
    fixedColor2_H = floor(random(360)); fixedColor2_S = floor(random(50, 101)); fixedColor2_B = floor(random(50, 101));
    window.fixedColor1_H = fixedColor1_H; window.fixedColor1_S = fixedColor1_S; window.fixedColor1_B = fixedColor1_B;
    window.fixedColor2_H = fixedColor2_H; window.fixedColor2_S = fixedColor2_S; window.fixedColor2_B = fixedColor2_B;
    if (window.updateFixedColorSliders) window.updateFixedColorSliders();
}

// --- Preload, Setup, Draw, RandomizeAll, InitShapes, IsOverlapping (mostly the same) ---
function preload() {
  let imagePaths = [
    "images/1.png", "images/2.png", "images/3.png", "images/4.png",
    "images/5.png", "images/6.png", "images/7.png"
  ];
  images = []; anImageHasLoaded = false; let imagesSuccessfullyLoadedCount = 0;
  let validImagePaths = imagePaths.filter(p => p && p.trim() !== "");
  let imagesAttemptedToLoad = validImagePaths.length;
  if (imagesAttemptedToLoad === 0) { console.warn("No valid image paths."); return; }
  validImagePaths.forEach(path => {
    images.push(loadImage(path, 
        () => { imagesSuccessfullyLoadedCount++; if(imagesSuccessfullyLoadedCount > 0) anImageHasLoaded = true; console.log("Img loaded:", path); }, 
        (err) => console.error("Img fail:", path, err)
    ));
  });
  if (imagesAttemptedToLoad > 0 && imagesSuccessfullyLoadedCount === 0) console.warn("Attempted image loads, none successful.");
  else if (imagesSuccessfullyLoadedCount < imagesAttemptedToLoad) console.warn("Some images failed to load.");
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE).parent(document.body);
  colorMode(HSB, 360, 100, 100, 255); 
  noStroke();

  currentShapeType = 'rectangle'; useRandomColor = true; prismMode = false;
  numShapes = 20; minPrimarySize = 60; maxPrimarySize = 160; shapeHeight = 30;
  animationType = 'sine'; animationSpeed = 0.01;
  showBackground = true; shapeAlpha = 100; useRandomPerShapeAlpha = false;
  fixedColor1_H = 0; fixedColor1_S = 100; fixedColor1_B = 100;
  fixedColor2_H = 240; fixedColor2_S = 100; fixedColor2_B = 100;

  window.currentShapeType = currentShapeType; window.useRandomColor = useRandomColor;
  window.numShapes = numShapes; window.minPrimarySize = minPrimarySize; window.maxPrimarySize = maxPrimarySize;
  window.shapeHeight = shapeHeight; window.animationType = animationType; window.animationSpeed = animationSpeed;
  window.showBackground = showBackground; window.shapeAlpha = shapeAlpha;
  window.fixedColor1_H = fixedColor1_H; window.fixedColor1_S = fixedColor1_S; window.fixedColor1_B = fixedColor1_B;
  window.fixedColor2_H = fixedColor2_H; window.fixedColor2_S = fixedColor2_S; window.fixedColor2_B = fixedColor2_B;
  window.prismMode = prismMode; window.useRandomPerShapeAlpha = useRandomPerShapeAlpha;
  
  setRandomFixedColors(); 
  if (typeof setupUI === 'function') setupUI(); else console.error("setupUI() not defined.");
  if (typeof randomizeAll === 'function') randomizeAll(); else console.error("randomizeAll() not defined.");
  currentShapeType = 'rectangle'; window.currentShapeType = 'rectangle';
  if (window.updateShapeToggleButtonText) window.updateShapeToggleButtonText();
  if (typeof initShapes === 'function') initShapes(); else console.error("initShapes() not defined.");
}

function draw() {
  background(210, 30, 30); 
  if (window.showBackground && currentImage && currentImage.width > 1 && anImageHasLoaded) {
    let imgAspect = currentImage.width / currentImage.height;
    let canvasAspect = width / height;
    let drawWidth, drawHeight, drawX, drawY;
    if (imgAspect > canvasAspect) {
      drawWidth = width; drawHeight = drawWidth / imgAspect; drawX = 0; drawY = (height - drawHeight) / 2;
    } else {
      drawHeight = height; drawWidth = drawHeight * imgAspect; drawY = 0; drawX = (width - drawWidth) / 2;
    }
    image(currentImage, drawX, drawY, drawWidth, drawHeight);
  }
  shapes.forEach(s => { s.update(); s.display(); });
}

function randomizeAll() {
  let validLoadedImages = images.filter(img => img && img.width > 1);
  currentImage = validLoadedImages.length > 0 ? random(validLoadedImages) : null;
  currentShapeType = random(['rectangle', 'circle']); window.currentShapeType = currentShapeType;
  useRandomColor = random([true, false]); window.useRandomColor = useRandomColor;
  prismMode = random([true, false]); window.prismMode = prismMode; 
  useRandomPerShapeAlpha = random([true, false]); window.useRandomPerShapeAlpha = useRandomPerShapeAlpha;
  if (!window.useRandomColor && !window.prismMode) setRandomFixedColors();
  numShapes = int(random(10, 50)); window.numShapes = numShapes;
  minPrimarySize = int(random(20, 80)); window.minPrimarySize = minPrimarySize;
  maxPrimarySize = int(random(minPrimarySize + 40, minPrimarySize + 200)); window.maxPrimarySize = maxPrimarySize;
  shapeHeight = int(random(10, 100)); window.shapeHeight = shapeHeight;
  animationType = random(['sine', 'wander']); window.animationType = animationType;
  animationSpeed = random(0.005, 0.03); window.animationSpeed = animationSpeed;
  shapeAlpha = int(random(0, 101)); window.shapeAlpha = shapeAlpha; 
  if (window.updateShapeToggleButtonText) window.updateShapeToggleButtonText();
  if (window.updateRandomColorButtonText) window.updateRandomColorButtonText();
  if (window.updateUISliders) window.updateUISliders(); 
  if (window.animationTypeSelect && typeof window.animationTypeSelect.selected === 'function') window.animationTypeSelect.selected(window.animationType);
  if (typeof initShapes === 'function') initShapes();
}

function initShapes() {
  shapes = []; 
  for (let attempts = 0; shapes.length < window.numShapes && attempts < 5000; attempts++) {
    let w = random(window.minPrimarySize, window.maxPrimarySize);
    let h = (window.currentShapeType === 'rectangle') ? window.shapeHeight : w;
    let x = random(0, width - w);
    let y = random(0, height - h);
    let newShape = new AnimatedShape(x, y, w, h);
    if (!isOverlapping(newShape)) shapes.push(newShape);
  }
}

function isOverlapping(newShape) {
  return shapes.some(s => !(newShape.x + newShape.w < s.x || newShape.x > s.x + s.w || newShape.y + newShape.h < s.y || newShape.y > s.y + s.h));
}

class AnimatedShape {
  constructor(x, y, w, h) {
    this.x = x; this.y = y; this.baseX = x; this.baseY = y;
    this.w = w; this.h = h;
    this.offset = random(TWO_PI); this.speed = window.animationSpeed;
    
    if (window.prismMode) {
        // Assign prism characteristics for this specific shape
        this.prismHueStart = random(360);
        this.prismHueSweep = random(120, 360); // How "wide" the rainbow segment is
        this.prismSaturation = random(85, 100);
        this.prismBrightness = random(90, 100);
    } else if (window.useRandomColor) {
        let colors = generateHarmonizedRandomColors();
        this.color1 = colors.c1; 
        this.color2 = colors.c2; 
    } else { // Fixed colors
        this.color1 = color(window.fixedColor1_H, window.fixedColor1_S, window.fixedColor1_B);
        this.color2 = color(window.fixedColor2_H, window.fixedColor2_S, window.fixedColor2_B);
    }
    this.individualAlpha = floor(random(30, 101));
  }

  update() {
    if (window.animationType === 'sine') this.y = this.baseY + sin(frameCount * this.speed + this.offset) * 10;
    else if (window.animationType === 'wander') this.x = this.baseX + sin(frameCount * this.speed + this.offset) * 10;
  }

  display() {
    let alphaSourceValue = window.useRandomPerShapeAlpha ? this.individualAlpha : window.shapeAlpha;
    let mappedAlpha = map(alphaSourceValue, 0, 100, 0, 255);

    if (window.currentShapeType === 'rectangle') {
        if (window.prismMode) {
            if (this.w <= 0) return;
            for (let i = 0; i < this.w; i++) {
                // Use this shape's specific prism characteristics
                let hueValue = map(i, 0, this.w - 1, this.prismHueStart, this.prismHueStart + this.prismHueSweep);
                let currentColor = color(hueValue % 360, this.prismSaturation, this.prismBrightness);
                fill(hue(currentColor), saturation(currentColor), brightness(currentColor), mappedAlpha);
                rect(this.x + i, this.y, 1, this.h);
            }
        } else { // Non-Prism: Use this.color1 and this.color2 for gradient
            if (this.w <= 0) return;
            for (let i = 0; i < this.w; i++) {
                let inter = map(i, 0, this.w - 1, 0, 1);
                inter = constrain(inter, 0, 1);
                let c = lerpColor(this.color1, this.color2, inter);
                fill(red(c), green(c), blue(c), mappedAlpha);
                rect(this.x + i, this.y, 1, this.h);
            }
        }
    } else if (window.currentShapeType === 'circle') {
        let centerX = this.x + this.w / 2;
        let centerY = this.y + this.h / 2; 
        let maxRadius = this.w / 2;
        
        if (maxRadius <= 0) return;

        if (window.prismMode) {
            // Use this shape's specific prism characteristics
            let stepSize = 1; 
            for (let r = maxRadius; r >= 0; r -= stepSize) { 
                let currentR = r; 
                // Hue mapped from center (prismHueStart) to edge (prismHueStart + prismHueSweep)
                let hueValue = map(currentR, 0, maxRadius, this.prismHueStart, this.prismHueStart + this.prismHueSweep); 
                let currentColor = color(hueValue % 360, this.prismSaturation, this.prismBrightness); 
                fill(hue(currentColor), saturation(currentColor), brightness(currentColor), mappedAlpha);
                ellipse(centerX, centerY, currentR * 2, currentR * 2);
            }
        } else { // Non-Prism: Use this.color1 and this.color2 for gradient
            let numGradientSteps = Math.max(10, floor(maxRadius / 2.0)); 
            if (numGradientSteps === 0 && maxRadius > 0) numGradientSteps = 1;
             if (maxRadius <=0 ) return;

            for (let r = maxRadius; r > 0; r -= (maxRadius / numGradientSteps)) {
                 if (numGradientSteps <=0) break; 
                let currentR = max(0, r);
                let inter = map(currentR, maxRadius, 0, 0, 1); 
                let c = lerpColor(this.color2, this.color1, inter); 
                fill(red(c), green(c), blue(c), mappedAlpha);
                ellipse(centerX, centerY, currentR * 2, currentR * 2);
            }
        }
    }
  }
}
// End of sketch.js