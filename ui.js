function setupUI() {
  const panel = select('#controls');

  panel.child(makeButton('Shuffle Colors', () => {
    rectangles.forEach(r => {
      r.color1 = randomColorHSB();
      r.color2 = randomColorHSB();
    });
  }));

  panel.child(makeButton('Switch Shape', () => {
    settings.useCircles = !settings.useCircles;
    initRectangles();
  }));

  panel.child(makeCheckbox('Enable Blend Mode', false, checked => {
    blendMode(checked ? BLEND : NORMAL);
  }));

  panel.child(makeCheckbox('Show Background', settings.showBackground, checked => {
    settings.showBackground = checked;
  }));

  panel.child(makeSlider('Rect Count', 1, 100, settings.numRects, val => {
    settings.numRects = val;
    initRectangles();
  }));

  panel.child(makeSlider('Min Width', 10, 200, settings.minW, val => {
    settings.minW = val;
    initRectangles();
  }));

  panel.child(makeSlider('Max Width', 40, 400, settings.maxW, val => {
    settings.maxW = val;
    initRectangles();
  }));

  panel.child(makeSlider('Height', 5, 100, settings.rectH, val => {
    settings.rectH = val;
    initRectangles();
  }));

  panel.child(makeDropdown('Animation Type', ['sine', 'wander'], settings.animationType, val => {
    settings.animationType = val;
  }));

  panel.child(makeSlider('Speed', 0.001, 0.05, settings.animationSpeed, val => {
    settings.animationSpeed = val;
    rectangles.forEach(r => r.speed = val);
  }));

  panel.child(makeButton('Randomize All', randomizeAll));
  panel.child(makeButton('Save Image', () => saveCanvas('cloud_bar', 'png')));
}

function makeButton(label, callback) {
  return createButton(label).mousePressed(callback).style('margin-bottom', '8px');
}

function makeCheckbox(label, checked, callback) {
  const cb = createCheckbox(label, checked);
  cb.changed(() => callback(cb.checked()));
  return cb;
}

function makeSlider(label, min, max, value, callback) {
  const group = createDiv().addClass('slider-group');
  group.child(createDiv(label));
  const slider = createSlider(min, max, value, (max - min) / 100);
  slider.input(() => callback(slider.value()));
  slider.style('width', '100%');
  group.child(slider);
  return group;
}

function makeDropdown(label, options, selected, callback) {
  const group = createDiv().addClass('slider-group');
  group.child(createDiv(label));
  const dropdown = createSelect();
  options.forEach(opt => dropdown.option(opt));
  dropdown.selected(selected);
  dropdown.changed(() => callback(dropdown.value()));
  group.child(dropdown);
  return group;
}