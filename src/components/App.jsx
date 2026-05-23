import { useState, useEffect } from 'react';
import { IOSDevice } from '@/components/IosFrame';
import LandingScreen from '@/components/screens/LandingScreen';
import { MenuScreen, CartScreen } from '@/components/screens/MenuCartScreen';
import { CheckoutScreen, PaymentScreen, PickupPaymentScreen, OrderConfirmedScreen, OrderCancelledScreen, TrackingScreen } from '@/components/screens/CheckoutScreen';
import AuthOnboarding from '@/components/screens/AuthOnboarding';
import { AccountScreen, AddressEditScreen } from '@/components/screens/AccountScreen';
import ProductModal from '@/components/ProductModal';
import { SEED_ADDRESSES } from '@/data';

const SCREENS = [
  { id: 'landing',  title: 'Inicio',         sub: 'Selección de restaurante' },
  { id: 'menu',     title: 'Carta Priamo',   sub: 'Pizzas, hamburguesas, bebidas' },
  { id: 'auth',     title: 'Onboarding',     sub: 'Crear cuenta + datos' },
  { id: 'cart',     title: 'Carrito',        sub: 'Resumen + subtotal + delivery' },
  { id: 'checkout', title: 'Entrega',        sub: 'Dirección guardada + confirmación' },
  { id: 'payment',  title: 'Método de pago', sub: 'Yape al recibir / Efectivo / Prepagar' },
  { id: 'prepay',   title: 'Pre-pago Yape',  sub: 'Comprobante + timer 10:00 (delivery prepago)' },
  { id: 'tracking', title: 'Seguimiento',    sub: 'Estados sin validación de pago' },
  { id: 'cancelled',title: 'Pedido cancelado', sub: 'Timer 10:00 expirado' },
  { id: 'account',  title: 'Mi cuenta',      sub: 'Direcciones + historial' },
];

const SEED_CART = [
  {
    key: 'seed-1',
    productId: 'pz-margarita',
    name: 'Margarita',
    qty: 1,
    unitPrice: 36,
    total: 36,
    hue: 8,
    modifiers: [
      { group: 'Tamaño', name: 'Familiar', price: 8 },
      { group: 'Tipo de masa', name: 'Tradicional', price: 0 },
    ],
    note: null,
  },
  {
    key: 'seed-2',
    productId: 'bg-bbq',
    name: 'BBQ Bacon',
    qty: 1,
    unitPrice: 36,
    total: 36,
    hue: 18,
    modifiers: [
      { group: 'Término', name: 'Tres cuartos', price: 0 },
      { group: 'Acompañamiento', name: 'Papas rústicas', price: 0 },
      { group: 'Extras', name: 'Tocino extra', price: 4 },
      { group: 'Extras', name: 'Huevo frito', price: 3 },
    ],
    note: 'Sin cebolla por favor',
  },
  {
    key: 'seed-3',
    productId: 'dr-inca',
    name: 'Inca Kola 500ml',
    qty: 2,
    unitPrice: 5,
    total: 10,
    hue: 55,
    modifiers: [],
    note: null,
  },
];

const SIGNED_IN_USER = {
  signedIn: true,
  name: 'María López',
  email: 'maria.lopez@gmail.com',
  phone: '987123456',
  addresses: SEED_ADDRESSES,
};

const GOOGLE_PARTIAL_USER = {
  signedIn: true,
  name: 'María López',
  email: 'maria.lopez@gmail.com',
  phone: '',
  addresses: [],
};

