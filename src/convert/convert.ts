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

function string2numberArr(color: string): number[] {
  if (!color || typeof color !== 'string') return [];

  let s = color.trim().toLowerCase();
  s = s.replace(/^rgba?\(/, '').replace(/^hsla?\(/, '').replace(/\)$/, '');

  const tokens = s.split(/[\s,\/]+/);

  const numbers = tokens.map(token => parseFloat(token)).filter(n => !isNaN(n));

  return numbers;
}

export const hexToRgba = (hex: string, alpha?: number): string => {
  hex = hex.trim().replace(/^#/, '');

  let r: number, g: number, b: number, a: number | undefined;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = alpha;
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = alpha ?? parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = alpha;
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = alpha ?? parseInt(hex.slice(6, 8), 16) / 255;
  } else {
    throw new Error('Invalid hex color');
  }

  return a !== undefined
    ? `rgba(${r}, ${g}, ${b}, ${a})`
    : `rgb(${r}, ${g}, ${b})`;
}

export const rgbaToHex = (rgba: string, alpha?: number): string => {
  const numbers = string2numberArr(rgba);
  let [r, g, b, a] = numbers;
  let rHex, gHex, bHex, aHex;

  rHex = number2hex(r);
  gHex = number2hex(g);
  bHex = number2hex(b);
  aHex = alpha ? Math.round(alpha * 255).toString(16).padStart(2, '0') 
  : a ? Math.round(a * 255).toString(16).padStart(2, '0')
  : '';

  return `#${rHex}${gHex}${bHex}${aHex}`
}

export const rgbaToHsla = (rgba: string, a?: number): string => {
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

  return a ? `hsla(${H}, ${S}%, ${L}%, ${a})` : alpha ? `hsla(${H}, ${S}%, ${L}%, ${alpha})` : `hsl(${H}, ${S}%, ${L}%)`;
}

export const hslaToRgba = (hsla: string, alpha?: number): string => {
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

  r = Math.round(hue2rgb(p, q, hDecimal + 1 / 3) * 255);
  g = Math.round(hue2rgb(p, q, hDecimal) * 255);
  b = Math.round(hue2rgb(p, q, hDecimal - 1 / 3) * 255);

  return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : a ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
}

export const hexToHsla = (hex: string, a?: number): string => {
  hex = hex.trim().replace(/^#/, '').toLowerCase();

  let r: number, g: number, b: number, alpha: number | undefined;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    alpha = a;
  } else if (hex.length === 4) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    alpha = a ?? parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    alpha = a;
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    alpha = a ?? parseInt(hex.slice(6, 8), 16) / 255;
  } else {
    throw new Error('Invalid hex color');
  }

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0));
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  const H = Math.round(h * 360);
  const S = Math.round(s * 100);
  const L = Math.round(l * 100);

  return alpha !== undefined ? `hsla(${H}, ${S}%, ${L}%, ${alpha})` : `hsl(${H}, ${S}%, ${L}%)`;
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