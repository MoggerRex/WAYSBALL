import { useCallback, useEffect, useRef, useState } from "react";
import { Gamepad2, Pause, RefreshCw, TrendingUp } from "lucide-react";
import Icon from "../Icon/Icon";
import "./MiniJuego.css";

const emptyStats = { maxScore: 0, totalPoints: 0, totalStrikes: 0 };
const PITCH_RELEASE_SECONDS = 56 / 30;
const BAT_SWING_DURATION = 0.7;
const BAT_SWING_END_FRAME = 78;

function GamePlayers({ onReady, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let renderer;
    let resizeObserver;
    let animationFrame;
    const mixers = [];

    const initializePlayers = async () => {
      try {
        const [THREE, { FBXLoader }] = await Promise.all([
          import("https://cdn.jsdelivr.net/npm/three@0.160.0/+esm"),
          import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js/+esm"),
        ]);
        if (cancelled || !containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 100);
        camera.position.set(0, 0, 20);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        scene.add(ambientLight);
        const keyLight = new THREE.DirectionalLight(0xffffff, 2);
        keyLight.position.set(-3, 8, 10);
        scene.add(keyLight);

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        const resize = () => {
          const { width, height } = container.getBoundingClientRect();
          if (!width || !height) return;
          const aspect = width / height;
          camera.left = -5 * aspect;
          camera.right = 5 * aspect;
          camera.top = 5;
          camera.bottom = -5;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height, false);
        };
        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const loader = new FBXLoader();
        const players = [
          { file: "pi_sultanes.fbx", x: 0, y: 3.0, height: 1.15, role: "pitcher" },
          { file: "pi_caliente.fbx", x: -2.2, y: -4.65, height: 5.1, role: "batter" },
        ];
        const loadedPlayers = await Promise.all(players.map(({ file, x, y, height, role }) =>
          new Promise((resolve, reject) => {
            loader.load(
              `${import.meta.env.BASE_URL}Animaciones/${file}`,
              (model) => resolve({ model, x, y, height, role }),
              undefined,
              reject,
            );
          }),
        ));
        if (cancelled) return;

        const actions = {};
        loadedPlayers.forEach(({ model, x, y, height, role }) => {
          model.traverse((object) => {
            if (!object.isMesh) return;
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              if (!material) return;
              material.alphaMap = null;
              material.opacity = 1;
              material.transparent = false;
              material.alphaTest = 0;
              material.depthWrite = true;
              material.needsUpdate = true;
            });
          });
          const bounds = new THREE.Box3().setFromObject(model);
          const dimensions = bounds.getSize(new THREE.Vector3());
          if (!Number.isFinite(dimensions.y) || dimensions.y <= 0) {
            throw new Error(`El modelo ${role} no tiene una altura válida.`);
          }
          const scale = height / dimensions.y;
          model.scale.setScalar(scale);
          if (role === "batter") model.rotation.y = Math.PI;
          const center = bounds.getCenter(new THREE.Vector3());
          model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);

          const player = new THREE.Group();
          player.position.set(x, y, 0);
          player.add(model);
          scene.add(player);

          const mixer = new THREE.AnimationMixer(model);
          mixers.push(mixer);
          if (model.animations.length > 0) {
            const clip = role === "batter"
              ? THREE.AnimationUtils.subclip(model.animations[0], "batting-swing", 0, BAT_SWING_END_FRAME, 30)
              : model.animations[0];
            if (role === "batter") {
              clip.tracks = clip.tracks.filter((track) => track.name !== "mixamorigHips.position");
            }
            actions[role] = mixer.clipAction(clip);
          }
        });

        let previousTime = 0;
        const render = (time) => {
          if (cancelled) return;
          const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
          previousTime = time;
          mixers.forEach((mixer) => mixer.update(delta));
          renderer.render(scene, camera);
          animationFrame = window.requestAnimationFrame(render);
        };
        animationFrame = window.requestAnimationFrame(render);

        const play = (action, duration) => {
          if (!action) return;
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = false;
          if (duration) action.setDuration(duration);
          action.play();
        };
        onReady({
          pitch: () => play(actions.pitcher),
          swing: () => play(actions.batter, BAT_SWING_DURATION),
        });
        const missingAnimations = loadedPlayers
          .filter(({ model }) => model.animations.length === 0)
          .map(({ role }) => role);
        if (missingAnimations.length) {
          onError(`El modelo ${missingAnimations.join(" y ")} no contiene una animación.`);
        }
      } catch (error) {
        if (!cancelled) {
          onError(error instanceof Error ? error.message : "No se pudieron cargar los modelos del minijuego.");
        }
      }
    };

    initializePlayers();
    return () => {
      cancelled = true;
      onReady(null);
      resizeObserver?.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      mixers.forEach((mixer) => mixer.stopAllAction());
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [onError, onReady]);

  return <div ref={containerRef} className="game-players" aria-hidden="true" />;
}

