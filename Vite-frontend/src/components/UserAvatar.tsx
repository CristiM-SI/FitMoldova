import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { ROUTES } from "../routes/paths";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import styles from "../styles/UserAvatar.module.css";

const UserAvatar = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <button
            className={styles.avatar}
            onClick={() => navigate(ROUTES.PROFILE)}
            title={`${user.firstName} ${user.lastName}`}
        >
            <UserCircleIcon className={styles.icon} />
        </button>
    );
};

export default UserAvatar;
