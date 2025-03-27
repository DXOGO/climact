import React, { useState, useEffect, useRef } from 'react';
import { MdKeyboardArrowLeft, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './MainLayout.module.css';

import fct from "../../assets/fct-light.png";
import pt from "../../assets/pt-light.png";
import ua from "../../assets/ua-light.png";
import cesam from "../../assets/cesam-light.png";
import dfis from "../../assets/dfis-light.png";

import TimePeriod from '../../components/TimePeriodSubmenu/TimePeriod';
import Variable from '../../components/VariableSubmenu/Variable';
import FutureScenario from '../../components/FutureScenarioSubmenu/FutureScenario';
import LeafletMap from '../../components/Map/LeafletMap';
import GraphComponent from '../../components/Graph/GraphComponent';

const MainLayout = () => {
    const { t } = useTranslation();

    const timePeriod = useSelector((state) => state.timePeriod);
    const futureScenario = useSelector((state) => state.futureScenario);
    const variable = useSelector((state) => state.variable);
    const isMobile = useSelector((state) => state.isMobile);

    const [showMap, setShowMap] = useState(false);
    const [showGraph, setShowGraph] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [title, setTitle] = useState('');
    const [mapKey, setMapKey] = useState(0);
    const middleColumnRef = useRef(null);

    useEffect(() => {
        const middleColumn = middleColumnRef.current;
        if (!middleColumn) return;

        const resizeObserver = new ResizeObserver(() => {
            setMapKey(prevKey => prevKey + 1);
        });

        resizeObserver.observe(middleColumn);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

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

    const isFutureScenarioDisabled = timePeriod.domain === 'historical';

    return (
        !isMobile ? (
            <>
                <div className={styles.container}>
                    <div className={`${styles.leftColumn} ${activeMenu ? styles.expandedLeftColumn : ''}`} onMouseLeave={handleMouseLeave}>
                        <div className={`${styles.mainMenu} ${activeMenu ? styles.expandedMainMenu : ''}`}>
                            <MenuOption
                                title={t('timePeriod')}
                                variable={timePeriod.period}
                                isActive={activeMenu === 'timePeriod'}
                                onMouseEnter={() => handleMouseEnter('timePeriod')} />
                            <MenuOption
                                title={t('futureScenario')}
                                variable={t(futureScenario.scenario)}
                                isActive={activeMenu === 'futureScenario'}
                                onMouseEnter={() => !isFutureScenarioDisabled && handleMouseEnter('futureScenario')}
                                disabled={isFutureScenarioDisabled}
                                t={t} />
                            <MenuOption
                                title={t('variable')}
                                subtitle={t(variable.name)}
                                variable={variable.name === "agriculture"
                                    ? `${extractAbbreviation(t(variable.subvariable))} - ${t(variable.option)}`
                                    : t(variable.option)}
                                isActive={activeMenu === 'variable'}
                                onMouseEnter={() => handleMouseEnter('variable')} />
                        </div>

                        <div className={`${styles.submenu} ${activeMenu ? styles.expandedSubmenu : ''}`}>
                            {activeMenu === 'timePeriod' && <TimePeriod />}
                            {activeMenu === 'futureScenario' && !isFutureScenarioDisabled && <FutureScenario />}
                            {activeMenu === 'variable' && <Variable />}
                        </div>
                    </div>
                    <div className={styles.middleColumn} ref={middleColumnRef}>
                        {/* {variable.domain !== 'KOPPEN' && variable.domain !== 'TREWARTHA' && variable.domain !== 'UNEP' && variable.domain !== 'SPEI' && variable.domain !== 'SPI' && ( */}
                            <div className={styles.chartHeader}>
                                <h2 className={styles.chartTitle}>{getMapTitle(variable, t)}</h2>
                                <h4 className={styles.chartSubtitle}>
                                    {`${timePeriod.domain === 'historical' ? t('historical') : t('futureScenario') + ' ' + futureScenario.scenario.split(' ')[1]}, ${t('period')} ${timePeriod.period}`}
                                </h4>
                            </div>
                        {/* )} */}
                        <LeafletMap key={mapKey} />
                    </div>
                    <div className={styles.rightColumn}>
                        <GraphComponent />
                    </div>
                </div>
                <div className={styles.logos}>
                    <div className={styles.logosLeft}>
                        <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={!isMobile ? { height: '84px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={dfis} alt="Departamento de Física" style={!isMobile ? { height: '88px', width: 'auto' } : { height: 'auto', width: '80px' }} />
                        <img src={ua} alt="Universidade de Aveiro" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                    <div className={styles.logosRight}>
                        <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={pt} alt="República Portuguesa" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                </div>
            </>
        ) : (
            <>
                <div className={styles.container}>
                    <div className={styles.leftColumn}>
                        {activeMenu === null ? (
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <MenuOption
                                    title={t('timePeriod')}
                                    variable={timePeriod.period}
                                    onClick={() => handleClick('timePeriod', t('timePeriod'))} />
                                <MenuOption
                                    title={t('futureScenario')}
                                    subtitle={t(futureScenario.scenario)}
                                    onClick={() => !isFutureScenarioDisabled && handleClick('futureScenario', t('futureScenario'))}
                                    disabled={isFutureScenarioDisabled}
                                    t={t} />
                                <MenuOption
                                    title={t('variable')}
                                    subtitle={t(variable.name)}
                                    variable={variable.name === "agriculture"
                                        ? `${extractAbbreviation(t(variable.subvariable))} - ${t(variable.option)}`
                                        : t(variable.option)}
                                    onClick={() => handleClick('variable', t('variable'))} />
                            </div>
                        ) : (
                            <div className={styles.activeMenu}>
                                <button className={styles.backButton} onClick={handleBack}>
                                    <MdKeyboardArrowLeft color='#2c2c36' size={isMobile ? 28 : 32} style={{ flexShrink: 0 }} />
                                    <span className={styles.backTitle}>{title}</span>
                                </button>
                                {activeMenu === 'timePeriod' && <TimePeriod />}
                                {activeMenu === 'futureScenario' && !isFutureScenarioDisabled && <FutureScenario />}
                                {activeMenu === 'variable' && <Variable />}
                            </div>
                        )}
                    </div>
                    <div className={styles.middleColumn}>
                        {/* {variable.domain !== 'KOPPEN' && variable.domain !== 'TREWARTHA' && variable.domain !== 'UNEP' && variable.domain !== 'SPEI' && variable.domain !== 'SPI' && ( */}
                            <div className={styles.chartHeader}>
                                <h2 className={styles.chartTitle}>{getMapTitle(variable, t)}</h2>
                                <h4 className={styles.chartSubtitle}>
                                    {`${timePeriod.domain === 'historical' ? t('historical') : t('futureScenario') + ' ' + futureScenario.scenario.split(' ')[1]}, ${t('period')} ${timePeriod.period}`}
                                </h4>
                            </div>
                        {/* )} */}
                        <LeafletMap />
                    </div>
                    <div className={styles.rightColumn}>
                        <GraphComponent />
                    </div>
                </div>
                <div className={styles.logos}>
                    <div className={styles.logosLeft}>
                        <img src={cesam} alt="Centro de Estudos do Ambiente e do Mar" style={!isMobile ? { height: '84px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={dfis} alt="Departamento de Física" style={!isMobile ? { height: '88px', width: 'auto' } : { height: 'auto', width: '80px' }} />
                        <img src={ua} alt="Universidade de Aveiro" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                    <div className={styles.logosRight}>
                        <img src={fct} alt="Fundação para a Ciência e a Tecnologia" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                        <img src={pt} alt="República Portuguesa" style={!isMobile ? { height: '40px', width: 'auto' } : { height: 'auto', width: '110px' }} />
                    </div>
                </div>
            </>
        )
    );
};

const MenuOption = ({ title, subtitle, variable, onMouseEnter, onClick, isActive, disabled, t }) => {
    return (
        <div
            className={`${styles.menuOption} ${isActive ? styles.activeMenuOption : ''} ${disabled ? styles.disabledMenuOption : ''}`}
            onMouseEnter={!disabled ? onMouseEnter : null}
            onClick={!disabled ? onClick : null}
            title={disabled ? t('disabledOption') : null}
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

const extractAbbreviation = (text) => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? match[1] : text; // If there's a match, return the content inside parentheses; otherwise, return the full text
};

/**
 * getChartTitle - Returns the chart title based on the selected variable.
 */
const getMapTitle = (variable, t) => {
    switch (variable.id) {
        case 'Tmax': return t('maximumTemperatureMapTitle');
        case 'Tmin': return t('minimumTemperatureMapTitle');
        case 'Tmean': return t('meanTemperatureMapTitle');
        case 'rr_anual': return t('annualTotalPrecipMapTitle');
        case 'RR50': return t('extremePrecipMapTitle');
        case 'RR20': return t('veryHeavyPrecipMapTitle');
        case 'RR10': return t('heavyPrecipMapTitle');
        case 'avg_wet_days': return t('wetDaysMapTitle');
        case 'avg_dry_days': return t('dryDaysMapTitle');
        case 'RX1day': return t('rx1dayGraphTittle');
        case 'RX5day': return t('rx5dayGraphTittle');
        case 'CDD': return t('cddMapTitle');
        case 'CWD': return t('cwdMapTitle');
        case 'LPD': return t('lpdMapTitle');
        case 'hw_int': return t('hwIntensityMapTitle');
        case 'hw_dur': return t('hwDurationMapTitle');
        case 'hw_ndays': return t('hwNDaysMapTitle');
        case 'hw_nwaves': return t('hwNWavesMapTitle');
        case 'very_hot_days': return t('veryHotDaysMapTitle');
        case 'hot_days': return t('hotDaysMapTitle');
        case 'tropical_nights': return t('tropicalNightsMapTitle');
        case 'frost_days': return t('frostDaysMapTitle');
        case 'cold_days': return t('coldDaysMapTitle');
        case 'wind_energy_100m': return t('windMapTitle');
        case 'solar_energy': return t('solarMapTitle');
        case 'fwi_above24': return t('fwiAbove24MapTitle');
        case 'NO2': return `${t('aqMapTitle')} NO2`;
        case 'O3': return `${t('aqMapTitle')} O3`;
        case 'PM10': return `${t('aqMapTitle')} PM10`;
        case 'PM25': return `${t('aqMapTitle')} PM2.5`;
        case 'CO': return `${t('aqMapTitle')} CO`;
        case 'SO2': return `${t('aqMapTitle')} SO2`;
        case 'tdi28': return t('tdi28MapTitle');
        case 'utci26': return t('utci26MapTitle');
        case 'utci32': return t('utci32MapTitle');
        default: return '';
    }
};

export default MainLayout;
