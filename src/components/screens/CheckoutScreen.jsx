import { useState, useRef, useEffect } from 'react';
import { Icon, ScreenHeader, Segmented } from '@/components/ui';
import { PRIAMO } from '@/data';

// Checkout screen
export function CheckoutScreen({ cart, user, order, setOrder, onBack, onConfirm, onAddAddress, onEditAddress }) {
  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const fee = order.method === 'delivery' ? PRIAMO.fee : 0;
  const total = subtotal + fee;

  const validPhone = /^9\d{8}$/.test(order.phone.replace(/\s/g, ''));
  const selectedAddress = user.addresses.find(a => a.id === order.addressId);
  const needsAddress = order.method === 'delivery' && !selectedAddress;
  const canContinue = !needsAddress && validPhone;

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title="Datos de entrega" onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '6px 16px 0' }}>
          <Segmented
            value={order.method}
            onChange={(m) => setOrder({ ...order, method: m })}
            options={[
              { value: 'delivery', label: 'Delivery', icon: <Icon.Truck/> },
              { value: 'pickup', label: 'Pick-up', icon: <Icon.Store/> },
            ]}
          />

          {order.method === 'delivery' ? (
            <div style={{ marginTop: 18 }}>
              <div style={{
                display: 'flex', alignItems: 'baseline',
                justifyContent: 'space-between', marginBottom: 8,
              }}>
                <label className="field-label" style={{ margin: 0 }}>
                  Entregar en
                </label>
                <button onClick={onAddAddress} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: '#F97316', fontFamily: 'inherit', fontSize: 12,
                  fontWeight: 600, padding: 0,
                  display: 'inline-flex', alignItems: 'center', gap: 3,
                }}>
                  <Icon.Plus style={{ width: 12, height: 12 }}/> Añadir nueva
                </button>
              </div>

              {user.addresses.length === 0 ? (
                <button onClick={onAddAddress} style={{
                  width: '100%',
                  background: 'rgba(249,115,22,0.04)',
                  border: '1.5px dashed rgba(249,115,22,0.35)',
                  borderRadius: 18, padding: '20px 16px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  color: '#C2410C',
                }}>
                  <Icon.Plus style={{ width: 20, height: 20 }}/>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Añade tu primera dirección</div>
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {user.addresses.map(a => (
                    <AddressCard
                      key={a.id}
                      address={a}
                      compact
                      selected={order.addressId === a.id}
                      onSelect={() => setOrder({ ...order, addressId: a.id })}
                    />
                  ))}
                </div>
              )}

              <div style={{
                marginTop: 10, fontSize: 11, color: 'rgba(26,22,20,0.55)',
                padding: '8px 12px', background: 'rgba(26,22,20,0.04)',
                borderRadius: 10, display: 'flex', gap: 6, alignItems: 'flex-start',
              }}>
                <Icon.Pin style={{ flexShrink: 0, marginTop: 2 }}/>
                <span>
                  Solo entregamos en el polígono de cobertura de San Jacinto. Las direcciones se validan al confirmar.
                </span>
              </div>
            </div>
          ) : (
            <div style={{
              marginTop: 18, background: '#fff',
              borderRadius: 18, padding: 16,
              border: '1px solid rgba(26,22,20,0.05)',
            }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Recoge en tienda</div>
              <div className="priamo-display" style={{ fontSize: 17 }}>Priamo San Jacinto</div>
              <div style={{ fontSize: 13, color: 'rgba(26,22,20,0.65)', marginTop: 4 }}>
                Jr. Bolognesi 245 · San Jacinto · {PRIAMO.hours}
              </div>
              <div style={{
                marginTop: 12, padding: '10px 12px',
                background: 'rgba(26,22,20,0.04)', borderRadius: 10,
                fontSize: 12, color: 'rgba(26,22,20,0.65)',
              }}>
                Listo para recoger en <strong>20–25 min</strong> después de confirmar pago.
              </div>
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <label className="field-label">
              Teléfono de contacto <span style={{ color: '#F97316' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(26,22,20,0.5)', fontSize: 16,
              }}>+51</span>
              <input
                className="field"
                style={{ paddingLeft: 48 }}
                placeholder="987 654 321"
                value={order.phone}
                onChange={e => setOrder({ ...order, phone: e.target.value })}
                inputMode="numeric"
                maxLength={11}
              />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <label className="field-label">Nota adicional (opcional)</label>
            <textarea
              className="field"
              placeholder="¿Alguna indicación adicional? Ej: sin lechuga en la hamburguesa, extra salsa en el pollo."
              value={order.note || ''}
              onChange={e => setOrder({ ...order, note: e.target.value })}
              maxLength={200}
            />
            <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.45)', marginTop: 4, textAlign: 'right' }}>
              {(order.note || '').length}/200
            </div>
          </div>

          <div className="card" style={{ marginTop: 18, padding: '14px 16px' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Resumen</div>
            <Row label={`Productos (${cart.reduce((s,i)=>s+i.qty,0)})`} value={`S/ ${subtotal.toFixed(2)}`}/>
            <Row label={order.method === 'delivery' ? 'Delivery' : 'Pick-up'} value={`S/ ${fee.toFixed(2)}`}/>
            <div style={{ height: 1, background: 'rgba(26,22,20,0.08)', margin: '8px 0' }}/>
            <Row label="Total a pagar" value={`S/ ${total.toFixed(2)}`} big/>
          </div>
        </div>
        <div style={{ height: 140 }}/>
      </div>

      <div className="sticky-cta" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <button
          className="btn btn-primary btn-block"
          disabled={!canContinue}
          onClick={() => setShowConfirm(true)}>
          {canContinue
            ? <>Revisar y pagar · S/ {total.toFixed(2)}</>
            : (needsAddress ? 'Selecciona una dirección' : 'Ingresa un teléfono válido')}
        </button>
      </div>
      <div className="pad-home"/>

      {showConfirm && (
        <ConfirmAddressModal
          order={order}
          user={user}
          address={selectedAddress}
          total={total}
          cart={cart}
          onClose={() => setShowConfirm(false)}
          onEdit={() => { setShowConfirm(false); onEditAddress(selectedAddress); }}
          onConfirm={() => { setShowConfirm(false); onConfirm(total); }}
        />
      )}
    </div>
  );
}

function ConfirmAddressModal({ order, user, address, cart, total, onClose, onEdit, onConfirm }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '88%' }}>
        <div style={{
          padding: '18px 18px 6px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'rgba(26,22,20,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon.Pin/>
          </div>
          <div className="priamo-display" style={{ flex: 1, fontSize: 19 }}>
            {order.method === 'delivery' ? '¿Confirmas la entrega aquí?' : '¿Listo para tu pick-up?'}
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 999,
            background: 'rgba(26,22,20,0.06)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1614',
          }}>
            <Icon.Close/>
          </button>
        </div>

        <div className="priamo-scroll" style={{ flex: 1 }}>
          <div style={{ padding: '8px 18px 0' }}>
            {order.method === 'delivery' && address ? (
              <>
                <div style={{
                  height: 120, borderRadius: 16, overflow: 'hidden',
                  position: 'relative', marginBottom: 12,
                  background: '#E6E2D6',
                }}>
                  <MapTiles/>
                  <div style={{
                    position: 'absolute',
                    left: address.pinPos.x, top: address.pinPos.y,
                    transform: 'translate(-50%, -100%)',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
                  }}>
                    <svg width="28" height="36" viewBox="0 0 34 44">
                      <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 27 17 27s17-15 17-27C34 7.6 26.4 0 17 0z" fill="#F97316"/>
                      <circle cx="17" cy="16" r="5.5" fill="#fff"/>
                    </svg>
                  </div>
                </div>

                <div style={{
                  background: '#fff', borderRadius: 16, padding: 14,
                  border: '1px solid rgba(26,22,20,0.06)',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 11,
                      background: 'rgba(249,115,22,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, flexShrink: 0,
                    }}>{address.label === 'Casa' ? '🏠' : address.label === 'Trabajo' ? '💼' : '📍'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{address.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{address.line}</div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12, color: 'rgba(26,22,20,0.65)',
                    background: 'rgba(26,22,20,0.04)',
                    padding: '10px 12px', borderRadius: 10, lineHeight: 1.45,
                  }}>
                    <strong style={{ fontWeight: 600 }}>Referencia:</strong> {address.reference}
                  </div>
                </div>

                <button onClick={onEdit} style={{
                  width: '100%', marginTop: 10,
                  padding: '12px 14px', background: 'rgba(26,22,20,0.04)',
                  border: '1px solid rgba(26,22,20,0.06)', borderRadius: 12,
                  cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  fontSize: 13, fontWeight: 500, color: '#1A1614',
                }}>
                  ✏️ Editar esta dirección
                </button>
              </>
            ) : (
              <div style={{
                background: '#fff', borderRadius: 16, padding: 16,
                border: '1px solid rgba(26,22,20,0.06)',
              }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Recoge en</div>
                <div className="priamo-display" style={{ fontSize: 18 }}>Priamo San Jacinto</div>
                <div style={{ fontSize: 13, color: 'rgba(26,22,20,0.65)', marginTop: 4 }}>
                  Jr. Bolognesi 245
                </div>
              </div>
            )}

            <div style={{
              marginTop: 14, background: '#fff',
              borderRadius: 16, padding: 14,
              border: '1px solid rgba(26,22,20,0.06)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11,
                background: 'rgba(26,22,20,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1A1614',
              }}>
                <Icon.Phone/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)' }}>Contacto</div>
                <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {user.name} · +51 {order.phone}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 14, background: '#fff',
              borderRadius: 16, padding: 14,
              border: '1px solid rgba(26,22,20,0.06)',
            }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Tu pedido</div>
              {cart.map(item => (
                <div key={item.key} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '4px 0', fontSize: 13, color: 'rgba(26,22,20,0.85)',
                }}>
                  <span>{item.qty}× {item.name}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {item.total.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ height: 1, background: 'rgba(26,22,20,0.08)', margin: '8px 0' }}/>
              <Row label="Total a pagar" value={`S/ ${total.toFixed(2)}`} big/>
            </div>
          </div>
          <div style={{ height: 20 }}/>
        </div>

        <div style={{
          padding: '14px 16px 24px',
          background: '#FAF6F1',
          borderTop: '1px solid rgba(26,22,20,0.06)',
          display: 'flex', gap: 10,
        }}>
          <button onClick={onClose} style={{
            background: 'rgba(26,22,20,0.06)', color: '#1A1614',
            border: 'none', padding: '16px 20px', borderRadius: 16,
            fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            Volver
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={onConfirm}>
            Sí, ir al pago
          </button>
        </div>
      </div>
    </div>
  );
}

