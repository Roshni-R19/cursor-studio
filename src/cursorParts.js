export const BODIES = {
  arrow: {
    label: 'Arrow',
    emoji: '↖',
    svg: `<path d="M8 8 L8 48 L20 36 L28 56 L34 53 L26 33 L42 33 Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>`,
  },
  hand: {
    label: 'Hand',
    emoji: '👆',
    svg: `<g fill="currentColor">
      <rect x="28" y="20" width="8" height="22" rx="4"/>
      <rect x="20" y="26" width="8" height="18" rx="4"/>
      <rect x="36" y="28" width="8" height="16" rx="4"/>
      <rect x="44" y="32" width="7" height="12" rx="3.5"/>
      <path d="M20 38 Q18 42 18 48 Q18 54 24 56 L40 56 Q46 56 46 50 L46 44 L20 44 Z"/>
    </g>`,
  },
  circle: {
    label: 'Circle',
    emoji: '●',
    svg: `<circle cx="32" cy="36" r="22" fill="currentColor"/>`,
  },
  ghost: {
    label: 'Ghost',
    emoji: '👻',
    svg: `<path d="M14 42 Q14 16 32 14 Q50 16 50 42 L50 54 Q44 50 38 54 Q35 58 32 54 Q29 58 26 54 Q20 50 14 54 Z" fill="currentColor"/>`,
  },
  star: {
    label: 'Star',
    emoji: '⭐',
    svg: `<polygon points="32,10 38,26 56,26 42,36 48,52 32,42 16,52 22,36 8,26 26,26" fill="currentColor"/>`,
  },
  bubble: {
    label: 'Bubble',
    emoji: '💬',
    svg: `<path d="M12 14 Q12 8 18 8 L46 8 Q52 8 52 14 L52 38 Q52 44 46 44 L36 44 L28 56 L28 44 L18 44 Q12 44 12 38 Z" fill="currentColor"/>`,
  },
};

export const EYES = {
  none: {
    label: 'None',
    emoji: '—',
    svg: ``,
  },
  dots: {
    label: 'Dots',
    emoji: '··',
    svg: `<circle cx="26" cy="30" r="3" fill="#0F0F13"/><circle cx="38" cy="30" r="3" fill="#0F0F13"/>`,
  },
  sleepy: {
    label: 'Sleepy',
    emoji: '—',
    svg: `<path d="M22 30 Q26 26 30 30" stroke="#0F0F13" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <path d="M34 30 Q38 26 42 30" stroke="#0F0F13" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  },
  wide: {
    label: 'Wide',
    emoji: '●●',
    svg: `<circle cx="26" cy="30" r="5" fill="white"/>
          <circle cx="38" cy="30" r="5" fill="white"/>
          <circle cx="27" cy="31" r="2.5" fill="#0F0F13"/>
          <circle cx="39" cy="31" r="2.5" fill="#0F0F13"/>
          <circle cx="28" cy="30" r="1" fill="white"/>
          <circle cx="40" cy="30" r="1" fill="white"/>`,
  },
  hearts: {
    label: 'Hearts',
    emoji: '♥♥',
    svg: `<path d="M23 27 Q23 24 26 24 Q29 24 29 27 Q29 30 26 33 Q23 30 23 27 Z" fill="#FF6B8A"/>
          <path d="M35 27 Q35 24 38 24 Q41 24 41 27 Q41 30 38 33 Q35 30 35 27 Z" fill="#FF6B8A"/>`,
  },
  wink: {
    label: 'Wink',
    emoji: ';)',
    svg: `<path d="M22 30 Q26 26 30 30" stroke="#0F0F13" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <circle cx="38" cy="30" r="4" fill="white"/>
          <circle cx="39" cy="31" r="2" fill="#0F0F13"/>`,
  },
};

export const ACCESSORIES = {
  none: {
    label: 'None',
    emoji: '—',
    svg: ``,
  },
  sunglasses: {
    label: 'Sunnies',
    emoji: '🕶',
    svg: `<rect x="18" y="22" width="10" height="7" rx="2" fill="#1a1a2e" stroke="#666" stroke-width="1.5"/>
          <rect x="32" y="22" width="10" height="7" rx="2" fill="#1a1a2e" stroke="#666" stroke-width="1.5"/>
          <line x1="28" y1="25" x2="32" y2="25" stroke="#666" stroke-width="1.5"/>
          <line x1="14" y1="25" x2="18" y2="25" stroke="#666" stroke-width="1.5"/>
          <line x1="42" y1="25" x2="46" y2="25" stroke="#666" stroke-width="1.5"/>`,
  },
  tophat: {
    label: 'Top Hat',
    emoji: '🎩',
    svg: `<rect x="22" y="4" width="20" height="18" rx="2" fill="#1a1a2e" stroke="#444" stroke-width="1"/>
          <rect x="16" y="20" width="32" height="5" rx="2" fill="#1a1a2e" stroke="#444" stroke-width="1"/>`,
  },
  crown: {
    label: 'Crown',
    emoji: '👑',
    svg: `<path d="M16 24 L16 10 L26 18 L32 6 L38 18 L48 10 L48 24 Z" fill="#FFD700" stroke="#E5A000" stroke-width="1"/>
          <circle cx="32" cy="8" r="2.5" fill="#FF6B6B"/>
          <circle cx="16" cy="12" r="2" fill="#6366F1"/>
          <circle cx="48" cy="12" r="2" fill="#6366F1"/>`,
  },
  halo: {
    label: 'Halo',
    emoji: '😇',
    svg: `<ellipse cx="32" cy="10" rx="14" ry="5" fill="none" stroke="#FFD700" stroke-width="3" opacity="0.9"/>`,
  },
  sparkles: {
    label: 'Sparkles',
    emoji: '✨',
    svg: `<path d="M10 14 L11.5 10 L13 14 L17 15.5 L13 17 L11.5 21 L10 17 L6 15.5 Z" fill="#FFD700"/>
          <path d="M50 10 L51 7 L52 10 L55 11 L52 12 L51 15 L50 12 L47 11 Z" fill="#FFD700"/>
          <path d="M52 36 L53 33 L54 36 L57 37 L54 38 L53 41 L52 38 L49 37 Z" fill="#A78BFA"/>`,
  },
};

export function buildCursorSVG(body, eyes, accessories, color) {
  const bodyPart = BODIES[body] || BODIES.arrow;
  const eyesPart = EYES[eyes] || EYES.none;
  const accessoryPart = ACCESSORIES[accessories] || ACCESSORIES.none;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <g color="${color}" style="color:${color}">
      ${bodyPart.svg}
      ${eyesPart.svg}
      ${accessoryPart.svg}
    </g>
  </svg>`;
}

export function svgToDataURL(svgString) {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encoded}`;
}

export async function svgToPNG(svgString, size = 128) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const url = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = url;
  });
}
