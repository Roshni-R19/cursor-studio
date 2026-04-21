import React, { useState } from 'react';

// ─── Platform logo SVGs ───────────────────────────────────────────────────────
function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="#111111">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function WindowsLogo() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="#0078D4" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
    </svg>
  );
}

// ─── Step row ─────────────────────────────────────────────────────────────────
function Step({ number, text, note }) {
  return (
    <div style={{
      display: 'flex', gap: 16, padding: '16px 0',
      borderBottom: '1px solid #F3F4F6', alignItems: 'flex-start',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        border: '1.5px solid #E5E7EB', background: '#FFFFFF',
        color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 600, flexShrink: 0, marginTop: 1,
      }}>
        {number}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: '#374151', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{text}</p>
        {note && (
          <div style={{
            marginTop: 8, background: 'rgba(99,102,241,0.06)',
            borderLeft: '3px solid #6366F1', borderRadius: '0 6px 6px 0',
            padding: '8px 12px', color: '#6B7280', fontSize: 12, lineHeight: 1.6,
          }}>
            {note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Platform card ────────────────────────────────────────────────────────────
function PlatformCard({ Logo, title, subtitle, steps, downloadLabel, onDownload }) {
  return (
    <div style={{
      background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden', flex: 1,
    }}>
      <div style={{
        padding: '24px 28px 20px', borderBottom: '1px solid #F3F4F6',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, background: '#F3F4F6', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Logo />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#111111', letterSpacing: '-0.3px' }}>{title}</div>
          <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>

      <div style={{ padding: '4px 28px' }}>
        {steps.map((step, i) => (
          <Step key={i} number={i + 1} text={step.text} note={step.note} />
        ))}
      </div>

      <div style={{ padding: '20px 28px 24px' }}>
        <DownloadButton label={downloadLabel} onClick={onDownload} />
      </div>
    </div>
  );
}

function DownloadButton({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', background: hov ? '#333333' : '#111111', color: '#FFFFFF',
        padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        transition: 'all 0.15s ease',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
      }}>
      {label}
    </button>
  );
}

// ─── Static content ───────────────────────────────────────────────────────────
const MAC_STEPS = [
  { text: 'Open System Settings from the Apple menu in the top-left corner of your screen.' },
  { text: 'Navigate to Accessibility → Display → Pointer.',
    note: 'On macOS Ventura and later, this path is System Settings → Accessibility → Display.' },
  { text: 'Use the Pointer Size slider to adjust how large your cursor appears.' },
  { text: "For full custom cursor support, you'll need a third-party app such as Cursor Pro or CursorSense.",
    note: 'macOS does not natively support importing custom cursor images. Third-party tools hook into the accessibility layer.' },
  { text: 'Download your cursor PNG from the Builder, then import it into your chosen app following its instructions.' },
];

const WINDOWS_STEPS = [
  { text: 'Right-click on your desktop and select Personalize from the context menu.' },
  { text: 'In the Personalization panel, click Themes in the left sidebar.' },
  { text: 'Scroll down and click Mouse cursor to open the Mouse Properties dialog.',
    note: 'Alternatively: Control Panel → Hardware and Sound → Devices and Printers → Mouse.' },
  { text: 'In the Pointers tab, select the cursor state you want to replace (e.g. Normal Select), then click Browse.' },
  { text: 'Navigate to your downloaded .cur file and select it. Click Open, then Apply and OK.',
    note: 'Convert your PNG to .cur format using a free tool like IcoFX or RealWorld Cursor Editor.' },
  { text: 'Your new cursor is active immediately — no restart required.' },
];

const TIPS = [
  { icon: '🎨', title: 'High contrast',   text: 'Pick colors that stand out against your desktop wallpaper.' },
  { icon: '📐', title: 'Retina-ready',    text: 'Export at 256×256 px for crisp rendering on HiDPI displays.' },
  { icon: '💾', title: 'Save variations', text: 'Build several designs and save them so you can swap anytime.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InstallGuide() {
  const [toast, setToast] = useState('');

  function fakeDownload(format) {
    setToast(format);
    setTimeout(() => setToast(''), 2500);
    alert(`To download a ${format} file, use the Download PNG button in the Builder after designing your cursor.`);
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111111', letterSpacing: '-0.5px', marginBottom: 8 }}>
          Install Your Cursor
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.7, maxWidth: 520 }}>
          Follow the steps for your operating system. Start by downloading your cursor from the Builder.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 32 }}>
        <PlatformCard
          Logo={AppleLogo}
          title="macOS"
          subtitle="System Settings · Accessibility"
          steps={MAC_STEPS}
          downloadLabel="↓ Download for Mac (.png)"
          onDownload={() => fakeDownload('PNG')}
        />
        <PlatformCard
          Logo={WindowsLogo}
          title="Windows"
          subtitle="Personalize · Mouse Cursor"
          steps={WINDOWS_STEPS}
          downloadLabel="↓ Download for Windows (.cur)"
          onDownload={() => fakeDownload('CUR')}
        />
      </div>

      {/* Pro tips */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '24px 28px',
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 16, letterSpacing: '-0.1px' }}>
          Pro tips
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {TIPS.map(tip => (
            <div key={tip.title} style={{
              background: '#F9FAFB', borderRadius: 12, padding: '16px 18px',
              display: 'flex', gap: 12, alignItems: 'flex-start', border: '1px solid #F3F4F6',
            }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{tip.icon}</span>
              <div>
                <div style={{ color: '#111111', fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{tip.title}</div>
                <div style={{ color: '#6B7280', fontSize: 12, lineHeight: 1.6 }}>{tip.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: '#111111', color: '#FFFFFF', borderRadius: 10,
          padding: '12px 20px', fontSize: 14, fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 999, whiteSpace: 'nowrap',
        }}>
          ✓ Initiating {toast} download
        </div>
      )}
    </div>
  );
}
