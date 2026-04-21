import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Builder from './pages/Builder';
import Gallery from './pages/Gallery';
import InstallGuide from './pages/InstallGuide';
import './index.css';

const NAV_LINKS = [
  { to: '/',        label: 'Builder'       },
  { to: '/gallery', label: 'Gallery'       },
  { to: '/install', label: 'Install Guide' },
];

function Navbar() {
  return (
    <nav style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      padding: '0 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 64,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 28,
          height: 28,
          background: '#111111',
          borderRadius: 7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: 14,
          flexShrink: 0,
        }}>
          ↖
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: 16,
          color: '#111111',
          letterSpacing: '-0.3px',
        }}>
          Cursor Studio
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 7,
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? '#111111' : '#6B7280',
              background: isActive ? '#F3F4F6' : 'transparent',
              transition: 'all 0.15s ease',
              textDecoration: 'none',
            })}
            onMouseEnter={e => {
              if (e.currentTarget.style.background === 'transparent') {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.color = '#374151';
              }
            }}
            onMouseLeave={e => {
              // NavLink active state is managed by React Router; we only reset inactive ones
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#FAFAFA', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"        element={<Builder />}      />
            <Route path="/gallery" element={<Gallery />}      />
            <Route path="/install" element={<InstallGuide />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
