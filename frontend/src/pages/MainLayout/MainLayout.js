import React, { useState } from 'react';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import styles from './MainLayout.module.css';

import TimePeriod from '../../components/TimePeriodSubmenu/TimePeriod';
import Variable from '../../components/VariableSubmenu/Variable';
import TemporalMean from '../../components/TemporalMeanSubmenu/TemporalMean';
import LeafletMap from '../../components/Map/LeafletMap';
import GraphComponent from '../../components/Graph/GraphComponent';

const MainLayout = () => {
    const { t } = useTranslation();

    const timePeriod = useSelector(state => state.timePeriod); // Scenario and period
    const variable = useSelector(state => state.variable); // Variable and option
    const temporalMean = useSelector(state => state.temporalMean);

    const isMobile = useSelector(state => state.isMobile);

    const [showMap, setShowMap] = useState(false); // For showing the map dropdown on mobile
    const [showGraph, setShowGraph] = useState(false); // For showing the graph dropdown on mobile

    const [activeMenu, setActiveMenu] = useState(null);
    const [title, setTitle] = useState('');

    const handleMouseEnter = (menu) => { setActiveMenu(menu); };

    const handleMouseLeave = () => { setActiveMenu(null); };

    const handleClick = (menu, title) => {
        setActiveMenu(menu);
        setTitle(title);
    };

    const handleBack = () => {
        setActiveMenu(null);
        setTitle('');
    };

    return (
        !isMobile ? (
            <div className={styles.container}>
                <div className={`${styles.leftColumn} ${activeMenu ? styles.expandedLeftColumn : ''}`} onMouseLeave={handleMouseLeave}>
                    <div className={`${styles.mainMenu} ${activeMenu ? styles.expandedMainMenu : ''}`}>
                        <MenuOption
                            title={t('timePeriod')}
                            subtitle={timePeriod.scenario}
                            variable={timePeriod.period}
                            isActive={activeMenu === 'timePeriod'}
                            onMouseEnter={() => handleMouseEnter('timePeriod')}
                        />
                        <MenuOption
                            title={t('variable')}
                            subtitle={t(variable.name)}
                            variable={t(variable.option)}
                            isActive={activeMenu === 'variable'}
                            onMouseEnter={() => handleMouseEnter('variable')}
                        />
                        <MenuOption
                            title={t('temporalMean')}
                            subtitle={t(temporalMean)}
                            isActive={activeMenu === 'temporalMean'}
                            onMouseEnter={() => handleMouseEnter('temporalMean')}
                        />
                    </div>

                    <div className={`${styles.submenu} ${activeMenu ? styles.expandedSubmenu : ''}`}>
                        {activeMenu === 'timePeriod' && <TimePeriod />}
                        {activeMenu === 'variable' && <Variable />}
                        {activeMenu === 'temporalMean' && <TemporalMean />}
                    </div>
                </div>
                <div className={styles.middleColumn}>
                    <LeafletMap />
                </div>
                <div className={styles.rightColumn}>
                    <GraphComponent />
                </div>
            </div>
        ) : (
            <div className={styles.container}>
                <div className={styles.leftColumn}>
                    {activeMenu === null ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <MenuOption
                                title={t('timePeriod')}
                                subtitle={timePeriod.scenario}
                                variable={timePeriod.period}
                                onClick={() => handleClick('timePeriod', t('timePeriod'))} />
                            <MenuOption
                                title={t('variable')}
                                subtitle={t(variable.name)}
                                variable={t(variable.option)}
                                onClick={() => handleClick('variable', t('variable'))} />
                            <MenuOption
                                title={t('temporalMean')}
                                subtitle={t(temporalMean)}
                                onClick={() => handleClick('temporalMean', t('temporalMean'))} />
                        </div>
                    ) : (
                        <div className={styles.activeMenu}>
                            <button className={styles.backButton} onClick={handleBack}>
                                <MdKeyboardArrowLeft color='#fff' size={isMobile ? 28 : 32} style={{ flexShrink: 0 }} />
                                <span className={styles.backTitle}>{title}</span>
                            </button>
                            {activeMenu === 'timePeriod' && <TimePeriod />}
                            {activeMenu === 'variable' && <Variable />}
                            {activeMenu === 'temporalMean' && <TemporalMean />}
                        </div>
                    )}
                </div>
                <div className={styles.middleColumn}>
                    <div className={styles.mobileDropdown}>
                        {t('textMap')}
                        {showMap ? <MdExpandLess size={28} onClick={() => setShowMap(false)} /> : <MdExpandMore size={28} onClick={() => setShowMap(true)} />}
                    </div>
                    {showMap && <LeafletMap />}
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.mobileDropdown}>
                        {t('textGraph')}
                        {showGraph ? <MdExpandLess size={28} onClick={() => setShowGraph(false)} /> : <MdExpandMore size={28} onClick={() => setShowGraph(true)} />}
                    </div>
                    {showGraph && <GraphComponent />}
                </div>
            </div>
        )
    );
};

const MenuOption = ({ title, subtitle, variable, onMouseEnter, onClick, isActive }) => {
    return (
        <div
            className={`${styles.menuOption} ${isActive ? styles.activeMenuOption : ''}`}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <div className={styles.menuOptionHeader}>
                <div className={styles.title}>{title}</div>
            </div>
            <div className={styles.subtext}>
                <p>{subtitle}</p>
                {variable && <p>{variable}</p>}
            </div>
        </div>
    );
};

export default MainLayout;
