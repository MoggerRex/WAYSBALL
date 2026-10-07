import "./Icon.css";

const paths = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  teams: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-4 2.7-6 6-6s6 2 6 6M15 14c3.5 0 5 2 5 5" /></>,
  quiz: <><path d="M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 2" /><path d="M12 17h.01" /><circle cx="12" cy="12" r="9" /></>,
  camera: <><path d="M4 7h4l2-3h4l2 3h4v12H4z" /><circle cx="12" cy="13" r="4" /></>,
  game: <><path d="M8 8h8a5 5 0 0 1 4.7 6.7l-1 2.8a2.5 2.5 0 0 1-4.2.8L14 17h-4l-1.5 1.3a2.5 2.5 0 0 1-4.2-.8l-1-2.8A5 5 0 0 1 8 8Z" /><path d="M8 11v4M6 13h4M16 12h.01M18 14h.01" /></>,
  history: <><path d="M4 5v5h5" /><path d="M5.5 9A8 8 0 1 1 4 15" /><path d="M12 7v5l3 2" /></>,
  gallery: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="m4 18 5-5 3 3 2-2 6 5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  back: <path d="m15 18-6-6 6-6" />,
  forward: <path d="m9 6 6 6-6 6" />,
  arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  pause: <path d="M9 6v12M15 6v12" />,
};

export default function Icon({ name, size = 22 }) {
  return <svg aria-hidden="true" className="icon" fill="none" height={size} viewBox="0 0 24 24" width={size}><g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</g></svg>;
}