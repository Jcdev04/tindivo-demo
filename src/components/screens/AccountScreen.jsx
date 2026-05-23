import { useState } from 'react';
import { Icon, ScreenHeader } from '@/components/ui';
import { PAST_ORDERS } from '@/data';
import { MapView } from './CheckoutScreen';

export function AccountScreen({ user, setUser, onBack, onEditAddress, onAddAddress, onLogout }) {
  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title="Mi cuenta" onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '8px 16px 0' }}>
          {/* Profile card */}
          <div style={{
            background: 'linear-gradient(135deg, #F97316 0%, #C2410C 100%)',
            color: '#fff', borderRadius: 22, padding: '20px',
            display: 'flex', alignItems: 'center', gap: 16,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: -20, top: -30,
              width: 140, height: 140, borderRadius: 999,
              background: 'rgba(255,255,255,0.1)',
            }}/>
            <div style={{
              width: 56, height: 56, borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff',
              position: 'relative', zIndex: 1,
            }}>{user.name[0]?.toUpperCase() || 'U'}</div>
            <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              <div className="priamo-display" style={{ fontSize: 20, lineHeight: 1.1 }}>
                {user.name || 'Usuario'}
              </div>
              <div style={{ fontSize: 12, opacity: 0.85, marginTop: 3 }}>{user.email}</div>
              <div style={{
                marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, background: 'rgba(255,255,255,0.18)',
                padding: '3px 9px', borderRadius: 999,
              }}>
                <Icon.Phone style={{ width: 12, height: 12 }}/>
                +51 {user.phone || '— — —'}
              </div>
            </div>
          </div>

          {/* Addresses section */}
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="priamo-display" style={{ fontSize: 19 }}>Mis direcciones</div>
            <button onClick={onAddAddress} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#F97316', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              padding: '6px 8px', borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Icon.Plus style={{ width: 14, height: 14 }}/> Añadir
            </button>
          </div>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user.addresses.length === 0 ? (
              <EmptyAddresses onAdd={onAddAddress}/>
            ) : (
              user.addresses.map(a => (
                <AddressCard
                  key={a.id}
                  address={a}
                  onEdit={() => onEditAddress(a)}
                  onSetDefault={() => {
                    setUser({
                      ...user,
                      addresses: user.addresses.map(x => ({ ...x, isDefault: x.id === a.id }))
                    });
                  }}
                />
              ))
            )}
          </div>

          {/* History */}
          <div style={{ marginTop: 22, marginBottom: 8 }}>
            <div className="priamo-display" style={{ fontSize: 19 }}>Pedidos anteriores</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(26,22,20,0.05)' }}>
            {PAST_ORDERS.map((o, i) => (
              <div key={o.id} style={{
                padding: '14px 16px',
                borderBottom: i < PAST_ORDERS.length - 1 ? '1px solid rgba(26,22,20,0.06)' : 'none',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(26,150,80,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1A8050', flexShrink: 0,
                }}>
                  <Icon.Check/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{o.items}</div>
                  <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>
                    {o.id} · {o.date}
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  S/ {o.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Settings */}
          <div style={{ marginTop: 22, marginBottom: 8 }}>
            <div className="priamo-display" style={{ fontSize: 19 }}>Cuenta</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(26,22,20,0.05)' }}>
            <SettingRow icon="📝" label="Editar perfil"/>
            <SettingRow icon="🔔" label="Notificaciones"/>
            <SettingRow icon="❓" label="Centro de ayuda"/>
            <SettingRow icon="📄" label="Términos y privacidad"/>
            <SettingRow icon="🚪" label="Cerrar sesión" onClick={onLogout} danger isLast/>
          </div>

          <div style={{ height: 60 }}/>
        </div>
      </div>
      <div className="pad-home"/>
    </div>
  );
}

function EmptyAddresses({ onAdd }) {
  return (
    <button onClick={onAdd} style={{
      background: 'rgba(249,115,22,0.04)',
      border: '1.5px dashed rgba(249,115,22,0.35)',
      borderRadius: 18, padding: '24px 16px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: 'pointer', fontFamily: 'inherit', color: '#C2410C',
      width: '100%',
    }}>
      <Icon.Plus style={{ width: 22, height: 22 }}/>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Añade tu primera dirección</div>
      <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)' }}>Guárdala una vez, úsala siempre.</div>
    </button>
  );
}

function AddressCard({ address: a, onEdit, onSetDefault, compact = false, selected, onSelect }) {
  const labelIcon = a.label === 'Casa' ? '🏠' : a.label === 'Trabajo' ? '💼' : '📍';
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff',
        borderRadius: 18, padding: compact ? 12 : 14,
        border: selected ? '2px solid #F97316' : '1px solid rgba(26,22,20,0.05)',
        display: 'flex', gap: 12, alignItems: 'flex-start',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'border-color 140ms ease',
      }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(249,115,22,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0,
      }}>{labelIcon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</div>
          {a.isDefault && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: '#F97316',
              background: 'rgba(249,115,22,0.1)',
              padding: '2px 7px', borderRadius: 5,
            }}>Por defecto</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(26,22,20,0.85)', fontWeight: 500 }}>{a.line}</div>
        <div style={{
          fontSize: 12, color: 'rgba(26,22,20,0.55)', marginTop: 4, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{a.reference}</div>
        {!compact && (
          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} style={textBtn}>Editar</button>
            {!a.isDefault && onSetDefault && (
              <button onClick={(e) => { e.stopPropagation(); onSetDefault(); }} style={textBtn}>
                Marcar como predeterminada
              </button>
            )}
          </div>
        )}
      </div>
      {selected && (
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          background: '#F97316', color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.Check/>
        </div>
      )}
    </div>
  );
}
const textBtn = {
  border: 'none', background: 'rgba(26,22,20,0.05)',
  color: '#1A1614', fontFamily: 'inherit',
  fontSize: 12, fontWeight: 500, padding: '6px 10px',
  borderRadius: 8, cursor: 'pointer',
};

