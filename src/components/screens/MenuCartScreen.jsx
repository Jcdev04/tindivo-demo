import { useState, useRef, Fragment } from 'react';
import { Icon, ProductImage, ScreenHeader } from '@/components/ui';
import { PRIAMO, MENU } from '@/data';

export function MenuScreen({ cart, onOpenProduct, onOpenCart, onBack, user, onOpenAccount }) {
  const [activeSection, setActiveSection] = useState(MENU[0].id);
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.total, 0);

  const jumpTo = (sid) => {
    const el = sectionRefs.current[sid];
    const scroller = scrollRef.current;
    if (el && scroller) {
      scroller.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' });
    }
    setActiveSection(sid);
  };

  return (
    <div className="priamo-surface">
      <div className="priamo-scroll" ref={scrollRef}>
        <div style={{
          position: 'relative',
          height: 300,
          color: '#fff',
          overflow: 'hidden',
          backgroundColor: '#1A1614',
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.75) 100%)',
            pointerEvents: 'none',
          }}/>

          <div style={{
            position: 'relative', zIndex: 2,
            padding: '54px 16px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 8,
          }}>
            {onBack ? (
              <button onClick={onBack} style={{
                width: 38, height: 38, borderRadius: 999,
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon.Back/>
              </button>
            ) : <div style={{ width: 38 }}/>}

            {user?.signedIn ? (
              <button
                onClick={onOpenAccount}
                style={{
                  width: 38, height: 38, borderRadius: 999,
                  background: 'rgba(0,0,0,0.45)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
                }}>
                {user.name[0]?.toUpperCase() || 'U'}
              </button>
            ) : (
              <button
                onClick={onOpenAccount}
                style={{
                  height: 38, padding: '0 16px', borderRadius: 999,
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#fff', cursor: 'pointer',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                  letterSpacing: '-0.01em',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                Entrar
              </button>
            )}
          </div>

          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            zIndex: 2, padding: '0 20px 22px',
          }}>
            <div className="priamo-display" style={{
              fontSize: 38, lineHeight: 1.05,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}>
              Priamo
            </div>
            <div style={{
              marginTop: 6, fontSize: 13, opacity: 0.92,
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            }}>
              {PRIAMO.tagline}
            </div>
            <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 13 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>
                <Icon.Clock/> ~23 min
              </span>
              <span style={{ width: 1, background: 'rgba(255,255,255,0.3)' }}/>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>
                <Icon.Truck/> S/ {PRIAMO.fee.toFixed(2)} delivery
              </span>
            </div>
          </div>
        </div>

        <div className="section-tabs">
          {MENU.map(sec => (
            <button
              key={sec.id}
              className={'chip' + (activeSection === sec.id ? ' active' : '')}
              onClick={() => jumpTo(sec.id)}>
              {sec.name}
            </button>
          ))}
        </div>

        <div style={{ padding: '8px 16px 140px' }}>
          {MENU.map(sec => (
            <div
              key={sec.id}
              ref={el => sectionRefs.current[sec.id] = el}
              style={{ paddingTop: 18, scrollMarginTop: 60 }}>
              <div style={{ marginBottom: 10 }}>
                <div className="priamo-display" style={{ fontSize: 22 }}>{sec.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>
                  {sec.blurb}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sec.items.map(item => (
                  <ProductRow
                    key={item.id}
                    item={item}
                    onClick={() => onOpenProduct(item, sec.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartCount > 0 && (
        <button
          onClick={onOpenCart}
          style={{
            position: 'absolute', left: 16, right: 16, bottom: 28,
            background: '#F97316', color: '#fff', border: 'none',
            borderRadius: 18, padding: '14px 18px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
            cursor: 'pointer', zIndex: 30,
            boxShadow: '0 12px 28px -10px rgba(249,115,22,0.6), 0 2px 8px rgba(0,0,0,0.1)',
            animation: 'slideUp 220ms cubic-bezier(.22,1,.36,1)',
          }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 999,
              background: 'rgba(255,255,255,0.22)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700,
            }}>{cartCount}</span>
            Ver mi pedido
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>S/ {cartTotal.toFixed(2)}</span>
        </button>
      )}
    </div>
  );
}

function ProductRow({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', gap: 14, alignItems: 'stretch',
        background: '#fff', border: '1px solid rgba(26,22,20,0.05)',
        borderRadius: 20, padding: 12, cursor: 'pointer',
        textAlign: 'left', fontFamily: 'inherit', color: 'inherit',
        width: '100%', transition: 'transform 80ms ease',
      }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          {item.tag && (
            <span style={{
              display: 'inline-block', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#F97316', background: 'rgba(249,115,22,0.08)',
              padding: '3px 8px', borderRadius: 6, marginBottom: 6,
            }}>{item.tag}</span>
          )}
          <div className="priamo-display" style={{ fontSize: 16, marginBottom: 4 }}>
            {item.name}
          </div>
          <div style={{
            fontSize: 12, color: 'rgba(26,22,20,0.55)', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{item.desc}</div>
        </div>
        <div style={{
          fontSize: 15, fontWeight: 600, marginTop: 8,
          fontVariantNumeric: 'tabular-nums',
        }}>S/ {item.price.toFixed(2)}</div>
      </div>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <ProductImage label={item.name} hue={item.hue} compact={item.compact} width={92} height={92}/>
        <div style={{
          position: 'absolute', bottom: -6, right: -6,
          width: 32, height: 32, borderRadius: 999,
          background: '#F97316', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px -2px rgba(249,115,22,0.55)',
        }}>
          <Icon.Plus/>
        </div>
      </div>
    </button>
  );
}

export function CartScreen({ cart, onBack, onUpdateQty, onRemove, onCheckout }) {
  const subtotal = cart.reduce((s, i) => s + i.total, 0);
  const fee = cart.length ? PRIAMO.fee : 0;
  const total = subtotal + fee;

  return (
    <div className="priamo-surface">
      <div className="pad-status"/>
      <ScreenHeader title="Mi pedido" onBack={onBack}/>
      <div className="priamo-scroll">
        <div style={{ padding: '8px 16px 0' }}>
          {cart.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(26,22,20,0.55)' }}>
              <div className="priamo-display" style={{ fontSize: 20, color: '#1A1614' }}>Carrito vacío</div>
              <div style={{ fontSize: 14, marginTop: 6 }}>Agrega productos desde la carta.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cart.map(item => (
                <CartItem key={item.key} item={item} onQty={onUpdateQty} onRemove={onRemove}/>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: '20px 16px 0' }}>
            <div className="card" style={{ padding: '18px 16px' }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Resumen</div>
              <Row label="Subtotal" value={`S/ ${subtotal.toFixed(2)}`}/>
              <Row label="Delivery" value={`S/ ${fee.toFixed(2)}`}/>
              <div style={{ height: 1, background: 'rgba(26,22,20,0.08)', margin: '10px 0' }}/>
              <Row label="Total" value={`S/ ${total.toFixed(2)}`} big/>
            </div>

            <div style={{
              marginTop: 14, padding: '14px 16px',
              background: 'rgba(249,115,22,0.05)',
              borderRadius: 14, fontSize: 13, color: '#7C2D12',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Icon.Clock style={{ flexShrink: 0, marginTop: 2 }}/>
              <span>Tiempo estimado de entrega: <strong>{PRIAMO.eta}</strong> una vez confirmado el pago.</span>
            </div>
          </div>
        )}
        <div style={{ height: 140 }}/>
      </div>

      {cart.length > 0 && (
        <div className="sticky-cta" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <button className="btn btn-primary btn-block" onClick={onCheckout}>
            Continuar · S/ {total.toFixed(2)}
          </button>
        </div>
      )}
      <div className="pad-home"/>
    </div>
  );
}

function CartItem({ item, onQty, onRemove }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 18,
      padding: 14, display: 'flex', gap: 12,
      border: '1px solid rgba(26,22,20,0.05)',
    }}>
      <ProductImage label={item.name} hue={item.hue} width={68} height={68}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <div className="priamo-display" style={{ fontSize: 15 }}>{item.name}</div>
          <button onClick={() => onRemove(item.key)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'rgba(26,22,20,0.4)', padding: 0,
          }}>
            <Icon.Close/>
          </button>
        </div>
        {item.modifiers.length > 0 && (
          <div style={{
            fontSize: 11, color: 'rgba(26,22,20,0.55)',
            marginTop: 4, lineHeight: 1.45,
          }}>
            {item.modifiers.map(m => m.name).join(' · ')}
          </div>
        )}
        {item.note && (
          <div style={{
            fontSize: 11, color: '#7C2D12', marginTop: 4,
            fontStyle: 'italic',
          }}>
            “{item.note}”
          </div>
        )}
        <div style={{
          marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <MiniQty value={item.qty} onChange={(q) => onQty(item.key, q)}/>
          <div style={{ fontSize: 14, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            S/ {item.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniQty({ value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(26,22,20,0.05)', borderRadius: 999, padding: 2,
    }}>
      <button onClick={() => onChange(Math.max(1, value - 1))} style={btnMini}><Icon.Minus/></button>
      <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 600, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      <button onClick={() => onChange(value + 1)} style={btnMini}><Icon.Plus/></button>
    </div>
  );
}
const btnMini = {
  width: 26, height: 26, borderRadius: 999,
  border: 'none', background: 'transparent', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1614',
};

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
