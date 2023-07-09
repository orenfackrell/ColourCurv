// These two functions I found online and have tested them for multiple values and work as intended
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
  lightnessInput.value = parseInt(minLightness);
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


//The bellow code updates the colour-val with the hex value.
/*
const colourInput = document.getElementById('brand-colour-picker');

let colourValue = colourInput.value;

colourInput.addEventListener('input', () =>{
  document.getElementById('colour-val').textContent = colourInput.value;
});
*/

const lockButtons = document.querySelectorAll('.lock-button');

lockButtons.forEach((button) => {
  const img = button.querySelector('.lock-status');

  button.addEventListener('click', () => {
    const isOpen = img.src.includes('lock-key-open.svg');
    img.src = isOpen ? 'assets/icons/lock-key.svg' : 'assets/icons/lock-key-open.svg';

    button.classList.toggle('open');
  });
});