import { useState } from 'react';
import { Icon } from './ui';
import { MODIFIERS } from '@/data';

export default function ProductModal({ product, category, onClose, onAdd }) {
  const groups = MODIFIERS[category] || [];
  const [selections, setSelections] = useState(() => {
    const s = {};
    for (const g of groups) s[g.id] = g.type === 'single' ? null : [];
    return s;
  });
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const toggle = (gid, opt, group) => {
    setSelections(prev => {
      const next = { ...prev };
      if (group.type === 'single') {
        next[gid] = opt.id;
      } else {
        const cur = next[gid] || [];
        if (cur.includes(opt.id)) {
          next[gid] = cur.filter(x => x !== opt.id);
        } else if (cur.length < group.max) {
          next[gid] = [...cur, opt.id];
        }
      }
      return next;
    });
  };

  const missing = groups.filter(g => {
    if (!g.required) return false;
    if (g.type === 'single') return !selections[g.id];
    return (selections[g.id] || []).length === 0;
  });
  const valid = missing.length === 0;

  const extrasTotal = groups.reduce((sum, g) => {
    const sel = selections[g.id];
    if (g.type === 'single') {
      const opt = g.options.find(o => o.id === sel);
      return sum + (opt?.price || 0);
    } else {
      return sum + (sel || []).reduce((s, id) => {
        const opt = g.options.find(o => o.id === id);
        return s + (opt?.price || 0);
      }, 0);
    }
  }, 0);
  const unitPrice = product.price + extrasTotal;
  const total = unitPrice * qty;

  const handleAdd = () => {
    const modSummary = groups.flatMap(g => {
      const sel = selections[g.id];
      if (g.type === 'single' && sel) {
        const opt = g.options.find(o => o.id === sel);
        return opt ? [{ group: g.name, name: opt.name, price: opt.price }] : [];
      } else if (g.type === 'multi') {
        return (sel || []).map(id => {
          const opt = g.options.find(o => o.id === id);
          return { group: g.name, name: opt.name, price: opt.price };
        });
      }
      return [];
    });
    onAdd({
      key: product.id + '-' + Date.now(),
      productId: product.id,
      name: product.name,
      qty,
      unitPrice,
      total,
      modifiers: modSummary,
      note: note.trim() || null,
      hue: product.hue,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ position: 'relative' }}>
          <div className="ph-image" style={{
            width: '100%', height: 200, borderRadius: 0,
            background: `oklch(0.92 0.04 ${product.hue})`,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: `oklch(0.35 0.10 ${product.hue})`, letterSpacing: '0.06em',
            }}>
              [ {product.name.toUpperCase()} HERO ]
            </div>
          </div>
          <button onClick={onClose} style={{
            position: 'absolute', top: 14, right: 14,
            width: 36, height: 36, borderRadius: 999,
            background: 'rgba(255,255,255,0.95)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            <Icon.Close/>
          </button>
        </div>

        <div className="priamo-scroll" style={{ flex: 1 }}>
          <div style={{ padding: '20px 20px 6px' }}>
            <div className="priamo-display" style={{ fontSize: 26, lineHeight: 1.1 }}>
              {product.name}
            </div>
            <div style={{ fontSize: 14, color: 'rgba(26,22,20,0.65)', marginTop: 8, lineHeight: 1.45 }}>
              {product.desc}
            </div>
            <div style={{ marginTop: 12, fontSize: 18, fontWeight: 600 }}>
              Desde S/ {product.price.toFixed(2)}
            </div>
          </div>

          <div style={{ padding: '12px 20px 0' }}>
            {groups.map((g) => (
              <ModGroup
                key={g.id}
                group={g}
                value={selections[g.id]}
                onToggle={(opt) => toggle(g.id, opt, g)}
                isMissing={missing.includes(g)}
              />
            ))}

            <div style={{ marginTop: 18, marginBottom: 16 }}>
              <label className="field-label">Nota especial (opcional)</label>
              <textarea
                className="field"
                placeholder="Ej. sin cebolla, masa bien cocida, tocar timbre 2 veces…"
                value={note}
                onChange={e => setNote(e.target.value)}
                maxLength={140}
              />
              <div style={{ textAlign: 'right', fontSize: 11, color: 'rgba(26,22,20,0.4)', marginTop: 4 }}>
                {note.length}/140
              </div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '14px 16px 24px',
          background: '#FAF6F1',
          borderTop: '1px solid rgba(26,22,20,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div className="qty">
            <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Menos">
              <Icon.Minus/>
            </button>
            <span className="val">{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label="Más">
              <Icon.Plus/>
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            disabled={!valid}
            onClick={handleAdd}>
            {valid
              ? <>Agregar · S/ {total.toFixed(2)}</>
              : <>Completa {missing.length} {missing.length === 1 ? 'opción' : 'opciones'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModGroup({ group, value, onToggle, isMissing }) {
  const isSingle = group.type === 'single';
  const selected = isSingle ? value : (value || []);
  const selectedCount = isSingle ? (value ? 1 : 0) : selected.length;

  return (
    <div style={{
      marginTop: 14,
      background: '#fff',
      borderRadius: 18,
      padding: '14px 16px',
      border: isMissing ? '1px solid #F97316' : '1px solid rgba(26,22,20,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="priamo-display" style={{ fontSize: 17, fontWeight: 700 }}>
          {group.name}
        </div>
        {group.required ? (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
            padding: '4px 8px', borderRadius: 6,
            background: selectedCount > 0 ? 'rgba(26,150,80,0.12)' : 'rgba(249,115,22,0.1)',
            color: selectedCount > 0 ? '#1A8050' : '#F97316',
            textTransform: 'uppercase',
          }}>
            {selectedCount > 0 ? <><Icon.Check style={{ verticalAlign: 'middle', width: 12, height: 12 }}/> Listo</> : 'Obligatorio'}
          </span>
        ) : !isSingle ? (
          <span style={{ fontSize: 12, color: 'rgba(26,22,20,0.5)', fontVariantNumeric: 'tabular-nums' }}>
            {selectedCount}/{group.max}
          </span>
        ) : null}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.5)', marginBottom: 12 }}>
        {group.sub}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {group.options.map(opt => {
          const isSelected = isSingle ? value === opt.id : selected.includes(opt.id);
          const disabled = !isSingle && !isSelected && selected.length >= group.max;
          return (
            <button
              key={opt.id}
              onClick={() => onToggle(opt)}
              disabled={disabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 10px',
                background: isSelected ? 'rgba(249,115,22,0.06)' : 'transparent',
                border: 'none',
                borderRadius: 12,
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.4 : 1,
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 120ms ease',
              }}>
              {isSingle ? (
                <div style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: `2px solid ${isSelected ? '#F97316' : 'rgba(26,22,20,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#F97316' }}/>}
                </div>
              ) : (
                <div style={{
                  width: 22, height: 22, borderRadius: 7,
                  border: `2px solid ${isSelected ? '#F97316' : 'rgba(26,22,20,0.25)'}`,
                  background: isSelected ? '#F97316' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: '#fff',
                }}>
                  {isSelected && <Icon.Check/>}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{opt.name}</div>
                {opt.desc && (
                  <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>{opt.desc}</div>
                )}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 500,
                color: opt.price > 0 ? '#1A1614' : 'rgba(26,22,20,0.45)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {opt.price > 0 ? `+S/ ${opt.price.toFixed(2)}` : 'Incluido'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