function SettingRow({ icon, label, onClick, danger, isLast }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', background: 'transparent', border: 'none',
      borderBottom: isLast ? 'none' : '1px solid rgba(26,22,20,0.06)',
      cursor: 'pointer', fontFamily: 'inherit', color: danger ? '#C2410C' : '#1A1614',
      textAlign: 'left',
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
      <svg width="8" height="14" viewBox="0 0 8 14" style={{ opacity: 0.4 }}>
        <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

export function AddressEditScreen({ address, isNew, onBack, onSave, onDelete }) {
  const [a, setA] = useState(address);
  const validRef = a.reference.trim().length >= 6;
  const validLine = a.line.trim().length >= 3;
  const canSave = validRef && validLine;

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title={isNew ? 'Nueva dirección' : 'Editar dirección'} onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '6px 16px 0' }}>
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Etiqueta</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Casa', 'Trabajo', 'Otro'].map(l => (
                <button
                  key={l}
                  onClick={() => setA({ ...a, label: l })}
                  className={'chip' + (a.label === l ? ' active' : '')}
                  style={{ flex: 1, justifyContent: 'center' }}>
                  {l === 'Casa' && '🏠 '}{l === 'Trabajo' && '💼 '}{l === 'Otro' && '📍 '}
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Ubicación en el mapa</label>
            <MapView pinPos={a.pinPos} onMove={(p) => setA({ ...a, pinPos: p })}/>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Calle / Jirón</label>
            <input
              className="field"
              placeholder="Ej. Jr. Sucre 412"
              value={a.line}
              onChange={e => setA({ ...a, line: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">
              Referencia <span style={{ color: '#F97316' }}>*</span>
            </label>
            <textarea
              className="field"
              placeholder="Frente a la bodega, casa de reja negra…"
              value={a.reference}
              onChange={e => setA({ ...a, reference: e.target.value })}
              maxLength={140}
            />
            <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.5)', marginTop: 4, lineHeight: 1.4 }}>
              {a.reference.length}/140 caracteres
            </div>
          </div>

          {/* Toggle default */}
          <div
            onClick={() => setA({ ...a, isDefault: !a.isDefault })}
            style={{
              background: '#fff', borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              border: '1px solid rgba(26,22,20,0.05)', cursor: 'pointer',
            }}>
            <div style={{
              width: 38, height: 22, borderRadius: 999,
              background: a.isDefault ? '#F97316' : 'rgba(26,22,20,0.15)',
              position: 'relative', transition: 'background 140ms ease',
              flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 2, left: a.isDefault ? 18 : 2,
                width: 18, height: 18, borderRadius: 999, background: '#fff',
                transition: 'left 140ms ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Usar como predeterminada</div>
              <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>
                Aparece primero al hacer un pedido nuevo.
              </div>
            </div>
          </div>

          {!isNew && onDelete && (
            <button
              onClick={onDelete}
              style={{
                width: '100%', marginTop: 14, padding: '14px 16px',
                background: 'rgba(220,38,38,0.06)', color: '#DC2626',
                border: 'none', borderRadius: 14, fontFamily: 'inherit',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
              Eliminar dirección
            </button>
          )}
        </div>
        <div style={{ height: 140 }}/>
      </div>

      <div className="sticky-cta" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <button className="btn btn-primary btn-block" disabled={!canSave} onClick={() => onSave(a)}>
          {isNew ? 'Guardar dirección' : 'Guardar cambios'}
        </button>
      </div>
      <div className="pad-home"/>
    </div>
  );
}
