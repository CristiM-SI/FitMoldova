import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axiosInstance from "../services/api/axiosInstance";
import { loginStyles } from "../styles/login.styles";
import { LeftPanel } from "../components/LeftPanel";
import { PasswordInput } from "../components/PasswordInput";
import { getPasswordStrength } from "../hooks/useLoginForm";
import { ROUTES } from "../routes/paths";
import type { StatItem } from "../types/login.types";

// Aceleași statistici ca pe pagina de login, pentru consistență vizuală
const STATS: StatItem[] = [
    { value: "50K+", label: "Membri activi" },
    { value: "340+", label: "Antrenori" },
    { value: "98%",  label: "Satisfacție" },
];

// Cele două etape gestionate prin state local (fără link în URL)
type Step = "email" | "reset";

// Caseta de feedback (eroare / info / succes) — refolosește stilul din LoginForm
function FeedbackBox({ kind, children }: { kind: "error" | "info" | "success"; children: React.ReactNode }) {
    const palette: Record<"error" | "info" | "success", { bg: string; border: string; color: string; icon: React.ReactNode }> = {
        error:   { bg: "rgba(255,77,109,0.1)",  border: "rgba(255,77,109,0.4)",  color: "#ff4d6d", icon: "⚠" },
        info:    { bg: "rgba(43,143,255,0.1)",   border: "rgba(43,143,255,0.4)",  color: "#2b8fff", icon: <InfoOutlinedIcon sx={{ fontSize: 18 }} /> },
        success: { bg: "rgba(34,197,94,0.1)",    border: "rgba(34,197,94,0.4)",   color: "#22c55e", icon: "✓" },
    };
    const current = palette[kind];

    return (
        <div style={{
            background: current.bg,
            border: `1px solid ${current.border}`,
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            color: current.color,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        }}>
            {current.icon}
            <span>{children}</span>
        </div>
    );
}

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>("email");

    // Câmpuri
    const [email, setEmail] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    // Stare UI
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string>("");
    const [infoMessage, setInfoMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const passwordStrength = getPasswordStrength(newPassword);

    // ── Pas 1: trimite codul pe email ────────────────────────────────────────
    const handleSendCode = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e?.preventDefault();
        setServerError("");

        const errs: Record<string, string> = {};
        if (!email.trim()) {
            errs.email = "Emailul este obligatoriu";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errs.email = "Introdu o adresă de email validă";
        }
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/forgot-password", { email: email.trim() });
            setInfoMessage("Dacă emailul există, ai primit un cod.");
            setStep("reset");
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "A apărut o eroare. Încearcă din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Pas 2: resetează parola cu codul de 6 cifre ──────────────────────────
    const handleResetPassword = async (e?: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e?.preventDefault();
        setServerError("");

        const errs: Record<string, string> = {};

        if (!/^\d{6}$/.test(code)) {
            errs.code = "Codul trebuie să conțină exact 6 cifre";
        }

        if (!newPassword) {
            errs.newPassword = "Parola nouă este obligatorie";
        } else if (passwordStrength.score < 4) {
            errs.newPassword = "Parola trebuie să conțină minim 8 caractere, 3 litere, 3 cifre și 2 caractere speciale.";
        }

        if (!confirmPassword) {
            errs.confirmPassword = "Confirmă parola nouă";
        } else if (confirmPassword !== newPassword) {
            errs.confirmPassword = "Parolele nu coincid";
        }

        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/reset-password", { email: email.trim(), code, newPassword });
            setInfoMessage("");
            setSuccessMessage("Parola a fost resetată cu succes! Te redirecționăm către autentificare...");
            // Redirecționare la /login cu mesaj de succes vizibil înainte de navigare
            setTimeout(() => navigate({ to: ROUTES.LOGIN }), 1600);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Cod invalid sau expirat. Încearcă din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    // Resetează eroarea pe câmp la editare
    const clearFieldError = (field: string) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        }
        if (serverError) setServerError("");
    };

    return (
        <>
            {/* Reutilizăm exact aceleași stiluri ca pagina de login */}
            <style>{loginStyles}</style>

            <div className="page">
                {/* Panoul stâng (brand) — vizibil doar pe desktop */}
                <LeftPanel stats={STATS} />

                {/* Panoul dreapta — formularul de recuperare parolă */}
                <div className="right-panel">
                    <div className="login-header">
                        <h2 className="login-title">
                            {step === "email" ? "Ai uitat parola?" : "Resetează parola"}
                        </h2>
                        <p className="login-subtitle">
                            {step === "email"
                                ? "Introdu emailul și îți trimitem un cod de verificare"
                                : "Introdu codul primit pe email și alege o parolă nouă"}
                        </p>
                    </div>

                    {serverError && <FeedbackBox kind="error">{serverError}</FeedbackBox>}
                    {successMessage && <FeedbackBox kind="success">{successMessage}</FeedbackBox>}
                    {step === "reset" && infoMessage && !successMessage && (
                        <FeedbackBox kind="info">{infoMessage}</FeedbackBox>
                    )}

                    {/* ── PAS 1: email ── */}
                    {step === "email" && (
                        <form onSubmit={handleSendCode} noValidate>
                            <div className="form-group">
                                <label className="form-label" htmlFor="email">Email</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="ex: ion.popescu@email.com"
                                        className={`form-input${fieldErrors.email ? " error" : ""}`}
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
                                        autoComplete="email"
                                    />
                                </div>
                                {fieldErrors.email && <div className="error-msg">⚠ {fieldErrors.email}</div>}
                            </div>

                            <button className="submit-btn" type="submit" disabled={isLoading} style={{ marginTop: 8 }}>
                                {isLoading && <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />}
                                {isLoading ? "Se trimite..." : "Trimite codul"}
                            </button>

                            <div className="register-link">
                                Ți-ai amintit parola?{" "}
                                <a href={ROUTES.LOGIN}>Înapoi la autentificare</a>
                            </div>
                        </form>
                    )}

                    {/* ── PAS 2: cod + parolă nouă ── */}
                    {step === "reset" && (
                        <form onSubmit={handleResetPassword} noValidate>
                            {/* Cod de 6 cifre */}
                            <div className="form-group">
                                <label className="form-label" htmlFor="code">Cod de verificare</label>
                                <div className="input-wrapper">
                                    <input
                                        id="code"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className={`form-input${fieldErrors.code ? " error" : ""}`}
                                        style={{ letterSpacing: "8px", fontWeight: 700 }}
                                        value={code}
                                        onChange={(e) => {
                                            // Acceptăm doar cifre, maxim 6
                                            const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                                            setCode(digits);
                                            clearFieldError("code");
                                        }}
                                        autoComplete="one-time-code"
                                    />
                                </div>
                                {fieldErrors.code && <div className="error-msg">⚠ {fieldErrors.code}</div>}
                            </div>

                            {/* Parolă nouă — refolosește componenta comună PasswordInput (același stil ca login) */}
                            <PasswordInput
                                id="newPassword"
                                label="Parolă nouă"
                                placeholder="Introdu parola nouă"
                                value={newPassword}
                                onChange={(v) => { setNewPassword(v); clearFieldError("newPassword"); }}
                                error={fieldErrors.newPassword}
                            >
                                {/* Indicator putere parolă — aceeași regulă ca la login/signup */}
                                {newPassword.length > 0 && (
                                    <div style={{ marginTop: "12px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                                            <div style={{ flex: 1, height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                                                <div style={{
                                                    height: "100%",
                                                    width: `${(passwordStrength.score / 4) * 100}%`,
                                                    background: passwordStrength.color,
                                                    borderRadius: "2px",
                                                    transition: "all 0.3s ease",
                                                }} />
                                            </div>
                                            <span style={{
                                                fontSize: "11px", fontWeight: 700,
                                                letterSpacing: "1px", textTransform: "uppercase",
                                                color: passwordStrength.color, whiteSpace: "nowrap",
                                            }}>
                                                {passwordStrength.label}
                                            </span>
                                        </div>
                                        {[
                                            { ok: passwordStrength.checks.minChars,   text: `Minim 8 caractere (${newPassword.length}/16)` },
                                            { ok: passwordStrength.checks.minLetters, text: `Cel puțin 3 litere (${(newPassword.match(/[a-zA-Z]/g) || []).length}/6)` },
                                            { ok: passwordStrength.checks.minDigits,  text: `Cel puțin 3 cifre (${(newPassword.match(/[0-9]/g) || []).length}/6)` },
                                            { ok: passwordStrength.checks.minSpecial, text: `Cel puțin 2 caractere speciale (${(newPassword.match(/[^a-zA-Z0-9]/g) || []).length}/4)` },
                                        ].map((item, i) => (
                                            <div key={i} style={{
                                                display: "flex", alignItems: "center", gap: "8px",
                                                fontSize: "13px", color: item.ok ? "#22c55e" : "#8ba4c8", marginBottom: "4px",
                                            }}>
                                                <span>{item.ok ? "✓" : "○"}</span>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </PasswordInput>

                            {/* Confirmare parolă — aceeași componentă comună PasswordInput */}
                            <PasswordInput
                                id="confirmPassword"
                                label="Confirmă parola"
                                placeholder="Reintrodu parola nouă"
                                value={confirmPassword}
                                onChange={(v) => { setConfirmPassword(v); clearFieldError("confirmPassword"); }}
                                error={fieldErrors.confirmPassword}
                            />

                            <button className="submit-btn" type="submit" disabled={isLoading} style={{ marginTop: 8 }}>
                                {isLoading && <CircularProgress size={18} sx={{ color: "#fff", mr: 1 }} />}
                                {isLoading ? "Se resetează..." : "Resetează parola"}
                            </button>

                            <div className="register-link">
                                <a href={ROUTES.LOGIN}>Înapoi la autentificare</a>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
