const p = { CW: 10.5, CH: 9 };
const custW = 9;
const custH = null;

let baseW = p.CW;
let baseH = p.CH;
const coverAR = p.CW / p.CH;

if (custW && custH) {
  baseW = custW;
  baseH = custH;
} else if (custW && !custH) {
  baseW = custW;
  let autoH = Math.round((custW / coverAR) * 10) / 10;
  if (autoH < 0.5) autoH = 0.5;
  baseH = autoH;
} else if (!custW && custH) {
  baseH = custH;
  let autoW = Math.round((custH * coverAR) * 10) / 10;
  if (autoW < 0.5) autoW = 0.5;
  baseW = autoW;
}

const scale = 49 / 100;
const mode = 'lock-w';

let finalW, finalH;
if (mode === 'aspect') {
  finalW = baseW * scale;
  finalH = baseH * scale;
} else if (mode === 'lock-w') {
  finalW = baseW;
  finalH = baseH * scale;
} else if (mode === 'lock-h') {
  finalW = baseW * scale;
  finalH = baseH;
}

finalW = Math.round(finalW * 100) / 100;
finalH = Math.round(finalH * 100) / 100;

console.log(JSON.stringify({ baseW, baseH, finalW, finalH, scale, mode }));
