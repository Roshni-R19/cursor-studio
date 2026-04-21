import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildCompositePNG } from '../assetParts';
import LayeredPreview from '../LayeredPreview';
import useAssets from '../useAssets';

function CursorCard({ entry, assets, onLoad }) {
  const [hov, setHov] = useState(false);

  // Resolve srcs — handle ai_generated bodies and gracefully degrade unknown keys
  const bodySrc = entry.body === 'ai_generated'
    ? entry.customBodySrc
    : (assets?.bodies?.[entry.body]?.src ?? assets?.bodies?.[Object.keys(assets?.bodies ?? {})[0]]?.src ?? null);
  const eyesSrc = assets?.eyes?.[entry.eyes]?.src ?? null;
  const accSrc  = assets?.accessories?.[entry.accessories]?.src ?? null;

  async function handleDownload() {
    const png  = await buildCompositePNG({ bodySrc, eyesSrc, accSrc }, 256);
    const link = document.createElement('a');
    link.download = `${entry.name || 'cursor'}.png`;
    link.href = png;
    link.click();
  }

  const dateStr = new Date(entry.dateCreated).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${hov ? '#D1D5DB' : '#E5E7EB'}`,
        borderRadius: 16,
        overflow: 'visible',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Preview */}
      <div style={{
        background: '#F9FAFB',
        borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid #F3F4F6',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        paddingTop: 20,
      }}>
        <LayeredPreview bodySrc={bodySrc} eyesSrc={eyesSrc} accSrc={accSrc} size={100} />
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: '#111111', marginBottom: 3, letterSpacing: '-0.2px' }}>
          {entry.name || 'Untitled Cursor'}
        </div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 14 }}>{dateStr}</div>

        {entry.promptUsed && (
          <div style={{
            fontSize: 11, color: '#6366F1', background: 'rgba(99,102,241,0.07)',
            borderRadius: 6, padding: '5px 9px', marginBottom: 14,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontStyle: 'italic',
          }}>
            "{entry.promptUsed}"
          </div>
        )}

        <div style={{ display: 'flex', gap: 8 }}>
          <LoadBtn  onClick={onLoad} />
          <DlBtn    onClick={handleDownload} />
        </div>
      </div>
    </div>
  );
}

function LoadBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, background: hov ? '#333333' : '#111111', color: '#FFFFFF',
        padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 600,
        transition: 'all 0.15s ease',
      }}>
      Load in Builder
    </button>
  );
}

function DlBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, background: hov ? '#F9FAFB' : '#FFFFFF',
        color: hov ? '#111111' : '#374151',
        padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
        border: `1px solid ${hov ? '#D1D5DB' : '#E5E7EB'}`,
        transition: 'all 0.15s ease',
      }}>
      ↓ Download
    </button>
  );
}

function OpenBuilderBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#333333' : '#111111', color: '#FFFFFF',
        padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        transition: 'all 0.15s ease',
      }}>
      Open Builder
    </button>
  );
}

export default function Gallery() {
  const navigate = useNavigate();
  const assets   = useAssets();
  const [cursors, setCursors] = useState([]);

  useEffect(() => {
    setCursors(JSON.parse(localStorage.getItem('cursor-gallery') || '[]'));
  }, []);

  function handleLoad(entry) {
    sessionStorage.setItem('load-cursor', JSON.stringify(entry));
    navigate('/');
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111111', letterSpacing: '-0.5px', marginBottom: 6 }}>
          Your Gallery
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280' }}>
          {cursors.length === 0
            ? 'Saved cursors will appear here.'
            : `${cursors.length} cursor${cursors.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {cursors.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 360, gap: 20,
          background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <div style={{
            width: 80, height: 80, background: '#F3F4F6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#D1D5DB',
          }}>
            ↖
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#111111', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>
              No cursors yet
            </h2>
            <p style={{ color: '#6B7280', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Build your first one in the Cursor Builder.
            </p>
            <OpenBuilderBtn onClick={() => navigate('/')} />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {cursors.map(entry => (
            <CursorCard
              key={entry.id}
              entry={entry}
              assets={assets}
              onLoad={() => handleLoad(entry)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
