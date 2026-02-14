import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function YesPage() {
    const navigate = useNavigate();

    const [bouquetClicks, setBouquetClicks] = useState(0);
    const [showNote, setShowNote] = useState(false);
    const [petalsOn, setPetalsOn] = useState(false);

    // 🎵 music
    const [playSong, setPlaySong] = useState(false);
    const ytEmbedUrl =
        "https://www.youtube.com/embed/rKNYV2RlRKY?start=55&autoplay=1&mute=0";

    const bouquetImg =
        "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f490.png"; // 💐
    const mailImg =
        "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f48c.png"; // 💌
    const petalEmoji = "🌼";

    const message = `Who would have thought that the girl I used to tease for my friend would be the reason I’m doing this coding stuff? I just to say na i am grateful na nakilala kita. Masaya ako kapag nakakausap kita. All those places na sinabi ko sayo na gusto kong puntahan kasama ka, totoo lahat yon. Tinatawan mo siguro ako pero seryoso ako ron, gusto ko mag-bake ng cake at cupcakes na kasama ka. Gusto ko mag-hike tapos manuod ng live bands sa cozy cove sa baguio na kasama ka. I don't know what future holds pero sana matupad lahat yan na ikaw ang kasama ko. Pero syempre para matupad yan, mag-aral muna tayo nang mabuti ngayon. I know it will never be easy, there will be a times na you feel like you're tired pero sana every time na you feel that, may you remember this letter, na there's someone believing and hping that next time she will edit is yung tarpaulin mo na kapag graduate at pumasa ka na sa board exam mo. Andito lang ako palagi. Happy valentines, my special friend! I like you sobra sobra.`;

    // ✅ "Full screen" petals (only shown after 5 clicks)
    const petals = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 120; i++) {
            arr.push({
                id: i,
                left: Math.random() * 100, // % of phone container
                delay: Math.random() * 1.8,
                dur: 2.8 + Math.random() * 2.8,
                size: 16 + Math.random() * 18,
                drift: -20 + Math.random() * 40,
                rot: Math.random() * 360,
            });
        }
        return arr;
    }, []);

    // ✅ click-burst petals (every bouquet click)
    const [burstPetals, setBurstPetals] = useState([]);
    const burstIdRef = useRef(0);

    const spawnBurst = () => {
        const now = Date.now();
        const batch = [];

        // 🌸 MUCH heavier burst
        const count = 40; // ← increase petals per click (try 40–60)

        for (let i = 0; i < count; i++) {
            burstIdRef.current += 1;

            batch.push({
                id: `${now}-${burstIdRef.current}`,
                left: 30 + Math.random() * 40, // wider horizontal spread
                delay: Math.random() * 0.05,
                dur: 1 + Math.random() * 1.5,
                size: 16 + Math.random() * 20,
                drift: -80 + Math.random() * 160, // BIGGER horizontal drift
                rot: Math.random() * 360,
            });
        }

        setBurstPetals((prev) => {
            const merged = [...prev, ...batch];
            return merged.slice(-300); // allow more petals on screen
        });

        // cleanup
        setTimeout(() => {
            setBurstPetals((prev) =>
                prev.filter((p) => !batch.some((b) => b.id === p.id))
            );
        }, 2500);
    };

    const handleBouquetClick = () => {
        spawnBurst(); // ✅ always rain petals on click

        setBouquetClicks((c) => {
            if (c >= 5) return c; // stop counting after 5
            const next = c + 1;
            if (next === 5) setPetalsOn(true); // ✅ turn on full-screen petals at 5
            return next;
        });
    };

    // autoplay music if coming from YES click
    useEffect(() => {
        const shouldAutoplay = sessionStorage.getItem("autoplaySong") === "1";
        if (shouldAutoplay) {
            setPlaySong(true);
            sessionStorage.removeItem("autoplaySong");
        }
    }, []);

    const openNote = () => setShowNote(true);

    return (
        <div className="page yes-page">
            {/* ✅ Same phone wrapper as Ask (centers card + prevents extra space) */}
            <div className="phone">
                {/* click-burst petals (every click) */}
                {burstPetals.length > 0 && (
                    <div className="petal-layer burst-layer" aria-hidden="true">
                        {burstPetals.map((p) => (
                            <div
                                key={p.id}
                                className="petal burst-petal"
                                style={{
                                    left: `${p.left}%`,
                                    animationDelay: `${p.delay}s`,
                                    animationDuration: `${p.dur}s`,
                                    fontSize: `${p.size}px`,
                                    "--drift": `${p.drift}px`,
                                    "--rot": `${p.rot}deg`,
                                }}
                            >
                                {petalEmoji}
                            </div>
                        ))}
                    </div>
                )}

                {/* full-screen petals (after 5 clicks) */}
                {petalsOn && (
                    <div className="petal-layer" aria-hidden="true">
                        {petals.map((p) => (
                            <div
                                key={p.id}
                                className="petal"
                                style={{
                                    left: `${p.left}%`, // ✅ percent inside phone
                                    animationDelay: `${p.delay}s`,
                                    animationDuration: `${p.dur}s`,
                                    fontSize: `${p.size}px`,
                                    "--drift": `${p.drift}px`,
                                    "--rot": `${p.rot}deg`,
                                }}
                            >
                                {petalEmoji}
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-hearts" aria-hidden="true" />

                <div className="card yes-card">
                    <h1 className="title">Yaaay! You said YES 🥰</h1>
                    <p className="subtitle">
                        Click the bouquet <b>5 times</b> 💐
                    </p>

                    <button className="bouquet-btn" onClick={handleBouquetClick}>
                        <img src={bouquetImg} alt="Bouquet" />
                        <span>{bouquetClicks}/5</span>
                    </button>

                    {bouquetClicks >= 5 && (
                        <button className="mail-btn" onClick={openNote}>
                            <img src={mailImg} alt="Mail" />
                            <span>OPEN ME!</span>
                        </button>
                    )}

                    <button className="btn reset" onClick={() => navigate("/")}>
                        Back
                    </button>
                </div>

                {/* 🎵 Background song */}
                <div className="music-wrap">
                    {playSong && (
                        <iframe
                            src={ytEmbedUrl}
                            title="Valentine song"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="hidden-audio"
                        />
                    )}

                    {!playSong && (
                        <button className="music-btn" onClick={() => setPlaySong(true)}>
                            ▶ Play song
                        </button>
                    )}
                </div>

                {showNote && (
                    <div className="note-backdrop" onClick={() => setShowNote(false)}>
                        <div className="note-card" onClick={(e) => e.stopPropagation()}>
                            <div className="note-top">
                                <div className="note-rings" aria-hidden="true" />
                                <h2 className="note-title">💌 Seamaara</h2>
                            </div>

                            <pre className="note-text">{message}</pre>

                            <div className="note-bouquet">
                                <img src={bouquetImg} alt="Bouquet" />
                            </div>

                            <button className="btn yes note-close" onClick={() => setShowNote(false)}>
                                Close 💖
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}