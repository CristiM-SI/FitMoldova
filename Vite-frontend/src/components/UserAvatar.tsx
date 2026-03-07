import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/paths";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const avatarStyle: React.CSSProperties = {
    width: 40, height: 40, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', background: 'transparent',
    border: 'none', cursor: 'pointer', transition: 'transform 0.15s ease, opacity 0.15s ease',
    padding: 0,
};

const iconStyle: React.CSSProperties = {
    width: 40, height: 40, color: '#1a7fff', transition: 'color 0.15s ease',
};

const UserAvatar = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) return null;

    return (
        <button
            style={avatarStyle}
            onClick={() => navigate(ROUTES.PROFILE)}
            title={user ? `${user.firstName} ${user.lastName}` : 'Profil'}
            onMouseEnter={(e) => { (e.currentTarget.style.transform = 'scale(1.08)'); (e.currentTarget.style.opacity = '0.85'); }}
            onMouseLeave={(e) => { (e.currentTarget.style.transform = 'scale(1)'); (e.currentTarget.style.opacity = '1'); }}
        >
            <UserCircleIcon style={iconStyle} />
        </button>
    );
};

export default UserAvatar;
