import React, { useState, useEffect } from 'react';
import { buildCompositePNG } from '../assetParts';
import LayeredPreview from '../LayeredPreview';
import useAssets from '../useAssets';

const CLAUDE_SYSTEM = `You are a cursor character designer. Generate a single cute kawaii SVG character based on the description. The SVG must be exactly 160x160 viewBox, with a single centered character that fills about 70% of the space. Use thick black strokes (stroke-width 3), flat bright colors, simple rounded shapes, kawaii style. Return ONLY the raw SVG code starting with <svg, nothing else.`;

// Strip markdown fences, extract the <svg>...</svg> block, and guarantee the
// attributes browsers require when loading SVG via <img> or canvas drawImage.
function cleanSvg(raw) {
  // Remove any markdown code fences (```svg, ```xml, ```, etc.)
  let s = raw.replace(/^```[a-z]*\n?/i, '').replace(/```\s*$/i, '').trim();

  // Extract from the first <svg to the last </svg>
  const start = s.indexOf('<svg');
  const end   = s.lastIndexOf('</svg>');
  if (start !== -1 && end !== -1) {
    s = s.slice(start, end + 6);
  }

  // Inject xmlns if missing — required for <img> and canvas
  if (!s.includes('xmlns=')) {
    s = s.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // Inject explicit width/height if missing — required for canvas drawImage sizing
  if (!s.includes('width=')) {
    s = s.replace('<svg', '<svg width="160"');
  }
  if (!s.includes('height=')) {
    s = s.replace('<svg', '<svg height="160"');
  }

  return s;
}

// ─── Thumbnail card ───────────────────────────────────────────────────────────
function Thumb({ label, src, isSelected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isSelected ? 'rgba(99,102,241,0.07)' : hov ? '#FAFAFA' : '#FFFFFF',
        border: `${isSelected ? 2 : 1}px solid ${isSelected ? '#6366F1' : hov ? '#D1D5DB' : '#E5E7EB'}`,
        borderRadius: 12,
        padding: '14px 8px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: isSelected
          ? '0 0 0 3px rgba(99,102,241,0.12)'
          : hov ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      {src ? (
        <img src={src} alt={label} draggable={false}
          style={{ width: 52, height: 52, objectFit: 'contain' }} />
      ) : (
        <div style={{
          width: 52, height: 52, borderRadius: 8,
          border: '1.5px dashed #D1D5DB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#D1D5DB', fontSize: 20,
        }}>
          ∅
        </div>
      )}
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: isSelected ? '#6366F1' : '#6B7280',
        textAlign: 'center', lineHeight: 1.2,
      }}>
        {label}
      </span>
    </button>
  );
}

// ─── Button components ────────────────────────────────────────────────────────
function BtnPrimary({ children, onClick, disabled, loading, style: sx = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: disabled ? '#9CA3AF' : hov ? '#333333' : '#111111',
        color: '#FFFFFF',
        padding: '11px 20px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.6 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        ...sx,
      }}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, onClick, style: sx = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#F9FAFB' : '#FFFFFF',
        color: hov ? '#111111' : '#374151',
        padding: '11px 20px',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        border: `1px solid ${hov ? '#D1D5DB' : '#E5E7EB'}`,
        transition: 'all 0.15s ease',
        ...sx,
      }}
    >
      {children}
    </button>
  );
}

// ─── Live cursor zone ─────────────────────────────────────────────────────────
function LiveZone() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', height: 80,
        border: `2px dashed ${hov ? '#6366F1' : '#E5E7EB'}`,
        background: hov ? 'rgba(99,102,241,0.04)' : 'transparent',
        borderRadius: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 5, transition: 'all 0.15s ease',
      }}
    >
      <span style={{ fontSize: 16, opacity: 0.35 }}>↖</span>
      <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>
        Your cursor is live across the whole app
      </span>
    </div>
  );
}

