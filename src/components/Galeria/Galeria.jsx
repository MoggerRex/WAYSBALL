import { useState } from "react";
import Icon from "../Icon/Icon";
import { Lock, Trash2, X } from "lucide-react";
import "./Galeria.css";

function formatPhotoDate(timestamp) {
  try {
    return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(timestamp));
  } catch {
    return "";
  }
}

export default function Galeria({
  galleryItems,
  completedChallenges,
  showChallenges,
  openDetail,
  photos,
  onDeletePhoto,
  goCamera,
}) {
  const [section, setSection] = useState("postales");
  const [openPhoto, setOpenPhoto] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const photoList = photos ?? [];
  const openPostcards = completedChallenges.length;
  const photoCountLabel = `${photoList.length} ${photoList.length === 1 ? "foto" : "fotos"}`;

  return (
    <main className="gallery-page page">
      <div className="page-intro gallery-intro">
        <span className="eyebrow light">Galería Waysball</span>
        {section === "postales" ? (
          <>
            <h1>Postales del<br /><em>diamante.</em></h1>
            <p>{openPostcards} de {galleryItems.length} recuerdos desbloqueados. Juega, aprende y vuelve para completar la colección.</p>
          </>
        ) : (
          <>
            <h1>Mis fotos<br /><em>del diamante.</em></h1>
            <p>
              {photoList.length === 0
                ? "Todavía no has tomado fotos. Entra a Realidad Aumentada y usa el botón de disparo."
                : `${photoCountLabel} tomadas en Realidad Aumentada. Toca una para verla en grande.`}
            </p>
          </>
        )}
        <div className="gallery-tabs" role="tablist" aria-label="Secciones de la galería">
          <button
            className={section === "postales" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={section === "postales"}
            onClick={() => setSection("postales")}
          >
            Postales
            <small>{openPostcards} de {galleryItems.length}</small>
          </button>
          <button
            className={section === "fotos" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={section === "fotos"}
            onClick={() => setSection("fotos")}
          >
            Mis fotos
            <small>{photoCountLabel}</small>
          </button>
        </div>
      </div>

      {section === "postales" ? (
        <div className="gallery-grid">{galleryItems.map((item, index) => {
          const isOpen = completedChallenges.includes(index);
          const isVideoPreview = index === 10 && Array.from({ length: 10 }, (_, challengeIndex) => challengeIndex).every((challengeIndex) => completedChallenges.includes(challengeIndex));
          const isAccessible = isOpen || isVideoPreview;
          return <button className={`gallery-card ${isAccessible ? "" : "locked"}`} key={item.title} onClick={() => isAccessible ? openDetail(index) : showChallenges(index)}>
            {item.type === "video" && item.video ? <video autoPlay={isAccessible} loop muted playsInline poster={item.image} src={isAccessible ? item.video : undefined} /> : <img src={item.image} alt={isOpen ? item.title : ""} />}
            {item.type === "video" && <span className="media-type">Video</span>}{!isAccessible && <div className="lock-screen"><Lock size={24} /><span>Reto {index + 1}</span><small>Detalles del reto</small></div>}
            <div className="gallery-caption"><span>WB · {String(index + 1).padStart(2, "0")}</span><strong>{isOpen ? item.title : isVideoPreview ? "Video especial" : "???"}</strong></div>
          </button>;
        })}</div>
      ) : photoList.length === 0 ? (
        <div className="photo-empty">
          <span className="photo-empty-icon"><Icon name="camera" size={28} /></span>
          <strong>Aún no hay fotos</strong>
          <p>Toma una foto en Realidad Aumentada con el botón de disparo y se guardará aquí automáticamente.</p>
          {goCamera && (
            <button className="primary-button" type="button" onClick={goCamera}>
              <Icon name="camera" size={18} /> Ir a Realidad Aumentada
            </button>
          )}
        </div>
      ) : (
        <div className="gallery-grid photo-grid">
          {photoList.map((photo) => (
            <button className="gallery-card photo-card" key={photo.id} type="button" onClick={() => { setOpenPhoto(photo); setConfirmDelete(false); }}>
              <img
                src={photo.dataUrl}
                alt={photo.teamName ? `Foto de ${photo.teamName} en realidad aumentada` : "Foto tomada en realidad aumentada"}
              />
              <div className="gallery-caption">
                <span>{formatPhotoDate(photo.createdAt)}</span>
                <strong>{photo.teamName || "Ballpark AR"}</strong>
              </div>
            </button>
          ))}
        </div>
      )}

      {openPhoto && (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Foto de la galería">
          <button className="photo-lightbox-close" type="button" onClick={() => { setOpenPhoto(null); setConfirmDelete(false); }} aria-label="Cerrar foto">
            <X size={20} />
          </button>
          <img
            src={openPhoto.dataUrl}
            alt={openPhoto.teamName ? `Foto de ${openPhoto.teamName} en realidad aumentada` : "Foto tomada en realidad aumentada"}
          />
          <div className="photo-lightbox-bar">
            <div>
              <strong>{openPhoto.teamName || "Ballpark AR"}</strong>
              <small>{formatPhotoDate(openPhoto.createdAt)}</small>
            </div>
            {onDeletePhoto && (
              <button
                className={`photo-delete ${confirmDelete ? "confirm" : ""}`}
                type="button"
                onClick={() => {
                  if (!confirmDelete) {
                    setConfirmDelete(true);
                    return;
                  }
                  onDeletePhoto(openPhoto.id);
                  setOpenPhoto(null);
                  setConfirmDelete(false);
                }}
              >
                <Trash2 size={16} /> {confirmDelete ? "¿Seguro?" : "Borrar"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
