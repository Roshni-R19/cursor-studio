import { useState, useEffect } from 'react';
import { ASSET_BODIES, ASSET_EYES, ASSET_ACCESSORIES } from './assetParts';

const FALLBACK = { bodies: ASSET_BODIES, eyes: ASSET_EYES, accessories: ASSET_ACCESSORIES };

function toMap(arr) {
  return arr.reduce((m, { key, label, src }) => ({ ...m, [key]: { label, src: src ?? null } }), {});
}

export default function useAssets() {
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    fetch('/assets-manifest.json')
      .then(r => {
        if (!r.ok) throw new Error('manifest not found');
        return r.json();
      })
      .then(data => {
        setAssets({
          bodies:      toMap(data.bodies),
          eyes:        toMap(data.eyes),
          accessories: toMap(data.accessories),
        });
      })
      .catch(err => {
        console.warn('[Cursor Studio] Falling back to hardcoded assets:', err.message);
        setAssets(FALLBACK);
      });
  }, []);

  return assets;
}
