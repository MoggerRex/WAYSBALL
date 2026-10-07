import { useEffect, useMemo, useRef, useState } from "react";
import HeaderComponent from "./components/Header/Header";
import HomeComponent from "./components/Home/Home";
import FooterComponent from "./components/Footer/Footer";
import EquiposComponent from "./components/Equipos/Equipos";
import EquipoDetalleComponent from "./components/EquipoDetalle/EquipoDetalle";
import TriviaComponent from "./components/Trivia/Trivia";
import HistoriaLigaComponent from "./components/HistoriaLiga/HistoriaLiga";
import ListaRetosComponent from "./components/ListaRetos/ListaRetos";
import MenuHamburguesaComponent from "./components/MenuHamburguesa/MenuHamburguesa";
import GaleriaComponent from "./components/Galeria/Galeria";
import GaleriaDetalleComponent from "./components/GaleriaDetalle/GaleriaDetalle";
import RealidadAumentadaComponent from "./components/RealidadAumentada/RealidadAumentada";
import MiniJuegoComponent from "./components/MiniJuego/MiniJuego";
import "./App.css";

/* ===== CONFIGURACIÓN DE RUTAS: Home, Header, Footer y pantallas ===== */
type View = "inicio" | "equipos" | "trivia" | "ar" | "juego" | "historia" | "galeria" | "retos";

type IconName =
  | "home"
  | "teams"
  | "quiz"
  | "camera"
  | "game"
  | "history"
  | "gallery"
  | "menu"
  | "back"
  | "forward"
  | "arrow"
  | "lock"
  | "check"
  | "pause";

type GalleryItem = {
  title: string;
  description: string;
  image: string;
  type: "image" | "video";
  video?: string;
};

/* ===== DATOS COMPARTIDOS: EquipoDetalle, HistoriaLiga, Galeria y AR ===== */
const photo =
  "https://images.unsplash.com/photo-1784657258179-27f2e692b62e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const galleryPhotos = [
  photo,
  "https://images.unsplash.com/photo-1787762001721-0f30c8b6af94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1785067728397-53c3a4dd5ee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1778050203444-90920c7a5652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1529768167801-9173d94c2a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1591444539769-2518e73d1090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1489460427746-b6296f4bc3f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1624375664562-fff61869fe8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1434854775064-aa2c72a4aa32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1654094706120-be054b9ef237?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
];
/* ===== FIN DE FOTOS COMPARTIDAS ===== */

/* ===== DATOS DE EQUIPOS: Equipos, EquipoDetalle, Trivia y AR ===== */
const teams = [
  {
    name: "Acereros de Monclova",
    city: "Monclova, Coahuila",
    short: "AM",
    logo: "/logos/acereros.png",
    color: "#ef4f3c",
    stadium: "Estadio Kickapoo Lucky Eagle",
    founded: "1974",
    titles: "Campeón LMB 2019",
    history:
      "La Furia Azul representa la tradición industrial de Monclova. Desde su llegada a la liga en 1974, el club ha construido una afición intensa y celebró su primer campeonato en 2019.",
  },  
  {
    name: "Caliente de Durango",
    city: "Durango, Durango",
    short: "CD",
    logo: "/logos/caliente.png",
    color: "#ee3324",
    stadium: "Estadio Francisco Villa",
    founded: "2024",
    titles: "Nueva era",
    history:
      "La franquicia abrió una nueva etapa para el beisbol profesional de Durango en 2024, llevando una identidad contemporánea al histórico parque Francisco Villa.",
  },
  {
    name: "Charros de Jalisco",
    city: "Zapopan, Jalisco",
    short: "CJ",
    logo: "/logos/charros.png",
    color: "#e7b32c",
    stadium: "Estadio Panamericano",
    founded: "1946",
    titles: "2 campeonatos LMB",
    history:
      "Los Charros son un símbolo deportivo de Jalisco. Su historia en la LMB atraviesa distintas épocas y conecta la tradición charra con una de las aficiones más reconocibles del país.",
  }, 
  {
    name: "Dorados de Chihuahua",
    city: "Chihuahua, Chihuahua",
    short: "DC",
    logo: "/logos/dorados.png",
    color: "#c99b37",
    stadium: "Estadio Monumental",
    founded: "2024",
    titles: "Regreso a la LMB",
    history:
      "Chihuahua recuperó su lugar en el máximo circuito de verano con el regreso de los Dorados, una franquicia que recoge décadas de pasión beisbolera en el estado grande.",
  },
  {
    name: "Sultanes de Monterrey",
    city: "Monterrey, Nuevo León",
    short: "SM",
    logo: "/logos/sultanes.png",
    color: "#3156a4",
    stadium: "Estadio Mobil Super",
    founded: "1939",
    titles: "10 campeonatos",
    history:
      "Fundados como Carta Blanca en 1939, los Sultanes son una de las instituciones más ganadoras y longevas de la LMB. Monterrey respira beisbol en cada serie.",
  },
  {
    name: "Rieleros de Aguascalientes",
    city: "Aguascalientes, Ags.",
    short: "RA",
    logo: "/logos/rieleros.png",
    color: "#cf3339",
    stadium: "Parque Alberto Romo Chávez",
    founded: "1975",
    titles: "Campeón LMB 1978",
    history:
      "Inspirados por la tradición ferroviaria de Aguascalientes, los Rieleros debutaron en 1975 y conquistaron la liga apenas tres años después, en una temporada inolvidable.",
  },  
  {
    name: "Algodoneros Unión Laguna",
    city: "Torreón, Coahuila",
    short: "UL",
    logo: "/logos/algodoneros.png",
    color: "#7d2441",
    stadium: "Estadio Revolución",
    founded: "1940",
    titles: "2 campeonatos",
    history:
      "Uno de los nombres históricos del beisbol lagunero. Su identidad nace del algodón, motor regional, y de una afición que convirtió al Estadio Revolución en una plaza legendaria.",
  }, 
  {
    name: "Saraperos de Saltillo",
    city: "Saltillo, Coahuila",
    short: "SS",
    logo: "/logos/saraperos.png",
    color: "#19854b",
    stadium: "Estadio Francisco I. Madero",
    founded: "1970",
    titles: "3 campeonatos",
    history:
      "El Sarape es una de las identidades más queridas de la zona norte. El club debutó en 1970 y ha bordado una historia de campeonatos, rivalidades y noches memorables.",
  },

  {
    name: "Tecolotes de los Dos Laredos",
    city: "Nuevo Laredo y Laredo",
    short: "TL",
    logo: "/logos/tecolotes.png",
    color: "#39a9c9",
    stadium: "Parque La Junta / Uni-Trade",
    founded: "1940",
    titles: "5 campeonatos",
    history:
      "El único club binacional del beisbol profesional juega en México y Estados Unidos. Los Tecolotes representan una frontera unida por la pelota desde 1940.",
  },
  {
    name: "Toros de Tijuana",
    city: "Tijuana, Baja California",
    short: "TT",
    logo: "/logos/toros.png",
    color: "#bd1e2d",
    stadium: "Estadio Chevron",
    founded: "2004",
    titles: "2 campeonatos",
    history:
      "Los Toros encarnan la energía de Tijuana. Con una historia moderna y competitiva, conquistaron la Copa Zaachila en 2017 y 2021.",
  },
];

/* ===== FIN DE DATOS DE EQUIPOS ===== */

/* ===== DATOS DE JUGADORES: EquipoDetalle e HistoriaLiga ===== */
const playerPhotos = [
  "https://images.unsplash.com/photo-1529768167801-9173d94c2a42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1591444539769-2518e73d1090?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1489460427746-b6296f4bc3f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
];
/* ===== FIN DE DATOS DE JUGADORES ===== */

/* ===== DATOS DE POSTALES: Galeria y GaleriaDetalle (índice 10 = postal 11) ===== */
const galleryItems: GalleryItem[] = [
  { title: "Noche de serie", description: "Las luces se encienden y el diamante se convierte en el punto de encuentro de toda una ciudad." },
  { title: "Bajo las luces", description: "Una postal del juego nocturno, cuando cada lanzamiento se vive con máxima intensidad." },
  { title: "Novena entrada", description: "Los últimos outs concentran la estrategia, la tensión y la esperanza de la tribuna." },
  { title: "Casa llena", description: "Miles de voces forman una sola porra alrededor del terreno de juego." },
  { title: "El turno", description: "Bateador y pitcher se enfrentan en el duelo que define cada jugada." },
  { title: "Desde la lomita", description: "Control, velocidad y precisión antes de que la pelota viaje hacia el plato." },
  { title: "Recta al plato", description: "El lanzamiento rompe el silencio en una fracción de segundo." },
  { title: "Poder al bat", description: "El instante exacto en que el swing transforma un lanzamiento en espectáculo." },
  { title: "Último out", description: "Una jugada final puede cerrar la noche y convertirse en recuerdo para siempre." },
  { title: "Guardia del plato", description: "Concentración absoluta antes de buscar el lanzamiento perfecto para conectar." },
].map((item, index) => ({ ...item, image: galleryPhotos[index], type: "image" as const }));

galleryItems.push(
  {
    title: "Movimiento en la lomita",
    description: "La mecánica completa de un pitcher, desde la preparación hasta soltar la pelota rumbo al plato.",
    image: galleryPhotos[5],
    type: "video",
    video: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Hyun-jin_Ryu_Pitching_motion.webm",
  },
  {
    title: "El lanzamiento",
    description: "Una entrega rápida capturada desde el inicio del movimiento hasta el final de la jugada.",
    image: galleryPhotos[6],
    type: "video",
    video: "https://upload.wikimedia.org/wikipedia/commons/3/34/Steven_Brault%27s_delivery.webm",
  },
);
/* ===== FIN DE DATOS DE POSTALES ===== */

