import Icon from "../Icon/Icon";
import { Lock } from "lucide-react";
import "./Galeria.css";

export default function Galeria({ galleryItems, completedChallenges, showChallenges, openDetail }) {
  const openPostcards = completedChallenges.length;
  return <main className="gallery-page page"><div className="page-intro gallery-intro"><span className="eyebrow light">Galería Waysball</span><h1>Postales del<br /><em>diamante.</em></h1><p>{openPostcards} de {galleryItems.length} recuerdos desbloqueados. Juega, aprende y vuelve para completar la colección.</p></div>
    <div className="gallery-grid">{galleryItems.map((item, index) => {
      const isOpen = completedChallenges.includes(index);
      const isVideoPreview = index === 10 && Array.from({ length: 10 }, (_, challengeIndex) => challengeIndex).every((challengeIndex) => completedChallenges.includes(challengeIndex));
      const isAccessible = isOpen || isVideoPreview;
      return <button className={`gallery-card ${isAccessible ? "" : "locked"}`} key={item.title} onClick={() => isAccessible ? openDetail(index) : showChallenges()}>
        {item.type === "video" && item.video ? <video autoPlay={isAccessible} loop muted playsInline poster={item.image} src={isAccessible ? item.video : undefined} /> : <img src={item.image} alt={isOpen ? item.title : ""} />}
        {item.type === "video" && <span className="media-type">Video</span>}{!isAccessible && <div className="lock-screen"><Lock size={24} /><span>Reto {index + 1}</span><small>Detalles del reto</small></div>}
        <div className="gallery-caption"><span>WB · {String(index + 1).padStart(2, "0")}</span><strong>{isOpen ? item.title : isVideoPreview ? "Video especial" : "???"}</strong></div>
      </button>;
    })}</div>
  </main>;
}