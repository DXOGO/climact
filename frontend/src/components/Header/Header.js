import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css'; // Import CSS file for styling
import logo from '../../assets/climact-dark.png'; // Path to your logo

const Header = () => {
    const location = useLocation(); // Get the current location
    const { i18n, t } = useTranslation(); // Get i18n instance from useTranslation hook

    // Function to handle language change
    const changeLanguage = (language) => {
        i18n.changeLanguage(language); // Change the language in i18next
    };

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
                    {t('data')}
                </Link>
                <Link
                    to="/project"
                    className={`${styles.navButton} ${location.pathname === '/project' ? styles.active : ''}`}
                >
                    {t('project')}
                </Link>
                <select
                    className={styles.languageDropdown}
                    onChange={(e) => changeLanguage(e.target.value)}
                    value={i18n.language}
                >
                    <option value="en">EN</option>
                    <option value="pt">PT</option>
                </select>
            </div>
        </header>
    );
};

export default Header;
