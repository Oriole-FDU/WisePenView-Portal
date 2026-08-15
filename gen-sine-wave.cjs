// Generate a simple white sine wave SVG data URI
// y = 0.5 * sin(x), scaled to a tileable viewBox

const W = 200; // tile width
const H = 24;  // tile height
const CY = H / 2; // center y
const AMP = 8;    // amplitude in px
const STEPS = 40; // segments per cycle

let d = '';
for (let i = 0; i <= STEPS; i++) {
  const t = (i / STEPS) * 2 * Math.PI;
  const x = (i / STEPS) * W;
  const y = CY + AMP * Math.sin(t);
  d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(2);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <path d="${d}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
</svg>`;

const encoded = encodeURIComponent(svg)
  .replace(/%2F/g, '/')
  .replace(/%3A/g, ':')
  .replace(/%20/g, ' ');

console.log('URL-encoded SVG:');
console.log(`url("data:image/svg+xml,${encoded}");`);