// MapView for draggable pin
export function MapView({ pinPos, onMove }) {
  const ref = useRef(null);
  const dragging = useRef(false);

  const handleStart = () => { dragging.current = true; };
  const handleMove = (e) => {
    if (!dragging.current || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    const x = Math.max(20, Math.min(rect.width - 20, t.clientX - rect.left));
    const y = Math.max(20, Math.min(rect.height - 20, t.clientY - rect.top));
    onMove({ x, y });
  };
  const handleEnd = () => { dragging.current = false; };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  });

  return (
    <div
      ref={ref}
      style={{
        position: 'relative', height: 180, borderRadius: 18,
        overflow: 'hidden', background: '#E6E2D6',
        cursor: 'grab', userSelect: 'none',
        border: '1px solid rgba(26,22,20,0.06)',
      }}>
      <MapTiles/>
      <div
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        style={{
          position: 'absolute',
          left: pinPos.x, top: pinPos.y,
          transform: 'translate(-50%, -100%)',
          cursor: 'grab', zIndex: 3,
          filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.25))',
        }}>
        <svg width="34" height="44" viewBox="0 0 34 44">
          <path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 27 17 27s17-15 17-27C34 7.6 26.4 0 17 0z" fill="#F97316"/>
          <circle cx="17" cy="16" r="6.5" fill="#fff"/>
        </svg>
      </div>
      <div style={{
        position: 'absolute', top: 10, left: 10,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        background: 'rgba(255,255,255,0.92)', color: '#1A1614',
        padding: '4px 8px', borderRadius: 6,
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        Arrastra para ajustar
      </div>
    </div>
  );
}

