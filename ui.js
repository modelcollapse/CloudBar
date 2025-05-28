// ui.js

// Declare variables for UI elements ONCE at the top of this script's scope.
let ui_numSlider, ui_minPrimarySizeSlider, ui_maxPrimarySizeSlider, ui_shapeHeightSlider;
let ui_shapeToggleButton, ui_randomColorButton;
let ui_animationTypeSelect, ui_speedSlider;
let ui_bgToggle, ui_alphaSlider, ui_globalAlphaSliderLabelDiv;
let ui_fixedC1HSlider, ui_fixedC1SSlider, ui_fixedC1BSlider;
let ui_fixedC2HSlider, ui_fixedC2SSlider, ui_fixedC2BSlider;
let ui_prismModeToggle, ui_randomPerShapeAlphaToggle;

// DEFINE setupUI function
function setupUI() {
  const panel = select('#controls');

  // --- STYLE ---
  createDiv('STYLE').class('section-label').parent(panel);

  ui_shapeToggleButton = createButton(`Shape: ${window.currentShapeType.charAt(0).toUpperCase() + window.currentShapeType.slice(1)}s`);
  ui_shapeToggleButton.mousePressed(() => {
    window.currentShapeType = (window.currentShapeType === 'rectangle') ? 'circle' : 'rectangle';
    if (typeof window.updateShapeToggleButtonText === 'function') window.updateShapeToggleButtonText();
    if (typeof initShapes === 'function') initShapes();
  }).parent(panel);

  ui_randomColorButton = createButton(window.useRandomColor ? 'Color: Random' : 'Color: Fixed');
  ui_randomColorButton.mousePressed(() => {
    window.useRandomColor = !window.useRandomColor;
    if (!window.useRandomColor && !window.prismMode) { 
        if (typeof setRandomFixedColors === 'function') setRandomFixedColors();
    }
    if (typeof window.updateRandomColorButtonText === 'function') window.updateRandomColorButtonText();
    if (typeof initShapes === 'function') initShapes();
  }).parent(panel);

  ui_prismModeToggle = createCheckbox('Prism Mode (Rainbow Colors)', window.prismMode).parent(panel);
  ui_prismModeToggle.changed(() => {
    window.prismMode = ui_prismModeToggle.checked();
    if (typeof updateFixedColorSectionInteractivity === 'function') updateFixedColorSectionInteractivity();
    if (typeof initShapes === 'function') initShapes(); 
  });
  
  panel.child(createElement('hr')).style('margin', '10px 0'); 

  // --- TRANSPARENCY CONTROLS ---
  createDiv('TRANSPARENCY').class('section-label').parent(panel);

  ui_randomPerShapeAlphaToggle = createCheckbox('Random Alpha per Shape', window.useRandomPerShapeAlpha).parent(panel);
  ui_randomPerShapeAlphaToggle.changed(() => {
    window.useRandomPerShapeAlpha = ui_randomPerShapeAlphaToggle.checked();
    if (typeof updateAlphaSliderInteractivity === 'function') updateAlphaSliderInteractivity();
  });
  
  ui_globalAlphaSliderLabelDiv = createDiv('Global Shape Transparency (0-100)').parent(panel);
  ui_globalAlphaSliderLabelDiv.style('margin-top', '4px'); 
  ui_alphaSlider = createSlider(0, 100, window.shapeAlpha).parent(panel);
  ui_alphaSlider.input(() => {
    if (!window.useRandomPerShapeAlpha) {
        window.shapeAlpha = ui_alphaSlider.value();
    }
  });
  
  panel.child(createElement('hr')).style('margin', '10px 0');

  // --- FIXED COLOR SETTINGS --- 
  let fixedColorSection = createDiv().parent(panel); 
  fixedColorSection.id('fixedColorControlsSection');
  fixedColorSection.child(createDiv('FIXED COLOR SETTINGS').class('section-label'));
  
  fixedColorSection.child(createDiv('Color 1 Hue (0-360)'));
  ui_fixedC1HSlider = createSlider(0, 360, window.fixedColor1_H).parent(fixedColorSection);
  ui_fixedC1HSlider.input(() => { window.fixedColor1_H = ui_fixedC1HSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });
  
  fixedColorSection.child(createDiv('Color 1 Saturation (0-100)'));
  ui_fixedC1SSlider = createSlider(0, 100, window.fixedColor1_S).parent(fixedColorSection);
  ui_fixedC1SSlider.input(() => { window.fixedColor1_S = ui_fixedC1SSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });

  fixedColorSection.child(createDiv('Color 1 Brightness (0-100)'));
  ui_fixedC1BSlider = createSlider(0, 100, window.fixedColor1_B).parent(fixedColorSection);
  ui_fixedC1BSlider.input(() => { window.fixedColor1_B = ui_fixedC1BSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });

  fixedColorSection.child(createDiv('Color 2 Hue (0-360)')).style('margin-top', '6px');
  ui_fixedC2HSlider = createSlider(0, 360, window.fixedColor2_H).parent(fixedColorSection);
  ui_fixedC2HSlider.input(() => { window.fixedColor2_H = ui_fixedC2HSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });

  fixedColorSection.child(createDiv('Color 2 Saturation (0-100)'));
  ui_fixedC2SSlider = createSlider(0, 100, window.fixedColor2_S).parent(fixedColorSection);
  ui_fixedC2SSlider.input(() => { window.fixedColor2_S = ui_fixedC2SSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });

  fixedColorSection.child(createDiv('Color 2 Brightness (0-100)'));
  ui_fixedC2BSlider = createSlider(0, 100, window.fixedColor2_B).parent(fixedColorSection);
  ui_fixedC2BSlider.input(() => { window.fixedColor2_B = ui_fixedC2BSlider.value(); if (!window.useRandomColor && !window.prismMode && typeof initShapes === 'function') initShapes(); });
  
  panel.child(createElement('hr')).style('margin', '10px 0');
  
  // --- SHAPE SETTINGS ---
  createDiv('SHAPE SETTINGS').class('section-label').style('margin-top', '10px').parent(panel);
  panel.child(createDiv('Number of Shapes'));
  ui_numSlider = createSlider(1, 100, window.numShapes);
  ui_numSlider.input(() => { window.numShapes = ui_numSlider.value(); if (typeof initShapes === 'function') initShapes(); }).parent(panel);
  panel.child(createDiv('Min Primary Size (Width/Diameter)'));
  ui_minPrimarySizeSlider = createSlider(10, 200, window.minPrimarySize);
  ui_minPrimarySizeSlider.input(() => {
    window.minPrimarySize = ui_minPrimarySizeSlider.value();
    if (parseInt(window.minPrimarySize) > parseInt(window.maxPrimarySize)) {
        window.maxPrimarySize = window.minPrimarySize;
        if(ui_maxPrimarySizeSlider) ui_maxPrimarySizeSlider.value(window.maxPrimarySize);
    }
    if (typeof initShapes === 'function') initShapes();
  }).parent(panel);
  panel.child(createDiv('Max Primary Size (Width/Diameter)'));
  ui_maxPrimarySizeSlider = createSlider(40, 400, window.maxPrimarySize);
  ui_maxPrimarySizeSlider.input(() => {
    window.maxPrimarySize = ui_maxPrimarySizeSlider.value();
    if (parseInt(window.maxPrimarySize) < parseInt(window.minPrimarySize)) {
        window.minPrimarySize = window.maxPrimarySize;
        if(ui_minPrimarySizeSlider) ui_minPrimarySizeSlider.value(window.minPrimarySize);
    }
    if (typeof initShapes === 'function') initShapes();
  }).parent(panel);
  panel.child(createDiv('Shape Height (for Rects only)'));
  ui_shapeHeightSlider = createSlider(5, 100, window.shapeHeight);
  ui_shapeHeightSlider.input(() => { window.shapeHeight = ui_shapeHeightSlider.value(); if (typeof initShapes === 'function') initShapes(); }).parent(panel);
  panel.child(createElement('hr')).style('margin', '10px 0');

  // --- ANIMATION SETTINGS ---
  createDiv('ANIMATION SETTINGS').class('section-label').style('margin-top', '10px').parent(panel);
  panel.child(createDiv('Animation Style'));
  ui_animationTypeSelect = createSelect(); ui_animationTypeSelect.option('sine'); ui_animationTypeSelect.option('wander');
  ui_animationTypeSelect.selected(window.animationType);
  ui_animationTypeSelect.changed(() => { window.animationType = ui_animationTypeSelect.value(); }).parent(panel);
  window.animationTypeSelect = ui_animationTypeSelect;
  panel.child(createDiv('Animation Speed'));
  ui_speedSlider = createSlider(0.001, 0.05, window.animationSpeed, 0.001);
  ui_speedSlider.input(() => {
    window.animationSpeed = ui_speedSlider.value();
    if (typeof shapes !== 'undefined' && shapes.length > 0) { shapes.forEach(s => s.speed = window.animationSpeed); }
  }).parent(panel);
  window.speedSlider = ui_speedSlider;
  panel.child(createElement('hr')).style('margin', '10px 0');
  
  // --- VISUAL OPTIONS ---
  createDiv('VISUAL OPTIONS').class('section-label').parent(panel);
  ui_bgToggle = createCheckbox('Show Background Image', window.showBackground);
  ui_bgToggle.changed(() => { window.showBackground = ui_bgToggle.checked(); }).parent(panel);
  panel.child(createElement('hr')).style('margin', '10px 0');

  const randomizeAllBtn = createButton('Randomize All').mousePressed(() => { if (typeof randomizeAll === 'function') randomizeAll(); }).parent(panel).style('margin-top', '10px');
  const saveBtn = createButton('Save Image').mousePressed(() => { if (typeof saveCanvas === 'function') saveCanvas('output', 'png'); }).parent(panel).style('margin-top', '4px');

  if (typeof updateAlphaSliderInteractivity === 'function') updateAlphaSliderInteractivity();
  if (typeof updateFixedColorSectionInteractivity === 'function') updateFixedColorSectionInteractivity();
} // End of setupUI function

