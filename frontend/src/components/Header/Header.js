import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css'; // Import CSS file for styling
import logo from '../../assets/climact-dark.png'; // Path to your logo

const Header = () => {
    const location = useLocation(); // Get the current location

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <img src={logo} alt="ClimACT Logo" className={styles.logo} />
            </div>
            <div className={styles.navButtons}>
                <Link
                    to="/"
                    className={`${styles.navButton} ${location.pathname === '/' ? styles.active : ''}`}
                >
                    Data
                </Link>
                <Link
                    to="/project"
                    className={`${styles.navButton} ${location.pathname === '/project' ? styles.active : ''}`}
                >
                    Project
                </Link>
            </div>
        </header>
    );
};

export default Header;
