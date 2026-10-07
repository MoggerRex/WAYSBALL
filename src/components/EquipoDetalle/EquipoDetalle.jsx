import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import "./EquipoDetalle.css";

function ArrowIcon({ back = false }) {
  return <svg aria-hidden="true" className="icon" fill="none" height="22" viewBox="0 0 24 24" width="22"><path d={back ? "m15 18-6-6 6-6" : "m9 6 6 6-6 6"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
}

export default function EquipoDetalle({ index, back, teams, profiles, galleryPhotos, playerPhotos }) {
  const team = teams[index];
  const profile = profiles[index];
  const [activePlayer, setActivePlayer] = useState(0);
  const player = profile.players[activePlayer];
  const changePlayer = (direction) => setActivePlayer((current) => (current + direction + profile.players.length) % profile.players.length);
  return <main className="detail-page">
    <button className="back-label" onClick={back}><ChevronLeft size={18} back /> Todos los equipos</button>
    <div className="team-hero" style={{ "--team-color": team.color }}>
      <img className="detail-team-logo" src={team.logo} alt="" />
      <div><span className="eyebrow light">Club {String(index + 1).padStart(2, "0")}</span><h1>{team.name}</h1><p>{team.city}</p></div>
    </div>
    <section className="team-story"><span className="eyebrow">Nuestra historia</span><h2>Historia del club</h2><p>{team.history}</p></section>
    <section className="detail-section stadium-section">
      <div className="detail-heading"><span className="eyebrow">Sede del club</span><h2>{team.stadium}</h2></div>
      <div className="stadium-feature"><img src={galleryPhotos[(index % 3) + 1]} alt={`Estadio y ambiente de beisbol de ${team.name}`} /><div className="capacity-badge"><strong>{profile.capacity}</strong><span>aficionados</span></div></div>
      <p>{profile.stadiumDetails}</p>
    </section>
    <section className="detail-section players-section">
      <div className="detail-heading"><span className="eyebrow">Figuras del club</span><h2>Tres nombres que dejaron huella</h2></div>
      <div className="player-carousel"><img src={playerPhotos[activePlayer]} alt="Jugador de beisbol en acción" /><div className="player-shade" /><div className="player-copy"><span>Figura {activePlayer + 1} de 3</span><h3>{player[0]}</h3><p>{player[1]}</p></div>
        <div className="carousel-controls"><button onClick={() => changePlayer(-1)} aria-label="Jugador anterior"><ArrowIcon back /></button><button onClick={() => changePlayer(1)} aria-label="Siguiente jugador"><ArrowIcon /></button></div>
      </div>
      <div className="carousel-dots">{profile.players.map((item, playerIndex) => <button aria-label={`Ver a ${item[0]}`} className={playerIndex === activePlayer ? "active" : ""} key={item[0]} onClick={() => setActivePlayer(playerIndex)} />)}</div>
    </section>
    <section className="detail-section achievements-section"><div className="detail-heading"><span className="eyebrow">Hazañas del club</span><h2>Momentos para la historia</h2></div>
      <div className="achievement-list">{profile.achievements.map((achievement, achievementIndex) => <article key={achievement}><span>{String(achievementIndex + 1).padStart(2, "0")}</span><p>{achievement}</p></article>)}</div>
    </section>
  </main>;
}