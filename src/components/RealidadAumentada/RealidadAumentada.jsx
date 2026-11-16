import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import "./RealidadAumentada.css";

let mindArScriptPromise = null;
const teamModelFiles = {
  "Acereros de Monclova": "pi_acereros.fbx",
  "Caliente de Durango": "pi_caliente.fbx",
  "Charros de Jalisco": "pi_charros.fbx",
  "Dorados de Chihuahua": "pi_doradosanim.fbx",
  "Sultanes de Monterrey": "pi_sultanes.fbx",
  "Rieleros de Aguascalientes": "pi_rieleros.fbx",
  "Algodoneros Unión Laguna": "pi_algodoneros.fbx",
  "Saraperos de Saltillo": "pi_saraperos.fbx",
  "Tecolotes de los Dos Laredos": "pi_tecolotes.fbx",
  "Toros de Tijuana": "pi_toros.fbx",
};
const teamModelSettings = {
  "Acereros de Monclova": { scale: 1, rotation: [0, 0, 0] },
  "Caliente de Durango": { scale: 1, rotation: [0, 0, 0] },
  "Charros de Jalisco": { scale: .8, rotation: [0, 0, 0] },
  "Dorados de Chihuahua": { scale: .6, rotation: [0, 0, 0] },
  "Sultanes de Monterrey": { scale: 1.1, rotation: [0, 0, 0] },
  "Rieleros de Aguascalientes": { scale: 1.3, rotation: [0, 0, 0] },
  "Algodoneros Unión Laguna": { scale: 1.3, rotation: [0, 0, 0] },
  "Saraperos de Saltillo": { scale: 1.5, rotation: [0, 0, 0] },
  "Tecolotes de los Dos Laredos": { scale: 1.9, rotation: [0, 0, 0] },
  "Toros de Tijuana": { scale: .6, rotation: [0, 0, 0] },
};

function loadMindARScript() {
  if (window.MINDAR?.IMAGE?.MindARThree) return Promise.resolve(window.MINDAR);
  if (mindArScriptPromise) return mindArScriptPromise;
  mindArScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js/+esm";
    script.async = true;
    script.dataset.mindAr = "true";
    const timeout = window.setTimeout(() => {
      script.remove();
      mindArScriptPromise = null;
      reject(new Error("MindAR tardó demasiado en cargar. Comprueba tu conexión e inténtalo otra vez."));
    }, 20000);
    script.onload = () => {
      window.clearTimeout(timeout);
      if (window.MINDAR?.IMAGE?.MindARThree) resolve(window.MINDAR);
      else {
        mindArScriptPromise = null;
        reject(new Error("El archivo se descargó, pero no se encontró MindAR.IMAGE.MindARThree."));
      }
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      mindArScriptPromise = null;
      reject(new Error("No se pudo descargar MindAR desde jsDelivr."));
    };
    document.head.appendChild(script);
  });
  return mindArScriptPromise;
}

/* Convierte un dataURL en File para poder compartirlo con el menú del sistema
   (en iOS es la forma más fiable de "Guardar imagen" en Fotos). */
function dataUrlToFile(dataUrl, fileName) {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new File([bytes], fileName, { type: mime });
}

function stopMindAR(mindarThree, container) {
  if (!mindarThree) return Promise.resolve();
  mindarThree.renderer?.setAnimationLoop(null);
  const videos = new Set(container?.querySelectorAll("video") ?? []);
  if (mindarThree.video instanceof HTMLVideoElement) videos.add(mindarThree.video);
  const streams = new Set(
    [...videos].map((video) => video.srcObject).filter((stream) => stream instanceof MediaStream),
  );
  return Promise.resolve()
    .then(() => mindarThree.stop())
    .catch((error) => console.warn("No se pudo detener MindAR limpiamente:", error))
    .finally(() => {
      streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()));
      videos.forEach((video) => {
        video.pause();
        video.srcObject = null;
      });
      container?.replaceChildren();
    });
}

