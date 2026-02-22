import { useState } from "react";
import { LoginForm, LoginFormErrors } from "../types/login.types";

// Valorile inițiale ale formularului
const INITIAL_FORM: LoginForm = {
    email: "",
    password: "",
    rememberMe: false,
};

export function useLoginForm() {
    // Starea principală a formularului (email, parolă, ține-mă conectat)
    const [form, setForm] = useState<LoginForm>(INITIAL_FORM);

    // Controlează dacă parola este vizibilă sau ascunsă (tip text/password)
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // Controlează afișarea spinner-ului de loading la submit
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Stochează erorile de validare per câmp
    const [errors, setErrors] = useState<LoginFormErrors>({});

    // ----------------------------------------------------------
    // validate() — verifică câmpurile și populează `errors`
    // Returnează true dacă totul e valid, false dacă există erori
    // ----------------------------------------------------------
    const validate = (): boolean => {
        const newErrors: LoginFormErrors = {};

        // Validare email
        if (!form.email) {
            newErrors.email = "Email-ul este obligatoriu";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email invalid";
        }

        // Validare parolă
        if (!form.password) {
            newErrors.password = "Parola este obligatorie";
        } else if (form.password.length < 6) {
            newErrors.password = "Parola trebuie să aibă cel puțin 6 caractere";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ----------------------------------------------------------
    // handleSubmit() — apelat la click pe butonul "Intră în cont"
    // Validează, simulează un request API și arată rezultatul
    // TODO: înlocuiește setTimeout cu un apel real la API (ex: fetch/axios)
    // ----------------------------------------------------------
    const handleSubmit = async (): Promise<void> => {
        if (!validate()) return; // oprește dacă există erori

        setIsLoading(true);
        // Simulare request API (1.5 secunde)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);

        alert("Autentificare reușită!");
    };

    // ----------------------------------------------------------
    // handleChange() — actualizează un câmp din formular
    // Șterge și eroarea câmpului respectiv când utilizatorul scrie
    // ----------------------------------------------------------
    const handleChange = (
        field: keyof LoginForm,
        value: string | boolean
    ): void => {
        setForm((prev) => ({ ...prev, [field]: value }));

        // Dacă exista o eroare pe câmpul editat, o ștergem imediat
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    // ----------------------------------------------------------
    // toggleShowPassword() — comută vizibilitatea parolei
    // ----------------------------------------------------------
    const toggleShowPassword = (): void => {
        setShowPassword((prev) => !prev);
    };

    // Returnăm tot ce are nevoie componenta UI
    return {
        form,
        errors,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        toggleShowPassword,
    };
}
