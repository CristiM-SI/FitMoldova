import { LoginFormErrors, LoginForm } from "../types/login.types";

// Iconița de ochi deschis (parolă vizibilă)
function EyeOpenIcon() {
    return (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );
}

// Iconița de ochi tăiat (parolă ascunsă)
function EyeOffIcon() {
    return (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
}

// Logoul Google (SVG inline — fără dependință externă)
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

// Props-urile primite de la LoginPage prin hook-ul useLoginForm
interface LoginFormProps {
    form: LoginForm;
    errors: LoginFormErrors;
    showPassword: boolean;
    isLoading: boolean;
    onChange: (field: keyof LoginForm, value: string | boolean) => void;
    onSubmit: () => void;
    onTogglePassword: () => void;
}

export function LoginForm({
                              form,
                              errors,
                              showPassword,
                              isLoading,
                              onChange,
                              onSubmit,
                              onTogglePassword,
                          }: LoginFormProps) {
    return (
        <div className="right-panel">

            {/* Header — titlu și subtitlu */}
            <div className="login-header">
                <h2 className="login-title">Bine ai revenit</h2>
                <p className="login-subtitle">Autentifică-te în contul tău FitMoldova</p>
            </div>

            {/* Buton login cu Google (OAuth) */}
            <button
                className="social-btn"
                type="button"
                onClick={() => alert("Google OAuth — conectează cu backend")}
            >
                <GoogleIcon />
                Continuă cu Google
            </button>

            {/* Separator vizual între OAuth și form clasic */}
            <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">sau cu email</span>
                <div className="divider-line" />
            </div>

            {/* ---- CÂMPURI FORMULAR ---- */}
            <div>

                {/* Câmp Email */}
                <div className="form-group">
                    <label className="form-label" htmlFor="email">Adresă Email</label>
                    <div className="input-wrapper">
                        <input
                            id="email"
                            type="email"
                            placeholder="exemplu@email.com"
                            className={`form-input${errors.email ? " error" : ""}`}
                            value={form.email}
                            onChange={(e) => onChange("email", e.target.value)}
                            autoComplete="email"
                        />
                    </div>
                    {/* Mesaj eroare email — afișat condiționat */}
                    {errors.email && <div className="error-msg">⚠ {errors.email}</div>}
                </div>

                {/* Câmp Parolă cu toggle vizibilitate */}
                <div className="form-group">
                    <label className="form-label" htmlFor="password">Parolă</label>
                    <div className="input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"} // comutăm tipul
                            placeholder="Introdu parola"
                            className={`form-input${errors.password ? " error" : ""}`}
                            style={{ paddingRight: "46px" }} // spațiu pentru iconița de ochi
                            value={form.password}
                            onChange={(e) => onChange("password", e.target.value)}
                            autoComplete="current-password"
                        />