function updateAlphaSliderInteractivity() {
    if (window.useRandomPerShapeAlpha) {
        if (ui_alphaSlider) ui_alphaSlider.attribute('disabled', '');
        if (ui_globalAlphaSliderLabelDiv) ui_globalAlphaSliderLabelDiv.style('color', '#777');
    } else {
        if (ui_alphaSlider) ui_alphaSlider.removeAttribute('disabled');
        if (ui_globalAlphaSliderLabelDiv) ui_globalAlphaSliderLabelDiv.style('color', '#fff');
    }
}

function updateFixedColorSectionInteractivity() {
    const section = select('#fixedColorControlsSection');
    if (!section) return;
    const sliders = [ ui_fixedC1HSlider, ui_fixedC1SSlider, ui_fixedC1BSlider, ui_fixedC2HSlider, ui_fixedC2SSlider, ui_fixedC2BSlider ];
    const labels = section.elt.querySelectorAll('div:not(.section-label)');

    if (window.prismMode || window.useRandomColor) { 
        sliders.forEach(slider => { if (slider) slider.attribute('disabled', ''); });
        labels.forEach(lbl => lbl.style.color = '#777');
        let sectionTitle = section.elt.querySelector('.section-label');
        if (sectionTitle) sectionTitle.style.color = '#fff';
    } else { 
        sliders.forEach(slider => { if (slider) slider.removeAttribute('disabled'); });
        labels.forEach(lbl => lbl.style.color = '#fff');
    }
}

