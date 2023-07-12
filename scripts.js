// These three conversion functions I found online and have tested them for multiple values and work as intended
// percentage values are returned in decimal form but are easily adjusted when they are called 

// Function to convert hex colour to HSL
function hexToHSL(hex) {
  hex = hex.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  let h;
  if (max === min) {
    h = 0; 
  } else if (max === r) {
    h = ((g - b) / (max - min)) % 6;
  } else if (max === g) {
    h = (2 + (b - r) / (max - min)) % 6;
  } else {
    h = (4 + (r - g) / (max - min)) % 6;
  }
  
  // Adjust h if it is negative
  if (h < 0) {
    h += 6;
  }
  
  h = Math.round(h * 60);

  let l = (max + min) / 2;
  let s;
  
  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = (max - min) / (max + min);
  } else {
    s = (max - min) / (2 - max - min);
  }
  
  s = Math.round(s * 100);

  return {h, s, l};
};

// Function to convert HSL to RGB
function hslToRGB(h, s, l) {
  // Convert HSL values to the range of 0 to 1
  const hNormalized = h / 360;
  const sNormalized = s / 100;
  const lNormalized = l / 100;

  // Calculate intermediate values
  const c = (1 - Math.abs(2 * lNormalized - 1)) * sNormalized;
  const x = c * (1 - Math.abs((hNormalized * 6) % 2 - 1));
  const m = lNormalized - c / 2;

  let r, g, b;

  // Calculate RGB values based on the hue
  if (hNormalized < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (hNormalized < 2 / 6) {
    r = x;
    g = c;
    b = 0;
  } else if (hNormalized < 3 / 6) {
    r = 0;
    g = c;
    b = x;
  } else if (hNormalized < 4 / 6) {
    r = 0;
    g = x;
    b = c;
  } else if (hNormalized < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  // Adjust RGB values and convert to the range of 0 to 255
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

// Function to convert RGB to hex colour
function rgbToHex(r, g, b) {
  const componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const redHex = componentToHex(r);
  const greenHex = componentToHex(g);
  const blueHex = componentToHex(b);

  return `#${redHex}${greenHex}${blueHex}`;
}

const colourInput = document.getElementById('brand-colour-picker');
const colourValue = document.getElementById('colour-val');
const hueInput = document.getElementById("hue-value");
const saturationInput = document.getElementById("saturation-value");
const lightnessInput = document.getElementById("min-lightness");

// This event listener updates the colour-val with the HSL value
colourInput.addEventListener('input', () => {
  
  let hslValue = hexToHSL(colourInput.value);

  let hue = hslValue.h;
  let saturation = hslValue.s;
  let minLightness = Math.round(hslValue.l * 100);

  colourValue.textContent = `HSL(${hue}, ${saturation}%, ${minLightness}%)`;
  colourInput.value = rgbToHex(...Object.values(hslToRGB(hue, saturation, minLightness)));

  hueInput.value = parseInt(hue);
  saturationInput.value = parseInt(saturation);
});

// Function to update the colour input value based on HSL values
function updateColourInput() {
  const hue = hueInput.valueAsNumber;
  const saturation = saturationInput.valueAsNumber;
  const minLightness = lightnessInput.valueAsNumber;

  colourValue.textContent = `HSL(${hue}, ${saturation}%, ${minLightness}%)`;
  colourInput.value = rgbToHex(...Object.values(hslToRGB(hue, saturation, minLightness)));
}

// Add event listeners to the input elements so when they are changed it will update the hsl value above
hueInput.addEventListener("input", updateColourInput);
saturationInput.addEventListener("input", updateColourInput);
lightnessInput.addEventListener("input", updateColourInput);


//The below code updates the colour-val with the hex value.
/*
const colourInput = document.getElementById('brand-colour-picker');

let colourValue = colourInput.value;

colourInput.addEventListener('input', () =>{
  document.getElementById('colour-val').textContent = colourInput.value;
});
*/

// These below functions update styles and classes of the locking buttons for the colours card
const lockButtons = document.querySelectorAll('.lock-button');

lockButtons.forEach((button) => {
  const img = button.querySelector('.lock-status');

  button.addEventListener('click', () => {
    const isOpen = img.src.includes('lock-key-open.svg');
    img.src = isOpen ? 'assets/icons/lock-key.svg' : 'assets/icons/lock-key-open.svg';

    button.classList.toggle('locked');
  });
});


function getEasingFunction(easing) {
  if (easing === 'quartIn') return t => Math.pow(t, 4);
  if (easing === 'quartOut') return t => 1 - Math.pow(1 - t, 4);
  if (easing === 'quartInOut') return t => t < 0.5 ? 8 * Math.pow(t, 4) : 1 - Math.pow(-2 * t + 2, 4) / 2;
  if (easing === 'quintIn') return t => Math.pow(t, 5);
  if (easing === 'quintOut') return t => 1 - Math.pow(1 - t, 5);
  if (easing === 'quintInOut') return t => t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
  return d3['ease' + easing.charAt(0).toUpperCase() + easing.slice(1)];
}

function generateColors() {

// If the button has the 'locked' class, do not proceed with the color generation.

  let lockButton = document.getElementById('brand-lock');
  
  if (lockButton.classList.contains('locked')) {
    return;
  }

  let hue = document.getElementById('hue-value').value;
  let saturation = document.getElementById('saturation-value').value;
  let easing = document.getElementById('easing').value;
  let min = document.getElementById('min-lightness').value / 100;
  let max = document.getElementById('max-lightness').value / 100;

  let easingFunction = getEasingFunction(easing);

  let lightnessValues = d3.range(min, max + 0.01, (max - min) / 11).map(easingFunction);

  lightnessValues.forEach(function(lightness, i) {
    let hslValue = 'hsl(' + hue + ', ' + saturation + '%, ' + (lightness * 100) + '%)';
    let index = ("0" + (i + 1)).slice(-2);  // generates a two-digit string
    let swatch = document.querySelector(`.brand-swatch${index}`);

    if ('.brand') {
      swatch.style.background = hslValue;
      swatch.style.border = hslValue;
    }
  });
}


// Code below for if we want the graph to show in a later version
/*

let graph = document.getElementById('graph');
graph.innerHTML = '';
let svg = d3.select('#graph').append('svg').attr('width', 500).attr('height', 240);
  let x = d3.scaleLinear().domain([0, 1]).range([0, 500]);
  let y = d3.scaleLinear().domain([0, 1]).range([240, 0]);


  let line = d3.line()
      .x(function(d) { return x(d); })
      .y(function(d) { return y(easingFunction(d)); });

  svg.append('path')
      .datum(d3.range(min, max + 0.1, (max - min) / 10))
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

  svg.selectAll('.dot')
      .data(d3.range(min, max + 0.1, (max - min) / 10))
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', function(d) { return x(d); })
      .attr('cy', function(d) { return y(easingFunction(d)); })
      .attr('r', 3.5);.

*/

