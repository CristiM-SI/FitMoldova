import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/paths";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import styles from "../styles/UserAvatar.module.css";

const UserAvatar = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    return (
        <button
            className={styles.avatar}
            onClick={() => navigate(ROUTES.PROFILE)}
            title={user ? `${user.firstName} ${user.lastName}` : 'Profil'}
        >
            <UserCircleIcon className={styles.icon} />
        </button>
    );
};

export default UserAvatar;