/* ===== TEXTOS Y RECOMPENSAS: ListaRetos y MenuHamburguesa ===== */
const challenges = [
  { title: "Primera entrada", description: "Explora la ficha completa de tu primer equipo de la Zona Norte.", reward: "Noche de serie" },
  { title: "Racha perfecta", description: "Responde correctamente las cinco preguntas de un club en un solo intento.", reward: "Bajo las luces" },
  { title: "Bateador novato", description: "Consigue 500 puntos en el minijuego Home Run Norte.", reward: "Novena entrada" },
  { title: "Explorador del norte", description: "Visita las fichas de cinco equipos diferentes.", reward: "Casa llena" },
  { title: "Conocedor de la liga", description: "Completa los bloques de trivia de tres clubes.", reward: "El turno" },
  { title: "Marcador encontrado", description: "Activa la cámara y entra al modo de realidad aumentada.", reward: "Desde la lomita" },
  { title: "Un siglo de historia", description: "Recorre la historia, torneos y momentos legendarios de la LMB.", reward: "Recta al plato" },
  { title: "Gran coleccionista", description: "Completa siete retos y abre sus respectivas postales.", reward: "Poder al bat" },
  { title: "Temporada perfecta", description: "Supera la trivia de los diez clubes de la Zona Norte.", reward: "Último out" },
  { title: "Guardia del plato", description: "Alcanza una puntuación de 1,000 puntos en el minijuego.", reward: "Guardia del plato" },
  { title: "Puntaje de 1500", description: "Alcanza una puntuación de 1500 puntos en el minijuego.", reward: "Movimiento en la lomita" },
  { title: "Archivo Waysball", description: "Completa los once retos anteriores y termina toda la colección.", reward: "El lanzamiento" },
];

const initialCompletedChallenges: number[] = [];
/* ===== FIN DE RETOS: ListaRetos y MenuHamburguesa ===== */

/* ===== PERFILES DE CLUB: EquipoDetalle ===== */
const clubProfiles = [
  {
    capacity: "8,500",
    stadiumDetails: "Un parque compacto y ruidoso, renovado para acercar a la afición a cada jugada y aprovechar la intensidad de las noches de Monclova.",
    players: [["Chris Carter", "Bateador de poder"], ["Josh Lowey", "Pitcher histórico"], ["Erick Aybar", "Infielder estelar"]],
    achievements: ["Primer campeonato de LMB en 2019", "Campeón de la Zona Norte en 2019", "Una de las ofensivas más poderosas de su época"],
  },
  {
    capacity: "7,689",
    stadiumDetails: "Inaugurado en 1932, el Estadio Revolución es uno de los escenarios más antiguos y reconocibles del beisbol mexicano.",
    players: [["Martín Dihigo", "Leyenda histórica"], ["Jonathan Villar", "Infielder"], ["Nick Torres", "Bateador de poder"]],
    achievements: ["Campeonatos de liga en 1942 y 1950", "Una de las franquicias fundadoras del norte", "Regreso a una Serie del Rey en 2023"],
  },
  {
    capacity: "4,983",
    stadiumDetails: "El Francisco Villa combina la tradición deportiva de Durango con una atmósfera cercana, donde cada tribuna se siente junto al diamante.",
    players: [["Alberth Martínez", "Outfielder"], ["Tiago da Silva", "Pitcher"], ["Michael Robles", "Infielder"]],
    achievements: ["Debut de la nueva franquicia en 2024", "Regreso del beisbol de verano a Durango", "Construcción de una nueva identidad deportiva"],
  },
  {
    capacity: "16,500",
    stadiumDetails: "El Estadio Panamericano es un recinto moderno y versátil que ha recibido torneos internacionales y grandes noches del beisbol jalisciense.",
    players: [["Fernando Valenzuela", "Pitcher legendario"], ["Benjamín Gil", "Infielder y manager"], ["Japhet Amador", "Bateador de poder"]],
    achievements: ["Campeón de LMB en 1967 y 1971", "Protagonista histórico del beisbol de Jalisco", "Regreso al circuito de verano en 2024"],
  },
  {
    capacity: "14,500",
    stadiumDetails: "El Monumental es uno de los parques más amplios del norte; sus grandes jardines y gradas abiertas reflejan la escala deportiva de Chihuahua.",
    players: [["Félix Doubront", "Pitcher abridor"], ["Sebastián Elizalde", "Outfielder"], ["Octavio Acosta", "Pitcher"]],
    achievements: ["Regreso de Chihuahua a la LMB en 2024", "Herencia de una de las regiones más beisboleras", "Consolidación de una nueva afición en el norte"],
  },
  {
    capacity: "6,496",
    stadiumDetails: "El parque Alberto Romo Chávez conserva el carácter clásico de la liga: tribunas próximas, ambiente familiar y una vista directa del terreno.",
    players: [["Derek Bryant", "Bateador histórico"], ["Saúl Soto", "Catcher y referente"], ["Ramón Ramírez", "Pitcher"]],
    achievements: ["Campeón de la LMB en 1978", "Una de las remontadas más recordadas de la liga", "Más de cinco décadas de tradición ferroviaria"],
  },
  {
    capacity: "12,000",
    stadiumDetails: "El Francisco I. Madero es famoso por el color de su afición y una atmósfera que convierte cada serie en una celebración de Saltillo.",
    players: [["Andrés Mora", "Bateador legendario"], ["Miguel Flores", "Capitán histórico"], ["Mario Mendoza", "Infielder"]],
    achievements: ["Bicampeonato en 2009 y 2010", "Campeonato de liga en 1980", "Una de las aficiones más constantes del circuito"],
  },
  {
    capacity: "21,803",
    stadiumDetails: "El Estadio Mobil Super es uno de los parques más grandes de México, con graderíos de gran escala y una atmósfera única en juegos nocturnos.",
    players: [["Héctor Espino", "Máximo símbolo"], ["Vinicio Castilla", "Tercera base"], ["Ramiro Peña", "Infielder y capitán"]],
    achievements: ["Diez campeonatos de la Liga Mexicana", "Franquicia activa desde 1939", "Referente histórico del beisbol del norte"],
  },
  {
    capacity: "5,000 / 6,000",
    stadiumDetails: "La franquicia juega en dos países: el histórico Parque La Junta en Nuevo Laredo y el Uni-Trade Stadium en Laredo, Texas.",
    players: [["Alejandro Ortiz", "Bateador histórico"], ["Balbino Fuenmayor", "Primera base"], ["Kennys Vargas", "Bateador de poder"]],
    achievements: ["Cinco campeonatos de la LMB", "Único equipo profesional binacional", "Una historia fronteriza que comenzó en 1940"],
  },
  {
    capacity: "17,000",
    stadiumDetails: "El Estadio Chevron combina grandes tribunas, zona de bullpen visible y una de las experiencias de juego más intensas de la frontera.",
    players: [["Gabriel Gutiérrez", "Catcher histórico"], ["Junior Lake", "Outfielder"], ["Fernando Rodney", "Pitcher cerrador"]],
    achievements: ["Campeón de la LMB en 2017 y 2021", "Remontada histórica en la Serie del Rey 2021", "Protagonista constante de la Zona Norte"],
  },
];
/* ===== FIN DE PERFILES DE CLUB ===== */

/* ===== PREGUNTAS: Trivia ===== */
const answerSet = (correct: string, alternatives: string[]) => [
  correct,
  ...Array.from(new Set(alternatives.filter((option) => option !== correct))).slice(0, 3),
];

const questionTemplates = [
  (team: (typeof teams)[number]) => ({
    q: `¿En qué ciudad juegan los ${team.name}?`,
    options: answerSet(team.city, teams.map((club) => club.city)),
    answer: team.city,
  }),
  (team: (typeof teams)[number]) => ({
    q: `¿Cuál es la casa de los ${team.name}?`,
    options: answerSet(team.stadium, teams.map((club) => club.stadium)),
    answer: team.stadium,
  }),
  (team: (typeof teams)[number]) => ({
    q: `¿En qué año comenzó la historia de ${team.name}?`,
    options: answerSet(team.founded, teams.map((club) => club.founded)),
    answer: team.founded,
  }),
  (team: (typeof teams)[number]) => ({
    q: `¿Qué dato pertenece a ${team.name}?`,
    options: answerSet(team.titles, teams.map((club) => club.titles)),
    answer: team.titles,
  }),
  (team: (typeof teams)[number]) => ({
    q: `¿Qué siglas identifican a ${team.name} en Waysball?`,
    options: answerSet(team.short, teams.map((club) => club.short)),
    answer: team.short,
  }),
];

const questions = teams.flatMap((team, teamIndex) =>
  questionTemplates.map((template, questionIndex) => {
    const question = template(team);
    const shift = (teamIndex + questionIndex) % question.options.length;
    return {
      ...question,
      options: [...question.options.slice(shift), ...question.options.slice(0, shift)],
      team: team.name,
    };
  }),
);
/* ===== FIN DE PREGUNTAS: Trivia ===== */

/* ===== MARCADORES: RealidadAumentada ===== */
const suppliedMarkers: Record<string, string> = {
  "Acereros de Monclova": "/markers/acereros.png",
  "Caliente de Durango": "/markers/caliente.jpg",
  "Charros de Jalisco": "/markers/charros.png",
};
/* ===== FIN DE MARCADORES: RealidadAumentada ===== */

/* ===== HELPERS ANTIGUOS DE AR INLINE: la versión activa está en RealidadAumentada.jsx ===== */
let openCvPromise: Promise<any> | null = null;

function loadOpenCv() {
  const browserWindow = window as typeof window & { cv?: any; Module?: Record<string, unknown> };
  if (browserWindow.cv?.Mat) return Promise.resolve(browserWindow.cv);
  if (openCvPromise) return openCvPromise;
  openCvPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("OpenCV tardó demasiado en cargar")), 25000);
    const ready = () => {
      window.clearTimeout(timeout);
      resolve(browserWindow.cv);
    };
    browserWindow.Module = { onRuntimeInitialized: ready };
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-opencv]");
    if (existingScript) {
      existingScript.addEventListener("error", () => reject(new Error("No se pudo cargar OpenCV")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.dataset.opencv = "true";
    script.src = "https://docs.opencv.org/4.10.0/opencv.js";
    script.onerror = () => reject(new Error("No se pudo cargar OpenCV"));
    document.head.appendChild(script);
  });
  return openCvPromise;
}

function loadMarkerImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo preparar ${src}`));
    image.src = src;
  });
}

/* ===== FIN DE HELPERS ANTIGUOS DE AR INLINE ===== */

/* ===== SPLASH ACTIVO DE APP: Brand y BaseballGraphic se usan solo aquí ===== */
function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    teams: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M15 14c3.5 0 5 2 5 5" /></>,
    quiz: <><path d="M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 2" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></>,
    camera: <><path d="M4 7h4l2-3h4l2 3h4v12H4z" /><circle cx="12" cy="13" r="4" /></>,
    game: <><path d="M8 8h8a5 5 0 0 1 4.7 6.7l-1 2.8a2.5 2.5 0 0 1-4.2.8L14 17h-4l-1.5 1.3a2.5 2.5 0 0 1-4.2-.8l-1-2.8A5 5 0 0 1 8 8Z" /><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01" /></>,
    history: <><path d="M4 5v5h5" /><path d="M5.5 9A8 8 0 1 1 4 15" /><path d="M12 7v5l3 2" /></>,
    gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 18 5-5 3 3 2-2 6 5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    forward: <><path d="m9 6 6 6-6 6" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    pause: <><path d="M9 6v12M15 6v12" /></>,
  };
  return (
    <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</g>
    </svg>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  const wordmark = <><span>WAYS</span>BALL</>;
  if (onClick) {
    return <button className="brand brand-button" onClick={onClick} aria-label="Ir al inicio">{wordmark}</button>;
  }
  return <div className="brand" aria-label="Waysball">{wordmark}</div>;
}

function BaseballGraphic({ className = "" }: { className?: string }) {
  return <img
    aria-hidden="true"
    alt=""
    className={`baseball-graphic ${className}`}
    src="/BaseballIntro/Pelota%20Beisbol.png"
  />;
}

function SplashScreen() {
  return (
    <div className="splash-screen" aria-label="Cargando Waysball">
      <Brand />
      <BaseballGraphic className="splash-ball" />
    </div>
  );
}

/* ===== FIN DE SPLASH ACTIVO ===== */

/* ===== COMPONENTES INLINE ANTIGUOS (NO SE RENDERIZAN) =====
   Las vistas activas viven en src/components/<Componente>/<Componente>.jsx.
   Este bloque se conserva temporalmente; editar las rutas activas de abajo o esos módulos.
*/
function Header({
  onMenu,
  onHome,
  isGame,
  level,
}: {
  onMenu: () => void;
  onHome: () => void;
  isGame: boolean;
  level: number;
}) {
  return (
    <header className="topbar">
      <button className="icon-button" onClick={isGame ? onHome : onMenu} aria-label={isGame ? "Volver al inicio" : "Abrir menú"}>
        <Icon name={isGame ? "back" : "menu"} />
      </button>
      <Brand onClick={onHome} />
      <button className="avatar" onClick={onMenu} aria-label={`Ver progreso, nivel ${level}`}>{level}</button>
    </header>
  );
}

function Home({ go }: { go: (view: View) => void }) {
  const shortcuts: { view: View; label: string }[] = [
    { view: "equipos", label: "Equipos" },
    { view: "trivia", label: "Trivia" },
    { view: "juego", label: "Minijuego" },
    { view: "historia", label: "Historia" },
  ];
  return (
    <main className="mockup-home">
      <div className="home-shortcuts">
        {shortcuts.map((shortcut, index) => (
          <button
            className={`home-shortcut shortcut-${index + 1}`}
            key={shortcut.view}
            onClick={() => go(shortcut.view)}
          >
            {shortcut.label}
          </button>
        ))}
      </div>
      <button className="home-gallery-link" onClick={() => go("galeria")}>
        Galería desbloqueable <Icon name="arrow" />
      </button>
      <div className="home-signature">Waysball · Zona Norte · 2026</div>
    </main>
  );
}

function Teams({ select }: { select: (index: number) => void }) {
  return (
    <main className="page">
      <div className="page-intro">
        <span className="eyebrow light">Roster · Zona Norte</span>
        <h1>Diez ciudades.<br /><em>Una pasión.</em></h1>
        <p>Conoce la identidad, el estadio y las hazañas de cada club.</p>
      </div>
      <div className="team-list">
        {teams.map((team, index) => (
          <button
            className="team-row"
            onClick={() => select(index)}
            key={team.name}
            style={{
              "--team-color": team.color,
              "--team-logo": `url("${team.logo}")`,
            } as React.CSSProperties}
          >
            <span className="team-name"><strong>{team.name}</strong><small>{team.city}</small></span>
            <Icon name="arrow" />
          </button>
        ))}
      </div>
    </main>
  );
}

function TeamDetail({ index, back }: { index: number; back: () => void }) {
  const team = teams[index];
  const profile = clubProfiles[index];
  const [activePlayer, setActivePlayer] = useState(0);
  const player = profile.players[activePlayer];
  const changePlayer = (direction: number) => {
    setActivePlayer((current) => (current + direction + profile.players.length) % profile.players.length);
  };
  return (
    <main className="detail-page">
      <button className="back-label" onClick={back}><Icon name="back" /> Todos los equipos</button>
      <div className="team-hero" style={{ "--team-color": team.color } as React.CSSProperties}>
        <img className="detail-team-logo" src={team.logo} alt="" />
        <div><span className="eyebrow light">Club {String(index + 1).padStart(2, "0")}</span><h1>{team.name}</h1><p>{team.city}</p></div>
      </div>
      <section className="team-story">
        <span className="eyebrow">Nuestra historia</span>
        <h2>Historia del club</h2>
        <p>{team.history}</p>
      </section>

      <section className="detail-section stadium-section">
        <div className="detail-heading">
          <span className="eyebrow">Sede del club</span>
          <h2>{team.stadium}</h2>
        </div>
        <div className="stadium-feature">
          <img src={galleryPhotos[(index % 3) + 1]} alt={`Estadio y ambiente de beisbol de ${team.name}`} />
          <div className="capacity-badge"><strong>{profile.capacity}</strong><span>aficionados</span></div>
        </div>
        <p>{profile.stadiumDetails}</p>
      </section>

      <section className="detail-section players-section">
        <div className="detail-heading">
          <span className="eyebrow">Figuras del club</span>
          <h2>Tres nombres que dejaron huella</h2>
        </div>
        <div className="player-carousel">
          <img src={playerPhotos[activePlayer]} alt="Jugador de beisbol en acción" />
          <div className="player-shade" />
          <div className="player-copy">
            <span>Figura {activePlayer + 1} de 3</span>
            <h3>{player[0]}</h3>
            <p>{player[1]}</p>
          </div>
          <div className="carousel-controls">
            <button onClick={() => changePlayer(-1)} aria-label="Jugador anterior"><Icon name="back" /></button>
            <button onClick={() => changePlayer(1)} aria-label="Siguiente jugador"><Icon name="forward" /></button>
          </div>
        </div>
        <div className="carousel-dots">
          {profile.players.map((item, playerIndex) => (
            <button
              aria-label={`Ver a ${item[0]}`}
              className={playerIndex === activePlayer ? "active" : ""}
              key={item[0]}
              onClick={() => setActivePlayer(playerIndex)}
            />
          ))}
        </div>
      </section>

      <section className="detail-section achievements-section">
        <div className="detail-heading">
          <span className="eyebrow">Hazañas del club</span>
          <h2>Momentos para la historia</h2>
        </div>
        <div className="achievement-list">
          {profile.achievements.map((achievement, achievementIndex) => (
            <article key={achievement}>
              <span>{String(achievementIndex + 1).padStart(2, "0")}</span>
              <p>{achievement}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Trivia({ onComplete }: { onComplete: (clubIndex: number, perfectAttempt: boolean) => void }) {
  const [clubIndex, setClubIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(5).fill(""));
  const [failedQuestions, setFailedQuestions] = useState<number[] | null>(null);
  const [attemptFailed, setAttemptFailed] = useState(false);
  const clubQuestions = questions.slice(clubIndex * 5, clubIndex * 5 + 5);
  const answeredCount = selectedAnswers.filter(Boolean).length;
  const choose = (questionIndex: number, option: string) => {
    setSelectedAnswers((current) =>
      current.map((answer, index) => index === questionIndex ? option : answer),
    );
  };
  const confirm = () => {
    const failed = clubQuestions
      .map((question, index) => selectedAnswers[index] === question.answer ? -1 : index)
      .filter((index) => index >= 0);
    if (failed.length) {
      setAttemptFailed(true);
      setFailedQuestions(failed);
      return;
    }
    onComplete(clubIndex, !attemptFailed);
    setClubIndex((current) => current === teams.length - 1 ? 0 : current + 1);
    setSelectedAnswers(Array(5).fill(""));
    setAttemptFailed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const retry = () => {
    setFailedQuestions(null);
    setSelectedAnswers(Array(5).fill(""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <main className="quiz-page">
      <div className="quiz-top">
        <span className="eyebrow light">Club actual</span><strong>{clubQuestions[0].team}</strong>
        <div className="quiz-progress"><i style={{ width: `${(answeredCount / 5) * 100}%` }} /></div>
        <div className="quiz-meta"><span>{answeredCount} de 5 respondidas</span><span>Club {clubIndex + 1} de 10</span></div>
        <p className="quiz-rule">Responde las cinco correctamente para avanzar.</p>
      </div>
      <section className="quiz-card">
        {clubQuestions.map((question, questionIndex) => (
          <article className="quiz-question" key={question.q}>
            <h2>{question.q}</h2>
            <div className="answers">
              {question.options.map((option, optionIndex) => (
                <button
                  className={`answer ${selectedAnswers[questionIndex] === option ? "selected" : ""}`}
                  key={option}
                  onClick={() => choose(questionIndex, option)}
                >
                  <span>{String.fromCharCode(65 + optionIndex)}</span>{option}
                </button>
              ))}
            </div>
          </article>
        ))}
        <button className="primary-button full confirm-pitch" disabled={answeredCount !== 5} onClick={confirm}>
          Confirmar lanzamiento <Icon name="check" />
        </button>
      </section>
      {failedQuestions && (
        <div className="quiz-modal-layer" role="alertdialog" aria-modal="true" aria-labelledby="quiz-error-title">
          <div className="quiz-modal">
            <span className="modal-mark">!</span>
            <span className="eyebrow">Entrada incompleta</span>
            <h2 id="quiz-error-title">Hay que volver<br />a intentarlo.</h2>
            <p>Fallaste en {failedQuestions.length === 1 ? "esta pregunta" : "estas preguntas"}:</p>
            <ul>
              {failedQuestions.map((questionIndex) => (
                <li key={questionIndex}>{clubQuestions[questionIndex].q}</li>
              ))}
            </ul>
            <button className="primary-button full" onClick={retry}>
              Reintentar <Icon name="history" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ARView({ unlock }: { unlock: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [camera, setCamera] = useState<"idle" | "active" | "error">("idle");
  const [recognitionStatus, setRecognitionStatus] = useState<"idle" | "loading" | "scanning" | "error">("idle");
  const [recognizedTeam, setRecognizedTeam] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const rewardedRef = useRef(false);
  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCamera("active");
    } catch {
      setCamera("error");
    }
  };
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);
  useEffect(() => {
    if (camera !== "active") return;
    let cancelled = false;
    let scanTimer = 0;
    let cv: any;
    let orb: any;
    let matcher: any;
    let mask: any;
    let markerDescriptors: Array<{ teamIndex: number; descriptors: any }> = [];
    let stableCandidate = -1;
    let stableFrames = 0;
    let missedFrames = 0;

    const prepareDescriptor = (source: any) => {
      const gray = new cv.Mat();
      const resized = new cv.Mat();
      const keypoints = new cv.KeyPointVector();
      const descriptors = new cv.Mat();
      cv.cvtColor(source, gray, cv.COLOR_RGBA2GRAY);
      cv.resize(gray, resized, new cv.Size(360, 360), 0, 0, cv.INTER_CUBIC);
      orb.detectAndCompute(resized, mask, keypoints, descriptors);
      gray.delete();
      resized.delete();
      keypoints.delete();
      return descriptors;
    };

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = recognitionCanvasRef.current;
      if (cancelled || !video || !canvas || video.readyState < 2 || !video.videoWidth) return;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      const sourceSize = Math.min(video.videoWidth, video.videoHeight) * 0.78;
      const sourceX = (video.videoWidth - sourceSize) / 2;
      const sourceY = (video.videoHeight - sourceSize) / 2;
      context.drawImage(video, sourceX, sourceY, sourceSize, sourceSize, 0, 0, 360, 360);
      const frame = cv.imread(canvas);
      const descriptors = prepareDescriptor(frame);
      frame.delete();
      if (!descriptors.rows) {
        descriptors.delete();
        return;
      }

      let bestTeam = -1;
      let bestMatches = 0;
      for (const marker of markerDescriptors) {
        if (!marker.descriptors.rows) continue;
        const matches = new cv.DMatchVectorVector();
        matcher.knnMatch(descriptors, marker.descriptors, matches, 2);
        let goodMatches = 0;
        for (let matchIndex = 0; matchIndex < matches.size(); matchIndex += 1) {
          const pair = matches.get(matchIndex);
          if (pair.size() >= 2 && pair.get(0).distance < pair.get(1).distance * 0.72) goodMatches += 1;
          pair.delete();
        }
        matches.delete();
        if (goodMatches > bestMatches) {
          bestMatches = goodMatches;
          bestTeam = marker.teamIndex;
        }
      }
      descriptors.delete();

      if (bestTeam >= 0 && bestMatches >= 9) {
        missedFrames = 0;
        if (stableCandidate === bestTeam) stableFrames += 1;
        else {
          stableCandidate = bestTeam;
          stableFrames = 1;
        }
        if (stableFrames >= 2) {
          setRecognizedTeam(bestTeam);
          setConfidence(Math.min(99, 55 + bestMatches * 3));
          if (!rewardedRef.current) {
            rewardedRef.current = true;
            unlock();
          }
        }
      } else {
        stableFrames = 0;
        stableCandidate = -1;
        missedFrames += 1;
        if (missedFrames >= 4) {
          setRecognizedTeam(null);
          setConfidence(0);
        }
      }
    };

    const prepareRecognition = async () => {
      try {
        setRecognitionStatus("loading");
        cv = await loadOpenCv();
        if (cancelled) return;
        orb = new cv.ORB(1000);
        matcher = new cv.BFMatcher(cv.NORM_HAMMING, false);
        mask = new cv.Mat();
        const prepared = await Promise.all(teams.map(async (team, teamIndex) => {
          const markerSource = suppliedMarkers[team.name] ?? team.logo;
          const image = await loadMarkerImage(markerSource);
          const source = cv.imread(image);
          const descriptors = prepareDescriptor(source);
          source.delete();
          return { teamIndex, descriptors };
        }));
        if (cancelled) {
          prepared.forEach((marker) => marker.descriptors.delete());
          return;
        }
        markerDescriptors = prepared;
        setRecognitionStatus("scanning");
        scanTimer = window.setInterval(scanFrame, 650);
      } catch {
        if (!cancelled) setRecognitionStatus("error");
      }
    };

    prepareRecognition();
    return () => {
      cancelled = true;
      window.clearInterval(scanTimer);
      markerDescriptors.forEach((marker) => marker.descriptors.delete());
      orb?.delete();
      matcher?.delete();
      mask?.delete();
    };
  }, [camera]);

  const detectedTeam = recognizedTeam === null ? null : teams[recognizedTeam];
  return (
    <main className="camera-page">
      <video ref={videoRef} autoPlay muted playsInline className={camera === "active" ? "active" : ""} />
      <canvas ref={recognitionCanvasRef} className="recognition-canvas" height="360" width="360" />
      {camera !== "active" && <img src={galleryPhotos[2]} alt="Vista previa de un campo de beisbol para realidad aumentada" />}
      <div className="camera-overlay" />
      <div className={`scan-frame ${detectedTeam ? "detected" : ""}`}><i /><i /><i /><i /><span>{detectedTeam ? "Logo detectado" : "Centra el logo dentro del marco"}</span></div>
      {detectedTeam && (
        <div
          className="ar-anchor-card"
          data-ar-anchor={detectedTeam.short}
          data-model-slot={detectedTeam.name}
        >
          <img src={detectedTeam.logo} alt="" />
          <div><span>Marcador reconocido · {confidence}%</span><strong>{detectedTeam.name}</strong><small>Anclaje listo para modelo 3D</small></div>
        </div>
      )}
      <div className="camera-copy">
        <span className="eyebrow light">Ballpark AR · Beta</span>
        {camera !== "active" && <h1>El juego sale<br />de la pantalla.</h1>}
        <p>{camera === "error"
          ? "No pudimos acceder a la cámara. Revisa los permisos del navegador."
          : camera === "active"
            ? recognitionStatus === "loading"
              ? "Preparando los 10 logotipos..."
              : recognitionStatus === "error"
                ? "No se pudo iniciar el detector. Comprueba tu conexión e inténtalo de nuevo."
                : detectedTeam
                  ? "Marcador estable. Aquí se mostrará el modelo 3D del equipo."
                  : "Muestra uno de los 10 logos completos, de frente y con buena iluminación."
            : "Escanea una imagen Waysball para reconocer el club y preparar su experiencia 3D."}</p>
        {camera !== "active" && <button className="primary-button light-button" onClick={start}><Icon name="camera" /> Activar cámara</button>}
        {camera === "active" && recognitionStatus !== "error" && <div className={`scanning ${detectedTeam ? "found" : ""}`}><i /> {detectedTeam ? "Seguimiento activo" : "Buscando marcador..."}</div>}
      </div>
    </main>
  );
}

type GameStats = {
  maxScore: number;
  totalPoints: number;
  totalStrikes: number;
};

const emptyGameStats: GameStats = { maxScore: 0, totalPoints: 0, totalStrikes: 0 };

function Game({
  unlock,
  unlockHighScore,
  challengeCompleted,
}: {
  unlock: () => void;
  unlockHighScore: () => void;
  challengeCompleted: boolean;
}) {
  const pitchDuration = 1600;
  const hitZoneCue = 940;
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const [pauseView, setPauseView] = useState<"menu" | "stats" | null>(null);
  const [phase, setPhase] = useState<"idle" | "countdown" | "waiting" | "pitching" | "result" | "lost" | "paused" | "victory">("idle");
  const [countdown, setCountdown] = useState<string | null>(null);
  const [message, setMessage] = useState("Espera el lanzamiento");
  const [pitchKey, setPitchKey] = useState(0);
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const storedStats = window.localStorage.getItem("waysball-game-stats");
      return storedStats ? { ...emptyGameStats, ...JSON.parse(storedStats) } : emptyGameStats;
    } catch {
      return emptyGameStats;
    }
  });
  const timersRef = useRef<number[]>([]);
  const roundResolvedRef = useRef(false);
  const victoryShownRef = useRef(false);
  const scoreRef = useRef(0);
  const strikesRef = useRef(0);
  const pitchBallRef = useRef<HTMLDivElement>(null);
  const hitZoneRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };
  const later = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  };
  const schedulePitch = () => {
    roundResolvedRef.current = false;
    setPhase("waiting");
    setMessage("Espera el lanzamiento");
    later(() => {
      setPitchKey((value) => value + 1);
      setPhase("pitching");
      setMessage("Sigue la pelota");
      later(() => setMessage("¡Swing! La pelota está en la zona"), hitZoneCue);
      later(() => resolvePitch(false, "¡Strike! La pelota pasó la cuadrícula."), pitchDuration);
    }, 750 + Math.random() * 900);
  };
  const resolvePitch = (hit: boolean, resultMessage: string) => {
    if (roundResolvedRef.current) return;
    roundResolvedRef.current = true;
    clearTimers();
    setPhase("result");
    setMessage(resultMessage);
    if (hit) {
      const nextScore = scoreRef.current + 100;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setStats((current) => ({
        ...current,
        maxScore: Math.max(current.maxScore, nextScore),
        totalPoints: current.totalPoints + 100,
      }));
      if (nextScore >= 1000) unlockHighScore();
      if (nextScore >= 500 && !challengeCompleted && !victoryShownRef.current) {
        victoryShownRef.current = true;
        unlock();
        setPhase("victory");
        setShowVictory(true);
        return;
      }
      later(schedulePitch, 850);
      return;
    }
    const nextStrikes = Math.min(strikesRef.current + 1, 3);
    strikesRef.current = nextStrikes;
    setStrikes(nextStrikes);
    setStats((current) => ({ ...current, totalStrikes: current.totalStrikes + 1 }));
    if (nextStrikes >= 3) later(() => setPhase("lost"), 650);
    else later(schedulePitch, 900);
  };
  const swing = () => {
    if (swinging || (phase !== "waiting" && phase !== "pitching")) return;
    setSwinging(true);
    if (phase === "waiting") resolvePitch(false, "Muy pronto. Espera a que salga la pelota.");
    else {
      const ballBounds = pitchBallRef.current?.getBoundingClientRect();
      const zoneBounds = hitZoneRef.current?.getBoundingClientRect();
      if (!ballBounds || !zoneBounds) resolvePitch(false, "No pudimos ubicar la pelota. ¡Strike!");
      else {
        const ballCenterX = ballBounds.left + ballBounds.width / 2;
        const ballCenterY = ballBounds.top + ballBounds.height / 2;
        const isInsideZone =
          ballCenterX >= zoneBounds.left &&
          ballCenterX <= zoneBounds.right &&
          ballCenterY >= zoneBounds.top &&
          ballCenterY <= zoneBounds.bottom;
        if (isInsideZone) resolvePitch(true, "¡Batazo conectado dentro de la cuadrícula! +100");
        else resolvePitch(false, ballCenterY < zoneBounds.top
          ? "Bateaste antes de que entrara a la cuadrícula."
          : "La pelota ya pasó la cuadrícula. ¡Strike!");
      }
    }
    later(() => setSwinging(false), 380);
  };
  const beginGame = () => {
    clearTimers();
    scoreRef.current = 0;
    strikesRef.current = 0;
    roundResolvedRef.current = false;
    setScore(0);
    setStrikes(0);
    setSwinging(false);
    setShowInstructions(false);
    setShowVictory(false);
    setPauseView(null);
    setPhase("countdown");
    setMessage("Prepárate");
    setCountdown("3");
    later(() => setCountdown("2"), 1000);
    later(() => setCountdown("1"), 2000);
    later(() => setCountdown("¡Adelante!"), 3000);
    later(() => {
      setCountdown(null);
      schedulePitch();
    }, 3900);
  };
  const pauseGame = () => {
    if (showInstructions || showVictory || pauseView || phase === "idle" || phase === "countdown" || phase === "lost") return;
    clearTimers();
    roundResolvedRef.current = true;
    setSwinging(false);
    setCountdown(null);
    setMessage("Juego en pausa");
    setPhase("paused");
    setPauseView("menu");
  };
  const continueGame = () => {
    setPauseView(null);
    setShowVictory(false);
    setMessage("Espera el lanzamiento");
    schedulePitch();
  };
  useEffect(() => {
    try {
      window.localStorage.setItem("waysball-game-stats", JSON.stringify(stats));
    } catch {
      // The game remains playable when browser storage is unavailable.
    }
  }, [stats]);
  useEffect(() => () => clearTimers(), []);
  return (
    <main className="game-page">
      <div className="scoreboard">
        <div><span>Puntos</span><strong>{String(score).padStart(4, "0")}</strong></div>
        <button
          className="pause-button"
          onClick={pauseGame}
          disabled={showInstructions || showVictory || Boolean(pauseView) || phase === "idle" || phase === "countdown" || phase === "lost"}
          aria-label="Pausar juego"
        >
          <Icon name="pause" />
        </button>
        <div><span>Strikes</span><strong>{strikes} / 3</strong></div>
      </div>
      <div className="ballpark">
        <div ref={hitZoneRef} className="hit-zone" aria-hidden="true" />
        <div ref={pitchBallRef} key={pitchKey} className={`pitch-ball ${phase === "pitching" ? "thrown" : ""}`} />
        <div className={`batter ${swinging ? "swing" : ""}`}><i /><b /><span /></div>
        <div className="game-instruction">{message}</div>
        {countdown && <div className={`game-countdown ${countdown === "¡Adelante!" ? "go" : ""}`}>{countdown}</div>}
      </div>
      <section className="game-controls">
        <button
          className="swing-button"
          onClick={swing}
          disabled={swinging || phase === "countdown" || phase === "idle" || phase === "result" || phase === "lost"}
        >
          Swing
        </button>
      </section>
      {showInstructions && (
        <div className="game-modal-layer" role="dialog" aria-modal="true" aria-labelledby="game-title">
          <div className="game-modal">
            <span className="eyebrow">Home Run Norte</span>
            <h2 id="game-title">Conecta el batazo.</h2>
            <p>Espera el lanzamiento y pulsa Swing en el momento preciso para sumar la mayor cantidad de puntos.</p>
            <div className="game-rules">
              <p><span>01</span> Cada batazo conectado suma 100 puntos.</p>
              <p><span>02</span> Si fallas tres veces termina la entrada.</p>
              <p><span>03</span> Consigue 500 puntos para completar el reto.</p>
            </div>
            <button className="primary-button full" onClick={beginGame}>
              Comenzar entrada <Icon name="game" />
            </button>
          </div>
        </div>
      )}
      {phase === "lost" && (
        <div className="game-modal-layer" role="alertdialog" aria-modal="true" aria-labelledby="lost-title">
          <div className="game-modal lost-modal">
            <span className="eyebrow">Fin de la entrada</span>
            <h2 id="lost-title">Perdiste.</h2>
            <p>No te rindas. Observa la pelota desde que sale de la mano del pitcher y espera a que se acerque al cuadro antes de pulsar Swing.</p>
            <div className="game-tip"><Icon name="quiz" /><span>Consejo: evita adelantarte. La paciencia vale más que un swing rápido.</span></div>
            <button className="primary-button full" onClick={beginGame}>
              Reintentar <Icon name="history" />
            </button>
          </div>
        </div>
      )}
      {showVictory && (
        <div className="game-modal-layer" role="alertdialog" aria-modal="true" aria-labelledby="victory-title">
          <div className="game-modal victory-modal">
            <span className="eyebrow">Home Run Norte</span>
            <h2 id="victory-title">Victoria.</h2>
            <p>Alcanzaste 500 puntos y conquistaste la Copa Waysball. Tu temporada suma un nuevo logro.</p>
            <div className="game-rewards">
              <span>Recompensas</span>
              <p><Icon name="check" /> Subiste de nivel de temporada</p>
              <p><Icon name="check" /> Reto 3 completado</p>
            </div>
            <button className="primary-button full" onClick={continueGame}>
              Seguir bateando <Icon name="game" />
            </button>
          </div>
        </div>
      )}
      {pauseView && (
        <div className="game-modal-layer" role="dialog" aria-modal="true" aria-labelledby="pause-title">
          <div className="game-modal pause-modal">
            {pauseView === "menu" ? (
              <>
                <span className="eyebrow">Entrada en pausa</span>
                <h2 id="pause-title">Pausa.</h2>
                <p>Tu entrada está detenida. Puedes continuar, comenzar de nuevo o revisar tu historial.</p>
                <div className="pause-actions">
                  <button className="primary-button full" onClick={continueGame}>
                    Continuar <Icon name="game" />
                  </button>
                  <button className="modal-secondary-button" onClick={beginGame}>
                    Reiniciar <Icon name="history" />
                  </button>
                  <button className="modal-secondary-button" onClick={() => setPauseView("stats")}>
                    Estadísticas <Icon name="arrow" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="eyebrow">Trayectoria Waysball</span>
                <h2 id="pause-title">Estadísticas.</h2>
                <div className="game-stats">
                  <div><span>Máximo puntaje</span><strong>{stats.maxScore}</strong></div>
                  <div><span>Puntos históricos</span><strong>{stats.totalPoints}</strong></div>
                  <div><span>Strikes históricos</span><strong>{stats.totalStrikes}</strong></div>
                </div>
                <div className="pause-actions">
                  <button className="primary-button full" onClick={continueGame}>
                    Continuar <Icon name="game" />
                  </button>
                  <button className="modal-secondary-button" onClick={() => setPauseView("menu")}>
                    Volver al menú <Icon name="back" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function History({ onVisit }: { onVisit: () => void }) {
  const [activeTournament, setActiveTournament] = useState(0);
  useEffect(() => onVisit(), [onVisit]);
  const historyTimeline = [
    ["1925", "Nace la Liga Mexicana", "La liga se organizó en la Ciudad de México por impulso de Alejandro Aguilar Reyes “Fray Nano” y Ernesto Carmona. Su primera temporada reunió a los clubes México, Agraria, Nacional y Guanajuato.", galleryPhotos[1]],
    ["1940s", "La era de Jorge Pasquel", "La inversión de los hermanos Pasquel atrajo figuras internacionales y convirtió a México en uno de los centros más ambiciosos del beisbol profesional.", playerPhotos[0]],
    ["1955", "Beisbol organizado", "La LMB ingresó formalmente al sistema de Ligas Menores, fortaleciendo su estructura deportiva, contratos y relación con otros circuitos profesionales.", galleryPhotos[2]],
    ["1970", "Zonas Norte y Sur", "La expansión permitió reorganizar el campeonato en dos zonas, crear nuevas rivalidades regionales y consolidar el formato de postemporada.", galleryPhotos[3]],
    ["2025", "Un siglo de pelota", "Veinte organizaciones celebraron cien años de historias, estadios y generaciones que han hecho de la liga una institución nacional.", photo],
  ];
  const tournaments = [
    {
      name: "Temporada regular",
      label: "El camino",
      copy: "Los clubes compiten dentro de las zonas Norte y Sur. Cada juego suma para definir a los equipos que avanzan a la postemporada.",
      image: galleryPhotos[1],
      prize: "Clasificación a playoffs",
    },
    {
      name: "Playoffs de zona",
      label: "La eliminación",
      copy: "Series directas deciden a los campeones del Norte y del Sur. La profundidad del pitcheo y la estrategia se vuelven decisivas.",
      image: playerPhotos[2],
      prize: "Trofeo de campeón de zona",
    },
    {
      name: "Serie del Rey",
      label: "La gran final",
      copy: "Los campeones de ambas zonas disputan el título absoluto. El ganador levanta la Copa Zaachila y entra a la historia de la LMB.",
      image: galleryPhotos[0],
      prize: "Copa Zaachila",
    },
    {
      name: "Juego de Estrellas",
      label: "La celebración",
      copy: "Las figuras más destacadas se reúnen en una sede especial para celebrar el talento, la afición y la identidad del circuito.",
      image: playerPhotos[1],
      prize: "Reconocimientos individuales",
    },
  ];
  const historicMoments = [
    ["1946", "Las estrellas llegan a México", "La liga reunió a peloteros de élite de México, Cuba, Estados Unidos y otras naciones, elevando el nivel y la atención internacional.", playerPhotos[1]],
    ["1964", "Comienza la leyenda de Héctor Espino", "El gran bateador mexicano inició una trayectoria que lo convertiría en referencia del poder ofensivo y símbolo eterno del circuito.", playerPhotos[0]],
    ["1979", "Fernando antes de la Fernandomanía", "Fernando Valenzuela lanzó con los Leones de Yucatán antes de conquistar las Grandes Ligas, conectando dos capítulos esenciales del beisbol mexicano.", playerPhotos[2]],
    ["2021", "Una remontada imposible", "Toros de Tijuana revirtió una desventaja de 0–3 ante Leones de Yucatán para conquistar una de las Series del Rey más dramáticas.", galleryPhotos[3]],
    ["2025", "La liga cumple cien años", "Clubes y aficionados conmemoraron un siglo de campeones, narraciones, rivalidades y noches que permanecen en la memoria colectiva.", galleryPhotos[0]],
  ];
  const tournament = tournaments[activeTournament];
  return (
    <main className="history-page">
      <div className="league-hero">
        <img src="/history/lmb-logo.png" alt="" />
        <div>
          <span className="eyebrow light">Liga Mexicana de Beisbol</span>
          <h1>Cien años de<br /><em>pelota mexicana.</em></h1>
          <p>Historia, campeones y momentos que viven más allá del diamante.</p>
        </div>
      </div>

      <section className="league-section">
        <div className="detail-heading"><span className="eyebrow">Historia</span><h2>El origen de una tradición</h2></div>
        <p className="league-lead">La Liga Mexicana de Beisbol nació en 1925 en la Ciudad de México. Cronistas, empresarios y peloteros construyeron un campeonato profesional que pronto se extendió por distintas regiones del país.</p>
        <div className="league-timeline">
          {historyTimeline.map(([year, title, copy, image]) => (
            <article className="league-timeline-item" key={year}>
              <img src={image} alt="" />
              <div><span>{year}</span><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="league-section tournaments-section">
        <div className="detail-heading"><span className="eyebrow">Torneos y campeonatos</span><h2>El camino a la corona</h2></div>
        <div className="tournament-hero">
          <img src={tournament.image} alt="" />
          <div className="player-shade" />
          <div className="tournament-copy">
            <span>{tournament.label}</span>
            <h3>{tournament.name}</h3>
            <p>{tournament.copy}</p>
            <strong>{tournament.prize}</strong>
          </div>
          <div className="carousel-controls">
            <button onClick={() => setActiveTournament((value) => (value + tournaments.length - 1) % tournaments.length)} aria-label="Competición anterior"><Icon name="back" /></button>
            <button onClick={() => setActiveTournament((value) => (value + 1) % tournaments.length)} aria-label="Siguiente competición"><Icon name="forward" /></button>
          </div>
        </div>
        <div className="carousel-dots">
          {tournaments.map((item, itemIndex) => <button aria-label={`Ver ${item.name}`} className={itemIndex === activeTournament ? "active" : ""} key={item.name} onClick={() => setActiveTournament(itemIndex)} />)}
        </div>
      </section>

      <section className="league-section actuality-section">
        <div className="detail-heading"><span className="eyebrow">Actualidad</span><h2>Una liga de todo México</h2></div>
        <div className="actuality-image"><img src={galleryPhotos[2]} alt="Aficionados y jugadores durante un juego de beisbol" /></div>
        <p className="league-lead">Hoy la LMB reúne a 20 organizaciones divididas entre las zonas Norte y Sur. Los estadios combinan tradición y nuevas experiencias, mientras las transmisiones digitales acercan cada juego a aficionados dentro y fuera del país.</p>
        <p className="league-lead">La comunidad se construye en familia: porras, mascotas, narradores, coleccionistas y generaciones enteras comparten los colores de sus clubes. La liga también impulsa talento mexicano y mantiene conexiones con circuitos internacionales.</p>
        <div className="league-stats"><div><strong>20</strong><span>clubes</span></div><div><strong>2</strong><span>zonas</span></div><div><strong>100+</strong><span>años</span></div></div>
      </section>

      <section className="league-section moments-section">
        <div className="detail-heading"><span className="eyebrow">Momentos históricos</span><h2>Jugadas que se volvieron leyenda</h2></div>
        <div className="league-timeline historic-timeline">
          {historicMoments.map(([year, title, copy, image]) => (
            <article className="league-timeline-item" key={year}>
              <img src={image} alt="" />
              <div><span>{year}</span><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function PixelatedVideo({
  src,
  poster,
  title,
  onPlay,
}: {
  src: string;
  poster: string;
  title: string;
  onPlay: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let animationFrame = 0;
    const renderFrame = () => {
      if (video.readyState >= 2 && video.videoWidth && video.videoHeight) {
        const targetWidth = canvas.width;
        const targetHeight = canvas.height;
        const sourceRatio = video.videoWidth / video.videoHeight;
        const targetRatio = targetWidth / targetHeight;
        let sourceWidth = video.videoWidth;
        let sourceHeight = video.videoHeight;
        let sourceX = 0;
        let sourceY = 0;
        if (sourceRatio > targetRatio) {
          sourceWidth = video.videoHeight * targetRatio;
          sourceX = (video.videoWidth - sourceWidth) / 2;
        } else {
          sourceHeight = video.videoWidth / targetRatio;
          sourceY = (video.videoHeight - sourceHeight) / 2;
        }
        context.imageSmoothingEnabled = false;
        context.drawImage(
          video,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          targetWidth,
          targetHeight,
        );
      }
      animationFrame = window.requestAnimationFrame(renderFrame);
    };
    renderFrame();
    video.play().catch(() => setPlaying(false));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [src]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPlaying(false));
    else video.pause();
  };

  return (
    <div className="pixel-video">
      <img src={poster} alt="" />
      <canvas ref={canvasRef} height="64" width="72" role="img" aria-label={`${title}, video pixelado`} />
      <video
        ref={videoRef}
        autoPlay
        crossOrigin="anonymous"
        loop
        muted
        playsInline
        poster={poster}
        src={src}
        onPause={() => setPlaying(false)}
        onPlay={() => { setPlaying(true); onPlay(); }}
      />
      <button onClick={togglePlayback} aria-label={playing ? "Pausar video" : "Reproducir video"}>
        <Icon name={playing ? "pause" : "game"} />
        {playing ? "Pausar" : "Reproducir"}
      </button>
    </div>
  );
}

function Gallery({
  completedChallenges = initialCompletedChallenges,
  showChallenges,
  initialSelectedImage = null,
  onPlayVideo,
}: {
  completedChallenges?: number[];
  showChallenges: () => void;
  initialSelectedImage?: number | null;
  onPlayVideo: () => void;
}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(initialSelectedImage);
  const [activeFilter, setActiveFilter] = useState("none");
  const [colorAdjustment, setColorAdjustment] = useState({ hue: 0, saturation: 100, contrast: 100 });
  const filters = [
    { id: "none", label: "Sin filtro" },
    { id: "blur", label: "Desenfoque" },
    { id: "pixel", label: "Pixelado" },
    { id: "thermal", label: "Cámara térmica" },
    { id: "color", label: "Ajuste de color" },
    { id: "smooth", label: "Suavizado" },
    { id: "pastel", label: "Colores pasteles" },
    { id: "saturation", label: "Alta saturación" },
  ];
  if (selectedImage !== null) {
    const item = galleryItems[selectedImage];
    const filterPreview = item.image;
    const pixelatedSource = (source: string, width: number) =>
      source.replace(/([?&])w=\d+/, `$1w=${width}`);
    const colorFilterStyle = {
      "--filter-hue": `${colorAdjustment.hue}deg`,
      "--filter-saturation": `${colorAdjustment.saturation}%`,
      "--filter-contrast": `${colorAdjustment.contrast}%`,
    } as React.CSSProperties;
    const mediaStyle = activeFilter === "color" ? colorFilterStyle : undefined;
    return (
      <main className="gallery-detail">
        <button className="gallery-detail-back" onClick={() => { setSelectedImage(null); setActiveFilter("none"); }}>
          <Icon name="back" /> Volver a la galería
        </button>
        <div className="gallery-detail-heading">
          <span className="eyebrow">Postal desbloqueada</span>
          <h1>{item.title}</h1>
          <p>{item.description}</p>
        </div>
        <div className={`gallery-image-stage filter-stage-${activeFilter}`}>
          {item.type === "video" && item.video && activeFilter === "pixel" ? (
            <PixelatedVideo src={item.video} poster={item.image} title={item.title} onPlay={onPlayVideo} />
          ) : item.type === "video" && item.video ? (
            <video
              autoPlay
              className={`filter-${activeFilter}`}
              controls
              loop
              muted
              playsInline
              poster={item.image}
              src={item.video}
              style={mediaStyle}
              onPlay={onPlayVideo}
            />
          ) : (
            <img
              className={`filter-${activeFilter}`}
              src={activeFilter === "pixel" ? pixelatedSource(item.image, 56) : item.image}
              alt={item.title}
              style={mediaStyle}
            />
          )}
          <span>WB · {String(selectedImage + 1).padStart(2, "0")}</span>
        </div>
        <section className="filters-section">
          <div className="detail-heading"><span className="eyebrow">Edición</span><h2>Filtros</h2></div>
          <p>Transforma tu postal con efectos visuales y ajustes de color.</p>
          <div className="filter-grid">
            {filters.map((filter) => (
              <button className={activeFilter === filter.id ? "active" : ""} key={filter.id} onClick={() => setActiveFilter(filter.id)}>
                <span className={`filter-preview filter-preview-${filter.id}`}>
                  <img
                    className={`filter-${filter.id}`}
                    src={filter.id === "pixel" ? pixelatedSource(filterPreview, 24) : filterPreview}
                    alt=""
                    style={filter.id === "color" ? colorFilterStyle : undefined}
                  />
                </span>
                {filter.label}
              </button>
            ))}
          </div>
          {activeFilter === "color" && (
            <div className="color-controls">
              <div className="color-controls-heading">
                <span>Ajuste manual</span>
                <button onClick={() => setColorAdjustment({ hue: 0, saturation: 100, contrast: 100 })}>Restablecer</button>
              </div>
              <label>
                <span>Tono <strong>{colorAdjustment.hue}°</strong></span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={colorAdjustment.hue}
                  onChange={(event) => setColorAdjustment((current) => ({ ...current, hue: Number(event.target.value) }))}
                />
              </label>
              <label>
                <span>Saturación <strong>{colorAdjustment.saturation}%</strong></span>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={colorAdjustment.saturation}
                  onChange={(event) => setColorAdjustment((current) => ({ ...current, saturation: Number(event.target.value) }))}
                />
              </label>
              <label>
                <span>Contraste <strong>{colorAdjustment.contrast}%</strong></span>
                <input
                  type="range"
                  min="75"
                  max="150"
                  value={colorAdjustment.contrast}
                  onChange={(event) => setColorAdjustment((current) => ({ ...current, contrast: Number(event.target.value) }))}
                />
              </label>
            </div>
          )}
        </section>
      </main>
    );
  }
  const openPostcards = completedChallenges.length;
  return (
    <main className="gallery-page page">
      <div className="page-intro gallery-intro">
        <span className="eyebrow light">Galería Waysball</span>
        <h1>Postales del<br /><em>diamante.</em></h1>
        <p>{openPostcards} de {galleryItems.length} recuerdos desbloqueados. Juega, aprende y vuelve para completar la colección.</p>
      </div>
      <div className="gallery-grid">
        {galleryItems.map((item, index) => {
          const isOpen = completedChallenges.includes(index);
          const isVideoPreview = index === 10 && Array.from({ length: 10 }, (_, challengeIndex) => challengeIndex)
            .every((challengeIndex) => completedChallenges.includes(challengeIndex));
          const isAccessible = isOpen || isVideoPreview;
          return (
            <button
              className={`gallery-card ${isAccessible ? "" : "locked"}`}
              key={item.title}
              onClick={() => {
                if (!isAccessible) {
                  showChallenges();
                  return;
                }
                setSelectedImage(index);
                setActiveFilter("none");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {item.type === "video" && item.video ? (
                <video
                  autoPlay={isAccessible}
                  loop
                  muted
                  playsInline
                  poster={item.image}
                  src={isAccessible ? item.video : undefined}
                />
              ) : (
                <img src={item.image} alt={isOpen ? item.title : ""} />
              )}
              {item.type === "video" && <span className="media-type">Video</span>}
              {!isAccessible && <div className="lock-screen"><Icon name="lock" /><span>Reto {index + 1}</span><small>Detalles del reto</small></div>}
              <div className="gallery-caption">
                <span>WB · {String(index + 1).padStart(2, "0")}</span>
                <strong>{isOpen ? item.title : isVideoPreview ? "Video especial" : "???"}</strong>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

function Challenges({
  completedChallenges = initialCompletedChallenges,
  goGallery,
  viewPostcard,
  pinnedChallenge,
  pinChallenge,
}: {
  completedChallenges?: number[];
  goGallery: () => void;
  viewPostcard: (index: number) => void;
  pinnedChallenge: number;
  pinChallenge: (index: number) => void;
}) {
  return (
    <main className="challenges-page page">
      <div className="page-intro challenges-intro">
        <span className="eyebrow light">Progreso Waysball</span>
        <h1>Lista de<br /><em>retos.</em></h1>
        <p>Completa cada desafío para revelar las nueve postales de tu colección.</p>
        <div className="challenge-progress"><i style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }} /></div>
        <small>{completedChallenges.length} de {challenges.length} completados</small>
      </div>
      <section className="challenge-list">
        {challenges.map((challenge, index) => {
          const completed = completedChallenges.includes(index);
          return (
            <article className={completed ? "completed" : ""} key={challenge.title}>
              <div className="challenge-number">{completed ? <Icon name="check" /> : String(index + 1).padStart(2, "0")}</div>
              <div>
                <span>{completed ? "Completado" : `Reto ${index + 1}`}</span>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
                <small>Desbloquea: {completed ? challenge.reward : `Postal ${index + 1}`}</small>
                {completed && (
                  <button className="primary-button challenge-postcard-button" onClick={() => viewPostcard(index)}>
                    Ver postal <Icon name="gallery" />
                  </button>
                )}
                <button
                  className={`objective-button ${pinnedChallenge === index ? "active" : ""}`}
                  onClick={() => pinChallenge(index)}
                >
                  <Icon name={pinnedChallenge === index ? "check" : "quiz"} />
                  {pinnedChallenge === index ? "Objetivo activo" : "Marcar Objetivo"}
                </button>
              </div>
            </article>
          );
        })}
        <button className="primary-button full" onClick={goGallery}>Ver galería <Icon name="gallery" /></button>
      </section>
    </main>
  );
}

function SideMenu({
  open,
  close,
  go,
  resetSeason,
  completedChallenges = initialCompletedChallenges,
  pinnedChallenge,
  level,
}: {
  open: boolean;
  close: () => void;
  go: (view: View) => void;
  resetSeason: () => void;
  completedChallenges?: number[];
  pinnedChallenge: number;
  level: number;
}) {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const objective = challenges[pinnedChallenge];
  const links: { view: View; label: string; icon: IconName }[] = [
    { view: "historia", label: "Historia de la LMB", icon: "history" },
    { view: "galeria", label: "Galería desbloqueable", icon: "gallery" },
    { view: "ar", label: "Realidad aumentada", icon: "camera" },
  ];
  return (
    <div className={`menu-layer ${open ? "open" : ""}`} aria-hidden={!open}>
      <button className="menu-scrim" onClick={close} aria-label="Cerrar menú" />
      <aside className="side-menu">
        <div className="menu-top">
          <Brand onClick={() => { go("inicio"); close(); }} />
          <button className="icon-button" onClick={close} aria-label="Cerrar menú">×</button>
        </div>
        <div className="season-card">
          <span className="eyebrow light">Mi temporada</span>
          <strong>Nivel {level}</strong>
          <div><i style={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }} /></div>
          <small>{completedChallenges.length} de {challenges.length} retos completados</small>
        </div>
        <nav>
          {links.map((link) => <button key={link.view} onClick={() => { go(link.view); close(); }}><Icon name={link.icon} /><span>{link.label}</span><Icon name="arrow" /></button>)}
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
        <button className="collection-button" onClick={() => { go("retos"); close(); }}>
          <Icon name="quiz" />
          <span><b>Lista de retos</b><small>{completedChallenges.length} de {challenges.length} completados</small></span>
          <Icon name="arrow" />
        </button>
        <button className="reset-season-button" onClick={() => setShowResetConfirmation(true)}>
          <Icon name="history" /> Reiniciar temporada
        </button>
      </aside>
      {showResetConfirmation && (
        <div className="season-reset-layer" role="alertdialog" aria-modal="true" aria-labelledby="reset-season-title">
          <div className="season-reset-modal">
            <span className="eyebrow">Acción irreversible</span>
            <h2 id="reset-season-title">¿Reiniciar temporada?</h2>
            <p>Volverás a comenzar Waysball desde cero. Se borrará todo el progreso conseguido durante esta temporada.</p>
            <div className="season-reset-summary">
              <p><Icon name="history" /> Nivel de temporada</p>
              <p><Icon name="game" /> Estadísticas del minijuego</p>
              <p><Icon name="gallery" /> Postales desbloqueadas</p>
              <p><Icon name="quiz" /> Retos completados</p>
            </div>
            <small>Esta acción no se puede deshacer.</small>
            <div className="season-reset-actions">
              <button className="primary-button full" onClick={() => { resetSeason(); setShowResetConfirmation(false); close(); }}>
                Reiniciar <Icon name="history" />
              </button>
              <button className="modal-secondary-button" onClick={() => setShowResetConfirmation(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomNav({ view, go }: { view: View; go: (view: View) => void }) {
  const items: { view: View; label: string; icon: IconName }[] = [
    { view: "inicio", label: "Inicio", icon: "home" },
    { view: "equipos", label: "Equipos", icon: "teams" },
    { view: "trivia", label: "Trivia", icon: "quiz" },
    { view: "juego", label: "Juego", icon: "game" },
  ];
  return <nav className="bottom-nav">{items.map((item) =>
    <button className={view === item.view ? "active" : ""} key={item.view} onClick={() => go(item.view)}>
      <Icon name={item.icon} /><span>{item.label}</span>
    </button>)}</nav>;
}
  /* ===== FIN DE COMPONENTES INLINE ANTIGUOS ===== */

  /* ===== HELPER DE PERSISTENCIA: progreso de Equipos y Trivia ===== */
function loadStoredIndexes(key: string, maximum: number) {
  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) return [];
    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < maximum)
      : [];
  } catch {
    return [];
  }
}
/* ===== FIN DE HELPER DE PERSISTENCIA ===== */

export default function App() {
  /* ===== ESTADO DE APP: Header, Footer, MenuHamburguesa y navegación ===== */
  const [showSplash, setShowSplash] = useState(true);
  const splashTimerRef = useRef<number | null>(null);
  const [view, setView] = useState<View>("inicio");
  const [teamIndex, setTeamIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>(() => {
    try {
      const storedChallenges = window.localStorage.getItem("waysball-completed-challenges");
      if (!storedChallenges) return initialCompletedChallenges;
      const parsedChallenges = JSON.parse(storedChallenges);
      return Array.isArray(parsedChallenges)
        ? parsedChallenges.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < challenges.length)
        : initialCompletedChallenges;
    } catch {
      return initialCompletedChallenges;
    }
  });
  const [viewedTeams, setViewedTeams] = useState<number[]>(() => loadStoredIndexes("waysball-viewed-teams", teams.length));
  const [completedTriviaClubs, setCompletedTriviaClubs] = useState<number[]>(() =>
    loadStoredIndexes("waysball-trivia-clubs", teams.length),
  );
  const [pinnedChallenge, setPinnedChallenge] = useState(0);
  const [galleryPostcard, setGalleryPostcard] = useState<number | null>(null);
  const [seasonResetKey, setSeasonResetKey] = useState(0);
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string }>>([]);
  const [scrollIndicator, setScrollIndicator] = useState({ offset: 0, visible: false });
  const completedChallengesRef = useRef(completedChallenges);
  const viewedTeamsRef = useRef(viewedTeams);
  const completedTriviaClubsRef = useRef(completedTriviaClubs);
  const notificationIdRef = useRef(0);
  completedChallengesRef.current = completedChallenges;
  viewedTeamsRef.current = viewedTeams;
  completedTriviaClubsRef.current = completedTriviaClubs;
  const level = Math.min(completedChallenges.length, challenges.length);
  /* ===== FIN DE ESTADO DE APP ===== */

  /* ===== PROGRESO CENTRAL: MenuHamburguesa, ListaRetos y postales ===== */
  const completeChallenge = (challengeIndex: number) => {
    const current = completedChallengesRef.current;
    if (current.includes(challengeIndex)) return;
    const next = [...current, challengeIndex].sort((a, b) => a - b);
    completedChallengesRef.current = next;
    setCompletedChallenges(next);
    setNotifications((queued) => [
      ...queued,
      { id: ++notificationIdRef.current, text: `Subiste a nivel ${next.length}` },
      { id: ++notificationIdRef.current, text: `Reto ${challengeIndex + 1} completado` },
    ]);
  };
  /* ===== FIN DE PROGRESO CENTRAL ===== */

  /* ===== CALLBACK DE Equipos y EquipoDetalle ===== */
  const selectTeam = (index: number) => {
    completeChallenge(0);
    if (!viewedTeamsRef.current.includes(index)) {
      const nextViewedTeams = [...viewedTeamsRef.current, index].sort((a, b) => a - b);
      viewedTeamsRef.current = nextViewedTeams;
      setViewedTeams(nextViewedTeams);
      if (nextViewedTeams.length >= 5) completeChallenge(3);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setTeamIndex(index);
  };
  /* ===== FIN DE CALLBACK DE Equipos y EquipoDetalle ===== */

  /* ===== CALLBACK DE Trivia ===== */
  const completeTriviaClub = (clubIndex: number, perfectAttempt: boolean) => {
    if (perfectAttempt) completeChallenge(1);
    if (completedTriviaClubsRef.current.includes(clubIndex)) return;
    const nextCompletedClubs = [...completedTriviaClubsRef.current, clubIndex].sort((a, b) => a - b);
    completedTriviaClubsRef.current = nextCompletedClubs;
    setCompletedTriviaClubs(nextCompletedClubs);
    if (nextCompletedClubs.length >= 3) completeChallenge(4);
    if (nextCompletedClubs.length >= teams.length) completeChallenge(8);
  };
  /* ===== FIN DE CALLBACK DE Trivia ===== */

  /* ===== NAVEGACIÓN: Home, Header, Footer, MenuHamburguesa y Galeria ===== */
  const go = (next: View) => {
    setTeamIndex(null);
    if (next === "galeria") setGalleryPostcard(null);
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const viewPostcard = (index: number) => {
    setTeamIndex(null);
    setGalleryPostcard(index);
    setView("galeria");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  /* ===== FIN DE NAVEGACIÓN ===== */

  /* ===== REINICIO DE TEMPORADA: acción del MenuHamburguesa ===== */
  const resetSeason = () => {
    window.localStorage.setItem("waysball-completed-challenges", "[]");
    window.localStorage.setItem("waysball-viewed-teams", "[]");
    window.localStorage.setItem("waysball-trivia-clubs", "[]");
    window.localStorage.removeItem("waysball-game-stats");
    completedChallengesRef.current = [];
    viewedTeamsRef.current = [];
    completedTriviaClubsRef.current = [];
    setCompletedChallenges([]);
    setViewedTeams([]);
    setCompletedTriviaClubs([]);
    setNotifications([]);
    setPinnedChallenge(0);
    setGalleryPostcard(null);
    setTeamIndex(null);
    setSeasonResetKey((current) => current + 1);
    setView("inicio");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  /* ===== FIN DE REINICIO DE TEMPORADA ===== */

  /* ===== EFECTOS DE APP: almacenamiento, notificaciones y scroll ===== */
  useEffect(() => {
    const startSplash = () => {
      setShowSplash(true);
      if (splashTimerRef.current !== null) window.clearTimeout(splashTimerRef.current);
      splashTimerRef.current = window.setTimeout(() => setShowSplash(false), 1500);
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) startSplash();
    };
    startSplash();
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      if (splashTimerRef.current !== null) window.clearTimeout(splashTimerRef.current);
    };
  }, []);
  useEffect(() => {
    window.localStorage.setItem("waysball-completed-challenges", JSON.stringify(completedChallenges));
  }, [completedChallenges]);
  useEffect(() => {
    window.localStorage.setItem("waysball-viewed-teams", JSON.stringify(viewedTeams));
  }, [viewedTeams]);
  useEffect(() => {
    window.localStorage.setItem("waysball-trivia-clubs", JSON.stringify(completedTriviaClubs));
  }, [completedTriviaClubs]);
  useEffect(() => {
    const regularChallenges = completedChallenges.filter((challengeIndex) => challengeIndex !== 7 && challengeIndex !== 11);
    if (regularChallenges.length >= 7 && !completedChallenges.includes(7)) {
      completeChallenge(7);
      return;
    }
    const previousChallengesComplete = Array.from({ length: 11 }, (_, challengeIndex) => challengeIndex)
      .every((challengeIndex) => completedChallenges.includes(challengeIndex));
    if (previousChallengesComplete && !completedChallenges.includes(11)) completeChallenge(11);
  }, [completedChallenges]);
  const activeNotification = notifications[0];
  useEffect(() => {
    if (!activeNotification) return;
    const timer = window.setTimeout(() => {
      setNotifications((current) => current.slice(1));
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [activeNotification]);
  useEffect(() => {
    if (teamIndex === null) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [teamIndex]);
  useEffect(() => {
    const updateScrollIndicator = () => {
      if (view === "ar") {
        setScrollIndicator({ offset: 0, visible: false });
        return;
      }
      const root = document.documentElement;
      const scrollableDistance = root.scrollHeight - window.innerHeight;
      const progress = scrollableDistance > 0 ? Math.min(window.scrollY / scrollableDistance, 1) : 0;
      const headerBottom = document.querySelector(".topbar")?.getBoundingClientRect().bottom ?? 0;
      const footerTop = document.querySelector(".bottom-nav")?.getBoundingClientRect().top ?? window.innerHeight;
      const indicatorTrack = Math.max(footerTop - headerBottom - 66, 0);
      setScrollIndicator({
        offset: progress * indicatorTrack,
        visible: scrollableDistance > 2,
      });
    };
    updateScrollIndicator();
    window.addEventListener("scroll", updateScrollIndicator, { passive: true });
    window.addEventListener("resize", updateScrollIndicator);
    return () => {
      window.removeEventListener("scroll", updateScrollIndicator);
      window.removeEventListener("resize", updateScrollIndicator);
    };
  }, [view, teamIndex, showSplash]);
  /* ===== FIN DE EFECTOS DE APP ===== */

  /* ===== ROUTER INTERNO: inicio y fin de cada componente importado ===== */
  const page = useMemo(() => {
    /* ===== EquipoDetalle: inicio ===== */
    if (teamIndex !== null) return <EquipoDetalleComponent index={teamIndex} back={() => setTeamIndex(null)} teams={teams} profiles={clubProfiles} galleryPhotos={galleryPhotos} playerPhotos={playerPhotos} />;
    /* ===== EquipoDetalle: fin ===== */

    /* ===== Home: inicio ===== */
    if (view === "inicio") return <HomeComponent go={go} />;
    /* ===== Home: fin ===== */

    /* ===== Equipos: INICIO ===== */
    if (view === "equipos") return <EquiposComponent teams={teams} select={selectTeam} />;
    /* ===== Equipos: FIN ===== */

    /* ===== Trivia: INICIO ===== */
    if (view === "trivia") return <TriviaComponent questions={questions} teams={teams} onComplete={completeTriviaClub} />;
    /* ===== Trivia: FIN ===== */

    /* ===== RealidadAumentada: INICIO ===== */
    if (view === "ar") return <RealidadAumentadaComponent teams={teams} galleryPhotos={galleryPhotos} unlock={() => completeChallenge(5)} />;
    /* ===== RealidadAumentada: FIN ===== */

    /* ===== MiniJuego: INICIO ===== */
    if (view === "juego") return (
      <MiniJuegoComponent
        key={seasonResetKey}
        unlock={() => completeChallenge(2)}
        unlockHighScore={() => completeChallenge(9)}
        unlockPostal11={() => completeChallenge(10)}
        challengeCompleted={completedChallenges.includes(2)}
      />
    );
    /* ===== MiniJuego: FIN ===== */

    /* ===== HistoriaLiga: INICIO ===== */
    if (view === "historia") return <HistoriaLigaComponent galleryPhotos={galleryPhotos} playerPhotos={playerPhotos} photo={photo} onVisit={() => completeChallenge(6)} />;
    /* ===== HistoriaLiga: FIN ===== */

    /* ===== ListaRetos: INICIO ===== */
    if (view === "retos") return (
      <ListaRetosComponent
        challenges={challenges}
        completedChallenges={completedChallenges}
        goGallery={() => go("galeria")}
        viewPostcard={viewPostcard}
        pinnedChallenge={pinnedChallenge}
        pinChallenge={setPinnedChallenge}
      />
    );
    /* ===== ListaRetos: FIN ===== */

    /* ===== GaleriaDetalle: INICIO ===== */
    if (galleryPostcard !== null) return <GaleriaDetalleComponent item={galleryItems[galleryPostcard]} index={galleryPostcard} back={() => setGalleryPostcard(null)} />;
    /* ===== GaleriaDetalle: FIN ===== */

    /* ===== Galeria: INICIO ===== */
    return (
      <GaleriaComponent
        galleryItems={galleryItems}
        completedChallenges={completedChallenges}
        showChallenges={() => go("retos")}
        openDetail={(index: number) => { setGalleryPostcard(index); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      />
    );
    /* ===== Galeria: FIN ===== */
  }, [view, teamIndex, completedChallenges, pinnedChallenge, galleryPostcard, seasonResetKey]);
  /* ===== FIN DE ROUTER INTERNO ===== */

  return (
    <div className="app-shell">
      {showSplash && <SplashScreen />}
      {/* ===== Header: INICIO ===== */}
      <HeaderComponent onMenu={() => setMenuOpen(true)} onHome={() => go("inicio")} isGame={view === "juego"} level={level} />
      {/* ===== Header: FIN ===== */}
      {/* ===== Notificación de progreso: App ===== */}
      {activeNotification && (
        <div className="progress-notification" key={activeNotification.id} role="status" aria-live="polite">
          <span>Progreso Waysball</span>
          <strong>{activeNotification.text}</strong>
        </div>
      )}
      {/* ===== Vista activa: uno de los componentes enrutados arriba ===== */}
      {page}
      {/* ===== Footer: INICIO ===== */}
      <FooterComponent view={view} go={go} />
      {/* ===== Footer: FIN ===== */}
      {/* ===== Indicador de scroll: App ===== */}
      {view !== "ar" && (
        <div
          className={`scroll-indicator ${scrollIndicator.visible ? "visible" : ""}`}
          aria-hidden="true"
        >
          <i style={{ transform: `translateY(${scrollIndicator.offset}px)` }} />
        </div>
      )}
      {/* ===== MenuHamburguesa: INICIO ===== */}
      <MenuHamburguesaComponent
        open={menuOpen}
        close={() => setMenuOpen(false)}
        go={go}
        resetSeason={resetSeason}
        challenges={challenges}
        completedChallenges={completedChallenges}
        pinnedChallenge={pinnedChallenge}
        level={level}
      />
      {/* ===== MenuHamburguesa: FIN ===== */}
      {/* ===== FIN DE ESTRUCTURA DE APP ===== */}
    </div>
  );
}
