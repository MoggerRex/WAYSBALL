import { Menu, ChevronLeft } from "lucide-react";
import "./Header.css";

function Brand({ onClick }) {
  const wordmark = <><span>WAYS</span>BALL</>;
  return onClick ? (
    <button className="brand brand-button" onClick={onClick} aria-label="Ir al inicio">
      {wordmark}
    </button>
  ) : (
    <div className="brand" aria-label="Waysball">
      {wordmark}
    </div>
  );
}

export default function Header({ onMenu, onHome, isGame, level }) {
  return (
    <header className="topbar">
      <button
        className="icon-button"
        onClick={isGame ? onHome : onMenu}
        aria-label={isGame ? "Volver al inicio" : "Abrir menú"}
      >
        {isGame ? <ChevronLeft size={24} /> : <Menu size={24} />}
      </button>
      <Brand onClick={onHome} />
      <button
        className="avatar"
        onClick={onMenu}
        aria-label={`Ver progreso, nivel ${level}`}
      >
        {level}
      </button>
    </header>
  );
}