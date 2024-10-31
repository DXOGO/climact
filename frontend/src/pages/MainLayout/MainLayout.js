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

    const [submenu, setSubmenu] = useState(null);
    const [title, setTitle] = useState('');

    const handleClick = (menu, title) => {
        setSubmenu(menu); // Opens the submenu
        setTitle(title); // Sets the title for the submenu
    };

    const handleBack = () => {
        setSubmenu(null); // Returns to the main menu
        setTitle(''); // Resets the title
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                {submenu === null ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
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
                    <div className={styles.submenu}>
                        <button className={styles.backButton} onClick={handleBack}>
                            <MdKeyboardArrowLeft color='#fff' size={isMobile ? 28 : 32} />
                            <span className={styles.backTitle}>{title}</span>
                        </button>
                        {submenu === 'timePeriod' && <TimePeriod />}
                        {submenu === 'variable' && <Variable />}
                        {submenu === 'temporalMean' && <TemporalMean />}
                    </div>
                )}
            </div>

            {/* Conditional rendering for mobile and desktop layouts */}
            {isMobile ? (
                <>
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
                </>
            ) : (
                <>
                    <div className={styles.middleColumn}>
                        <LeafletMap />
                    </div>
                    <div className={styles.rightColumn}>
                        <GraphComponent />
                    </div>
                </>
            )
            }
        </div>
    );
};

const MenuOption = ({ title, subtitle, variable, onClick }) => {
    const isMobile = useSelector(state => state.isMobile);
    return (
        <div className={styles.menuOption} onClick={onClick}>
            <div className={styles.menuOptionText}>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtext}>
                    <p>{subtitle}</p>
                    {variable && <p>{variable}</p>}
                </div>
            </div>
            <MdKeyboardArrowRight color='#fff' size={isMobile ? 28 : 32} />
        </div>
    );
};

export default MainLayout;
