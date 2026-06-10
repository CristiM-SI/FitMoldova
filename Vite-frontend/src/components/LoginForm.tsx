import type { LoginFormErrors, LoginForm } from "../types/login.types";
import type { PasswordStrength } from "../hooks/useLoginForm";
import CircularProgress from '@mui/material/CircularProgress';

function EyeOpenIcon() {
    return (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

interface LoginFormProps {
    form: LoginForm;
    errors: LoginFormErrors;
    loginError: string;
    passwordStrength: PasswordStrength;
    showPassword: boolean;
    isLoading: boolean;
    onChange: (field: keyof LoginForm, value: string | boolean) => void;
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    onTogglePassword: () => void;
}

export function LoginForm({
                              form,
                              errors,
                              loginError,
                              showPassword,
                              isLoading,
                              passwordStrength,
                              onChange,
                              onSubmit,
                              onTogglePassword,
                          }: LoginFormProps) {
    return (
        <div className="right-panel">

            <div className="login-header">
                <h2 className="login-title">Bine ai revenit</h2>
                <p className="login-subtitle">Autentifică-te în contul tău FitMoldova</p>
            </div>

            {loginError && (
                <div style={{
                    background: "rgba(255,77,109,0.1)",
                    border: "1px solid rgba(255,77,109,0.4)",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    color: "#ff4d6d",
                    fontSize: "14px",
                }}>
                    ⚠ {loginError}
                </div>
            )}

            {/* ── Form — previne refresh la Enter ── */}
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} noValidate>

                {/* Câmp email */}
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Adresă de email</label>
                    <div className="input-wrapper">
                        <input
                            id="email"
                            type="email"
                            placeholder="ex: ion.popescu@gmail.com"
                            className={`form-input${errors.email ? " error" : ""}`}
                            value={form.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && <div className="error-msg">⚠ {errors.email}</div>}
                </div>

                {/* Câmp parolă */}
                <div className="form-group">
                    <label className="form-label" htmlFor="password">Parolă</label>
                    <div className="input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Introdu parola"
                            className={`form-input${errors.password ? " error" : ""}`}
                            style={{ paddingRight: "46px" }}
                            value={form.password}
                            onChange={(e) => onChange("password", e.target.value)}
                            autoComplete="current-password"
                        />
                        <button
                            className="password-toggle"
                            type="button"
                            onClick={onTogglePassword}
                            aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                        </button>
                    </div>
                    {errors.password && <div className="error-msg">⚠ {errors.password}</div>}

                    {form.password.length > 0 && (
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
                                { ok: passwordStrength.checks.minChars,   text: `Minim 8 caractere (${form.password.length}/16)` },
                                { ok: passwordStrength.checks.minLetters, text: `Cel puțin 3 litere (${(form.password.match(/[a-zA-Z]/g) || []).length}/6)` },
                                { ok: passwordStrength.checks.minDigits,  text: `Cel puțin 3 cifre (${(form.password.match(/[0-9]/g) || []).length}/6)` },
                                { ok: passwordStrength.checks.minSpecial, text: `Cel puțin 2 caractere speciale (${(form.password.match(/[^a-zA-Z0-9]/g) || []).length}/4)` },
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
                </div>

                {/* Remember me + Ai uitat parola */}
                <div className="form-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={form.rememberMe}
                            onChange={(e) => onChange("rememberMe", e.target.checked)}
                        />
                        Ține-mă conectat
                    </label>
                    <a href="/forgot-password" className="forgot-link">Ai uitat parola?</a>
                </div>

                {/* Submit */}
                <button className="submit-btn" type="submit" disabled={isLoading}>
                    {isLoading && <CircularProgress size={18} sx={{ color: '#fff' }} />}
                    {isLoading ? "Se conectează..." : "Intră în cont"}
                </button>

                <div className="register-link">
                    Nu ai cont?{" "}
                    <a href="/register">Creează cont gratuit</a>
                </div>

            </form>
        </div>
    );
}