export function MapTiles() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#EFEBE0"/>
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D8D2C2" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <path d="M 0 60 L 400 90" stroke="#fff" strokeWidth="14"/>
      <path d="M 0 60 L 400 90" stroke="#E6E2D6" strokeWidth="1" strokeDasharray="6 8"/>
      <path d="M 120 0 L 160 220" stroke="#fff" strokeWidth="10"/>
      <path d="M 280 0 L 240 220" stroke="#fff" strokeWidth="8"/>
      <path d="M 0 150 L 400 180" stroke="#fff" strokeWidth="6"/>
      <rect x="20" y="95" width="80" height="40" fill="rgba(255,255,255,0.4)" rx="3"/>
      <rect x="170" y="100" width="60" height="55" fill="rgba(255,255,255,0.4)" rx="3"/>
      <rect x="260" y="100" width="50" height="50" fill="rgba(255,255,255,0.4)" rx="3"/>
      <rect x="20" y="20" width="80" height="40" fill="#CFD8A7" rx="4"/>
      <text x="60" y="46" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#7C8F4A" textAnchor="middle">PARQUE</text>
    </svg>
  );
}

// Payment methods and screen
const PAYMENT_METHODS = [
  {
    id: 'yape-receive',
    label: 'Yape al recibir',
    sub: 'Yapea al motorizado cuando te entregue.',
    icon: 'Y',
    iconBg: '#6E27C5',
    badge: 'Más usado',
  },
  {
    id: 'cash-receive',
    label: 'Efectivo al recibir',
    sub: 'Paga con billete cuando te entregue.',
    icon: '$',
    iconBg: '#1A8050',
    needsChange: true,
  },
  {
    id: 'prepay-yape',
    label: 'Prepagar por Yape',
    sub: 'Transfiere ahora. El restaurante te llama para confirmar.',
    icon: 'Y',
    iconBg: '#F97316',
  },
];

export function PaymentScreen({ total, order, onBack, onConfirm, onPrepayUpload }) {
  if (order.method === 'pickup') {
    return <PickupPaymentScreen total={total} order={order} onBack={onBack} onConfirm={onConfirm}/>;
  }
  return <DeliveryPaymentScreen total={total} order={order} onBack={onBack} onConfirm={onConfirm} onPrepayUpload={onPrepayUpload}/>;
}

