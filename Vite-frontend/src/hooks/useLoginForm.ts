import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoginForm, LoginFormErrors } from "../types/login.types";
import { ROUTES } from "../routes/paths";

const INITIAL_FORM: LoginForm = {
    username: "",
    password: "",
    rememberMe: false,
};

// Validare putere parolă — aceleași reguli ca la SignUp
export interface PasswordStrength {
    score: number;           // 0-4
    label: string;           // "Slabă" | "Medie" | "Bună" | "Excelentă"
    color: string;
    checks: {
        minChars: boolean;     // minim 16 caractere
        minLetters: boolean;   // cel puțin 6 litere
        minDigits: boolean;    // cel puțin 6 cifre
        minSpecial: boolean;   // cel puțin 4 caractere speciale
    };
}

export function getPasswordStrength(password: string): PasswordStrength {
    const checks = {
        minChars: password.length >= 16,
        minLetters: (password.match(/[a-zA-Z]/g) || []).length >= 6,
        minDigits: (password.match(/[0-9]/g) || []).length >= 6,
        minSpecial: (password.match(/[^a-zA-Z0-9]/g) || []).length >= 4,
    };

    const score = Object.values(checks).filter(Boolean).length;

    const labels = ["Slabă", "Slabă", "Medie", "Bună", "Excelentă"];
    const colors = ["#ff4d6d", "#ff4d6d", "#f59e0b", "#3b82f6", "#22c55e"];

    return { score, label: labels[score], color: colors[score], checks };
}

export function useLoginForm() {
    const [form, setForm] = useState<LoginForm>(INITIAL_FORM);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [loginError, setLoginError] = useState<string>("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const passwordStrength = getPasswordStrength(form.password);

    const validate = (): boolean => {
        const newErrors: LoginFormErrors = {};

        if (!form.username) {
            newErrors.username = "Numele de utilizator este obligatoriu";
        } else if (form.username.length < 3) {
            newErrors.username = "Minim 3 caractere";
        }

        if (!form.password) {
            newErrors.password = "Parola este obligatorie";
        } else if (!passwordStrength.checks.minChars) {
            newErrors.password = "Parola trebuie să aibă cel puțin 16 caractere";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (): Promise<void> => {
        setLoginError("");
        if (!validate()) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 800));

        const result = login(form.username, form.password);

        setIsLoading(false);

        if (result.success) {
            navigate(ROUTES.HOME);   // ← redirecționează la homepage cu iconița de profil
        } else {
            setLoginError("Utilizator sau parolă incorectă");
        }
    };

    const handleChange = (field: keyof LoginForm, value: string | boolean): void => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        if (loginError) setLoginError("");
    };

    const toggleShowPassword = (): void => {
        setShowPassword((prev) => !prev);
    };

    return {
        form,
        errors,
        loginError,
        showPassword,
        isLoading,
        passwordStrength,
        handleChange,
        handleSubmit,
        toggleShowPassword,
    };
}