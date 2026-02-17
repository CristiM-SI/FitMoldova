import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";
import styles from "./SignUp.module.css";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

function getPasswordStrength(password: string) {
    return {
        letters: (password.match(/[a-zA-Z]/g) || []).length,
        digits: (password.match(/[0-9]/g) || []).length,
        specials: (password.match(/[^a-zA-Z0-9]/g) || []).length,
        total: password.length,
    };
}

function validatePassword(password: string): string | undefined {
    const { letters, digits, specials, total } = getPasswordStrength(password);
    if (total < 16) return `Parola trebuie să aibă cel puțin 16 caractere (ai ${total}).`;
    if (letters < 6) return `Sunt necesare cel puțin 6 litere (ai ${letters}).`;
    if (digits < 6) return `Sunt necesare cel puțin 6 cifre (ai ${digits}).`;
    if (specials < 4) return `Sunt necesare cel puțin 4 caractere speciale (ai ${specials}).`;
    return undefined;
}

function validateEmail(email: string): string | undefined {
    if (!email) return "Adresa de email este obligatorie.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Adresa de email nu este validă.";
    return undefined;
}

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

    const strength = getPasswordStrength(formData.password);

    const validate = useCallback((data: FormData): FormErrors => {
        const e: FormErrors = {};
        if (!data.firstName.trim()) e.firstName = "Prenumele este obligatoriu.";
        if (!data.lastName.trim()) e.lastName = "Numele este obligatoriu.";
        const emailErr = validateEmail(data.email);
        if (emailErr) e.email = emailErr;
        const pwdErr = validatePassword(data.password);
        if (pwdErr) e.password = pwdErr;
        if (!data.confirmPassword) e.confirmPassword = "Confirmarea parolei este obligatorie.";
        else if (data.password !== data.confirmPassword) e.confirmPassword = "Parolele nu coincid.";
        return e;
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        if (touched[name as keyof FormData]) setErrors(validate(updated));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors(validate(formData));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = Object.keys(formData).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {} as Partial<Record<keyof FormData, boolean>>
        );
        setTouched(allTouched);
        const newErrors = validate(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setSubmitted(true);
            setTimeout(() => navigate(ROUTES.HOME), 1800);
        }
    };

    const strengthPercent = Math.min(100, Math.round(
        (Math.min(strength.letters, 6) / 6) * 33 +
        (Math.min(strength.digits, 6) / 6) * 33 +
        (Math.min(strength.specials, 4) / 4) * 34
    ));

    const strengthLabel =
        strengthPercent === 0 ? "" :
            strengthPercent < 40 ? "Slabă" :
                strengthPercent < 75 ? "Medie" :
                    strengthPercent < 100 ? "Bună" : "Excelentă";

    const strengthColor =
        strengthPercent < 40 ? "#ef4444" :
            strengthPercent < 75 ? "#f59e0b" :
                strengthPercent < 100 ? "#3b82f6" : "#22c55e";

    if (submitted) {
        return (
            <div className={styles.page}>
                <div className={styles.grid} aria-hidden="true" />
                <div className={styles.card}>
                    <div className={styles.successIcon}>✓</div>
                    <h2 className={styles.successTitle}>CONT CREAT CU SUCCES!</h2>
                    <p className={styles.successText}>
                        Bine ai venit în comunitatea{" "}
                        <span className={styles.accent}>FitMoldova</span>.
                        <br />Ești redirecționat către pagina principală...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.grid} aria-hidden="true" />

            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <span className={styles.logoWhite}>FIT</span>
                        <span className={styles.logoBlue}>MOLDOVA</span>
                    </div>
                    <p className={styles.subtitle}>Alătură-te comunității de fitness</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="lastName">Nume</label>
                            <input
                                id="lastName" name="lastName" type="text" autoComplete="family-name"
                                className={`${styles.input} ${touched.lastName && errors.lastName ? styles.inputError : ""} ${touched.lastName && !errors.lastName && formData.lastName ? styles.inputValid : ""}`}
                                placeholder="Popescu"
                                value={formData.lastName} onChange={handleChange} onBlur={handleBlur}
                            />
                            {touched.lastName && errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="firstName">Prenume</label>
                            <input
                                id="firstName" name="firstName" type="text" autoComplete="given-name"
                                className={`${styles.input} ${touched.firstName && errors.firstName ? styles.inputError : ""} ${touched.firstName && !errors.firstName && formData.firstName ? styles.inputValid : ""}`}
                                placeholder="Ion"
                                value={formData.firstName} onChange={handleChange} onBlur={handleBlur}
                            />
                            {touched.firstName && errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Adresă de email</label>
                        <input
                            id="email" name="email" type="email" autoComplete="email"
                            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ""} ${touched.email && !errors.email && formData.email ? styles.inputValid : ""}`}
                            placeholder="ion.popescu@email.com"
                            value={formData.email} onChange={handleChange} onBlur={handleBlur}
                        />
                        {touched.email && errors.email && <span className={styles.error}>{errors.email}</span>}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Parolă</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password" name="password" type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                className={`${styles.input} ${styles.inputWithToggle} ${touched.password && errors.password ? styles.inputError : ""} ${touched.password && !errors.password && formData.password ? styles.inputValid : ""}`}
                                placeholder="Minim 16 caractere"
                                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                            />
                            <button type="button" className={styles.toggle} onClick={() => setShowPassword(v => !v)} aria-label="Toggle parolă">
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>

                        {formData.password && (
                            <>
                                <div className={styles.strengthWrapper}>
                                    <div className={styles.strengthBar}>
                                        <div className={styles.strengthFill} style={{ width: `${strengthPercent}%`, backgroundColor: strengthColor }} />
                                    </div>
                                    <span className={styles.strengthLabel} style={{ color: strengthColor }}>{strengthLabel}</span>
                                </div>
                                <ul className={styles.requirements}>
                                    <li className={strength.total >= 16 ? styles.reqMet : styles.reqUnmet}>{strength.total >= 16 ? "✓" : "○"} Minim 16 caractere ({strength.total}/16)</li>
                                    <li className={strength.letters >= 6 ? styles.reqMet : styles.reqUnmet}>{strength.letters >= 6 ? "✓" : "○"} Cel puțin 6 litere ({strength.letters}/6)</li>
                                    <li className={strength.digits >= 6 ? styles.reqMet : styles.reqUnmet}>{strength.digits >= 6 ? "✓" : "○"} Cel puțin 6 cifre ({strength.digits}/6)</li>
                                    <li className={strength.specials >= 4 ? styles.reqMet : styles.reqUnmet}>{strength.specials >= 4 ? "✓" : "○"} Cel puțin 4 caractere speciale ({strength.specials}/4)</li>
                                </ul>
                            </>
                        )}
                        {touched.password && errors.password && <span className={styles.error}>{errors.password}</span>}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="confirmPassword">Confirmă parola</label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"}
                                autoComplete="new-password"
                                className={`${styles.input} ${styles.inputWithToggle} ${touched.confirmPassword && errors.confirmPassword ? styles.inputError : ""} ${touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword ? styles.inputValid : ""}`}
                                placeholder="Repetă parola"
                                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                            />
                            <button type="button" className={styles.toggle} onClick={() => setShowConfirm(v => !v)} aria-label="Toggle confirmare">
                                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                        {touched.confirmPassword && errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                    </div>

                    <button type="submit" className={styles.submit}>CREEAZĂ CONT GRATUIT</button>

                    <p className={styles.loginPrompt}>
                        Ai deja un cont?{" "}
                        <Link to={ROUTES.LOGIN} className={styles.loginLink}>Autentifică-te</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

export default SignUp;