function DeliveryPaymentScreen({ total, order, onBack, onConfirm, onPrepayUpload }) {
  const [method, setMethod] = useState('yape-receive');
  const [change, setChange] = useState('');
  const sel = PAYMENT_METHODS.find(m => m.id === method);
  const validChange = method !== 'cash-receive' || change === '' || Number(change) >= total;

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title="Método de pago" onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '6px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fff', borderRadius: 16, padding: '14px 16px',
            border: '1px solid rgba(26,22,20,0.05)', marginBottom: 14,
          }}>
            <div>
              <div className="eyebrow">Total a pagar</div>
              <div className="priamo-display" style={{
                fontSize: 26, marginTop: 2,
                fontVariantNumeric: 'tabular-nums',
              }}>S/ {total.toFixed(2)}</div>
            </div>
            <div style={{
              fontSize: 11, textAlign: 'right',
              color: 'rgba(26,22,20,0.55)', lineHeight: 1.4,
            }}>
              {order.method === 'delivery' ? 'Delivery' : 'Pick-up'}<br/>
              en {PRIAMO.eta}
            </div>
          </div>

          <div className="eyebrow" style={{ marginBottom: 10, paddingLeft: 4 }}>
            Elige cómo pagar
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PAYMENT_METHODS.map(m => (
              <PaymentMethodCard
                key={m.id}
                method={m}
                selected={method === m.id}
                onSelect={() => {
                  if (m.id === 'prepay-yape') {
                    onPrepayUpload && onPrepayUpload();
                    return;
                  }
                  setMethod(m.id);
                }}>
                {method === m.id && m.id === 'cash-receive' && (
                  <div style={{ marginTop: 12 }}>
                    <label className="field-label">Pago con (opcional)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                        color: 'rgba(26,22,20,0.5)', fontSize: 15, fontVariantNumeric: 'tabular-nums',
                      }}>S/</span>
                      <input
                        className="field"
                        style={{ paddingLeft: 42 }}
                        placeholder="Ej. 100"
                        value={change}
                        onChange={e => setChange(e.target.value.replace(/[^0-9]/g, ''))}
                        inputMode="numeric"
                        maxLength={4}
                      />
                    </div>
                    <div style={{
                      fontSize: 11, color: 'rgba(26,22,20,0.55)',
                      marginTop: 6, lineHeight: 1.4,
                    }}>
                      Así el motorizado lleva tu vuelto preparado.
                      {change && Number(change) >= total && (
                        <span style={{ color: '#1A8050', fontWeight: 600 }}>
                          {' '}Vuelto: S/ {(Number(change) - total).toFixed(2)}.
                        </span>
                      )}
                      {change && Number(change) < total && (
                        <span style={{ color: '#DC2626', fontWeight: 600 }}>
                          {' '}Debe ser mayor a S/ {total.toFixed(2)}.
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {method === m.id && m.id === 'yape-receive' && (
                  <div style={{
                    marginTop: 12, padding: '10px 12px',
                    background: 'rgba(110,39,197,0.06)',
                    borderRadius: 10, fontSize: 12, lineHeight: 1.45,
                    color: 'rgba(26,22,20,0.7)',
                  }}>
                    El motorizado lleva su QR y número Yape. Le pagas al recibir tu pedido.
                  </div>
                )}
              </PaymentMethodCard>
            ))}
          </div>

          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: 'rgba(26,22,20,0.04)', borderRadius: 12,
            fontSize: 12, color: 'rgba(26,22,20,0.65)',
            display: 'flex', gap: 10, alignItems: 'flex-start', lineHeight: 1.45,
          }}>
            <Icon.Phone style={{ flexShrink: 0, marginTop: 2 }}/>
            <span>
              El restaurante <strong>te llamará en breve</strong> al +51 {order.phone} para confirmar tu pedido.
            </span>
          </div>
        </div>
        <div style={{ height: 140 }}/>
      </div>

      <div className="sticky-cta" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <button
          className="btn btn-primary btn-block"
          disabled={!validChange}
          onClick={() => {
            if (method === 'prepay-yape') {
              onPrepayUpload && onPrepayUpload();
              return;
            }
            const payment = { methodId: method, methodLabel: sel.label, change: change || null };
            onConfirm(payment);
          }}>
          {validChange
            ? (method === 'prepay-yape'
                ? <>Continuar al pago · S/ {total.toFixed(2)}</>
                : <>Enviar pedido · S/ {total.toFixed(2)}</>)
            : 'Monto en efectivo insuficiente'}
        </button>
      </div>
      <div className="pad-home"/>
    </div>
  );
}

