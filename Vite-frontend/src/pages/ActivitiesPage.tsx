import { useState, useEffect } from "react";
import { activityApi, type ActivityDto } from "../services/api/activityApi";
import Navbar from "../components/layout/Navbar";

const TYPE_EMOJI: Record<string, string> = {
    Alergare: "🏃", Ciclism: "🚴", Fitness: "💪",
    Înot: "🏊", "Mers pe jos": "🚶", Yoga: "🧘", Drumeție: "🥾",
};

const TYPE_COLOR: Record<string, string> = {
    Alergare: "#ef4444", Ciclism: "#f59e0b", Fitness: "#8b5cf6",
    Înot: "#06b6d4", "Mers pe jos": "#10b981", Yoga: "#ec4899", Drumeție: "#84cc16",
};

function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return dateStr;
    }
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ActivityModal({ activity, onClose }: { activity: ActivityDto; onClose: () => void }) {
    const emoji = TYPE_EMOJI[activity.type] ?? "🏋️";
    const color = TYPE_COLOR[activity.type] ?? "#0ea5e9";

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)", zIndex: 50, display: "flex",
            alignItems: "center", justifyContent: "center", padding: "1rem",
            animation: "fadeIn 0.2s ease",
        }}>
            <div onClick={(e) => e.stopPropagation()} style={{
                background: "#162032", border: "1px solid #1e3a5f", borderRadius: "1.25rem",
                width: "100%", maxWidth: "480px", padding: "2rem",
                animation: "slideUp 0.25s ease", position: "relative",
            }}>
                <button onClick={onClose} style={{
                    position: "absolute", top: "1.25rem", right: "1.25rem",
                    background: "#1e3a5f", border: "none", borderRadius: "50%",
                    width: 32, height: 32, color: "#94a3b8", cursor: "pointer",
                    fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "2.5rem" }}>{emoji}</span>
                    <div>
                        <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.3 }}>
                            {activity.name}
                        </h2>
                        <span style={{
                            display: "inline-block", marginTop: "0.35rem",
                            background: `${color}22`, color, border: `1px solid ${color}55`,
                            padding: "0.2rem 0.65rem", borderRadius: "999px",
                            fontSize: "0.75rem", fontWeight: 600,
                        }}>{activity.type}</span>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginBottom: "1.5rem" }}>
                    {[
                        { icon: "📏", label: "Distanță", value: activity.distance },
                        { icon: "⏱️", label: "Durată", value: activity.duration },
                        { icon: "🔥", label: "Calorii", value: `${activity.calories} kcal` },
                        { icon: "📅", label: "Data", value: formatDate(activity.date) },
                    ].map(({ icon, label, value }) => (
                        <div key={label} style={{
                            background: "#0f1e30", border: "1px solid #1e3a5f",
                            borderRadius: "0.75rem", padding: "0.85rem 1rem",
                        }}>
                            <div style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }}>{icon}</div>
                            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}>{value}</div>
                            <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.1rem" }}>{label}</div>
                        </div>
                    ))}
                </div>

                {activity.description && (
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                        {activity.description}
                    </p>
                )}

                {activity.createdBy && (
                    <p style={{ color: "#64748b", fontSize: "0.78rem", marginBottom: "1.25rem" }}>
                        Creat de <span style={{ color: "#94a3b8" }}>{activity.createdBy}</span>
                        {activity.participantsCount > 0 && ` · ${activity.participantsCount} participanți`}
                    </p>
                )}

                <button style={{
                    width: "100%", padding: "0.85rem",
                    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                    border: "none", borderRadius: "0.75rem", color: "#fff",
                    fontWeight: 700, fontSize: "1rem", cursor: "pointer", letterSpacing: "0.03em",
                }}>🚀 Începe activitatea</button>
            </div>
        </div>
    );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function ActivityCard({ activity, onClick }: { activity: ActivityDto; onClick: () => void }) {
    const [hovered, setHovered] = useState(false);
    const emoji = TYPE_EMOJI[activity.type] ?? "🏋️";
    const color = TYPE_COLOR[activity.type] ?? "#0ea5e9";

    return (
        <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
             style={{
                 background: hovered ? "#1a2d45" : "#162032",
                 border: `1px solid ${hovered ? "#0ea5e9" : "#1e3a5f"}`,
                 borderRadius: "1rem", padding: "1.25rem", cursor: "pointer",
                 transition: "all 0.2s ease", transform: hovered ? "translateY(-3px)" : "none",
                 boxShadow: hovered ? "0 8px 30px rgba(14,165,233,0.15)" : "none",
             }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.9rem" }}>{emoji}</span>
                <span style={{
                    background: `${color}22`, color, border: `1px solid ${color}55`,
                    padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600,
                }}>{activity.type}</span>
            </div>
            <h3 style={{ margin: "0 0 0.85rem", color: "#f1f5f9", fontSize: "0.95rem", fontWeight: 700, lineHeight: 1.4 }}>
                {activity.name}
            </h3>
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem",
                borderTop: "1px solid #1e3a5f", paddingTop: "0.85rem",
            }}>
                {[
                    { icon: "📏", val: activity.distance },
                    { icon: "⏱️", val: activity.duration },
                    { icon: "🔥", val: `${activity.calories} kcal` },
                ].map(({ icon, val }) => (
                    <div key={icon} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "0.85rem" }}>{icon}</div>
                        <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.2rem" }}>{val}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Pagina principală ────────────────────────────────────────────────────────
export default function ActivitiesPage() {
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activFilter, setActivFilter] = useState("Toate");
    const [selected, setSelected] = useState<ActivityDto | null>(null);

    useEffect(() => {
        activityApi.getAll()
            .then(setActivities)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const types = ["Toate", ...Array.from(new Set(activities.map((a) => a.type))).sort()];

    const filtered = activFilter === "Toate"
        ? activities
        : activities.filter((a) => a.type === activFilter);

    const totalCalorii = activities.reduce((s, a) => s + a.calories, 0);

    return (
        <div style={{ minHeight: "100vh", background: "#0d1117", color: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
                ::-webkit-scrollbar { width: 6px }
                ::-webkit-scrollbar-track { background: #0d1117 }
                ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px }
            `}</style>

            <Navbar />

            <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.4rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        🏋️ Activități & <span style={{ color: "#0ea5e9" }}>Antrenamente</span>
                    </h1>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
                        Explorează activitățile din comunitatea FitMoldova
                    </p>
                </div>

                {/* Stat boxes */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                    {[
                        { label: "Total activități", value: activities.length },
                        { label: "Tipuri", value: types.length - 1 },
                        { label: "Calorii totale", value: `~${totalCalorii}` },
                    ].map(({ label, value }) => (
                        <div key={label} style={{
                            background: "#162032", border: "1px solid #1e3a5f",
                            borderRadius: "0.875rem", padding: "0.85rem 1.25rem", minWidth: 110,
                        }}>
                            <div style={{ color: "#0ea5e9", fontSize: "1.5rem", fontWeight: 800 }}>{value}</div>
                            <div style={{ color: "#64748b", fontSize: "0.78rem", marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Loading / Error */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                        Se încarcă activitățile...
                    </div>
                )}
                {error && (
                    <div style={{
                        background: "#2d1a1a", border: "1px solid #7f1d1d", borderRadius: "0.75rem",
                        padding: "1rem 1.25rem", color: "#fca5a5", marginBottom: "1.5rem",
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {/* Filtre */}
                        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
                            {types.map((tip) => {
                                const count = tip === "Toate"
                                    ? activities.length
                                    : activities.filter((a) => a.type === tip).length;
                                const active = activFilter === tip;
                                return (
                                    <button key={tip} onClick={() => setActivFilter(tip)} style={{
                                        background: active ? "#0ea5e9" : "transparent",
                                        border: `1px solid ${active ? "#0ea5e9" : "#1e3a5f"}`,
                                        color: active ? "#fff" : "#94a3b8",
                                        padding: "0.4rem 1rem", borderRadius: "999px",
                                        fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                                        transition: "all 0.15s ease",
                                    }}>{tip} {count}</button>
                                );
                            })}
                        </div>

                        {/* Grid */}
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
                                Nu există activități în această categorie.
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                                {filtered.map((a) => (
                                    <ActivityCard key={a.id} activity={a} onClick={() => setSelected(a)} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {selected && <ActivityModal activity={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}