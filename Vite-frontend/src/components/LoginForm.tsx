import { LoginFormErrors, LoginForm } from "../types/login.types";
import { PasswordStrength } from "../hooks/useLoginForm";

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

function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
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
    onSubmit: () => void;
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

            <button className="social-btn" type="button" onClick={() => alert("Google OAuth")}>
                <GoogleIcon />
                Continuă cu Google
            </button>

            <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">sau cu cont</span>
                <div className="divider-line" />
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

            <div>
                {/* Câmp username */}
                <div className="form-group">
                    <label className="form-label" htmlFor="username">Nume utilizator</label>
                    <div className="input-wrapper">
                        <input
                            id="username"
                            type="text"
                            placeholder="ex: ion.popescu"
                            className={`form-input${errors.username ? " error" : ""}`}
                            value={form.username}
                            onChange={(e) => onChange("username", e.target.value)}
                            autoComplete="username"
                        />
                    </div>
                    {errors.username && <div className="error-msg">⚠ {errors.username}</div>}
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
                                { ok: passwordStrength.checks.minChars,   text: `Minim 16 caractere (${form.password.length}/16)` },
                                { ok: passwordStrength.checks.minLetters, text: `Cel puțin 6 litere (${(form.password.match(/[a-zA-Z]/g) || []).length}/6)` },
                                { ok: passwordStrength.checks.minDigits,  text: `Cel puțin 6 cifre (${(form.password.match(/[0-9]/g) || []).length}/6)` },
                                { ok: passwordStrength.checks.minSpecial, text: `Cel puțin 4 caractere speciale (${(form.password.match(/[^a-zA-Z0-9]/g) || []).length}/4)` },
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
                <button className="submit-btn" type="button" onClick={onSubmit} disabled={isLoading}>
                    {isLoading && <span className="spinner" />}
                    {isLoading ? "Se conectează..." : "Intră în cont"}
                </button>

                <div className="register-link">
                    Nu ai cont?{" "}
                    <a href="/register">Creează cont gratuit</a>
                </div>
            </div>
        </div>
    );
}