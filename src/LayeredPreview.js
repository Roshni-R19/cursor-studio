import React from 'react';

/**
 * Stacks three PNG layers in a 160×200 frame (scaled by `size`).
 *
 * Container: width=size, height=size×1.25
 * Body      : absolute, bottom:0, left:0,  160×160  (bottom-aligned)
 * Eyes      : absolute, top:80s, centred,  90×60
 * Accessory : absolute, top:0,   centred,  120×120  (renders on top)
 */
export default function LayeredPreview({ bodySrc, eyesSrc, accSrc, size = 160 }) {
  const s = size / 160;
  const H = Math.round(size * 1.25);

  return (
    <div style={{ width: size, height: H, position: 'relative', flexShrink: 0 }}>
      {/* Body — bottom-aligned */}
      {bodySrc && (
        <img
          src={bodySrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', bottom: 0, left: 0,
            width: size, height: size,
            objectFit: 'contain', userSelect: 'none',
          }}
        />
      )}

      {/* Eyes — mid area */}
      {eyesSrc && (
        <img
          src={eyesSrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: 80 * s,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 90 * s,
            height: 60 * s,
            objectFit: 'contain', userSelect: 'none',
          }}
        />
      )}

      {/* Accessory — top, renders over body & eyes */}
      {accSrc && (
        <img
          src={accSrc}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120 * s,
            height: 120 * s,
            objectFit: 'contain', userSelect: 'none',
          }}
        />
      )}
    </div>
  );
}
