import { useContext, useState, useEffect } from "react"
import { AuthContext } from '../../../context/auth'
import { Link } from "react-router-dom"
import { FiHome, FiUser, FiSettings, FiLogOut, FiMessageSquare, FiAlertCircle, FiChevronDown, FiChevronUp, FiBox, FiBell, FiMessageCircle } from 'react-icons/fi'
import { db } from '../../../services/firebaseConnection'
import { doc, getDoc } from 'firebase/firestore'
import './header.css'

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [submenuVisible, setSubmenuVisible] = useState(false);
    const photoUserEmpty = 'https://imgs.search.brave.com/BhIDjkBh32rIpzRTQJIIDpGyT7Z8R7NFf0Vsy-DqLIg/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA1LzA5LzA3LzQ5/LzM2MF9GXzUwOTA3/NDk2N19qdGJXbGdn/ZU9qQ0d5UXFBekE5/dU5nSG9XNkxXRUR0/aC5qcGc';

    // Buscar dados do usuário do Firebase
    useEffect(() => {
        async function loadUserPhoto() {
            if (user?.uid) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setProfilePhoto(userData.photoURL || photoUserEmpty);
                    }
                } catch (error) {
                    setProfilePhoto(photoUserEmpty);
                }
            } else {
                setProfilePhoto(photoUserEmpty);
            }
        }

        loadUserPhoto();
    }, [user]);

    useEffect(() => {
        if (user?.photoURL) {
            setProfilePhoto(user.photoURL);
        }
    }, [user?.photoURL]);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img
                    src={profilePhoto || photoUserEmpty}
                    alt="Foto do usuário"
                    onError={(e) => {
                        e.target.src = photoUserEmpty;
                    }}
                />
            </div>

            <div className="sidebar-links">
                <Link to="/dashboard">
                    <FiHome color="#fff" size={24} />
                    Dashboard
                </Link>

                <Link to="/Chamados">
                    <FiMessageSquare color="#fff" size={24} />
                    Chamados
                </Link>

                <Link to="/" onClick={logout}>
                    <FiLogOut color="#fff" size={24} />
                    Sair
                </Link>
            </div>
        </div>
    );
}