export default function MiniJuego({ unlock, unlockHighScore, unlockPostal11, challengeCompleted }) {
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [swinging, setSwinging] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState("Espera el lanzamiento");
  const [showInstructions, setShowInstructions] = useState(true);
  const [showVictory, setShowVictory] = useState(false);
  const [pauseView, setPauseView] = useState(null);
  const [playersError, setPlayersError] = useState("");
  const [stats, setStats] = useState(() => {
    try { return { ...emptyStats, ...JSON.parse(window.localStorage.getItem("waysball-game-stats") || "{}") }; }
    catch { return emptyStats; }
  });
  const scoreRef = useRef(0);
  const strikeRef = useRef(0);
  const resolvedRef = useRef(false);
  const timersRef = useRef([]);
  const pitchBallRef = useRef(null);
  const hitZoneRef = useRef(null);
  const playerAnimationsRef = useRef(null);

  const handlePlayersReady = useCallback((animations) => {
    playerAnimationsRef.current = animations;
  }, []);
  const handlePlayersError = useCallback((error) => {
    setPlayersError(error);
  }, []);

  const clearTimers = () => { timersRef.current.forEach(window.clearTimeout); timersRef.current = []; };
  const later = (callback, delay) => { const timer = window.setTimeout(callback, delay); timersRef.current.push(timer); };

  const schedulePitch = () => {
    resolvedRef.current = false;
    setPhase("waiting");
    setMessage("Espera el lanzamiento");
    later(() => {
      setPhase("windup");
      setMessage("El lanzador se prepara");
      playerAnimationsRef.current?.pitch();
      later(() => {
        setPhase("pitching");
        setMessage("Sigue la pelota");
        later(() => resolvePitch(false), 1600);
      }, PITCH_RELEASE_SECONDS * 1000);
    }, 750 + Math.random() * 900);
  };

  const resolvePitch = (hit, resultMessage) => {
    if (resolvedRef.current) return;
    resolvedRef.current = true;
    clearTimers();
    setPhase("result");
    if (hit) {
      setMessage(resultMessage || "¡Batazo conectado! +100");
      const nextScore = scoreRef.current + 100;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setStats((current) => ({ ...current, maxScore: Math.max(current.maxScore, nextScore), totalPoints: current.totalPoints + 100 }));
      if (nextScore >= 1000) unlockHighScore();
      if (nextScore >= 1500) unlockPostal11();
      if (nextScore >= 500 && !challengeCompleted) { unlock(); setPhase("victory"); setShowVictory(true); return; }
      later(schedulePitch, 850);
      return;
    }
    setMessage(resultMessage || "¡Strike! La pelota pasó la cuadrícula.");
    const nextStrikes = Math.min(strikeRef.current + 1, 3);
    strikeRef.current = nextStrikes;
    setStrikes(nextStrikes);
    setStats((current) => ({ ...current, totalStrikes: current.totalStrikes + 1 }));
    if (nextStrikes >= 3) later(() => setPhase("lost"), 650);
    else later(schedulePitch, 900);
  };

  const beginGame = () => {
    clearTimers(); 
    scoreRef.current = 0; 
    strikeRef.current = 0; 
    resolvedRef.current = false;
    setScore(0); 
    setStrikes(0); 
    setSwinging(false); 
    setPhase("countdown"); 
    setShowInstructions(false); 
    setShowVictory(false); 
    setPauseView(null);
    setMessage("Prepárate");

    // Secuencia de cuenta regresiva 3, 2, 1, ¡ADELANTE!
    setCountdownNumber("3");
    later(() => setCountdownNumber("2"), 800);
    later(() => setCountdownNumber("1"), 1600);
    later(() => setCountdownNumber("¡ADELANTE!"), 2400);

    // Iniciar la partida tras completar la cuenta regresiva
    later(() => {
      setCountdownNumber(null);
      schedulePitch();
    }, 3200);
  };

  const swing = () => {
    if (swinging || (phase !== "waiting" && phase !== "pitching")) return;
    setSwinging(true);
    playerAnimationsRef.current?.swing();
    if (phase === "waiting") resolvePitch(false, "Muy pronto. Espera a que salga la pelota.");
    else {
      const ballBounds = pitchBallRef.current?.getBoundingClientRect();
      const zoneBounds = hitZoneRef.current?.getBoundingClientRect();
      if (!ballBounds || !zoneBounds) resolvePitch(false, "No pudimos ubicar la pelota. ¡Strike!");
      else {
        const ballCenterX = ballBounds.left + ballBounds.width / 2;
        const ballCenterY = ballBounds.top + ballBounds.height / 2;
        const hit = ballCenterX >= zoneBounds.left && ballCenterX <= zoneBounds.right && ballCenterY >= zoneBounds.top && ballCenterY <= zoneBounds.bottom;
        const message = hit ? "¡Batazo conectado dentro de la cuadrícula! +100" : ballCenterY < zoneBounds.top ? "Bateaste antes de que entrara a la cuadrícula." : "La pelota ya pasó la cuadrícula. ¡Strike!";
        resolvePitch(hit, message);
      }
    }
    later(() => setSwinging(false), 380);
  };

  const pauseGame = () => {
    if (["idle", "countdown", "lost"].includes(phase) || showVictory || pauseView) return;
    clearTimers(); resolvedRef.current = true; setSwinging(false); setPhase("paused"); setPauseView("menu"); setMessage("Juego en pausa");
  };

  const continueGame = () => { setPauseView(null); setShowVictory(false); schedulePitch(); };

  useEffect(() => {
    try { window.localStorage.setItem("waysball-game-stats", JSON.stringify(stats)); } catch {}
  }, [stats]);

  useEffect(() => () => clearTimers(), []);

  return (
    <main className="game-page">
      <div className="scoreboard">
        <div><span>Puntos</span><strong>{String(score).padStart(4, "0")}</strong></div>
        <button 
          className="pause-button" 
          onClick={pauseGame} 
          disabled={showInstructions || showVictory || Boolean(pauseView) || ["idle", "countdown", "lost"].includes(phase)} 
          aria-label="Pausar juego"
        >
          <Pause size={18} />
        </button>
        <div><span>Strikes</span><strong>{strikes} / 3</strong></div>
      </div>

      <div className="ballpark">
        <GamePlayers onReady={handlePlayersReady} onError={handlePlayersError} />
        <div ref={hitZoneRef} className="hit-zone" aria-hidden="true">
          <i /><i /><i /><i /><b />
        </div>
        <div ref={pitchBallRef} className={`pitch-ball ${phase === "pitching" ? "thrown" : ""}`} />
        
        {phase === "countdown" && countdownNumber && (
          <div className="countdown-overlay">
            <span key={countdownNumber} className="countdown-text">
              {countdownNumber}
            </span>
          </div>
        )}

        <div className="game-instruction">{message}</div>
        {playersError && <div className="game-player-error" role="status">{playersError}</div>}
      </div>

      <section className="game-controls">
        <button className="swing-button" onClick={swing} disabled={swinging || !(["waiting", "pitching"].includes(phase))}>Swing</button>
      </section>

      {(showInstructions || phase === "lost" || showVictory || pauseView) && (
        <div className="game-modal-layer" role="dialog" aria-modal="true">
          <div className="game-modal">
            {showInstructions ? (
              <>
                <span className="eyebrow">Home Run Norte</span>
                <h2>Conecta el batazo.</h2>
                <p>Espera el lanzamiento y pulsa Swing cuando la pelota llegue a la zona.</p>
                <div className="game-rules">
                  <p><span>01</span> Cada batazo conectado suma 100 puntos.</p>
                  <p><span>02</span> Si fallas tres veces termina la entrada.</p>
                  <p><span>03</span> Consigue 500 puntos para completar el reto.</p>
                </div>
                <button className="primary-button full" onClick={beginGame}>
                  Comenzar entrada <Gamepad2 size={18} />
                </button>
              </>
            ) : phase === "lost" ? (
              <>
                <span className="eyebrow">Fin de la entrada</span>
                <h2>Perdiste.</h2>
                <p>Observa la pelota y espera a que se acerque al cuadro antes de pulsar Swing.</p>
                <button className="primary-button full" onClick={beginGame}>
                  Reintentar <RefreshCw  size={18} />
                </button>
              </>
            ) : showVictory ? (
              <>
                <span className="eyebrow">Home Run Norte</span>
                <h2>Victoria.</h2>
                <p>Alcanzaste 500 puntos y conquistaste la Copa Waysball.</p>
                <button className="primary-button full" onClick={continueGame}>
                  Seguir bateando <Icon name="game" />
                </button>
              </>
            ) : pauseView === "stats" ? (
              <>
                <span className="eyebrow">Trayectoria Waysball</span>
                <h2>Estadísticas.</h2>
                <div className="game-stats">
                  <div><span>Máximo puntaje</span><strong>{stats.maxScore}</strong></div>
                  <div><span>Puntos históricos</span><strong>{stats.totalPoints}</strong></div>
                  <div><span>Strikes históricos</span><strong>{stats.totalStrikes}</strong></div>
                </div>
                <button className="primary-button full" onClick={continueGame}>
                  Continuar <Gamepad2 size={18} />
                </button>
                <button className="modal-secondary-button" onClick={() => setPauseView("menu")}>
                  Volver al menú
                </button>
              </>
            ) : (
              <>
                <span className="eyebrow">Entrada en pausa</span>
                <h2>Pausa.</h2>
                <div className="pause-actions">
                  <button className="primary-button full" onClick={continueGame}>
                    Continuar <Gamepad2 size={18} />
                  </button>
                  <button className="modal-secondary-button" onClick={beginGame}>
                    Reiniciar <RefreshCw size={18} />
                  </button>
                  <button className="modal-secondary-button" onClick={() => setPauseView("stats")}>
                    Estadísticas <TrendingUp size={18} />
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