// Fallback asset maps — the canonical list lives in public/assets-manifest.json.
// useAssets.js fetches the manifest at runtime; these are used only if the fetch fails.
export const ASSET_BODIES = {
  flower: { label: 'Flower',  src: '/bodies/Flower Shape.png' },
  heart:  { label: 'Heart',   src: '/bodies/Heart Icon.png'  },
  shape:  { label: 'Shape',   src: '/bodies/Image-1.png'     },
};

export const ASSET_EYES = {
  none:   { label: 'None',    src: null                    },
  dots:   { label: 'Dots',    src: '/eyes/Dots Image.png'  },
  style1: { label: 'Style 1', src: '/eyes/Eyes 1.png'      },
  style2: { label: 'Style 2', src: '/eyes/Eyes 2.png'      },
};

export const ASSET_ACCESSORIES = {
  none:       { label: 'None',       src: null                                },
  hat:        { label: 'Hat',        src: '/accessories/Hat Image.png'        },
  headphones: { label: 'Headphones', src: '/accessories/Headphones Icon.png'  },
  extra:      { label: 'Extra',      src: '/accessories/Image.png'            },
};

// ── Canvas helpers ────────────────────────────────────────────────────────────

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Composite the three PNG layers onto a canvas.
 *
 * Base frame: 160 × 200 (width × height).  Scale factor s = size / 160.
 *
 * Layer positions (all at base size, multiply by s):
 *   Body      : x=0,      y=40  (bottom:0),  w=160, h=160
 *   Eyes      : centred,  y=80,              w=90,  h=60
 *   Accessory : centred,  y=0   (top:0),     w=120, h=120
 *
 * Drawing order: body → eyes → accessory  (accessory renders on top).
 *
 * @param {{ bodySrc: string|null, eyesSrc: string|null, accSrc: string|null }} srcs
 * @param {number} size  Width in px (height = size × 1.25)
 */
// square=true forces a square canvas (used for cursor data URLs so the hotspot
// at 0,0 lands precisely at the top-left corner of a 64×64 image).
export async function buildCompositePNG({ bodySrc, eyesSrc, accSrc }, size = 160, square = false) {
  const s  = size / 160;
  const W  = size;
  const H  = square ? size : Math.round(size * 1.25); // 200 at base size

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Body: bottom-aligned, full width
  if (bodySrc) {
    try {
      const img = await loadImage(bodySrc);
      ctx.drawImage(img, 0, H - 160 * s, W, 160 * s);
    } catch (_) {}
  }

  // Eyes: top:80, centred, 90×60
  if (eyesSrc) {
    try {
      const img = await loadImage(eyesSrc);
      const eW = 90 * s, eH = 60 * s;
      ctx.drawImage(img, (W - eW) / 2, 80 * s, eW, eH);
    } catch (_) {}
  }

  // Accessory: top:-20, centred, 120×120  (renders on top of body + eyes)
  if (accSrc) {
    try {
      const img = await loadImage(accSrc);
      const aW = 120 * s, aH = 120 * s;
      ctx.drawImage(img, (W - aW) / 2, -20 * s, aW, aH);
    } catch (_) {}
  }

  return canvas.toDataURL('image/png');
}
