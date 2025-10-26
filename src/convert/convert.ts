function shortHex2rgba(hex: string, a?: number): string {
  let red = hex.slice(1, 2);
  let green = hex.slice(2, 3);
  let blue = hex.slice(3, 4);

  let r = parseInt(red + red, 16);
  let g = parseInt(green + green, 16);
  let b = parseInt(blue + blue, 16);

  return a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

function number2hex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

function string2numberArr(rgba: string): number[] {
  return rgba.replace('(', '').replace(')', '')
  .replace('rgba', '').replace('rgb', '')
  .replace(',', '').replace('/', '')
  .replace('hsl', '').replace('hsla', '')
  .split(' ').map(string => parseInt(string));
}

export const hexToRgba = (hex: string, a?: number): string => {
  if(hex.length === 4 && a) {
    return shortHex2rgba(hex, a);
  } else if(hex.length === 4 && !a) {
    return shortHex2rgba(hex);
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return a ? `rgb(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

export const rgbaToHex = (rgba: string): string => {
  const numbers = string2numberArr(rgba);
  let rHex, gHex, bHex;

  if(numbers.length === 3) {
    let [r, g, b] = numbers;
    rHex = number2hex(r);
    gHex = number2hex(g);
    bHex = number2hex(b);

    return `#${rHex}${gHex}${bHex}`;

  } else if(numbers.length === 4) {
    let [r, g, b, a] = numbers;
    rHex = number2hex(r);
    gHex = number2hex(g);
    bHex = number2hex(b);
    let aHex = Math.round(a * 255).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}${aHex}`
  }

  return 'Error: format is not correct!';
}

export const rgbaToHsla = (rgba: string): string => {
  const numbers = string2numberArr(rgba);
  const [red, green, blue, alpha] = numbers;
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let d = max - min;
  let h = 0;

  h = d === 0 ? 0 : max === r ? h - (g - b) / d % 6 : max === g ? h = (b - r) / d + 2 : h = (r - g) / d + 4;

  let l = (min + max) / 2;
  let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  let H = Math.round(h * 60);
  let S = Math.round(s * 100);
  let L = Math.round(l * 100);

  return alpha ? `hsl(${H}, ${S}, ${L}, ${alpha})` : `hsl(${H}, ${S}, ${L})`;
}

export const hslaToRgba = (hsla: string): string => {
  const numbers = string2numberArr(hsla);
  let r,g,b;
  const [h, s, l, a] = numbers;
  
  const hDecimal = h / 100;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  if(s === 0) return `rgba(${lDecimal}, ${lDecimal}, ${lDecimal})`;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1 / 6) return p + (q - p) * 6 * t;
    if(t < 1 / 2) return q;
    if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let q = lDecimal < 0.5
  ? lDecimal * (1 + sDecimal)
  : lDecimal + sDecimal - lDecimal * sDecimal;

  let p = 2 * lDecimal - q;

  r = hue2rgb(p, q, hDecimal + 1 / 3) * 255;
  g = hue2rgb(p, q, hDecimal) * 255;
  b = hue2rgb(p, q, hDecimal - 1 / 3) * 255;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const hexToHsla = (hex: string, a?: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!result) {
    throw new Error("Could not parse Hex Color");
  }

  const rHex = parseInt(result[1], 16);
  const gHex = parseInt(result[2], 16);
  const bHex = parseInt(result[3], 16);

  const r = rHex / 255;
  const g = gHex / 255;
  const b = bHex / 255;
  let alpha;
  if(result[4]) alpha = result[4];

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
    // Achromatic
    return `hsla(0, 0, ${l}, ${alpha})`;
  }

  const d = max - min;
  s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  switch (max) {
    case r:
      h = (g - b) / d + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / d + 2;
      break;
    case b:
      h = (r - g) / d + 4;
      break;
  }
  h /= 6;

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return a ? `hsla(${h}, ${s}, ${l}, ${a})` : `hsla(${h}, ${s}, ${l}, ${alpha})`;
}

export const hslaToHex = (hsla: string): string => {
  const hslaArr = string2numberArr(hsla);
  let [h, s, l, a] = hslaArr;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255).toString(16).padStart(2, "0");
    return hex;
  };

  const rHex = toHex(r);
  const gHex = toHex(g);
  const bHex = toHex(b);
  const aHex = Math.round(a * 255).toString(16).padStart(2, "0");

  return a ? `#${rHex}${gHex}${bHex}${aHex}` : `#${rHex}${gHex}${bHex}`;
}