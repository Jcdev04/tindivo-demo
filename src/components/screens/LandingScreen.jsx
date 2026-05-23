import { Icon } from '@/components/ui';
import { TINDIVO, RESTAURANTS } from '@/data';

export default function LandingScreen({ user, onPickRestaurant, onOpenAuth, onOpenAccount }) {
  return (
    <div className="priamo-surface" style={{ background: '#FAF6F1' }}>
      <div className="priamo-scroll">
        <div style={{
          padding: '56px 20px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(26,22,20,0.5)',
            }}>
              {TINDIVO.city}
            </div>
            <div className="priamo-display" style={{ fontSize: 28, marginTop: 2, lineHeight: 1 }}>
              Tindivo
            </div>
          </div>
          <button
            onClick={user.signedIn ? onOpenAccount : onOpenAuth}
            style={{
              width: 42, height: 42, borderRadius: 999,
              background: user.signedIn ? '#F97316' : 'rgba(26,22,20,0.06)',
              color: user.signedIn ? '#fff' : '#1A1614',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, fontFamily: 'inherit',
            }}>
            {user.signedIn ? user.name[0]?.toUpperCase() || 'U' : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 20c2-4 6-5 8-5s6 1 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        <div style={{ padding: '4px 20px 16px' }}>
          <div className="priamo-display" style={{
            fontSize: 32, lineHeight: 1.05, fontWeight: 700,
            letterSpacing: '-0.03em',
          }}>
            {user.signedIn ? <>Buenas noches,<br/>{user.name.split(' ')[0]} 🍕</> : <>¿Qué pedimos<br/>hoy en la noche?</>}
          </div>
        </div>

        <div style={{ padding: '0 16px 8px' }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid rgba(26,22,20,0.06)',
          }}>
            <Icon.Search style={{ color: 'rgba(26,22,20,0.4)' }}/>
            <span style={{ color: 'rgba(26,22,20,0.5)', fontSize: 15 }}>
              Buscar pizza, hamburguesa, bebida…
            </span>
          </div>
        </div>

        <div style={{ padding: '8px 16px 16px' }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
            color: '#fff', borderRadius: 22, padding: '22px 22px 24px',
            overflow: 'hidden',
            boxShadow: '0 12px 32px -10px rgba(249,115,22,0.45)',
          }}>
            <svg viewBox="0 0 200 200" style={{
              position: 'absolute', right: -40, top: -50,
              width: 220, height: 220, opacity: 0.18,
              pointerEvents: 'none',
            }}>
              <path fill="#FFF7ED" d="M44.7,-67.3C58.1,-58.9,68.9,-44.7,74.6,-29C80.3,-13.3,80.9,3.9,75.6,18.6C70.3,33.4,59.1,45.7,46.1,55.4C33.1,65.1,18.3,72.1,1.7,69.9C-14.8,67.6,-31.3,56.1,-44.6,43.2C-57.9,30.3,-68.1,16.1,-71.8,-0.4C-75.5,-16.9,-72.7,-35.6,-62.4,-46.9C-52.1,-58.1,-34.3,-61.9,-18.5,-67.4C-2.7,-72.8,11.1,-79.9,25,-78.6C38.9,-77.4,52.8,-67.9,65.1,-55.6" transform="translate(100 100)"/>
            </svg>
            <div style={{
              position: 'absolute', left: -30, bottom: -50,
              width: 140, height: 140, borderRadius: 999,
              background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)',
            }}/>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 0, transparent 50%)',
              pointerEvents: 'none',
            }}/>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.22)', padding: '4px 10px',
                borderRadius: 999, marginBottom: 12,
                backdropFilter: 'blur(8px)',
              }}>Solo en Tindivo</div>
              <div className="priamo-display" style={{
                fontSize: 22, lineHeight: 1.15, fontWeight: 700,
                letterSpacing: '-0.02em',
              }}>
                Pide en minutos,<br/>paga al recibir o por Yape.
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px 8px' }}>
          <div className="priamo-display" style={{ fontSize: 22 }}>Restaurantes</div>
        </div>

        <div style={{ padding: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RESTAURANTS.map(r => (
            <RestaurantCard key={r.id} restaurant={r} onClick={() => r.status === 'open' && onPickRestaurant(r)}/>
          ))}
        </div>

        <div style={{ padding: '24px 20px 40px', textAlign: 'center' }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(26,22,20,0.4)', marginBottom: 4,
          }}>tindivo · v1.0 · piloto</div>
          <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.4)' }}>
            Pedidos directos desde San Jacinto. Hecho en Áncash.
          </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant: r, onClick }) {
  const isOpen = r.status === 'open';
  return (
    <button
      onClick={onClick}
      disabled={!isOpen}
      style={{
        display: 'flex', gap: 14, alignItems: 'stretch',
        background: '#fff', border: '1px solid rgba(26,22,20,0.05)',
        borderRadius: 20, padding: 12, cursor: isOpen ? 'pointer' : 'not-allowed',
        textAlign: 'left', fontFamily: 'inherit', color: 'inherit',
        width: '100%',
        opacity: isOpen ? 1 : 0.4,
        filter: isOpen ? 'none' : 'grayscale(1)',
        transition: 'opacity 160ms ease',
        position: 'relative',
      }}>
      <div style={{
        width: 88, height: 88, borderRadius: 14,
        overflow: 'hidden', flexShrink: 0,
        backgroundColor: `oklch(0.92 0.04 ${r.hue})`,
        backgroundImage: `url("${r.photo}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)',
      }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
        <div>
          {r.badge && isOpen && (
            <span style={{
              display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#F97316',
              background: 'rgba(249,115,22,0.1)',
              padding: '3px 7px', borderRadius: 6, marginBottom: 4,
            }}>{r.badge}</span>
          )}
          <div className="priamo-display" style={{ fontSize: 18, marginBottom: 2 }}>{r.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(26,22,20,0.55)' }}>{r.tagline}</div>
        </div>
        {isOpen && (
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'rgba(26,22,20,0.7)', marginTop: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Clock/> {r.eta}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Icon.Truck/> S/{r.fee.toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
