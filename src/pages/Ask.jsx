import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Ask() {
  const navigate = useNavigate();

  const [noClicks, setNoClicks] = useState(0);
  const [accepted, setAccepted] = useState(false);

  const gifUrl = "https://media.giphy.com/media/xT0BKBvMYBEq0CcYmY/giphy.gif";

  const sadCats = useMemo(
    () => [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejZuN2o2aGhvN2dqc3JjNjdlc2hjYWZxYzg3OXBhaXl4cTYxd2hybyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7AzEXdIb1wyCTWJntb/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejZuN2o2aGhvN2dqc3JjNjdlc2hjYWZxYzg3OXBhaXl4cTYxd2hybyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/N92tr5rzjZx7wnRKiy/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3OXdzeDdtNm9rYnhnY2M2OXN1MnJ1NjE5aGc5ZGNyOXBlenFtdDBqYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wfS4vDyVsASQygl4mN/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YTRodDNlNDk0ODNubHg1OHF6ZXM4cDl0MmViNHhwazhmNHc5OGU3biZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Rf5Kq1IXnxilMczBI5/giphy.gif",
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExejZuN2o2aGhvN2dqc3JjNjdlc2hjYWZxYzg3OXBhaXl4cTYxd2hybyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aWMJvA76tNnBR9gkpT/giphy.gif",
    ],
    []
  );

  // Lock page scroll while Ask is mounted
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevOverflowX = document.body.style.overflowX;
    const prevHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";
    document.body.style.height = "100%";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overflowX = prevOverflowX;
      document.body.style.height = prevHeight;
    };
  }, []);

  // Preload sad cat GIFs
  useEffect(() => {
    sadCats.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [sadCats]);

  const [spawnedCats, setSpawnedCats] = useState([]);

  const cardRef = useRef(null);

  const yesScale = useMemo(() => Math.min(1 + noClicks * 0.35, 12), [noClicks]);
  const noOpacity = useMemo(() => Math.max(1 - noClicks * 0.18, 0), [noClicks]);
  const noScale = useMemo(() => Math.max(1 - noClicks * 0.08, 0.25), [noClicks]);
  const swallowNo = yesScale >= 6;

  const spawnSadCat = () => {
    setSpawnedCats((prev) => {
      const src = sadCats[Math.floor(Math.random() * sadCats.length)];
      const warm = new Image();
      warm.src = src;

      const size = 56 + Math.random() * 54;
      const rot = -12 + Math.random() * 24;
      const drift = 1 + Math.floor(Math.random() * 4);

      // Phone container boundaries
      const TOP_MIN = 6,
        TOP_MAX = 30;
      const BOT_MIN = 70,
        BOT_MAX = 94;

      const tries = 30;
      const minDistX = 16;
      const minDistY = 10;

      let x = 10 + Math.random() * 80;
      let yPct = TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN);

      for (let i = 0; i < tries; i++) {
        const inTop = Math.random() < 0.5;

        x = 10 + Math.random() * 80;
        yPct = inTop
          ? TOP_MIN + Math.random() * (TOP_MAX - TOP_MIN)
          : BOT_MIN + Math.random() * (BOT_MAX - BOT_MIN);

        const tooClose = prev.some((c) => {
          const dx = Math.abs(c.x - x);
          const dy = Math.abs(c.yPct - yPct);
          return dx < minDistX && dy < minDistY;
        });

        if (!tooClose) break;
      }

      return [
        { id: Date.now() + Math.random(), src, x, yPct, size, rot, drift },
        ...prev,
      ].slice(0, 25);
    });
  };

  const handleNo = () => {
    setNoClicks((v) => {
      const next = v + 1;
      if (next <= 6) spawnSadCat(); // ✅ allow 6 NO clicks now
      return next;
    });
  };

  const handleYes = () => {
    setAccepted(true);
    sessionStorage.setItem("autoplaySong", "1");
    setTimeout(() => navigate("/yes"), 450);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        className="phone"
        style={{
          width: "min(420px, 100vw)",
          height: "100dvh",
          maxHeight: "900px",
          margin: "0 auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="cat-layer" aria-hidden="true">
          {spawnedCats.map((c) => (
            <img
              key={c.id}
              className={`sad-cat drift-${c.drift}`}
              src={c.src}
              alt=""
              style={{
                left: `${c.x}%`,
                top: `${c.yPct}%`,
                width: `${c.size}px`,
                transform: `translate(-50%, -50%) rotate(${c.rot}deg)`,
              }}
            />
          ))}
        </div>

        <div className="bg-hearts" aria-hidden="true" />

        <div className="card" ref={cardRef}>
          <img className="gif" src={gifUrl} alt="Cute heart gif" />
          <h1 className="title">Will you be my Valentine? 💘</h1>
          <p className="subtitle">Be honest… but choose wisely 😌</p>

          <div className="buttons">
            <button
              className="btn yes"
              onClick={handleYes}
              style={{ transform: `scale(${yesScale})` }}
            >
              YES 💖
            </button>

            {!swallowNo && (
              <button
                className="btn no"
                onClick={handleNo}
                style={{ opacity: noOpacity, transform: `scale(${noScale})` }}
              >
                NO 🙃
              </button>
            )}
          </div>

          <div className="hint">
            {accepted
              ? "Okay okay… redirecting 😳"
              : noClicks === 0
              ? "Try clicking NO…"
              : `NO clicks: ${noClicks} ${
                  noClicks >= 6 ? "(max cats reached 😭)" : ""
                }`}
          </div>
        </div>
      </div>
    </div>
  );
}
