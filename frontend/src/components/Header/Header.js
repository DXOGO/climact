import React from 'react';
import { useSelector } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

import desktopLogo from '../../assets/climact-light.svg';
import mobileLogo from '../../assets/climact-light-mobile.svg'

const Header = () => {
    const location = useLocation(); // Get the current location
    const { i18n, t } = useTranslation(); // Get i18n instance from useTranslation hook

    const isMobile = useSelector(state => state.isMobile);

    // Function to handle language change
    const changeLanguage = (language) => {
        i18n.changeLanguage(language); // Change the language in i18next
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/">
                    <img src={!isMobile ? desktopLogo : mobileLogo} alt="ClimACT Logo" className={styles.logo} />
                </Link>
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
                    <option value="en" style={{ fontSize: isMobile ? '12px' : '14px' }}>EN</option>
                    <option value="pt" style={{ fontSize: isMobile ? '12px' : '14px' }}>PT</option>
                </select>
            </div>
        </header>
    );
};

export default Header;