// ─── Builder page ─────────────────────────────────────────────────────────────
const TABS = ['Body', 'Eyes', 'Accessories'];

export default function Builder() {
  const assets = useAssets();

  const [activeTab,     setActiveTab]     = useState('Body');
  const [selectedBody,  setSelectedBody]  = useState('flower');
  const [selectedEyes,  setSelectedEyes]  = useState('dots');
  const [selectedAcc,   setSelectedAcc]   = useState('none');
  const [generatedImage, setGeneratedImage] = useState(null); // base64 data URL from DALL-E
  const [cursorName,    setCursorName]    = useState('My Cursor');
  const [aiPrompt,      setAiPrompt]      = useState('');
  const [isGenerating,  setIsGenerating]  = useState(false);
  const [aiError,       setAiError]       = useState('');
  const [saveMsg,       setSaveMsg]       = useState('');

  // Resolve body src — handles both regular asset keys and AI-generated image
  const bodySrc = selectedBody === 'ai_generated'
    ? generatedImage
    : (assets?.bodies?.[selectedBody]?.src ?? null);
  const eyesSrc = assets?.eyes?.[selectedEyes]?.src ?? null;
  const accSrc  = assets?.accessories?.[selectedAcc]?.src ?? null;

  // ── Global cursor: inject <style> + set body.style.cursor ──────────────────
  useEffect(() => {
    let alive = true;
    buildCompositePNG({ bodySrc, eyesSrc, accSrc }, 96)
      .then(dataUrl => {
        if (!alive) return;
        let el = document.getElementById('cursor-studio-global');
        if (!el) {
          el = document.createElement('style');
          el.id = 'cursor-studio-global';
          document.head.appendChild(el);
        }
        el.textContent = `*, *::before, *::after { cursor: url("${dataUrl}") 48 60, auto !important; }`;
        document.body.style.cursor = `url("${dataUrl}") 48 60, auto`;
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [bodySrc, eyesSrc, accSrc]);

  // ── Claude SVG generation ──────────────────────────────────────────────────
  async function handleGenerate() {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2048,
          system: CLAUDE_SYSTEM,
          messages: [{ role: 'user', content: aiPrompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Claude API request failed');
      }

      const data = await res.json();
      const rawText = data.content[0].text.trim();
      console.log('[Cursor Studio] Raw response from Claude:', rawText);
      const svgCode = cleanSvg(rawText);
      console.log('[Cursor Studio] Cleaned SVG:', svgCode);
      const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgCode);

      setGeneratedImage(svgDataUrl);
      setSelectedBody('ai_generated');
    } catch (e) {
      setAiError(e.message);
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Save / Download ────────────────────────────────────────────────────────
  function handleSave() {
    const existing = JSON.parse(localStorage.getItem('cursor-gallery') || '[]');
    localStorage.setItem('cursor-gallery', JSON.stringify([
      {
        id:            Date.now().toString(),
        name:          cursorName || 'Untitled Cursor',
        body:          selectedBody,
        eyes:          selectedEyes,
        accessories:   selectedAcc,
        customBodySrc: selectedBody === 'ai_generated' ? generatedImage : null,
        dateCreated:   new Date().toISOString(),
        promptUsed:    aiPrompt,
      },
      ...existing,
    ]));
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }

  async function handleDownload() {
    const png  = await buildCompositePNG({ bodySrc, eyesSrc, accSrc }, 256);
    const link = document.createElement('a');
    link.download = `${cursorName || 'cursor'}.png`;
    link.href = png;
    link.click();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111111', letterSpacing: '-0.5px', marginBottom: 6 }}>
          Cursor Builder
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>
          Describe your character and AI will draw it, or mix and match parts manually.
        </p>
      </div>

      {/* AI prompt bar */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16,
        padding: '20px 24px', marginBottom: 28,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex', gap: 12, alignItems: 'center',
        position: 'relative', zIndex: 10,
      }}>
        <input
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="Describe your cursor character... e.g. a chubby ghost eating ramen"
          style={{
            flex: 1, background: '#F9FAFB', border: '1px solid #E5E7EB',
            borderRadius: 8, padding: '11px 16px', color: '#111111', fontSize: 14,
            transition: 'all 0.15s ease',
          }}
          onFocus={e => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
          onBlur={e  => { e.target.style.background = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
        />
        <BtnPrimary
          onClick={handleGenerate}
          disabled={isGenerating || !aiPrompt.trim()}
          sx={{ minWidth: 180 }}
        >
          {isGenerating
            ? <><span style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block' }}>◌</span> Generating your cursor…</>
            : <>✦ Generate with AI</>}
        </BtnPrimary>
      </div>

      {aiError && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
          padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 24,
        }}>
          {aiError}
        </div>
      )}

      {/* Two-column layout */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Left: component picker ── */}
        <div style={{
          width: '38%', background: '#FFFFFF', border: '1px solid #E5E7EB',
          borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden',
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex', borderBottom: '1px solid #E5E7EB',
            padding: '0 20px', background: '#FAFAFA',
          }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '14px 8px', fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? '#111111' : '#9CA3AF',
                background: 'transparent',
                borderBottom: activeTab === tab ? '2px solid #111111' : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s ease',
              }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Thumbnail grid */}
          <div style={{ padding: 20 }}>
            {!assets ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF', fontSize: 13 }}>
                Loading assets…
              </div>
            ) : (
              <>
                {activeTab === 'Body' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {Object.entries(assets.bodies).map(([k, v]) => (
                      <Thumb key={k} label={v.label} src={v.src}
                        isSelected={selectedBody === k} onClick={() => setSelectedBody(k)} />
                    ))}
                    {/* AI generated body — appears as a selectable option when generated */}
                    {generatedImage && (
                      <Thumb
                        key="ai_generated"
                        label="AI Art"
                        src={generatedImage}
                        isSelected={selectedBody === 'ai_generated'}
                        onClick={() => setSelectedBody('ai_generated')}
                      />
                    )}
                  </div>
                )}
                {activeTab === 'Eyes' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {Object.entries(assets.eyes).map(([k, v]) => (
                      <Thumb key={k} label={v.label} src={v.src}
                        isSelected={selectedEyes === k} onClick={() => setSelectedEyes(k)} />
                    ))}
                  </div>
                )}
                {activeTab === 'Accessories' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {Object.entries(assets.accessories).map(([k, v]) => (
                      <Thumb key={k} label={v.label} src={v.src}
                        isSelected={selectedAcc === k} onClick={() => setSelectedAcc(k)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Right: preview + controls ── */}
        <div style={{
          flex: 1, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          {/* Preview stage */}
          <div style={{
            width: '100%', background: '#F9FAFB', borderRadius: 12,
            border: '1px solid #F3F4F6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px 20px',
            overflow: 'visible',
          }}>
            <LayeredPreview bodySrc={bodySrc} eyesSrc={eyesSrc} accSrc={accSrc} size={200} />
          </div>

          {/* Cursor name */}
          <input
            value={cursorName}
            onChange={e => setCursorName(e.target.value)}
            placeholder="Name your cursor…"
            style={{
              width: '100%', background: '#F9FAFB', border: '1px solid #E5E7EB',
              borderRadius: 8, padding: '11px 16px', color: '#111111', fontSize: 14,
              textAlign: 'center', transition: 'all 0.15s ease',
            }}
            onFocus={e => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
            onBlur={e  => { e.target.style.background = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
          />

          <LiveZone />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <BtnPrimary onClick={handleSave} sx={{ flex: 1 }}>
              {saveMsg || '✦ Save to Gallery'}
            </BtnPrimary>
            <BtnSecondary onClick={handleDownload} style={{ flex: 1 }}>
              ↓ Download PNG
            </BtnSecondary>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
