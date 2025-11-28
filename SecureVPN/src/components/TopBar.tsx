import { useVpn } from '../context/VpnContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { screen, setScreen } = useVpn();

  const isSubScreen = screen !== 'home';

  const handleClick = () => {
    if (isSubScreen) {
      setScreen('home');
    } else {
      onMenuClick();
    }
  };

  return (
    <header className="topbar">
      {isSubScreen ? (
        <button className="btn hotzone" onClick={handleClick}>
          <i className="fa fa-arrow-left" /> Volver
        </button>
      ) : (
        <div className="dots hotzone" onClick={handleClick} aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      )}
      <div className="row">
        <span className="chip">👑 Suscribirse a un plan</span>
      </div>
    </header>
  );
}
