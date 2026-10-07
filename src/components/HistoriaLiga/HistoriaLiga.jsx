import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import "./HistoriaLiga.css";

export default function HistoriaLiga({ galleryPhotos, playerPhotos, photo, onVisit }) {
  const [activeTournament, setActiveTournament] = useState(0);
  useEffect(() => onVisit(), [onVisit]);
  const timeline = [
    ["1925", "Nace la Liga Mexicana", "La liga se organizó en la Ciudad de México por impulso de Alejandro Aguilar Reyes y Ernesto Carmona. Su primera temporada reunió a cuatro clubes.", galleryPhotos[1]],
    ["1940s", "La era de Jorge Pasquel", "La inversión de los hermanos Pasquel atrajo figuras internacionales y convirtió a México en un centro ambicioso del beisbol profesional.", playerPhotos[0]],
    ["1955", "Beisbol organizado", "La LMB ingresó formalmente al sistema de Ligas Menores, fortaleciendo su estructura y relación con otros circuitos.", galleryPhotos[2]],
    ["1970", "Zonas Norte y Sur", "La expansión reorganizó el campeonato en dos zonas y consolidó nuevas rivalidades regionales.", galleryPhotos[3]],
    ["2025", "Un siglo de pelota", "Veinte organizaciones celebraron cien años de historias, estadios y generaciones de aficionados.", photo],
  ];
  const tournaments = [
    { name: "Temporada regular", label: "El camino", copy: "Los clubes compiten en las zonas Norte y Sur para definir a quienes avanzan a la postemporada.", image: galleryPhotos[1], prize: "Clasificación a playoffs" },
    { name: "Playoffs de zona", label: "La eliminación", copy: "Series directas deciden a los campeones del Norte y del Sur.", image: playerPhotos[2], prize: "Trofeo de campeón de zona" },
    { name: "Serie del Rey", label: "La gran final", copy: "Los campeones de ambas zonas disputan el título absoluto por la Copa Zaachila.", image: galleryPhotos[0], prize: "Copa Zaachila" },
    { name: "Juego de Estrellas", label: "La celebración", copy: "Las figuras más destacadas celebran el talento y la identidad del circuito.", image: playerPhotos[1], prize: "Reconocimientos individuales" },
  ];
  const moments = [
    ["1946", "Las estrellas llegan a México", "La liga reunió peloteros de élite de México, Cuba y Estados Unidos.", playerPhotos[1]],
    ["1964", "Comienza la leyenda de Héctor Espino", "El gran bateador mexicano se convirtió en referente del poder ofensivo.", playerPhotos[0]],
    ["1979", "Fernando antes de la Fernandomanía", "Fernando Valenzuela lanzó con los Leones de Yucatán antes de conquistar Grandes Ligas.", playerPhotos[2]],
    ["2021", "Una remontada imposible", "Toros de Tijuana revirtió una desventaja de 0–3 para ganar la Serie del Rey.", galleryPhotos[3]],
    ["2025", "La liga cumple cien años", "Clubes y aficionados conmemoraron un siglo de rivalidades y noches memorables.", galleryPhotos[0]],
  ];
  const tournament = tournaments[activeTournament];
  const cards = (entries) => <div className="league-timeline">{entries.map(([year, title, copy, image]) => <article className="league-timeline-item" key={year}><img src={image} alt="" /><div><span>{year}</span><h3>{title}</h3><p>{copy}</p></div></article>)}</div>;
  return <main className="history-page">
    <div className="league-hero"><img src="/history/lmb-logo.png" alt="" /><div><span className="eyebrow light">Liga Mexicana de Beisbol</span><h1>Cien años de<br /><em>pelota mexicana.</em></h1><p>Historia, campeones y momentos que viven más allá del diamante.</p></div></div>
    <section className="league-section"><div className="detail-heading"><span className="eyebrow">Historia</span><h2>El origen de una tradición</h2></div><p className="league-lead">La Liga Mexicana de Beisbol nació en 1925 en la Ciudad de México. Cronistas, empresarios y peloteros construyeron un campeonato profesional que pronto se extendió por distintas regiones del país.</p>{cards(timeline)}</section>
    <section className="league-section tournaments-section"><div className="detail-heading"><span className="eyebrow">Torneos y campeonatos</span><h2>El camino a la corona</h2></div>
      <div className="tournament-hero"><img src={tournament.image} alt="" /><div className="player-shade" /><div className="tournament-copy"><span>{tournament.label}</span><h3>{tournament.name}</h3><p>{tournament.copy}</p><strong>{tournament.prize}</strong></div>
        <div className="carousel-controls"><button onClick={() => setActiveTournament((value) => (value + tournaments.length - 1) % tournaments.length)} aria-label="Competición anterior"><Icon name="back" /></button><button onClick={() => setActiveTournament((value) => (value + 1) % tournaments.length)} aria-label="Siguiente competición"><Icon name="forward" /></button></div>
      </div><div className="carousel-dots">{tournaments.map((item, index) => <button aria-label={`Ver ${item.name}`} className={index === activeTournament ? "active" : ""} key={item.name} onClick={() => setActiveTournament(index)} />)}</div>
    </section>
    <section className="league-section actuality-section"><div className="detail-heading"><span className="eyebrow">Actualidad</span><h2>Una liga de todo México</h2></div><div className="actuality-image"><img src={galleryPhotos[2]} alt="Aficionados y jugadores durante un juego de beisbol" /></div><p className="league-lead">Hoy la LMB reúne a 20 organizaciones divididas entre las zonas Norte y Sur. Los estadios combinan tradición y nuevas experiencias.</p><p className="league-lead">La comunidad se construye en familia: porras, mascotas y generaciones enteras comparten los colores de sus clubes.</p><div className="league-stats"><div><strong>20</strong><span>clubes</span></div><div><strong>2</strong><span>zonas</span></div><div><strong>100+</strong><span>años</span></div></div></section>
    <section className="league-section moments-section"><div className="detail-heading"><span className="eyebrow">Momentos históricos</span><h2>Jugadas que se volvieron leyenda</h2></div>{cards(moments)}</section>
  </main>;
}