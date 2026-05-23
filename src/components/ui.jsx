// Icons used throughout Tindivo / Priamo
export const Icon = {
  Search: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Bag: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 8h14l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Back: (p) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Close: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  ),
  Star: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" {...p}>
      <path d="M12 2l3 6.9L22 10l-5.5 4.7L18 22l-6-3.6L6 22l1.5-7.3L2 10l7-1.1L12 2z" fill="currentColor"/>
    </svg>
  ),
  Clock: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Pin: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Plus: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  Minus: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  ),
  Check: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Upload: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 16V4M7 9l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Phone: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  Truck: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 7h11v9H3V7zM14 11h4l3 3v2h-7v-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="7" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  Store: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8h16l-1.5-4h-13L4 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M5 8v12h14V8" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 20v-5h6v5" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
};

// Striped product image placeholder
export function ProductImage({ label, hue = 14, height = 88, width = 88, compact = false }) {
  const bg = `oklch(0.92 0.03 ${hue})`;
  return (
    <div className="ph-image" style={{ width, height, background: bg, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'JetBrains Mono, monospace', fontSize: compact ? 9 : 10,
        color: `oklch(0.35 0.10 ${hue})`,
        letterSpacing: '0.05em', textAlign: 'center', padding: 6,
      }}>
        {compact ? '◷' : label}
      </div>
    </div>
  );
}

// Pill toggle group
export function Segmented({ options, value, onChange }) {
  return (
    <div style={{
      display: 'flex',
      background: 'rgba(26,22,20,0.06)',
      borderRadius: 14,
      padding: 4,
    }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1,
            border: 'none',
            background: value === o.value ? '#fff' : 'transparent',
            color: '#1A1614',
            padding: '12px 16px',
            borderRadius: 10,
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: value === o.value ? 600 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: value === o.value ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
            transition: 'background 140ms ease',
          }}>
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Header bar (used by all screens except menu)
export function ScreenHeader({ title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px 12px',
      background: '#FAF6F1',
      borderBottom: '1px solid rgba(26,22,20,0.05)',
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 999,
          background: 'rgba(26,22,20,0.06)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#1A1614',
        }}>
          <Icon.Back/>
        </button>
      )}
      <div className="priamo-display" style={{ flex: 1, fontSize: 22, fontWeight: 700 }}>
        {title}
      </div>
      {right}
    </div>
  );
}
