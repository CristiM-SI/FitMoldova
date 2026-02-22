
import { LeftPanelProps } from "../types/login.types";

export function LeftPanel({ stats }: LeftPanelProps) {
    return (
        <div className="left-panel">
            {/* Grila decorativă de fundal (linii subțiri albăstrui) */}
            <div className="grid-overlay" />

        {/* Logo / Numele brandului */}
        <a href="/" className="brand-link">
    <div className="brand-name">FitMoldova</div>
        </a>

    {/* Secțiunea hero — centrul vizual al panoului */}
    <div className="hero-content">

        {/* Badge animat cu dot pulsând */}
        <div className="hero-badge">
    <div className="badge-dot" />
    <span className="badge-text">Platforma #1 în Moldova</span>
    </div>

    {/* Titlu principal cu cuvântul "Fitness-ul" în albastru */}
    <h1 className="hero-title">
        Transformă-ți
        <span className="accent">Fitness-ul</span>
    Acum
    </h1>

    {/* Subtitlu descriptiv */}
    <p className="hero-subtitle">
        Alătură-te comunității celor mai motivați sportivi. Urmărește
    progresul, participă la provocări și conectează-te cu pasionați
    de sport.
    </p>

    {/* Statistici (membri, antrenori, satisfacție) — date din props */}
    <div className="stats-row">
        {stats.map((stat, index) => (
                <div className="stat-item" key={index}>
            <div className="stat-number">
                {/* Valoarea numerică (ex: "12K+") */}
    {stat.value.replace(/[K+%]/g, "")}
    <span>{stat.value.replace(/[^K+%]/g, "")}</span>
    </div>
    <div className="stat-label">{stat.label}</div>
        </div>
))}
    </div>
    </div>

    {/* Footer cu copyright */}
    <div className="left-footer">
        © 2025 FitMoldova. Toate drepturile rezervate.
    </div>
    </div>
);
}