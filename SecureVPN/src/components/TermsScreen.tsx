import { useVpn } from '../context/VpnContext';
import { useSafeArea } from '../hooks/useSafeArea';
import { Button } from './ui/Button';

export function TermsScreen() {
  const { acceptTerms, setScreen, termsAccepted } = useVpn();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();

  const handleAccept = () => {
    acceptTerms();
    setScreen('home');
  };

  const termCards = [
    {
      icon: 'fa-scroll',
      color: 'var(--accent)',
      title: 'Acuerdo Legal',
      text: 'Al aceptar, estás de acuerdo en cumplir todos los términos de uso y condiciones de servicio detallados en nuestra política. El uso indebido resultará en suspensión de la cuenta.',
    },
    {
      icon: 'fa-shield-alt',
      color: '#39d98a',
      title: 'Política de Privacidad',
      text: 'Garantizamos la protección de tus datos. No almacenamos logs de actividad ni información de tráfico. Tu privacidad es nuestra prioridad.',
    },
    {
      icon: 'fa-ban',
      color: '#ef6573',
      title: 'Uso Prohibido',
      text: 'Está estrictamente prohibido el uso del servicio para actividades ilegales, spamming, ataques cibernéticos o cualquier violación de derechos de autor y propiedad intelectual.',
    },
    {
      icon: 'fa-sync-alt',
      color: '#f0a74b',
      title: 'Cambios Futuros',
      text: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos a los usuarios sobre cambios significativos. El uso continuo implica aceptación de las nuevas reglas.',
    },
  ];

  return (
    <section
      className="screen"
      style={{
        inset: 0,
        paddingTop: `calc(${statusBarHeight}px + 16px)`,
        paddingBottom: `calc(${navigationBarHeight}px + 16px)`,
      }}
    >
      <div className="pad" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="panel-title center" style={{ marginBottom: 20 }}>
          Términos de Uso y Política
        </div>

        <div className="terms-scroll" style={{ flex: 1, overflowY: 'auto', paddingRight: 2 }}>
          {termCards.map((card, i) => (
            <div key={i} className="info-card term-card" style={{ padding: 16, marginBottom: 12 }}>
              <div className="row" style={{ marginBottom: 8 }}>
                <i className={`fa ${card.icon}`} style={{ color: card.color, fontSize: 18 }} />
                <strong style={{ fontSize: 16 }}>{card.title}</strong>
              </div>
              <p className="muted" style={{ fontSize: 13 }}>{card.text}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: '18px 0 20px', borderTop: '1px solid rgba(255,255,255,.05)' }}>
          {!termsAccepted && (
            <Button variant="primary" onClick={handleAccept} className="full-width">
              ACEPTO LOS TÉRMINOS DE USO
            </Button>
          )}
          {termsAccepted && (
            <Button variant="primary" onClick={() => setScreen('home')} className="full-width">
              VOLVER
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
