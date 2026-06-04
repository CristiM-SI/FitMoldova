import { useState } from "react";

// ── Iconițele de ochi — identice cu cele din pagina de login (LoginForm.tsx) ──
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

interface PasswordInputProps {
    id: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    autoComplete?: string;
    /** Conținut suplimentar randat sub input, în interiorul .form-group (ex: indicator putere parolă) */
    children?: React.ReactNode;
}

/**
 * Câmp de parolă reutilizabil cu buton de toggle (icon ochi) poziționat absolut
 * în dreapta câmpului. Refolosește exact aceleași clase CSS și icon ca pagina de
 * login, pentru consecvență vizuală. Gestionează intern starea show/hide.
 */
export function PasswordInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    error,
    autoComplete = "new-password",
    children,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="form-group">
            {label && <label className="form-label" htmlFor={id}>{label}</label>}
            <div className="input-wrapper">
                <input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    className={`form-input${error ? " error" : ""}`}
                    style={{ paddingRight: "46px" }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    autoComplete={autoComplete}
                />
                <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
                >
                    {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                </button>
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
            {children}
        </div>
    );
}