const isOnboardingComplete = (u) =>
  u.signedIn && u.phone && u.addresses.length > 0;

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(SIGNED_IN_USER);
  const [cart, setCart] = useState(SEED_CART);
  const [modal, setModal] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [order, setOrder] = useState({
    method: 'delivery',
    addressId: 'addr-1',
    phone: '987123456',
    note: '',
  });
  const [confirmedTotal, setConfirmedTotal] = useState(84);
  const [trackingState, setTrackingState] = useState('sent');
  const [cancelReason, setCancelReason] = useState('timeout');
  const [submittedOrder, setSubmittedOrder] = useState({
    id: '48391',
    phone: '987123456',
    payment: { methodId: 'yape-receive', methodLabel: 'Yape al recibir', change: null },
  });

  useEffect(() => {
    if (user.signedIn && !order.phone) setOrder(o => ({ ...o, phone: user.phone }));
    if (user.signedIn && !order.addressId && user.addresses[0]) {
      setOrder(o => ({ ...o, addressId: (user.addresses.find(a => a.isDefault) || user.addresses[0]).id }));
    }
  }, [user.signedIn]);

  const handleAddToCart = (item) => {
    setCart([...cart, item]);
    setModal(null);
  };
  const handleUpdateQty = (key, qty) => {
    setCart(cart.map(i => i.key === key ? { ...i, qty, total: i.unitPrice * qty } : i));
  };
  const handleRemove = (key) => setCart(cart.filter(i => i.key !== key));

  const handleOpenCart = () => {
    if (!user.signedIn) {
      setAuthOpen(true);
      setScreen('cart');
      return;
    }
    if (!isOnboardingComplete(user)) setAuthOpen(true);
    setScreen('cart');
  };

  const handleProceedToCheckout = () => {
    if (!isOnboardingComplete(user)) {
      setAuthOpen(true);
      return;
    }
    setScreen('checkout');
  };

  const handleAuthComplete = ({ phone, address }) => {
    const next = {
      ...user,
      phone,
      addresses: user.addresses.length === 0
        ? [address]
        : [...user.addresses.map(a => ({ ...a, isDefault: false })), address],
    };
    setUser(next);
    setOrder(o => ({
      ...o,
      phone,
      addressId: address.id,
    }));
    setAuthOpen(false);
    setScreen(cart.length > 0 ? 'checkout' : 'menu');
  };

  const handleSaveAddress = (a) => {
    const exists = user.addresses.find(x => x.id === a.id);
    let nextAddresses;
    if (exists) {
      nextAddresses = user.addresses.map(x => x.id === a.id ? a : (a.isDefault ? { ...x, isDefault: false } : x));
    } else {
      const newAddr = { ...a, id: 'addr-' + Date.now() };
      nextAddresses = a.isDefault
        ? [...user.addresses.map(x => ({ ...x, isDefault: false })), newAddr]
        : [...user.addresses, newAddr];
    }
    setUser({ ...user, addresses: nextAddresses });
    setEditingAddress(null);
    setScreen('account');
  };
  const handleDeleteAddress = (id) => {
    const filtered = user.addresses.filter(a => a.id !== id);
    if (filtered.length && !filtered.some(a => a.isDefault)) filtered[0].isDefault = true;
    setUser({ ...user, addresses: filtered });
    setEditingAddress(null);
    setScreen('account');
  };

  const handleLogout = () => {
    setUser({ signedIn: false, name: '', email: '', phone: '', addresses: [] });
    setOrder({ method: 'delivery', addressId: null, phone: '', note: '' });
    setScreen('landing');
  };

  const beginAddAddress = (fromScreen = 'account') => {
    setEditingAddress({
      id: 'addr-new',
      label: 'Casa',
      line: '',
      reference: '',
      pinPos: { x: 170, y: 90 },
      isDefault: user.addresses.length === 0,
      _from: fromScreen,
      _isNew: true,
    });
    setScreen('addressEdit');
  };
  const beginEditAddress = (a, fromScreen = 'account') => {
    setEditingAddress({ ...a, _from: fromScreen, _isNew: false });
    setScreen('addressEdit');
  };

  return (
    <div className="stage">
      <aside className="stage-side">
        <h1>Tindivo · Priamo</h1>
        <p>PWA de delivery para San Jacinto. Flujo completo con cuenta, direcciones guardadas, confirmación y rechazo de pago.</p>
        <div className="step-list">
          {SCREENS.map((s, i) => (
            <button
              key={s.id}
              className={'step' + (
                screen === s.id ||
                (s.id === 'auth' && authOpen) ||
                (s.id === 'account' && (screen === 'account' || screen === 'addressEdit'))
                ? ' active' : '')}
              onClick={() => {
                if (s.id === 'auth') { setAuthOpen(true); setScreen('landing'); }
                else if (s.id === 'account') {
                  if (!user.signedIn) setAuthOpen(true);
                  else setScreen('account');
                }
                else setScreen(s.id);
              }}>
              <span className="dot">{i + 1}</span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{s.title}</span>
                <span className="sub">{s.sub}</span>
              </span>
            </button>
          ))}
        </div>

        <div style={{
          marginTop: 16, paddingTop: 14,
          borderTop: '1px solid rgba(26,22,20,0.08)',
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#F97316', marginBottom: 8,
          }}>Demo</div>
          <button
            onClick={() => {
              setUser({ signedIn: false, name: '', email: '', phone: '', addresses: [] });
              setOrder({ method: 'delivery', addressId: null, phone: '', note: '' });
              setAuthOpen(true);
            }}
            style={demoBtn}>
            🆕 Probar onboarding desde cero
          </button>
          <button
            onClick={() => {
              setUser(SIGNED_IN_USER);
              setOrder({
                method: 'delivery',
                addressId: SEED_ADDRESSES[0].id,
                phone: SIGNED_IN_USER.phone,
                note: '',
              });
              setAuthOpen(false);
            }}
            style={demoBtn}>
            ✓ Restaurar usuario completo
          </button>
          <button
            onClick={() => { handleLogout(); setAuthOpen(false); }}
            style={demoBtn}>
            🚪 Cerrar sesión
          </button>
          <button
            onClick={() => setCart(cart.length ? [] : SEED_CART)}
            style={demoBtn}>
            {cart.length ? '🗑️ Vaciar carrito' : '🛒 Restaurar carrito'}
          </button>
        </div>

        <div style={{
          marginTop: 16, paddingTop: 14,
          borderTop: '1px solid rgba(26,22,20,0.08)',
          fontSize: 11, color: 'rgba(26,22,20,0.5)', lineHeight: 1.5,
        }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#1A1614', marginBottom: 6,
          }}>Sistema visual</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <Swatch c="#F97316" name="Brand"/>
            <Swatch c="#1A1614" name="Ink"/>
            <Swatch c="#FAF6F1" name="Surface"/>
            <Swatch c="#fff" name="Card"/>
          </div>
          Bricolage Grotesque para titulares · Geist para cuerpo · Tailwind orange-500. Botones ≥ 44px.
        </div>
      </aside>

      <main className="stage-frame">
        <IOSDevice width={402} height={874}>
          {screen === 'landing' && (
            <LandingScreen
              user={user}
              onPickRestaurant={(r) => setScreen('menu')}
              onOpenAuth={() => setAuthOpen(true)}
              onOpenAccount={() => setScreen('account')}
            />
          )}

          {screen === 'menu' && (
            <MenuScreen
              cart={cart}
              user={user}
              onBack={() => setScreen('landing')}
              onOpenAccount={() => user.signedIn ? setScreen('account') : setAuthOpen(true)}
              onOpenProduct={(p, c) => setModal({ product: p, category: c })}
              onOpenCart={handleOpenCart}
            />
          )}

          {screen === 'cart' && (
            <CartScreen
              cart={cart}
              onBack={() => setScreen('menu')}
              onUpdateQty={handleUpdateQty}
              onRemove={handleRemove}
              onCheckout={handleProceedToCheckout}
            />
          )}

          {screen === 'checkout' && (
            <CheckoutScreen
              cart={cart}
              user={user}
              order={order}
              setOrder={setOrder}
              onBack={() => setScreen('cart')}
              onAddAddress={() => beginAddAddress('checkout')}
              onEditAddress={(a) => beginEditAddress(a, 'checkout')}
              onConfirm={(total) => { setConfirmedTotal(total); setScreen('payment'); }}
            />
          )}

          {screen === 'payment' && (
            <PaymentScreen
              total={confirmedTotal}
              order={order}
              onBack={() => setScreen('checkout')}
              onTimeout={() => setScreen('cancelled')}
              onPrepayUpload={() => setScreen('prepay')}
              onConfirm={(payment) => {
                const newId = String(40000 + Math.floor(Math.random() * 9999));
                setSubmittedOrder({
                  id: newId,
                  phone: order.phone,
                  method: order.method,
                  payment,
                });
                setTrackingState('sent');
                setScreen('confirmed');
              }}
            />
          )}

          {screen === 'prepay' && (
            <PickupPaymentScreen
              mode="delivery-prepay"
              total={confirmedTotal}
              order={order}
              onBack={() => setScreen('payment')}
              onTimeout={() => setScreen('cancelled')}
              onConfirm={(payment) => {
                const newId = String(40000 + Math.floor(Math.random() * 9999));
                setSubmittedOrder({
                  id: newId,
                  phone: order.phone,
                  method: order.method,
                  payment,
                });
                setTrackingState('sent');
                setScreen('confirmed');
              }}
            />
          )}

          {screen === 'cancelled' && (
            <OrderCancelledScreen onBack={() => setScreen('menu')}/>
          )}

          {screen === 'confirmed' && (
            <OrderConfirmedScreen
              order={submittedOrder}
              total={confirmedTotal}
              onGoTracking={() => setScreen('tracking')}
              onGoHome={() => setScreen('landing')}
            />
          )}

          {screen === 'tracking' && (
            <TrackingScreen
              order={order}
              total={confirmedTotal}
              cart={cart}
              user={user}
              orderId={submittedOrder.id}
              currentState={trackingState}
              onSetState={(s) => setTrackingState(s)}
              onBack={() => setScreen('landing')}
            />
          )}

          {screen === 'account' && user.signedIn && (
            <AccountScreen
              user={user}
              setUser={setUser}
              onBack={() => setScreen('landing')}
              onAddAddress={() => beginAddAddress('account')}
              onEditAddress={(a) => beginEditAddress(a, 'account')}
              onLogout={handleLogout}
            />
          )}

          {screen === 'addressEdit' && editingAddress && (
            <AddressEditScreen
              address={editingAddress}
              isNew={editingAddress._isNew}
              onBack={() => { setScreen(editingAddress._from || 'account'); setEditingAddress(null); }}
              onSave={(a) => handleSaveAddress(a)}
              onDelete={() => handleDeleteAddress(editingAddress.id)}
            />
          )}

          {modal && (
            <ProductModal
              product={modal.product}
              category={modal.category}
              onClose={() => setModal(null)}
              onAdd={handleAddToCart}
            />
          )}

          {authOpen && (
            <AuthOnboarding
              user={user.signedIn ? user : null}
              onClose={() => setAuthOpen(false)}
              onComplete={handleAuthComplete}
              onAuthMethod={(newUser) => setUser(newUser)}
            />
          )}
        </IOSDevice>
      </main>
    </div>
  );
}

const demoBtn = {
  width: '100%', textAlign: 'left',
  background: 'rgba(26,22,20,0.04)', border: '1px solid rgba(26,22,20,0.06)',
  borderRadius: 10, padding: '8px 10px',
  fontFamily: 'inherit', fontSize: 12, color: '#1A1614',
  cursor: 'pointer', marginBottom: 6,
};

function Swatch({ c, name }) {
  const isLight = ['#FAF6F1', '#fff'].includes(c);
  return (
    <div style={{
      flex: 1, height: 32, borderRadius: 8, background: c,
      border: isLight ? '1px solid rgba(26,22,20,0.1)' : 'none',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: 8,
      color: isLight ? 'rgba(26,22,20,0.55)' : 'rgba(255,255,255,0.8)',
      letterSpacing: '0.05em',
    }}>{name}</div>
  );
}
