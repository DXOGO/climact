import React, { useState } from 'react';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/md'; // Importing the arrow icons
import styles from './MainLayout.module.css';

import TimePeriod from '../../components/TimePeriodSubmenu/TimePeriod';
import Variable from '../../components/VariableSubmenu/Variable';
import TemporalMean from '../../components/TemporalMeanSubmenu/TemporalMean';
import LeafletMap from '../../components/Map/LeafletMap';

import { useSelector } from 'react-redux';

const MainLayout = () => {

    const timePeriod = useSelector(state => state.timePeriod); // Scenario and period
    const variable = useSelector(state => state.variable); // Variable and option
    const temporalMean = useSelector(state => state.temporalMean);

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
                    <div>
                        <MenuOption
                            title="Time period"
                            subtitle={timePeriod.scenario}
                            variable={timePeriod.period}
                            onClick={() => handleClick('timePeriod', 'Time period')} />
                        <MenuOption
                            title="Variable"
                            subtitle={variable.name}
                            variable={variable.option}
                            onClick={() => handleClick('variable', 'Variable')} />
                        <MenuOption
                            title="Temporal mean"
                            subtitle={temporalMean}
                            onClick={() => handleClick('temporalMean', 'Temporal mean')} />
                    </div>
                ) : (
                    <div className={styles.submenu}>
                        <button className={styles.backButton} onClick={handleBack}>
                            <MdKeyboardArrowLeft color='#fff' size={32} />
                            <span className={styles.backTitle}>{title}</span>
                        </button>
                        {submenu === 'timePeriod' && <TimePeriod />}
                        {submenu === 'variable' && <Variable />}
                        {submenu === 'temporalMean' && <TemporalMean />}
                    </div>
                )}
            </div>
            <div className={styles.middleColumn}>
                <LeafletMap />
            </div>
            <div className={styles.rightColumn}>
                <div className={styles.topRightBox}>
                </div>
                <div className={styles.bottomRightBox}>
                </div>
            </div>
        </div>
    );
};

const MenuOption = ({ title, subtitle, variable, onClick }) => {
    return (
        <div className={styles.menuOption} onClick={onClick}>
            <div className={styles.menuOptionText}>
                <div className={styles.title}>{title}</div>
                <div className={styles.subtext}>
                    <p>{subtitle}</p>
                    {variable && <p>{variable}</p>}
                </div>
            </div>
            <MdKeyboardArrowRight color='#fff' size={32} />
        </div>
    );
};

export default MainLayout;
