import { House, Users, CircleHelp, Gamepad2 } from "lucide-react";
import "./Footer.css";

const items = [
  { view: "inicio", label: "Inicio", icon: House },
  { view: "equipos", label: "Equipos", icon: Users },
  { view: "trivia", label: "Trivia", icon: CircleHelp },
  { view: "juego", label: "Juego", icon: Gamepad2 },
];

export default function Footer({ view, go }) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            className={view === item.view ? "active" : ""}
            key={item.view}
            onClick={() => go(item.view)}
          >
            <span className="footer-icon" aria-hidden="true">
              <IconComponent size={20} />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}