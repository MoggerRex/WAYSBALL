import { useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";
import Icon from "../Icon/Icon";
import "./Trivia.css";

export default function Trivia({ questions, teams, onComplete }) {
  const [clubIndex, setClubIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(5).fill(""));
  const [failedQuestions, setFailedQuestions] = useState(null);
  const [attemptFailed, setAttemptFailed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const clubQuestions = questions.slice(clubIndex * 5, clubIndex * 5 + 5);
  const answeredCount = selectedAnswers.filter(Boolean).length;

  const choose = (questionIndex, option) =>
    setSelectedAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? option : answer))
    );

  const retry = () => {
    setFailedQuestions(null);
    setSelectedAnswers(Array(5).fill(""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirm = () => {
    const failed = clubQuestions
      .map((question, index) => (selectedAnswers[index] === question.answer ? -1 : index))
      .filter((index) => index >= 0);

    if (failed.length) {
      setAttemptFailed(true);
      setFailedQuestions(failed);
      return;
    }

    onComplete(clubIndex, !attemptFailed);
    setShowSuccessModal(true);
  };

  const nextClub = () => {
    setShowSuccessModal(false);
    setClubIndex((current) => (current === teams.length - 1 ? 0 : current + 1));
    setSelectedAnswers(Array(5).fill(""));
    setAttemptFailed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="quiz-page">
      <div className="quiz-top">
        <span className="eyebrow light">Club actual</span>
        <strong>{clubQuestions[0].team}</strong>
        <div className="quiz-progress">
          <i style={{ width: `${answeredCount * 20}%` }} />
        </div>
        <div className="quiz-meta">
          <span>{answeredCount} de 5 respondidas</span>
          <span>Club {clubIndex + 1} de {teams.length}</span>
        </div>
        <p className="quiz-rule">Responde las cinco correctamente para avanzar.</p>
      </div>

      <section className="quiz-card">
        {clubQuestions.map((question, questionIndex) => (
          <article className="quiz-question" key={question.q}>
            <h2>{question.q}</h2>
            <div className="answers">
              {question.options.map((option, optionIndex) => (
                <button
                  className={`answer ${
                    selectedAnswers[questionIndex] === option ? "selected" : ""
                  }`}
                  key={option}
                  onClick={() => choose(questionIndex, option)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>
                  {option}
                </button>
              ))}
            </div>
          </article>
        ))}
        <button
          className="primary-button full confirm-pitch"
          disabled={answeredCount !== 5}
          onClick={confirm}
        >
          Confirmar lanzamiento <Icon name="check" />
        </button>
      </section>

      {/* Modal de Reintentar */}
      {failedQuestions && (
        <div className="quiz-modal-layer" role="alertdialog" aria-modal="true" aria-labelledby="quiz-error-title">
          <div className="quiz-modal">
            <span className="modal-mark">!</span>
            <span className="eyebrow">Entrada incompleta</span>
            <h2 id="quiz-error-title">
              Hay que volver<br />a intentarlo.
            </h2>
            <p>Fallaste en {failedQuestions.length === 1 ? "esta pregunta" : "estas preguntas"}:</p>
            <ul>
              {failedQuestions.map((questionIndex) => (
                <li key={questionIndex}>{clubQuestions[questionIndex].q}</li>
              ))}
            </ul>
            <button className="primary-button full" onClick={retry}>
              Reintentar <RefreshCw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Éxito */}
      {showSuccessModal && (
        <div className="quiz-modal-layer" role="dialog" aria-modal="true" aria-labelledby="quiz-success-title">
          <div className="quiz-modal">
            <span className="modal-mark success">✓</span>
            <span className="eyebrow">Club contestado correctamente</span>
            <h2 id="quiz-success-title">
              ¡Gran trabajo!<br />Entrada dominada.
            </h2>
            <p className="modal-description">
              Demostraste tu conocimiento respondiendo correctamente todas las preguntas de {clubQuestions[0].team}. ¡Sigue así para conquistar la liga!
            </p>
            <button className="primary-button full" onClick={nextClub}>
              Al siguiente club <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}