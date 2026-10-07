import { useState } from "react";
import {
  RotateCcw,
  Images,
  Camera,
  List,
  ListRestart,
  ArrowRight,
  X
} from "lucide-react";
import "./MenuHamburguesa.css";

export default function MenuHamburguesa({
  open,
  close,
  go,
  resetSeason,
  challenges,
  completedChallenges,
  pinnedChallenge,
  level
}) {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const objective = challenges[pinnedChallenge];

  const links = [
    { view: "historia", label: "Historia de la LMB", icon: RotateCcw },
    { view: "galeria", label: "Galería desbloqueable", icon: Images },
    { view: "ar", label: "Realidad aumentada", icon: Camera }
  ];

  const progress = `${(completedChallenges.length / challenges.length) * 100}%`;

  return (
    <div className={`menu-layer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="menu-scrim" onClick={close} aria-label="Cerrar menú" />
      <aside className="side-menu">
        <div className="menu-top">
          <button
            className="brand brand-button"
            onClick={() => {
              go("inicio");
              close();
            }}
            aria-label="Ir al inicio"
          >
            <span>WAYS</span>BALL
          </button>
          <button className="icon-button" onClick={close} aria-label="Cerrar menú">
            <X size={20} />
          </button>
        </div>

        <div className="season-card">
          <span className="eyebrow light">Mi temporada</span>
          <strong>Nivel {level}</strong>
          <div>
            <i style={{ width: progress }} />
          </div>
          <small>
            {completedChallenges.length} de {challenges.length} retos completados
          </small>
        </div>

        <nav>
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <button
                key={link.view}
                onClick={() => {
                  go(link.view);
                  close();
                }}
              >
                <LinkIcon size={18} />
                <span>{link.label}</span>
                <ArrowRight size={18} />
              </button>
            );
          })}
        </nav>

        <div className="objective-list">
          <span className="eyebrow">Objetivos</span>
          <div className="pinned-objective">
            <span>Reto {pinnedChallenge + 1}</span>
            <h3>{objective.title}</h3>
            <p>{objective.description}</p>
            <small>Desbloquea: {objective.reward}</small>
          </div>
        </div>

        <button
          className="collection-button"
          onClick={() => {
            go("retos");
            close();
          }}
        >
          <List size={20} />
          <span>
            <b>Lista de retos</b>
            <small>
              {completedChallenges.length} de {challenges.length} completados
            </small>
          </span>
          <ArrowRight size={18} />
        </button>

        <button
          className="reset-season-button"
          onClick={() => setShowResetConfirmation(true)}
        >
          <ListRestart size={18} /> Reiniciar temporada
        </button>
      </aside>

      {showResetConfirmation && (
        <div
          className="season-reset-layer"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reset-season-title"
        >
          <div className="season-reset-modal">
            <span className="eyebrow">Acción irreversible</span>
            <h2 id="reset-season-title">¿Reiniciar temporada?</h2>
            <p>
              Volverás a comenzar Waysball desde cero. Se borrará todo el progreso
              conseguido durante esta temporada.
            </p>

            <div className="season-reset-summary">
              <p><RotateCcw size={16} /> Nivel de temporada</p>
              <p><RotateCcw size={16} /> Estadísticas del minijuego</p>
              <p><Images size={16} /> Postales desbloqueadas</p>
              <p><List size={16} /> Retos completados</p>
            </div>

            <small>Esta acción no se puede deshacer.</small>

            <div className="season-reset-actions">
              <button
                className="primary-button full"
                onClick={() => {
                  resetSeason();
                  setShowResetConfirmation(false);
                  close();
                }}
              >
                Reiniciar <ListRestart size={18} />
              </button>
              <button
                className="modal-secondary-button"
                onClick={() => setShowResetConfirmation(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}