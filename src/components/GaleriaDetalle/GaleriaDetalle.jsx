import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Icon from "../Icon/Icon";
import "./GaleriaDetalle.css";

const filters = ["none", "blur", "pixel", "thermal", "color", "smooth", "pastel", "saturation"];
const labels = { none: "Sin filtro", blur: "Desenfoque", pixel: "Pixelado", thermal: "Cámara térmica", color: "Ajuste de color", smooth: "Suavizado", pastel: "Colores pasteles", saturation: "Alta saturación" };

function PixelatedVideo({ src, poster, title }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    let frameId = 0;
    const draw = () => {
      if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
        context.imageSmoothingEnabled = false;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      frameId = window.requestAnimationFrame(draw);
    };
    draw();
    video.play().catch(() => setPlaying(false));
    return () => window.cancelAnimationFrame(frameId);
  }, [src]);
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };
  return <div className="pixel-video"><img src={poster} alt="" /><canvas ref={canvasRef} width="72" height="64" role="img" aria-label={`${title}, video pixelado`} />
    <video ref={videoRef} autoPlay crossOrigin="anonymous" loop muted playsInline poster={poster} src={src} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
    <button onClick={togglePlayback} aria-label={playing ? "Pausar video" : "Reproducir video"}><Icon name={playing ? "pause" : "game"} />{playing ? "Pausar" : "Reproducir"}</button>
  </div>;
}

export default function GaleriaDetalle({ item, index, back }) {
  const [activeFilter, setActiveFilter] = useState("none");
  const [color, setColor] = useState({ hue: 0, saturation: 100, contrast: 100 });
  const pixelatedSource = (source, width) => source.replace(/([?&])w=\d+/, `$1w=${width}`);
  const colorStyle = { "--filter-hue": `${color.hue}deg`, "--filter-saturation": `${color.saturation}%`, "--filter-contrast": `${color.contrast}%` };
  return <main className="gallery-detail"><button className="gallery-detail-back" onClick={back}><ChevronLeft size={18} /> Volver a la galería</button>
    <div className="gallery-detail-heading"><span className="eyebrow">Postal desbloqueada</span><h1>{item.title}</h1><p>{item.description}</p></div>
    <div className={`gallery-image-stage filter-stage-${activeFilter}`}>
      {item.type === "video" && item.video && activeFilter === "pixel" ? <PixelatedVideo src={item.video} poster={item.image} title={item.title} /> : item.type === "video" && item.video ? <video autoPlay className={`filter-${activeFilter}`} controls loop muted playsInline poster={item.image} src={item.video} style={activeFilter === "color" ? colorStyle : undefined} /> : <img className={`filter-${activeFilter}`} src={activeFilter === "pixel" ? pixelatedSource(item.image, 56) : item.image} alt={item.title} style={activeFilter === "color" ? colorStyle : undefined} />}
      <span>WB · {String(index + 1).padStart(2, "0")}</span>
    </div>
    <section className="filters-section"><div className="detail-heading"><span className="eyebrow">Edición</span><h2>Filtros</h2></div><p>Transforma tu postal con efectos visuales y ajustes de color.</p>
      <div className="filter-grid">{filters.map((filter) => <button className={activeFilter === filter ? "active" : ""} key={filter} onClick={() => setActiveFilter(filter)}><span><img className={`filter-${filter}`} src={filter === "pixel" ? pixelatedSource(item.image, 24) : item.image} alt="" style={filter === "color" ? colorStyle : undefined} /></span>{labels[filter]}</button>)}</div>
      {activeFilter === "color" && <div className="color-controls"><div className="color-controls-heading"><span>Ajuste manual</span><button onClick={() => setColor({ hue: 0, saturation: 100, contrast: 100 })}>Restablecer</button></div>
        {[["Tono", "hue", -180, 180, "°"], ["Saturación", "saturation", 50, 200, "%"], ["Contraste", "contrast", 75, 150, "%"]].map(([label, key, min, max, suffix]) => <label key={key}><span>{label} <strong>{color[key]}{suffix}</strong></span><input type="range" min={min} max={max} value={color[key]} onChange={(event) => setColor((current) => ({ ...current, [key]: Number(event.target.value) }))} /></label>)}
      </div>}
    </section>
  </main>;
}