function PaymentMethodCard({ method: m, selected, onSelect, children }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: '#fff',
        border: selected ? '2px solid #F97316' : '1px solid rgba(26,22,20,0.06)',
        borderRadius: 18,
        padding: selected ? 13 : 14,
        cursor: 'pointer',
        transition: 'border-color 140ms ease, padding 140ms ease',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: m.iconBg, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 22, fontWeight: 700, flexShrink: 0,
        }}>{m.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{m.label}</div>
            {m.badge && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#F97316',
                background: 'rgba(249,115,22,0.1)',
                padding: '2px 7px', borderRadius: 5,
              }}>{m.badge}</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.6)', lineHeight: 1.4 }}>{m.sub}</div>
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          border: `2px solid ${selected ? '#F97316' : 'rgba(26,22,20,0.2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'border-color 140ms ease',
        }}>
          {selected && <div style={{ width: 10, height: 10, borderRadius: 999, background: '#F97316' }}/>}
        </div>
      </div>
      {children}
    </div>
  );
}

function PrepayDetails({ total }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{
        background: 'linear-gradient(135deg, #6E27C5 0%, #4A1199 100%)',
        borderRadius: 16, padding: '14px 16px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 110, height: 110, borderRadius: 999,
          background: 'rgba(255,255,255,0.06)',
        }}/>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75,
        }}>Yapea a</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
          <div>
            <div className="priamo-display" style={{ fontSize: 17, lineHeight: 1.1 }}>
              Priamo
            </div>
            <div style={{
              fontSize: 19, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.04em', marginTop: 4,
            }}>{PRIAMO.yape}</div>
          </div>
          <button onClick={e => e.stopPropagation()} style={{
            background: 'rgba(255,255,255,0.16)', color: '#fff',
            border: 'none', padding: '6px 12px', borderRadius: 999,
            fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
            cursor: 'pointer',
          }}>Copiar</button>
        </div>
      </div>

      <div style={{
        marginTop: 8, background: '#FAF6F1',
        borderRadius: 14, padding: '12px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid rgba(249,115,22,0.2)',
      }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(26,22,20,0.55)' }}>
            Monto exacto
          </div>
          <div className="priamo-display" style={{
            fontSize: 22, color: '#F97316', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
          }}>S/ {total.toFixed(2)}</div>
        </div>
        <button onClick={e => e.stopPropagation()} style={{
          background: 'rgba(249,115,22,0.1)', color: '#F97316',
          border: 'none', padding: '6px 12px', borderRadius: 999,
          fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
          cursor: 'pointer',
        }}>Copiar</button>
      </div>

      <div style={{
        marginTop: 10, padding: '10px 12px',
        background: 'rgba(249,115,22,0.06)', borderRadius: 10,
        fontSize: 12, lineHeight: 1.45, color: '#7C2D12',
      }}>
        <strong>Sin subir captura.</strong> El restaurante valida tu pago por su lado y te llama para confirmar.
      </div>
    </div>
  );
}

// Pickup prepayment screen with timer
export function PickupPaymentScreen({ total, order, onBack, onConfirm, onTimeout, mode }) {
  const isPickup = mode !== 'delivery-prepay';
  const [uploaded, setUploaded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);

  useEffect(() => {
    if (uploaded) return;
    const t = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          onTimeout && onTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [uploaded]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const urgent = secondsLeft <= 60;

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title={isPickup ? 'Pagar pick-up' : 'Pagar por Yape'} onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '6px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: urgent ? 'rgba(220,38,38,0.08)' : 'rgba(249,115,22,0.07)',
            borderRadius: 14, padding: '10px 14px', marginBottom: 12,
            border: `1px solid ${urgent ? 'rgba(220,38,38,0.22)' : 'rgba(249,115,22,0.18)'}`,
          }}>
            <Icon.Clock style={{ color: urgent ? '#DC2626' : '#F97316', flexShrink: 0 }}/>
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4, color: '#1A1614' }}>
              Sube tu comprobante en los próximos
              {' '}<strong style={{
                fontVariantNumeric: 'tabular-nums',
                color: urgent ? '#DC2626' : '#C2410C',
              }}>{mm}:{ss}</strong>
              {' '}o el pedido se cancela.
            </div>
          </div>

          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            background: 'rgba(249,115,22,0.06)',
            border: '1px solid rgba(249,115,22,0.18)',
            borderRadius: 14, padding: '12px 14px', marginBottom: 14,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: 999,
              background: '#F97316', color: '#fff', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>
              {isPickup
                ? <Icon.Store style={{ width: 14, height: 14 }}/>
                : <Icon.Truck style={{ width: 14, height: 14 }}/>}
            </div>
            <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5, color: '#7C2D12' }}>
              {isPickup ? (
                <>Para recojos en local el pago se hace <strong>antes</strong>. Así el restaurante prepara tu pedido apenas confirme tu Yape.</>
              ) : (
                <>Elegiste <strong>prepagar por Yape</strong>. Sube tu comprobante para que el restaurante confirme y empiece a preparar.</>
              )}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #6E27C5 0%, #4A1199 100%)',
            borderRadius: 22, padding: '22px 20px',
            color: '#fff', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', right: -40, top: -40,
              width: 160, height: 160, borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
            }}/>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75,
            }}>Yapea a</div>
            <div className="priamo-display" style={{ fontSize: 26, marginTop: 6 }}>
              Priamo Restaurant
            </div>
            <div style={{
              marginTop: 16,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.7 }}>Número Yape</div>
                <div style={{
                  fontSize: 22, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.04em', marginTop: 2,
                }}>{PRIAMO.yape}</div>
              </div>
              <button style={{
                background: 'rgba(255,255,255,0.16)', color: '#fff',
                border: 'none', padding: '8px 14px', borderRadius: 999,
                fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                cursor: 'pointer',
              }}>Copiar</button>
            </div>
          </div>

          <div style={{
            marginTop: 12, background: '#fff',
            borderRadius: 18, padding: '16px 20px',
            border: '2px solid #F97316',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div className="eyebrow">Monto exacto</div>
              <div className="priamo-display" style={{
                fontSize: 30, marginTop: 2, color: '#F97316',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
              }}>S/ {total.toFixed(2)}</div>
            </div>
            <button style={{
              background: 'rgba(249,115,22,0.08)', color: '#F97316',
              border: 'none', padding: '8px 14px', borderRadius: 999,
              fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
              cursor: 'pointer',
            }}>Copiar</button>
          </div>

          <div style={{ marginTop: 22 }}>
            <div className="eyebrow" style={{ marginBottom: 10, paddingLeft: 4 }}>Cómo pagar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <PickupStep n={1}>Abre la app de Yape en tu celular.</PickupStep>
              <PickupStep n={2}>Yapea el monto exacto al número <strong>{PRIAMO.yape}</strong>.</PickupStep>
              <PickupStep n={3}>Toma captura del comprobante.</PickupStep>
              <PickupStep n={4}>Súbela aquí para enviar tu pedido.</PickupStep>
            </div>
          </div>

          <div style={{ marginTop: 22 }}>
            <label className="field-label">
              Comprobante <span style={{ color: '#F97316' }}>*</span>
            </label>
            <button
              onClick={() => setUploaded(!uploaded)}
              style={{
                width: '100%', padding: uploaded ? 14 : '32px 16px',
                background: uploaded ? '#fff' : 'rgba(249,115,22,0.04)',
                border: `2px dashed ${uploaded ? '#1A8050' : 'rgba(249,115,22,0.35)'}`,
                borderRadius: 18,
                display: 'flex', alignItems: 'center', gap: 14,
                cursor: 'pointer', fontFamily: 'inherit', color: '#1A1614',
                justifyContent: uploaded ? 'flex-start' : 'center',
                transition: 'all 200ms ease',
              }}>
              {uploaded ? (
                <>
                  <div className="ph-image" style={{
                    width: 52, height: 52, borderRadius: 10,
                    background: 'oklch(0.94 0.04 280)',
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#6E27C5',
                    }}>YAPE</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>yape-comprobante.jpg</div>
                    <div style={{
                      fontSize: 12, color: '#1A8050', marginTop: 2,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      <Icon.Check style={{ width: 12, height: 12 }}/> Listo para enviar
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: 'rgba(26,22,20,0.5)' }}>Cambiar</span>
                </>
              ) : (
                <>
                  <Icon.Upload style={{ color: '#F97316' }}/>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#F97316' }}>
                      Subir captura de Yape
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.55)', marginTop: 4 }}>
                      JPG o PNG · máx. 5 MB
                    </div>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
        <div style={{ height: 140 }}/>
      </div>

      <div className="sticky-cta" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <button
          className="btn btn-primary btn-block"
          disabled={!uploaded}
          onClick={() => onConfirm({
            methodId: isPickup ? 'prepay-pickup' : 'prepay-yape',
            methodLabel: isPickup ? 'Yape prepago (pick-up)' : 'Prepagar por Yape',
            change: null,
            comprobanteUploaded: true,
          })}>
          {uploaded ? `Enviar pedido · S/ ${total.toFixed(2)}` : 'Sube el comprobante para continuar'}
        </button>
      </div>
      <div className="pad-home"/>
    </div>
  );
}

function PickupStep({ n, children }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: '#fff', padding: '12px 14px', borderRadius: 14,
      border: '1px solid rgba(26,22,20,0.05)',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 999,
        background: '#1A1614', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, flexShrink: 0,
      }}>{n}</div>
      <div style={{ fontSize: 14, lineHeight: 1.45, paddingTop: 2 }}>{children}</div>
    </div>
  );
}

export function SupportLink({ orderId }) {
  const phone = '51987654321';
  const text = encodeURIComponent(
    `Hola Tindivo 👋, tengo un problema con mi pedido #TND-${orderId || '—'}. `
  );
  const url = `https://wa.me/${phone}?text=${text}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12.5, fontWeight: 500,
        color: 'rgba(26,22,20,0.6)',
        textDecoration: 'none',
        padding: '6px 10px', borderRadius: 8,
      }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
        <path d="M17.5 14.4l-2-1c-.3-.1-.5 0-.6.2l-.5.6c-.2.2-.4.3-.7.2-.9-.3-1.7-.8-2.4-1.5-.7-.7-1.2-1.5-1.5-2.4-.1-.3 0-.5.2-.7l.6-.5c.2-.1.3-.3.2-.6l-1-2c-.1-.3-.4-.4-.7-.3-.6.2-1.1.6-1.5 1.1-.4.5-.6 1.1-.5 1.7.1 1.5 1 3 2.4 4.4 1.4 1.4 2.9 2.3 4.4 2.4.6 0 1.2-.1 1.7-.5.5-.4.9-.9 1.1-1.5.1-.3 0-.6-.3-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
      </svg>
      <span>¿Algún problema? <u>Escríbenos</u></span>
    </a>
  );
}

export function OrderCancelledScreen({ onBack, reason = 'timeout' }) {
  const isUser = reason === 'user';
  return (
    <div className="priamo-surface" style={{
      background: 'linear-gradient(180deg, #FAF6F1 0%, #FFF0F0 100%)',
    }}>
      <div className="pad-status"/>
      <div className="priamo-scroll" style={{
        display: 'flex', flexDirection: 'column',
        padding: '20px 24px 0',
      }}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', paddingTop: 20,
        }}>
          <div style={{
            width: 96, height: 96, borderRadius: 999,
            background: '#fff', color: '#DC2626',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '3px solid #DC2626',
            marginBottom: 6,
          }}>
            {isUser ? (
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : <Icon.Clock style={{ width: 44, height: 44 }}/>}
          </div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#DC2626', marginTop: 18,
          }}>
            Pedido cancelado
          </div>

          <div className="priamo-display" style={{
            fontSize: 26, lineHeight: 1.1, textAlign: 'center', marginTop: 6,
          }}>
            {isUser ? <>Cancelaste<br/>tu pedido</> : <>Se acabó el tiempo<br/>para pagar</>}
          </div>

          <div style={{
            fontSize: 14, lineHeight: 1.55, color: 'rgba(26,22,20,0.72)',
            textAlign: 'center', marginTop: 14, maxWidth: 320,
          }}>
            {isUser ? (
              <>Tu pedido fue cancelado sin costo porque aún no estaba confirmado por el restaurante. Puedes volver a pedir cuando quieras.</>
            ) : (
              <>Tu pedido fue cancelado porque no recibimos tu comprobante a tiempo. Puedes volver a pedir cuando quieras.</>
            )}
          </div>
        </div>

        <div style={{ paddingBottom: 18, paddingTop: 20 }}>
          <button className="btn btn-primary btn-block" onClick={onBack}>
            Volver al menú
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <SupportLink/>
          </div>
        </div>
      </div>
      <div className="pad-home"/>
    </div>
  );
}

export function OrderConfirmedScreen({ order, total, onGoTracking, onGoHome }) {
  const isPickup = order.method === 'pickup';
  return (
    <div className="priamo-surface" style={{
      background: 'linear-gradient(180deg, #FAF6F1 0%, #FFF7ED 100%)',
    }}>
      <div className="pad-status"/>
      <div className="priamo-scroll" style={{
        display: 'flex', flexDirection: 'column',
        padding: '20px 24px 0',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: 12 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 999,
            background: '#F97316', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 12px 32px -6px rgba(249,115,22,0.55)',
            marginBottom: 6, position: 'relative',
            animation: 'okPop 480ms cubic-bezier(.34,1.56,.64,1)',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7"
                stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="30" strokeDashoffset="0"
                style={{ animation: 'drawCheck 480ms ease 240ms backwards' }}/>
            </svg>
            <div style={{
              position: 'absolute', inset: -12, borderRadius: 999,
              border: '2px solid rgba(249,115,22,0.25)',
              animation: 'ring 1.6s ease-out infinite',
            }}/>
          </div>

          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#F97316', marginTop: 18,
          }}>
            #TND-{order.id || '48391'}
          </div>

          <div className="priamo-display" style={{
            fontSize: isPickup ? 26 : 30, lineHeight: 1.1, textAlign: 'center', marginTop: 6,
          }}>
            {isPickup ? <>Pedido<br/>enviado</> : <>Tu pedido<br/>fue enviado</>}
          </div>

          <div style={{
            fontSize: 14, lineHeight: 1.55, color: 'rgba(26,22,20,0.72)',
            textAlign: 'center', marginTop: 12, maxWidth: 310,
          }}>
            {isPickup ? (
              <>
                El restaurante <strong>revisará tu pago</strong> y te llamará<br/>
                para confirmar cuándo estará listo.
              </>
            ) : (
              <>
                El restaurante te <strong>llamará en breve</strong> para confirmarlo.
              </>
            )}
          </div>

          <div style={{
            marginTop: 22, width: '100%',
            background: '#fff', borderRadius: 18,
            padding: '14px 16px', border: '1px solid rgba(26,22,20,0.06)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'rgba(249,115,22,0.1)', color: '#F97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon.Phone/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)' }}>Llamada a</div>
              <div style={{
                fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                marginTop: 1,
              }}>+51 {order.phone}</div>
            </div>
          </div>

          <div style={{
            marginTop: 10, width: '100%',
            background: '#fff', borderRadius: 18,
            padding: '14px 16px', border: '1px solid rgba(26,22,20,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)' }}>
                {isPickup ? 'Pagado por Yape' : 'Pago'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 1 }}>
                {order.payment?.methodLabel || 'Yape al recibir'}
              </div>
            </div>
            <div style={{
              fontSize: 17, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#F97316',
            }}>
              S/ {total.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ paddingBottom: 18, paddingTop: 22 }}>
          <button className="btn btn-primary btn-block" onClick={onGoTracking}>
            Ver seguimiento del pedido
          </button>
          <button
            onClick={onGoHome}
            style={{
              width: '100%', marginTop: 8,
              background: 'transparent', border: 'none',
              color: 'rgba(26,22,20,0.6)', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 500, padding: '12px',
              cursor: 'pointer',
            }}>
            Volver al inicio
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <SupportLink orderId={order.id}/>
          </div>
        </div>
      </div>
      <div className="pad-home"/>
      <style>{`
        @keyframes okPop {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const TRACKING_STATES = [
  { id: 'sent', label: 'Pedido enviado', sub: 'El restaurante te llamará en breve' },
  { id: 'confirmed', label: 'Confirmado', sub: 'Tu pedido fue confirmado por teléfono' },
  { id: 'preparing', label: 'Preparando', sub: 'Tu pedido está en cocina' },
  { id: 'ontheway', label: 'En camino', sub: 'Repartidor en ruta' },
  { id: 'delivered', label: 'Entregado', sub: '¡Buen provecho!' },
];

export function TrackingScreen({ order, total, cart, currentState, onSetState, onBack, user, orderId }) {
  const stateIdx = TRACKING_STATES.findIndex(s => s.id === currentState);
  const current = TRACKING_STATES[stateIdx];
  const progress = ((stateIdx + 1) / TRACKING_STATES.length) * 100;
  const idRef = useRef(orderId || String(Math.floor(10000 + Math.random() * 89999)));
  const displayId = idRef.current;
  const cancellable = currentState === 'sent';
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title="Tu pedido" onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '6px 16px 0' }}>
          <div style={{
            background: '#1A1614', color: '#fff',
            borderRadius: 22, padding: '22px 20px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 140, height: 140,
              background: 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, transparent 70%)',
              borderRadius: 999, transform: 'translate(40px,-40px)',
            }}/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#FED7AA', background: 'rgba(249,115,22,0.2)',
                padding: '5px 10px', borderRadius: 999,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: 999, background: '#FDBA74',
                  animation: 'pulse 1.6s ease-in-out infinite',
                }}/>
                Pedido #TND-{displayId}
              </div>
              <div className="priamo-display" style={{ fontSize: 30, marginTop: 12, lineHeight: 1.1 }}>
                {current.label}
              </div>
              <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                {current.sub}
              </div>
              <div style={{
                marginTop: 18, height: 8, borderRadius: 999,
                background: 'rgba(255,255,255,0.12)', overflow: 'hidden',
              }}>
                <div style={{
                  width: `${progress}%`, height: '100%',
                  background: 'linear-gradient(90deg, #F97316, #FB923C)',
                  borderRadius: 999, transition: 'width 600ms cubic-bezier(.4,0,.2,1)',
                }}/>
              </div>
              <div style={{
                marginTop: 8, fontSize: 12,
                display: 'flex', justifyContent: 'space-between', opacity: 0.6,
              }}>
                <span>Paso {stateIdx + 1} de {TRACKING_STATES.length}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>ETA {PRIAMO.eta}</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 14, background: '#fff', borderRadius: 22,
            padding: '20px 18px', border: '1px solid rgba(26,22,20,0.05)',
          }}>
            {TRACKING_STATES.map((s, i) => {
              const done = i < stateIdx;
              const active = i === stateIdx;
              return (
                <div key={s.id} style={{
                  display: 'flex', gap: 14,
                  paddingBottom: i === TRACKING_STATES.length - 1 ? 0 : 18,
                  position: 'relative',
                }}>
                  {i < TRACKING_STATES.length - 1 && (
                    <div style={{
                      position: 'absolute', left: 13, top: 26, bottom: -8,
                      width: 2, background: done ? '#F97316' : 'rgba(26,22,20,0.1)',
                    }}/>
                  )}
                  <div style={{
                    width: 28, height: 28, borderRadius: 999,
                    background: done || active ? '#F97316' : 'rgba(26,22,20,0.08)',
                    color: '#fff', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: active ? '0 0 0 5px rgba(249,115,22,0.18)' : 'none',
                    transition: 'all 240ms ease',
                    zIndex: 1,
                  }}>
                    {done ? <Icon.Check/> : (
                      <div style={{
                        width: 8, height: 8, borderRadius: 999,
                        background: active ? '#fff' : 'rgba(26,22,20,0.4)',
                        animation: active ? 'pulse 1.6s ease-in-out infinite' : 'none',
                      }}/>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{
                      fontSize: 15, fontWeight: active ? 600 : 500,
                      color: done || active ? '#1A1614' : 'rgba(26,22,20,0.45)',
                    }}>{s.label}</div>
                    <div style={{
                      fontSize: 12, marginTop: 2,
                      color: active ? '#F97316' : 'rgba(26,22,20,0.5)',
                    }}>{active ? s.sub + ' · ahora' : (done ? 'Completado' : s.sub)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 14, background: '#fff', borderRadius: 22,
            padding: '16px 18px', border: '1px solid rgba(26,22,20,0.05)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="eyebrow">Detalle</div>
              <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.5)' }}>
                {order.method === 'delivery' ? 'Delivery' : 'Pick-up'} · {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
              </div>
            </div>
            {cart.slice(0, 3).map(item => (
              <div key={item.key} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 0', fontSize: 14,
                color: 'rgba(26,22,20,0.75)',
              }}>
                <span>{item.qty}× {item.name}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {item.total.toFixed(2)}</span>
              </div>
            ))}
            {cart.length > 3 && (
              <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.5)', padding: '4px 0' }}>
                + {cart.length - 3} más
              </div>
            )}
            <div style={{ height: 1, background: 'rgba(26,22,20,0.08)', margin: '10px 0' }}/>
            <Row label="Total pagado" value={`S/ ${total.toFixed(2)}`} big/>
          </div>

          <div style={{
            marginTop: 14, background: 'rgba(26,22,20,0.04)',
            borderRadius: 14, padding: 12,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: 'rgba(26,22,20,0.5)', letterSpacing: '0.05em',
            textTransform: 'uppercase', marginBottom: 4,
          }}>
            Demo · avanzar estado
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {TRACKING_STATES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onSetState(s.id)}
                className={'chip' + (i === stateIdx ? ' active' : '')}
                style={{ fontSize: 12, padding: '6px 10px' }}>
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 22, paddingTop: 16,
            borderTop: '1px solid rgba(26,22,20,0.06)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SupportLink orderId={displayId}/>
            </div>
          </div>
        </div>
        <div style={{ height: 60 }}/>
      </div>
      <div className="pad-home"/>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }`}</style>

      {confirmCancel && (
        <div className="modal-backdrop" onClick={() => setConfirmCancel(false)} style={{ alignItems: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#FAF6F1', borderRadius: 22, margin: '0 24px',
            padding: '22px 22px 18px', width: 'calc(100% - 48px)',
            animation: 'slideUp 220ms cubic-bezier(.22,1,.36,1)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 999,
              background: 'rgba(220,38,38,0.1)', color: '#DC2626',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="priamo-display" style={{ fontSize: 20, lineHeight: 1.2 }}>
              ¿Cancelar tu pedido?
            </div>
            <div style={{
              fontSize: 13.5, color: 'rgba(26,22,20,0.7)',
              marginTop: 6, lineHeight: 1.5,
            }}>
              Aún no fue confirmado por el restaurante, así que puedes cancelarlo sin costo.
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
              <button onClick={() => setConfirmCancel(false)} style={{
                flex: 1, background: 'rgba(26,22,20,0.06)', color: '#1A1614',
                border: 'none', padding: '14px 16px', borderRadius: 14,
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                Mantener pedido
              </button>
              <button onClick={() => { setConfirmCancel(false); }} style={{
                flex: 1, background: '#DC2626', color: '#fff',
                border: 'none', padding: '14px 16px', borderRadius: 14,
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AddressCard({ address: a, compact, selected, onSelect }) {
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

function Row({ label, value, big }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '4px 0', fontVariantNumeric: 'tabular-nums',
      fontSize: big ? 17 : 14,
      fontWeight: big ? 700 : 500,
      color: big ? '#1A1614' : 'rgba(26,22,20,0.7)',
    }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