export default function RealidadAumentada({ teams, galleryPhotos, unlock, onOpenTeam, onTeamRecognized, onSavePhoto }) {
  const containerRef = useRef(null);
  const mindarRef = useRef(null);
  const visibleTargetsRef = useRef(new Set());
  const rewardedRef = useRef(false);
  const captureRequestRef = useRef(false);
  const unlockRef = useRef(unlock);
  unlockRef.current = unlock;

  const [camera, setCamera] = useState("idle");
  const [cameraError, setCameraError] = useState("");
  const [libraryStatus, setLibraryStatus] = useState("loading");
  const [libraryError, setLibraryError] = useState("");
  const [recognitionStatus, setRecognitionStatus] = useState("idle");
  const [recognizedTeam, setRecognizedTeam] = useState(null);
  const [particlesEnabled, setParticlesEnabled] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoNote, setPhotoNote] = useState("");
  const [photoSaved, setPhotoSaved] = useState(false);
  const [flashKey, setFlashKey] = useState(0);

  const canSharePhoto = typeof navigator !== "undefined"
    && typeof navigator.share === "function"
    && typeof navigator.canShare === "function";

  useEffect(() => {
    if (!recognizedTeam) setParticlesEnabled(false);
  }, [recognizedTeam]);

  const targetSrc = `${import.meta.env.BASE_URL}targets.mind`;
  useEffect(() => {
    let cancelled = false;
    const prepareAssets = async () => {
      try {
        const [mindar, targetResponse] = await Promise.all([
          loadMindARScript(),
          fetch(targetSrc, { method: "HEAD" }),
        ]);
        if (!mindar?.IMAGE?.MindARThree) throw new Error("No se encontró el motor MindAR para imágenes.");
        if (!targetResponse.ok) throw new Error(`No se encontró el archivo de marcadores (${targetResponse.status}).`);
        if (!cancelled) setLibraryStatus("ready");
      } catch (error) {
        if (!cancelled) {
          setLibraryError(error instanceof Error ? error.message : "No se pudieron preparar los recursos de AR.");
          setLibraryStatus("error");
        }
      }
    };
    prepareAssets();
    return () => { cancelled = true; };
  }, [targetSrc]);

  useEffect(() => () => {
    const mindarThree = mindarRef.current;
    const container = containerRef.current;
    mindarRef.current = null;
    if (!mindarThree) return;
    void stopMindAR(mindarThree, container);
  }, []);

  const retryLibrary = () => {
    mindArScriptPromise = null;
    setLibraryError("");
    setLibraryStatus("loading");
    loadMindARScript()
      .then((mindar) => fetch(targetSrc, { method: "HEAD" }).then((response) => {
        if (!response.ok) throw new Error(`No se encontró el archivo de marcadores (${response.status}).`);
        if (!mindar?.IMAGE?.MindARThree) throw new Error("No se encontró el motor MindAR para imágenes.");
        setLibraryStatus("ready");
      }))
      .catch((error) => {
        setLibraryError(error instanceof Error ? error.message : "No se pudieron preparar los recursos de AR.");
        setLibraryStatus("error");
      });
  };

  /* Compone la foto: fondo de la cámara (recortado igual que en pantalla, con
     "cover") + el canvas del renderer 3D encima. Devuelve un dataURL JPEG. */
  const drawArPhoto = () => {
    const mindarThree = mindarRef.current;
    const container = containerRef.current;
    if (!mindarThree || !container) return null;
    const video = mindarThree.video instanceof HTMLVideoElement
      ? mindarThree.video
      : container.querySelector("video");
    const threeCanvas = mindarThree.renderer?.domElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height || !video?.videoWidth || !video?.videoHeight) return null;

    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.round(width * scale));
    output.height = Math.max(1, Math.round(height * scale));
    const context = output.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#001c2d";
    context.fillRect(0, 0, output.width, output.height);

    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const targetRatio = width / height;
    const videoRatio = videoWidth / videoHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = videoWidth;
    let sourceHeight = videoHeight;
    if (videoRatio > targetRatio) {
      sourceWidth = videoHeight * targetRatio;
      sourceX = (videoWidth - sourceWidth) / 2;
    } else if (videoRatio < targetRatio) {
      sourceHeight = videoWidth / targetRatio;
      sourceY = (videoHeight - sourceHeight) / 2;
    }
    context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, output.width, output.height);

    if (threeCanvas && threeCanvas.width > 0 && threeCanvas.height > 0) {
      context.drawImage(threeCanvas, 0, 0, output.width, output.height);
    }

    return output.toDataURL("image/jpeg", 0.92);
  };

  /* La captura se hace dentro del bucle de render (justo después de dibujar):
     así el buffer del canvas WebGL todavía tiene el modelo 3D y no sale vacío. */
  const takePhoto = () => {
    if (camera !== "active" || !mindarRef.current) return;
    setFlashKey((key) => key + 1);
    setPhotoNote("");
    setPhotoSaved(false);
    captureRequestRef.current = true;
  };

  /* Guardar = enviar la foto a la galería de Waysball (sección "Mis fotos").
     Ya no se descarga al carrete: así el navegador no muestra el aviso de
     descarga y la foto queda dentro de la app. */
  const savePhotoToGallery = () => {
    if (!photo || photoSaved) return;
    onSavePhoto?.({ dataUrl: photo, teamName: recognizedTeam?.name ?? null });
    setPhotoSaved(true);
    setPhotoNote('Foto guardada en la sección "Mis fotos" de la galería Waysball.');
  };

  const sharePhoto = async () => {
    if (!photo) return;
    try {
      const file = dataUrlToFile(photo, `waysball-ar-${Date.now()}.jpg`);
      await navigator.share({ files: [file], title: "Waysball · Realidad Aumentada" });
      setPhotoNote("Foto compartida.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("No se pudo compartir la foto:", error);
      setPhotoNote("No se pudo abrir el menú de compartir. Usa Guardar.");
    }
  };

  const closePhoto = () => {
    setPhoto(null);
    setPhotoNote("");
    setPhotoSaved(false);
  };

  const startAR = async () => {
    setCameraError("");
    if (!window.isSecureContext) {
      setCamera("error");
      setCameraError("La cámara necesita HTTPS en el teléfono. Abre esta app con una URL HTTPS segura.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("error");
      setCameraError("Este navegador no ofrece acceso a la cámara. Actualiza Safari/Chrome y vuelve a intentarlo.");
      return;
    }
    if (libraryStatus !== "ready") {
      setCamera("error");
      setCameraError(libraryError || "Espera a que MindAR y el marcador terminen de cargar.");
      return;
    }

    let mindarThree;
    const animationMixers = [];
    try {
      setCamera("loading");
      setRecognitionStatus("loading");
      const [THREE, { FBXLoader }] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/three@0.160.0/+esm"),
        import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js/+esm"),
      ]);
      const MindARThree = window.MINDAR?.IMAGE?.MindARThree;
      if (!MindARThree) throw new Error("MindAR no terminó de inicializarse. Recarga la página e inténtalo otra vez.");
      mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: targetSrc,
        uiLoading: "no",
        uiScanning: "no",
        uiError: "no",
      });
      mindarRef.current = mindarThree;

      const { renderer, scene, camera: arCamera } = mindarThree;
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(1, 2, 3);
      scene.add(directionalLight);

      /*Carga equipos y animaciones 3D*/
      const targetTeams = teams;
      const modelLoader = new FBXLoader();
      visibleTargetsRef.current.clear();
      targetTeams.forEach((team, targetIndex) => {
        const anchor = mindarThree.addAnchor(targetIndex);
        const modelFile = teamModelFiles[team.name];
        if (modelFile) {
          const modelSettings = teamModelSettings[team.name] ?? { scale: 1, rotation: [0, 0, 0] };
          modelLoader.load(
            `${import.meta.env.BASE_URL}Animaciones/${modelFile}`,
            (model) => {
              model.traverse((object) => {
                if (!object.isMesh) return;
                const materials = Array.isArray(object.material) ? object.material : [object.material];
                materials.forEach((material) => {
                  if (!material) return;
                  material.alphaMap = null;
                  material.opacity = 1;
                  material.transparent = false;
                  material.depthWrite = true;
                  material.needsUpdate = true;
                });
              });
              const bounds = new THREE.Box3().setFromObject(model);
              const dimensions = bounds.getSize(new THREE.Vector3());
              const largestDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
              if (largestDimension > 0) {
                const modelTransform = new THREE.Group();
                modelTransform.scale.setScalar(modelSettings.scale / largestDimension);
                modelTransform.rotation.set(...modelSettings.rotation.map(THREE.MathUtils.degToRad));
                const centerOffset = new THREE.Group();
                centerOffset.position.copy(bounds.getCenter(new THREE.Vector3())).negate();
                centerOffset.add(model);
                modelTransform.add(centerOffset);
                anchor.group.add(modelTransform);
              } else {
                anchor.group.add(model);
              }
              const animationMixer = new THREE.AnimationMixer(model);
              if (model.animations.length > 0) {
                animationMixer.clipAction(model.animations[0]).play();
                animationMixers.push(animationMixer);
              }
            },
            undefined,
            (error) => console.error(`No se pudo cargar el modelo 3D de ${team.name}:`, error),
          );
        }
        anchor.onTargetFound = () => {
          visibleTargetsRef.current.add(targetIndex);
          setRecognizedTeam({ ...team, targetIndex });
          onTeamRecognized?.(targetIndex);
          if (!rewardedRef.current) {
            rewardedRef.current = true;
            unlockRef.current();
          }
        };
        anchor.onTargetLost = () => {
          visibleTargetsRef.current.delete(targetIndex);
          setRecognizedTeam((current) => {
            if (current?.targetIndex !== targetIndex) return current;
            const nextTargetIndex = visibleTargetsRef.current.values().next().value;
            return nextTargetIndex === undefined ? null : { ...targetTeams[nextTargetIndex], targetIndex: nextTargetIndex };
          });
        };
      });

      await mindarThree.start();
  setCamera("active");
      setRecognitionStatus("scanning");

      const animationClock = new THREE.Clock();
      renderer.setAnimationLoop(() => {
        const delta = animationClock.getDelta();
        animationMixers.forEach((animationMixer) => animationMixer.update(delta));
        renderer.render(scene, arCamera);
        if (captureRequestRef.current) {
          captureRequestRef.current = false;
          const dataUrl = drawArPhoto();
          if (dataUrl) setPhoto(dataUrl);
        }
      });
    } catch (error) {
      console.error(error);
      await stopMindAR(mindarThree, containerRef.current);
      mindarRef.current = null;
      setCamera("error");
      setRecognitionStatus("error");
      const errorName = error instanceof DOMException ? error.name : "";
      setCameraError(errorName === "NotAllowedError"
        ? "Safari/Chrome no concedió permiso para la cámara. Revisa los permisos del sitio."
        : errorName === "NotFoundError"
          ? "No se encontró una cámara disponible en este dispositivo."
          : error instanceof Error
            ? error.message
            : "No se pudo iniciar MindAR. Revisa la consola para ver el error exacto.");
    }
  };

  return (
    <main className="camera-page">
      <div ref={containerRef} className="ar-container" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
      
      {camera !== "active" && (
        <img src={galleryPhotos[2]} alt="Vista previa" />
      )}

      <div className="camera-overlay" />

      {camera === "loading" && (
        <div className="ar-loading" role="status" aria-live="polite">
          <span className="ar-loading-spinner" aria-hidden="true" />
          <strong>Cargando</strong>
          <small>Preparando cámara y modelos 3D…</small>
        </div>
      )}

      {recognizedTeam && particlesEnabled && (
        <div className="ar-particle-field" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <i className={index % 4 === 0 ? "smoke" : "ember"} key={index} />
          ))}
        </div>
      )}

      {/* El marco de escaneo solo se muestra mientras se busca el logo:
          al detectarlo se oculta para no tapar el modelo ni la tarjeta del club. */}
      {!recognizedTeam && (
        <div className="scan-frame">
          <i /><i /><i /><i />
          <span>Centra el logo dentro del marco</span>
        </div>
      )}

      {recognizedTeam && (
        <div className="ar-anchor-card">
          <img src={recognizedTeam.logo} alt="" />
          <div>
            <span>Marcador reconocido · 99%</span>
            <strong>{recognizedTeam.name}</strong>
            <small>Anclaje listo para modelo 3D</small>
          </div>
          <button
            className="ar-team-button"
            type="button"
            onClick={() => onOpenTeam?.(recognizedTeam.targetIndex)}
          >
            Ver equipo <Icon name="arrow" size={16} />
          </button>
        </div>
      )}

      <div className={`camera-copy ${camera === "active" ? "live" : ""}`}>
        <span className="eyebrow light">Ballpark AR · MindAR</span>
        {camera !== "active" && <h1>El juego sale<br />de la pantalla.</h1>}
        <p role={camera === "error" || libraryStatus === "error" ? "alert" : "status"} aria-live="polite">
          {camera === "error"
            ? cameraError
            : libraryStatus === "error"
              ? libraryError
              : libraryStatus === "loading"
                ? "Preparando MindAR y el archivo de marcadores..."
            : camera === "active"
              ? recognitionStatus === "loading"
                ? "Iniciando motor de Realidad Aumentada..."
                : recognizedTeam
                  ? "Marcador reconocido con éxito."
                  : "Muestra el logo de frente y con buena iluminación."
              : "Escanea la imagen para reconocer el club."}
        </p>
        
        {camera !== "active" && (
          <button className="primary-button light-button" disabled={libraryStatus === "loading" || camera === "loading"} onClick={libraryStatus === "error" ? retryLibrary : startAR}>
            <Icon name="camera" /> {libraryStatus === "loading" ? "Preparando AR..." : libraryStatus === "error" ? "Reintentar carga" : camera === "error" ? "Reintentar cámara" : camera === "loading" ? "Cargando..." : "Activar cámara"}
          </button>
        )}

        {camera === "active" && (
          <div className={`scanning ${recognizedTeam ? "found" : ""}`}>
            <i />{recognizedTeam ? "Seguimiento activo" : "Buscando marcador..."}
          </div>
        )}
      </div>

      {camera === "active" && (
        <button
          className="camera-shutter"
          type="button"
          onClick={takePhoto}
          aria-label="Tomar foto"
          title="Tomar foto"
        >
          <span aria-hidden="true" />
        </button>
      )}

      {flashKey > 0 && <span className="camera-flash" key={flashKey} aria-hidden="true" />}

      {photo && (
        <div className="photo-preview" role="dialog" aria-modal="true" aria-label="Foto tomada">
          <img src={photo} alt="Foto tomada en realidad aumentada" />
          <div className="photo-preview-actions">
            {canSharePhoto && (
              <button type="button" onClick={sharePhoto}>
                Compartir
              </button>
            )}
            <button type="button" onClick={savePhotoToGallery} disabled={photoSaved}>
              {photoSaved ? "Guardada" : "Guardar"}
            </button>
            <button className="ghost" type="button" onClick={closePhoto}>
              Cerrar
            </button>
          </div>
          <small className={`photo-preview-note ${photoSaved ? "saved" : ""}`} role="status" aria-live="polite">
            {photoNote || 'Guarda la foto en la sección "Mis fotos" de la galería Waysball.'}
          </small>
        </div>
      )}

      {camera === "active" && recognizedTeam && (
        <button
          className={`particle-toggle ${particlesEnabled ? "active" : ""}`}
          type="button"
          aria-pressed={particlesEnabled}
          onClick={() => setParticlesEnabled((enabled) => !enabled)}
        >
          PARTICULAS
        </button>
      )}
    </main>
  );
}