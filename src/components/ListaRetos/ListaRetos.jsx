import { Image, Pin, HelpCircle, Check, Images } from "lucide-react";
import "./ListaRetos.css";

export default function ListaRetos({
  challenges,
  completedChallenges,
  goGallery,
  viewPostcard,
  pinnedChallenge,
  pinChallenge
}) {
  return (
    <main className="challenges-page page">
      <div className="page-intro challenges-intro">
        <span className="eyebrow light">Progreso Waysball</span>
        <h1>
          Lista de<br />
          <em>retos.</em>
        </h1>
        <p>Completa cada desafío para revelar las postales de tu colección.</p>
        <div className="challenge-progress">
          <i
            style={{
              width: `${(completedChallenges.length / challenges.length) * 100}%`
            }}
          />
        </div>
        <small>
          {completedChallenges.length} de {challenges.length} completados
        </small>
      </div>

      <section className="challenge-list">
        {challenges.map((challenge, index) => {
          const completed = completedChallenges.includes(index);
          const isPinned = pinnedChallenge === index;

          return (
            <article className={completed ? "completed" : ""} key={challenge.title}>
              <div className="challenge-number">
                {completed ? (
                  <Check size={20} />
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </div>
              <div>
                <span>{completed ? "Completado" : `Reto ${index + 1}`}</span>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
                <small>
                  Desbloquea:{" "}
                  {completed ? challenge.reward : `Postal ${index + 1}`}
                </small>

                {completed && (
                  <button
                    className="primary-button challenge-postcard-button"
                    onClick={() => viewPostcard(index)}
                  >
                    Ver postal <Image size={18} />
                  </button>
                )}

                <button
                  className={`objective-button ${isPinned ? "active" : ""}`}
                  onClick={() => pinChallenge(index)}
                >
                  {isPinned ? <Pin size={16} /> : <HelpCircle size={16} />}
                  {isPinned ? "Objetivo activo" : "Marcar Objetivo"}
                </button>
              </div>
            </article>
          );
        })}

        <button className="primary-button full" onClick={goGallery}>
          Ver galería <Images size={18} />
        </button>
      </section>
    </main>
  );
}