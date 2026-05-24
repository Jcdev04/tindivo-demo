import { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui';
import { MapView } from './CheckoutScreen';
import { isWithinCoverage, COVERAGE_RADIUS_KM } from '@/data';

export default function AuthOnboarding({ user, onClose, onComplete, onAuthMethod }) {
  const initialStep = user?.name ? 'phone' : 'method';
  const [step, setStep] = useState(initialStep);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', password: '' });

  const [flowType, setFlowType] = useState(null); // 'google' | 'email'
  const [nameStepName, setNameStepName] = useState('');
  const [provisionalUser, setProvisionalUser] = useState(null);
  const nameRef = useRef(null);

  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneError, setPhoneError] = useState(false);
  const [address, setAddress] = useState({
    line: 'San Jacinto',
    reference: '',
    pinPos: { x: 170, y: 90 },
  });
  const [refError, setRefError] = useState(false);
  const phoneRef = useRef(null);

  useEffect(() => {
    if (step === 'name') {
      const t = setTimeout(() => nameRef.current?.focus(), 420);
      return () => clearTimeout(t);
    }
    if (step === 'phone') {
      const t = setTimeout(() => phoneRef.current?.focus(), 420);
      return () => clearTimeout(t);
    }
  }, [step]);

  const phoneDigits = phone.replace(/\D/g, '');
  const phoneValid = phoneDigits.length === 9 && phoneDigits.startsWith('9');
  const refValid = address.reference.trim().length >= 6;
  const coverage = isWithinCoverage(address.pinPos);
  const inZone = coverage.within;

  const nameTrimmed = nameStepName.trim();
  const nameValid = nameTrimmed.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameTrimmed);

  const isGoogleFlow = flowType === 'google';
  const isEmailFlow = flowType === 'email';
  const totalSteps = isGoogleFlow ? 3 : 2;

  const handlePickGoogle = () => {
    const googleName = 'Jesús Castillo';
    const googleEmail = 'jesus.castillo@gmail.com';
    setNameStepName(googleName);
    setFlowType('google');
    const newUser = {
      signedIn: true,
      name: googleName,
      email: googleEmail,
      phone: '',
      addresses: [],
    };
    setProvisionalUser(newUser);
    onAuthMethod && onAuthMethod(newUser);
    setStep('name');
  };

  const handleContinueName = () => {
    if (!nameValid) return;
    const updated = { ...provisionalUser, name: nameTrimmed };
    setProvisionalUser(updated);
    onAuthMethod && onAuthMethod(updated);
    setStep('phone');
  };

  const handleStartEmail = () => {
    setFlowType('email');
    setStep('email');
  };

  const validEmailForm =
    emailForm.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(emailForm.email) &&
    emailForm.password.length >= 6;

  const handleSubmitEmail = () => {
    if (!validEmailForm) return;
    setFlowType('email');
    const newUser = {
      signedIn: true,
      name: emailForm.name.trim(),
      email: emailForm.email.trim(),
      phone: '',
      addresses: [],
    };
    onAuthMethod && onAuthMethod(newUser);
    setStep('phone');
  };

  const handleContinuePhone = () => {
    if (!phoneValid) {
      setPhoneError(true);
      phoneRef.current?.focus();
      return;
    }
    setPhoneError(false);
    setStep('address');
  };

  const handleFinish = () => {
    if (!inZone) return;
    if (!refValid) {
      setRefError(true);
      return;
    }
    setRefError(false);
    onComplete({
      phone: phoneDigits,
      address: {
        id: 'addr-' + Date.now(),
        label: 'Casa',
        line: address.line.trim() || 'San Jacinto',
        reference: address.reference.trim(),
        pinPos: address.pinPos,
        isDefault: true,
      },
    });
  };

  const stepIndex = ['method', 'email', 'name', 'phone', 'address'].indexOf(step);
  const showProgressChip = step === 'name' || step === 'phone' || step === 'address';
  const progressNum = step === 'name' ? 1 : step === 'phone' ? (isGoogleFlow ? 2 : 1) : (isGoogleFlow ? 3 : 2);
  const showLaterHint = step === 'name' || step === 'phone' || step === 'address';

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: '94%' }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid rgba(26,22,20,0.06)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          gap: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <button onClick={step === 'email' || step === 'name' ? () => setStep('method') : onClose} style={{
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(26,22,20,0.06)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1614',
            }}>
              {step === 'email' || step === 'name' ? <Icon.Back/> : <Icon.Close/>}
            </button>
            {showLaterHint && (
              <div style={{
                fontSize: 11, color: 'rgba(26,22,20,0.5)',
                marginTop: 4, marginLeft: 1,
              }}>
                Puedes completar esto después
              </div>
            )}
          </div>

          {showProgressChip ? (
            <div style={{
              fontSize: 13, fontWeight: 600, color: '#F97316',
              background: 'rgba(249,115,22,0.1)',
              padding: '6px 12px', borderRadius: 999,
              marginTop: 4, flexShrink: 0,
            }}>
              Paso {progressNum} de {totalSteps}
            </div>
          ) : (
            <div style={{
              fontSize: 11, color: 'rgba(26,22,20,0.5)',
              marginTop: 12, flexShrink: 0,
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              {step === 'method' ? 'Crear cuenta' : step === 'email' ? 'Con correo' : step === 'name' ? 'Con Google' : ''}
            </div>
          )}
        </div>

        {/* Horizontal pager — 5 slides */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            display: 'flex', width: '500%', height: '100%',
            transform: `translateX(-${stepIndex * 20}%)`,
            transition: 'transform 400ms cubic-bezier(.22,1,.36,1)',
          }}>
            <div style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
              <MethodStep onGoogle={handlePickGoogle} onEmail={handleStartEmail}/>
            </div>
            <div style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
              <EmailStep form={emailForm} setForm={setEmailForm}/>
            </div>
            <div style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
              <NameStep name={nameStepName} onNameChange={setNameStepName} inputRef={nameRef}/>
            </div>
            <div style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
              <PhoneStep
                user={user}
                phone={phone}
                onPhoneChange={(v) => { setPhone(v); if (phoneError) setPhoneError(false); }}
                error={phoneError}
                inputRef={phoneRef}
              />
            </div>
            <div style={{ width: '20%', height: '100%', overflowY: 'auto' }}>
              <AddressStep
                address={address}
                onAddressChange={(patch) => {
                  setAddress({ ...address, ...patch });
                  if (refError && (patch.reference || '').trim().length >= 6) setRefError(false);
                }}
                error={refError}
              />
            </div>
          </div>
        </div>

        {/* Footer (varies per step) */}
        <div style={{
          padding: '14px 16px 24px',
          borderTop: '1px solid rgba(26,22,20,0.06)',
          background: '#FAF6F1',
        }}>
          {step === 'method' && (
            <div style={{
              fontSize: 11, color: 'rgba(26,22,20,0.5)',
              textAlign: 'center', lineHeight: 1.5,
            }}>
              Al continuar aceptas los <u style={{ color: '#1A1614' }}>Términos</u> y la
              {' '}<u style={{ color: '#1A1614' }}>Política de privacidad</u> de Tindivo.
            </div>
          )}

          {step === 'email' && (
            <button
              onClick={handleSubmitEmail}
              style={{
                width: '100%', padding: '18px 22px', border: 'none',
                borderRadius: 18,
                background: validEmailForm ? '#F97316' : 'rgba(249,115,22,0.32)',
                color: '#fff',
                fontFamily: 'inherit', fontSize: 17, fontWeight: 600,
                letterSpacing: '-0.01em', cursor: 'pointer',
                boxShadow: validEmailForm ? '0 8px 22px -8px rgba(249,115,22,0.55)' : 'none',
                transition: 'background 220ms ease, box-shadow 220ms ease',
              }}>
              Crear cuenta
            </button>
          )}

          {step === 'name' && (
            <button
              onClick={handleContinueName}
              disabled={!nameValid}
              style={{
                width: '100%', padding: '18px 22px', border: 'none',
                borderRadius: 18,
                background: nameValid ? '#F97316' : 'rgba(249,115,22,0.32)',
                color: '#fff',
                fontFamily: 'inherit', fontSize: 17, fontWeight: 600,
                letterSpacing: '-0.01em', cursor: nameValid ? 'pointer' : 'not-allowed',
                boxShadow: nameValid ? '0 8px 22px -8px rgba(249,115,22,0.55)' : 'none',
                transition: 'background 220ms ease, box-shadow 220ms ease',
              }}>
              Continuar
            </button>
          )}

          {step === 'phone' && (
            <button
              onClick={handleContinuePhone}
              style={{
                width: '100%', padding: '18px 22px', border: 'none',
                borderRadius: 18,
                background: phoneValid ? '#F97316' : 'rgba(249,115,22,0.32)',
                color: '#fff',
                fontFamily: 'inherit', fontSize: 17, fontWeight: 600,
                letterSpacing: '-0.01em', cursor: 'pointer',
                boxShadow: phoneValid ? '0 8px 22px -8px rgba(249,115,22,0.55)' : 'none',
                transition: 'background 220ms ease, box-shadow 220ms ease',
              }}>
              Continuar
            </button>
          )}

          {step === 'address' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setStep('phone')} style={{
                background: 'rgba(26,22,20,0.06)', color: '#1A1614',
                border: 'none', padding: '16px 20px', borderRadius: 18,
                fontFamily: 'inherit', fontSize: 15, fontWeight: 600, cursor: 'pointer',
              }}>
                Atrás
              </button>
              <button
                onClick={handleFinish}
                disabled={!refValid || !inZone}
                style={{
                  flex: 1, padding: '18px 22px', border: 'none',
                  borderRadius: 18,
                  background: (refValid && inZone) ? '#F97316' : 'rgba(249,115,22,0.32)',
                  color: '#fff',
                  fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
                  letterSpacing: '-0.01em', cursor: (refValid && inZone) ? 'pointer' : 'not-allowed',
                  boxShadow: (refValid && inZone) ? '0 8px 22px -8px rgba(249,115,22,0.55)' : 'none',
                  transition: 'background 220ms ease, box-shadow 220ms ease',
                }}>
                {!inZone ? 'Fuera de zona de cobertura' : 'Guardar y empezar a pedir'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Substep: Method picker (Google or Email) ────────────────────────
function MethodStep({ onGoogle, onEmail }) {
  return (
    <div style={{ padding: '24px 22px 0' }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: '#F97316',
        boxShadow: '0 12px 24px -8px rgba(249,115,22,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        <div style={{
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 30, fontWeight: 700, color: '#fff',
          letterSpacing: '-0.04em', lineHeight: 1,
        }}>T</div>
      </div>

      <div className="priamo-display" style={{ fontSize: 26, lineHeight: 1.15, marginBottom: 8 }}>
        Crea tu cuenta<br/>en Tindivo
      </div>
      <div style={{
        fontSize: 13.5, color: 'rgba(26,22,20,0.6)',
        marginBottom: 22, lineHeight: 1.5,
      }}>
        Sin verificación de correo. Empiezas a pedir al instante.
      </div>

      <button
        onClick={onGoogle}
        style={{
          width: '100%', padding: '16px 18px',
          background: '#fff', border: '1px solid rgba(26,22,20,0.1)',
          borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}>
        <svg width="22" height="22" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
          <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
        </svg>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Continuar con Google</div>
          <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>
            Recomendado · 1 toque
          </div>
        </div>
      </button>

      <button
        onClick={onEmail}
        style={{
          width: '100%', padding: '16px 18px',
          background: 'transparent', border: '1px solid rgba(26,22,20,0.12)',
          borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
        <div style={{ width: 22, height: 22, color: '#1A1614' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Ingresar con correo</div>
          <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)', marginTop: 2 }}>
            Crea tu cuenta en 1 paso
          </div>
        </div>
      </button>

      <div style={{
        marginTop: 18, display: 'flex',
        alignItems: 'center', gap: 8, padding: '0 4px',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,22,20,0.08)' }}/>
        <div style={{
          fontSize: 11, color: 'rgba(26,22,20,0.45)',
          fontFamily: 'JetBrains Mono, monospace',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>¿Ya tienes cuenta?</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,22,20,0.08)' }}/>
      </div>
      <button style={{
        width: '100%', marginTop: 12, padding: '12px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
        color: '#F97316',
      }}>Iniciar sesión</button>

      <div style={{ height: 30 }}/>
    </div>
  );
}

// ─── Substep: Name (Google flow only) ─────────────────────────────────
function NameStep({ name, onNameChange, inputRef }) {
  const trimmed = name.trim();
  const valid = trimmed.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);
  const hasInvalidChars = trimmed.length > 0 && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed);

  return (
    <div style={{ padding: '22px 22px 0' }}>
      <div className="priamo-display" style={{ fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>
        ¿Cómo te llamamos?
      </div>
      <div style={{
        fontSize: 13, color: 'rgba(26,22,20,0.6)',
        marginBottom: 22, lineHeight: 1.5,
      }}>
        Este nombre aparecerá en tu pedido.
      </div>

      <div>
        <label style={authFieldLabel}>Nombre <span style={{ color: '#F97316' }}>*</span></label>
        <input
          ref={inputRef}
          style={{
            ...authFieldInput,
            border: `2px solid ${hasInvalidChars ? '#DC2626' : 'rgba(26,22,20,0.08)'}`,
            backgroundColor: hasInvalidChars ? 'rgba(220,38,38,0.03)' : '#fff',
          }}
          placeholder="Tu nombre"
          value={name}
          onChange={e => onNameChange(e.target.value)}
        />
        {hasInvalidChars ? (
          <div style={{
            marginTop: 8, fontSize: 12.5, color: '#DC2626',
            fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: 6,
            lineHeight: 1.45,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 7v6M12 17v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Solo letras y espacios, sin números ni caracteres especiales.
          </div>
        ) : (
          <div style={{
            marginTop: 6, fontSize: 11.5, color: 'rgba(26,22,20,0.55)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Mínimo 2 caracteres, solo letras.</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{trimmed.length}/40</span>
          </div>
        )}
      </div>

      <div style={{ height: 30 }}/>
    </div>
  );
}

// ─── Substep: Email registration (3 fields) ──────────────────────────
function EmailStep({ form, setForm }) {
  return (
    <div style={{ padding: '22px 22px 0' }}>
      <div className="priamo-display" style={{ fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>
        Crea tu cuenta
      </div>
      <div style={{
        fontSize: 13, color: 'rgba(26,22,20,0.6)',
        marginBottom: 22, lineHeight: 1.5,
      }}>
        Sin verificación. Tres campos y listo.
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={authFieldLabel}>Nombre completo <span style={{ color: '#F97316' }}>*</span></label>
        <input
          style={authFieldInput}
          placeholder="Ej. María López"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={authFieldLabel}>Correo <span style={{ color: '#F97316' }}>*</span></label>
        <input
          style={authFieldInput}
          type="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label style={authFieldLabel}>Contraseña <span style={{ color: '#F97316' }}>*</span></label>
        <input
          style={authFieldInput}
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <div style={{ fontSize: 11.5, color: 'rgba(26,22,20,0.55)', marginTop: 6 }}>
          Mínimo 6 caracteres.
        </div>
      </div>

      <div style={{ height: 30 }}/>
    </div>
  );
}

const authFieldLabel = {
  display: 'block', fontSize: 12, fontWeight: 600,
  letterSpacing: '0.04em', textTransform: 'uppercase',
  color: 'rgba(26,22,20,0.55)', marginBottom: 8,
};
const authFieldInput = {
  background: '#fff', borderRadius: 16, padding: '14px 16px',
  border: '1px solid rgba(26,22,20,0.08)',
  fontFamily: 'inherit', fontSize: 16, width: '100%',
  outline: 'none', color: '#1A1614', boxSizing: 'border-box',
};

// ─── Step 1: WhatsApp phone ──────────────────────────────────────────
function PhoneStep({ user, phone, onPhoneChange, error, inputRef }) {
  return (
    <div style={{ padding: '20px 22px 0' }}>
      {user?.name && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#fff', borderRadius: 14, padding: '10px 12px',
          border: '1px solid rgba(26,22,20,0.06)', marginBottom: 18,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 999,
            background: 'linear-gradient(135deg, #F97316, #C2410C)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            fontFamily: 'Bricolage Grotesque, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {user.name[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ¡Hola, {user.name.split(' ')[0]}!
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: '#1A8050',
                background: 'rgba(26,128,80,0.1)',
                padding: '2px 7px', borderRadius: 5,
              }}>Cuenta lista</span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(26,22,20,0.55)', marginTop: 1 }}>
              {user.email}
            </div>
          </div>
        </div>
      )}

      <div className="priamo-display" style={{ fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>
        ¿Cuál es tu número<br/>de WhatsApp?
      </div>
      <div style={{
        fontSize: 13, color: 'rgba(26,22,20,0.6)',
        marginBottom: 20, lineHeight: 1.5,
      }}>
        El repartidor te contactará aquí si tiene alguna duda.
      </div>

      {/* Phone field */}
      <div style={{
        background: '#fff',
        border: `2px solid ${error ? '#DC2626' : 'rgba(26,22,20,0.08)'}`,
        borderRadius: 18, padding: '16px',
        transition: 'border-color 180ms ease, background 180ms ease',
        backgroundColor: error ? 'rgba(220,38,38,0.03)' : '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 22, fontWeight: 600, color: '#1A1614',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ fontSize: 18 }}>🇵🇪</span>+51
          </div>
          <div style={{ width: 1, height: 24, background: 'rgba(26,22,20,0.12)' }}/>
          <input
            ref={inputRef}
            value={phone}
            onChange={e => onPhoneChange(e.target.value.replace(/[^\d ]/g, '').slice(0, 11))}
            placeholder="9 — — — — — — — —"
            inputMode="numeric"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'inherit', fontSize: 22, fontWeight: 600,
              color: '#1A1614', fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em', minWidth: 0, width: '100%',
            }}
          />
        </div>
      </div>

      {error ? (
        <div style={{
          marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 6,
          fontSize: 12.5, color: '#DC2626', fontWeight: 500, lineHeight: 1.45,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7v6M12 17v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Ingresa tu número de WhatsApp para continuar.
        </div>
      ) : (
        <div style={{ marginTop: 10, fontSize: 11.5, color: 'rgba(26,22,20,0.55)' }}>
          Debe empezar con 9 y tener 9 dígitos.
        </div>
      )}

      {/* WhatsApp note */}
      <div style={{
        marginTop: 22, padding: '12px 14px',
        background: 'rgba(37,211,102,0.08)', borderRadius: 12,
        fontSize: 12, color: 'rgba(26,22,20,0.72)', lineHeight: 1.5,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 999,
          background: '#25D366', color: '#fff', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 1,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.5 14.4l-2-1c-.3-.1-.5 0-.6.2l-.5.6c-.2.2-.4.3-.7.2-.9-.3-1.7-.8-2.4-1.5-.7-.7-1.2-1.5-1.5-2.4-.1-.3 0-.5.2-.7l.6-.5c.2-.1.3-.3.2-.6l-1-2c-.1-.3-.4-.4-.7-.3-.6.2-1.1.6-1.5 1.1-.4.5-.6 1.1-.5 1.7.1 1.5 1 3 2.4 4.4 1.4 1.4 2.9 2.3 4.4 2.4.6 0 1.2-.1 1.7-.5.5-.4.9-.9 1.1-1.5.1-.3 0-.6-.3-.7zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5-1.3c1.5.8 3.2 1.3 5 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
          </svg>
        </div>
        <span>
          Nunca compartimos tu número. Solo lo usa el motorizado del pedido en curso.
        </span>
      </div>

      <div style={{ height: 30 }}/>
    </div>
  );
}

// ─── Step 2: Address with map ────────────────────────────────────────
function AddressStep({ address, onAddressChange, error }) {
  const coverage = isWithinCoverage(address.pinPos);
  const outOfZone = !coverage.within;
  return (
    <div style={{ padding: '20px 22px 0' }}>
      <div className="priamo-display" style={{ fontSize: 24, lineHeight: 1.15, marginBottom: 6 }}>
        Tu dirección<br/>de entrega
      </div>
      <div style={{
        fontSize: 13, color: 'rgba(26,22,20,0.6)',
        marginBottom: 16, lineHeight: 1.5,
      }}>
        Mueve el pin a tu casa en San Jacinto.
      </div>

      {/* Map */}
      <div style={{ marginBottom: 14 }}>
        <MapView
          pinPos={address.pinPos}
          onMove={(p) => onAddressChange({ pinPos: p })}
        />
        <div style={{
          marginTop: 8, fontSize: 11, color: 'rgba(26,22,20,0.55)',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#F97316' }}/>
          -9.1547, -78.5042 · San Jacinto, Áncash
        </div>
        {outOfZone && (
          <div style={{
            marginTop: 8, padding: '10px 12px',
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.22)',
            borderRadius: 10, fontSize: 12, color: '#DC2626',
            fontWeight: 500, lineHeight: 1.45,
          }}>
            Esta dirección está fuera de nuestra zona de cobertura en San Jacinto (radio {COVERAGE_RADIUS_KM}km).
          </div>
        )}
      </div>

      {/* Reference field */}
      <div>
        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600,
          letterSpacing: '0.04em', textTransform: 'uppercase',
          color: 'rgba(26,22,20,0.55)', marginBottom: 8,
        }}>
          Referencia <span style={{ color: '#F97316' }}>*</span>
        </label>
        <textarea
          value={address.reference}
          onChange={e => onAddressChange({ reference: e.target.value })}
          placeholder="Ej: Frente a la bodega de don Carlos, puerta azul"
          maxLength={140}
          style={{
            background: error ? 'rgba(220,38,38,0.03)' : '#fff',
            borderRadius: 16,
            padding: '14px 16px',
            border: `2px solid ${error ? '#DC2626' : 'rgba(26,22,20,0.08)'}`,
            fontFamily: 'inherit', fontSize: 14,
            width: '100%', outline: 'none', color: '#1A1614',
            minHeight: 84, resize: 'none', lineHeight: 1.45,
            transition: 'border-color 180ms ease, background 180ms ease',
            boxSizing: 'border-box',
          }}
        />
        {error ? (
          <div style={{
            marginTop: 8, fontSize: 12.5, color: '#DC2626',
            fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: 6,
            lineHeight: 1.45,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 7v6M12 17v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Escribe una referencia para que el motorizado te encuentre.
          </div>
        ) : (
          <div style={{
            marginTop: 6, fontSize: 11.5, color: 'rgba(26,22,20,0.55)',
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Mientras más detalle, menos llamadas del motorizado.</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{address.reference.length}/140</span>
          </div>
        )}
      </div>

      <div style={{ height: 30 }}/>
    </div>
  );
}
