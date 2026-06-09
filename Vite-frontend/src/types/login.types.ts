// Structura principală a formularului de login
export interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}

// Tipul pentru erorile de validare — toate câmpurile sunt opționale
// deoarece pot exista erori doar pe unele câmpuri
export type LoginFormErrors = Partial<LoginForm>;

// Tipul pentru props-urile panoului stâng (brand panel)
export interface LeftPanelProps {
    stats: StatItem[];
}

// Tipul pentru fiecare statistică afișată în panoul stâng
export interface StatItem {
    value: string;   // ex: "12K+"
    label: string;   // ex: "Membri activi"
}
