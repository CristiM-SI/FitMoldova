import { loginStyles } from "./styles/login.styles";
import { useLoginForm } from "./hooks/useLoginForm";
import { LeftPanel } from "./components/LeftPanel";
import { LoginForm } from "./components/LoginForm";
import { StatItem } from "./types/login.types";

// Datele statistice afișate în panoul stâng
// Le definim aici pentru a le putea schimba ușor sau a le lua dintr-un API
const STATS: StatItem[] = [
    { value: "12K+", label: "Membri activi" },
    { value: "340+", label: "Antrenori" },
    { value: "98%",  label: "Satisfacție" },
];

export default function LoginPage() {
    // Extragem toată logica din hook-ul dedicat
    const {
        form,
        errors,
        showPassword,
        isLoading,
        handleChange,
        handleSubmit,
        toggleShowPassword,
    } = useLoginForm();

    return (
        <>
            {/* Injectăm stilurile CSS global */}
            <style>{loginStyles}</style>

            {/* Layout split-screen: stânga (brand) + dreapta (form) */}
            <div className="page">

                {/* Panoul stâng — vizibil doar pe desktop (ascuns la < 900px) */}
                <LeftPanel stats={STATS} />

                {/* Panoul dreapta — formularul de login */}
                <LoginForm
                    form={form}
                    errors={errors}
                    showPassword={showPassword}
                    isLoading={isLoading}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onTogglePassword={toggleShowPassword}
                />
            </div>
        </>
    );
}