window.updateShapeToggleButtonText = function() { if (ui_shapeToggleButton) ui_shapeToggleButton.html(`Shape: ${window.currentShapeType.charAt(0).toUpperCase() + window.currentShapeType.slice(1)}s`); };
window.updateRandomColorButtonText = function() { 
    if (ui_randomColorButton) ui_randomColorButton.html(window.useRandomColor ? 'Color: Random' : 'Color: Fixed'); 
    if (typeof updateFixedColorSectionInteractivity === 'function') updateFixedColorSectionInteractivity();
};

window.updateFixedColorSliders = function() {
    if(ui_fixedC1HSlider) ui_fixedC1HSlider.value(window.fixedColor1_H); if(ui_fixedC1SSlider) ui_fixedC1SSlider.value(window.fixedColor1_S); if(ui_fixedC1BSlider) ui_fixedC1BSlider.value(window.fixedColor1_B);
    if(ui_fixedC2HSlider) ui_fixedC2HSlider.value(window.fixedColor2_H); if(ui_fixedC2SSlider) ui_fixedC2SSlider.value(window.fixedColor2_S); if(ui_fixedC2BSlider) ui_fixedC2BSlider.value(window.fixedColor2_B);
};

window.updateUISliders = function() { 
  if(ui_numSlider) ui_numSlider.value(window.numShapes);
  if(ui_minPrimarySizeSlider) ui_minPrimarySizeSlider.value(window.minPrimarySize);
  if(ui_maxPrimarySizeSlider) ui_maxPrimarySizeSlider.value(window.maxPrimarySize);
  if(ui_shapeHeightSlider) ui_shapeHeightSlider.value(window.shapeHeight);
  if(ui_alphaSlider) ui_alphaSlider.value(window.shapeAlpha);
  if(ui_animationTypeSelect && typeof ui_animationTypeSelect.selected === 'function') ui_animationTypeSelect.selected(window.animationType);
  if(ui_speedSlider) ui_speedSlider.value(window.animationSpeed);
  if(ui_bgToggle && typeof ui_bgToggle.checked === 'function') ui_bgToggle.checked(window.showBackground);
  
  if(ui_prismModeToggle && typeof ui_prismModeToggle.checked === 'function') ui_prismModeToggle.checked(window.prismMode);
  if(typeof window.updateRandomColorButtonText === 'function') window.updateRandomColorButtonText(); 
  if(ui_randomPerShapeAlphaToggle && typeof ui_randomPerShapeAlphaToggle.checked === 'function') ui_randomPerShapeAlphaToggle.checked(window.useRandomPerShapeAlpha);

  if (window.updateFixedColorSliders) window.updateFixedColorSliders();
  if (typeof updateAlphaSliderInteractivity === 'function') updateAlphaSliderInteractivity();
  if (typeof updateFixedColorSectionInteractivity === 'function') updateFixedColorSectionInteractivity();
};
// End of ui.js