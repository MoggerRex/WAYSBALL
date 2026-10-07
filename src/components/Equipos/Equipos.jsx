import "./Equipos.css";
import { ArrowRight } from "lucide-react";

function ArrowIcon() {
  return <ArrowRight size={22} />;
}

export default function Equipos({ teams, select }) {
  return <main className="page">
    <div className="page-intro">
      <span className="eyebrow light">Roster · Zona Norte</span>
      <h1>Diez ciudades.<br /><em>Una pasión.</em></h1>
      <p>Conoce la identidad, el estadio y las hazañas de cada club.</p>
    </div>
    <div className="team-list">
      {teams.map((team, index) => <button className="team-row" key={team.name} onClick={() => select(index)} style={{ "--team-color": team.color, "--team-logo": `url("${team.logo}")` }}>
        <span className="team-name"><strong>{team.name}</strong><small>{team.city}</small></span>
        <ArrowIcon />
      </button>)}
    </div>
  </main>;
}