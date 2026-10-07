import "./Home.css";
import { ArrowRight } from "lucide-react";

export default function Home({ go }) {
  const shortcuts = [
    { view: "equipos", label: "Equipos" },
    { view: "trivia", label: "Trivia" },
    { view: "juego", label: "Minijuego" },
    { view: "historia", label: "Historia" },
  ];
  return <main className="mockup-home">
    <div className="home-shortcuts">
      {shortcuts.map((shortcut, index) => <button className={`home-shortcut shortcut-${index + 1}`} key={shortcut.view} onClick={() => go(shortcut.view)}>{shortcut.label}</button>)}
    </div>
    <button className="home-gallery-link" onClick={() => go("galeria")}>Galería desbloqueable <span aria-hidden="true"><ArrowRight size={16} /></span></button>
    <div className="home-signature">Waysball · Zona Norte · 2026</div>
  </main>;
}