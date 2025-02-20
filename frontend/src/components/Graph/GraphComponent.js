import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";
import styles from './GraphComponent.module.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import variables from '../../data/variables.json';

/**
 * GraphComponent - A component to render a dynamic graph based on selected variable, time period, and scenario.
 */
const GraphComponent = () => {
    const { t, i18n } = useTranslation();
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [chartOptions, setChartOptions] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const timePeriod = useSelector((state) => state.timePeriod);
    const futureScenario = useSelector((state) => state.futureScenario);
    const variable = useSelector((state) => state.variable);
    const isMobile = useSelector((state) => state.isMobile);

    useEffect(() => {
        const handleResize = () => setScreenHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (variable.id === 'koppen' || variable.id === 'trewartha' || variable.domain === 'SPI') return;

        const fetchData = async () => {
            try {
                setErrorMessage(null);
                setChartOptions(null);

                const endpoint = `${process.env.REACT_APP_API_BASE_URL}/data/${variable.domain}/${variable.id}/${timePeriod.domain === 'historical' ? 'hist' : futureScenario.id + '_' + timePeriod.id}`;
                const response = await axios.get(endpoint);

                if (response.status === 200 && response.data && response.data.length > 0) {
                    const data = response.data;
                    const enMonths = data.map(item => item.month);
                    const ptMonths = enMonths.map(month => t(`months.${month}`));
                    const months = i18n.language === 'en' ? enMonths : ptMonths;
                    const values = data.map(item => item.value);
                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);
                    const range = maxValue - minValue;
                    const tickInterval = range >= 100 ? 50 : (range >= 20 ? 5 : (range > 10 ? 2 : (range > 1 ? 1 : 0.5)));

                    let yAxisTitle = '';
                    let tooltipUnit = '';

                    switch (variable.domain) {
                        case 'TEMPS':
                        case 'hw_int':
                            yAxisTitle = t('yAxisTitleTemp');
                            tooltipUnit = '°C';
                            break;
                        case 'NDAYS':
                        case 'FWI':
                        case 'AQ':
                        case 'TD':
                        case 'hw_dur':
                            yAxisTitle = t('yAxisTitleNDays');
                            tooltipUnit = ' days';
                            break;
                        case 'WIND':
                            yAxisTitle = t('yAxisTitleWind');
                            tooltipUnit = ' kW.h/m2';
                            break;
                        case 'SOLAR':
                            yAxisTitle = t('yAxisTitleSolar');
                            tooltipUnit = ' kW.h/m2';
                            break;
                        default:
                            break;
                    }

                    setChartOptions({
                        chart: {
                            type: 'line',
                            backgroundColor: 'rgb(39, 49, 57, 0)',
                            spacingTop: 20,
                            fontFamily: 'Epilogue',
                            height: isMobile ? 250 : Math.max(screenHeight * 0.35, screenHeight > 800 ? 350 : 300),
                            width: !isMobile ? null : 600,
                        },
                        title: { text: '' },
                        xAxis: {
                            lineColor: '#68727D',
                            categories: months,
                            labels: { style: { color: '#68727D', fontSize: '12px' } },
                        },
                        yAxis: {
                            title: { text: yAxisTitle, x: -10, style: { color: '#68727D', fontSize: '12px', fontFamily: 'Epilogue' } },
                            labels: { style: { color: '#68727D', fontSize: '12px', fontFamily: 'Epilogue' } },
                            gridLineColor: 'rgba(44, 44, 54, 0.1)',
                            gridLineWidth: 1.5,
                            min: Math.floor(minValue) === 0 ? 0 : Math.floor(minValue) - 1,
                            max: Math.floor(maxValue) + 1,
                            tickInterval: tickInterval,
                        },
                        series: [{
                            name: `${variable.name} (${timePeriod.scenario})`,
                            data: values,
                            color: {
                                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                                stops: [[0, '#44A3DA'], [1, '#0A47A9']]
                            },
                        }],
                        plotOptions: {
                            line: {
                                dataLabels: { enabled: false, style: { enableMouseTracking: true, color: '#373C41' } },
                            },
                        },
                        tooltip: {
                            useHTML: true,
                            formatter: function () {
                                return `Average<br /><strong>${this.category}</strong>: ${this.y.toFixed(1)}${tooltipUnit}`;
                            },
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            borderWidth: 2,
                            borderColor: 'rgb(217, 223, 228)',
                            padding: 10,
                            shadow: false,
                            style: { color: 'rgb(44, 44, 54)', fontSize: '11px' }
                        },
                        legend: { enabled: false },
                        credits: { enabled: false },
                    });
                } else {
                    setErrorMessage(t('noChartAvailable'));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage(t('noChartAvailable'));
            }
        };

        fetchData();
    }, [variable, timePeriod, futureScenario, t, screenHeight, isMobile]);

    if (variable.id === 'koppen' || variable.id === 'trewartha') {
        return <ClimateClassificationComponent variable={variable} t={t} i18n={i18n} />;
    } else if (variable.domain === 'SPI' || variable.domain === 'SPEI') {
        return <SPIComponent variable={variable} t={t} />;
    } else if (variable.domain === 'UNEP') {
        return <UNEPComponent variable={variable} t={t} />;
    }

    return (
        errorMessage ? (
            <p className={styles.errorMessage}>
                <MdErrorOutline size={28} style={{ marginBottom: '12px', flexShrink: 0 }} />
                {errorMessage}
            </p>
        ) : (
            <div className={styles.graphContainer}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.chartTitle}>{getChartTitle(variable, t)}</h2>
                    <h4 className={styles.chartSubtitle}>
                        {`${timePeriod.domain === 'historical' ? t('historical') : t('futureScenario') + ' ' + futureScenario.scenario.split(' ')[1]}, ${t('period')} ${timePeriod.period}`}
                    </h4>
                    <div className={styles.chartDescriptionInfo}>
                        <div className={styles.chartDescription}>
                            <div className={styles.chartDescriptionMain}>
                                <MdInfoOutline size={24} style={{ marginBottom: '4px', marginRight: '8px', flexShrink: 0 }} />
                                {t('graphInfoMain')}
                            </div>
                            <div className={styles.chartDescriptionExample}>{t('graphInfoSecondary')}</div>
                        </div>
                    </div>
                </div>
                <div className={styles.realChart}>
                    {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
                </div>
            </div>
        )
    );
};

/**
 * ClimateClassificationComponent - A component to render climate classification legend.
 */
const ClimateClassificationComponent = ({ variable, t, i18n }) => {
    const classification = variables.find(item => item.name === 'climateClassification');
    const option = classification.options.find(opt => opt.id === variable.id);

    const title = i18n.language === 'en' ? `${variable.id === 'koppen' ? 'Köppen' : 'Köppen-Trewartha'} ${t('ccTitle')}` : `${t('ccTitle')} ${variable.id === 'koppen' ? 'Köppen' : 'Köppen-Trewartha'}`;
    const kLink = i18n.language === 'en' ? 'https://en.wikipedia.org/wiki/Koppen_climate_classification' : 'https://pt.wikipedia.org/wiki/Classifica%C3%A7%C3%A3o_clim%C3%A1tica_de_K%C3%B6ppen-Geiger';
    const tLink = i18n.language === 'en' ? 'https://en.wikipedia.org/wiki/Trewartha_climate_classification' : 'https://pt.wikipedia.org/wiki/Classifica%C3%A7%C3%A3o_clim%C3%A1tica_de_Trewartha';

    return (
        <div className={styles.legendContainer}>
            <div className={styles.legendTitle}><p>{title}</p></div>
            <div className={styles.legendItems}>
                {option.legend.map(item => (
                    <div key={item.id} className={styles.legendItem}>
                        <div className={styles.legendItemHeader}>
                            <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                            <p><strong>{item.id}</strong></p>
                        </div>
                        <p style={{ marginTop: '4px' }}>{t(`climateClassificationLegend.${option.domain}.${item.id}`)}</p>
                    </div>
                ))}
                <div className={styles.moreInfo}>
                    <p style={{ marginTop: '8px', lineHeight: '1.2' }}>
                        {variable.id === 'koppen' ? t('moreInfoKoppen') : t('moreInfoTrewartha')}
                        <a className={styles.moreInfoLink} href={variable.id === 'koppen' ? tLink : kLink} target="_blank" rel="noopener noreferrer">link</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * SPIComponent - A component to render SPI/SPEI classification.
 */
const SPIComponent = ({ variable, t }) => {
    const title = t('spiTitle');
    const subtitle = variable.domain === 'SPI' ? t('spiSubtitle') : t('speiSubtitle');

    return (
        <div className={styles.container}>
            <div className={styles.title}><p>{title}</p></div>
            <div className={styles.subtitle}><p>{subtitle}</p></div>
            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <p className={styles.detailTitle}>{t('dur')}</p>
                    <p className={styles.detailText}>{t('durText')}</p>
                </div>
                <div className={styles.detailItem}>
                    <p className={styles.detailTitle}>{t('int')}</p>
                    <p className={styles.detailText}>{t('intText')}</p>
                </div>
                <div className={styles.detailItem}>
                    <p className={styles.detailTitle}>{t('nEvents')}</p>
                    <p className={styles.detailText}>{t('nEventsText')}</p>
                </div>
            </div>
        </div>
    );
}

/**
 * UNEPComponent - A component to render UNEP classification.
 */
const UNEPComponent = ({ t }) => {
    const legend = variables.find(item => item.name === 'agriculture')
        .subvariables.find(item => item.name === 'aridityIndex')
        .options.find(item => item.id === 'UNEP').legend;

    const title = t('unepTitle');
    const aridityText2 = t('aridityText2').split(':');

    return (
        <div className={styles.container}>
            <div className={styles.title}><p>{title}</p></div>
            <div className={styles.details}>
                <p className={styles.unepText1}>{t('aridityText1')}</p>
                <p className={styles.unepText2}>{aridityText2[0]}:</p>
                <p className={styles.unepText2}>{aridityText2[1]}</p>
                <p className={styles.unepText3}>{t('aridityText3')}</p>
                <div className={styles.unepItems} style={{ marginTop: '10px' }}>
                    {legend.map(item => (
                        <div key={item.id} className={styles.legendItem} style={{width: '33%'}}>
                            <div className={styles.legendItemHeader}>
                                <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                                <p><strong>{t(`aridityClassificationLegend.${item.id}`)}</strong></p>
                            </div>
                            <p style={{ marginTop: '4px' }}>{getUNEPInterval(item.id)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const getUNEPInterval = (id) => {
    switch (id) {
        case 'ha': return 'AI < 0.05';
        case 'a': return '0.05 ≤ AI < 0.2';
        case 'sa': return '0.2 ≤ AI < 0.5';
        case 'dsh': return '0.5 ≤ AI < 0.65';
        case 'h': return '0.65 ≤ AI < 0.75';
        case 'hh': return 'AI ≥ 0.75';
        default: return '';
    }
};

/**
 * getChartTitle - Returns the chart title based on the selected variable.
 */
const getChartTitle = (variable, t) => {
    switch (variable.id) {
        case 'Tmax': return t('maximumTemperatureGraphTitle');
        case 'Tmin': return t('minimumTemperatureGraphTitle');
        case 'Tmean': return t('meanTemperatureGraphTitle');
        case 'hw_int': return t('hwIntensityGraphTitle');
        case 'hw_dur': return t('hwDurationGraphTitle');
        case 'very_hot_days': return t('veryHotDaysGraphTitle');
        case 'hot_days': return t('hotDaysGraphTitle');
        case 'tropical_nights': return t('tropicalNightsGraphTitle');
        case 'frost_days': return t('frostDaysGraphTitle');
        case 'cold_days': return t('coldDaysGraphTitle');
        case 'wind_energy_100m': return t('windGraphTitle');
        case 'solar_energy': return t('solarGraphTitle');
        case 'fwi_above24': return t('fwiAbove24GraphTitle');
        case 'NO2': return `${t('aqGraphTitlePt1')} NO2 ${t('aqGraphTitlePt2')}`;
        case 'O3': return `${t('aqGraphTitlePt1')} O3 ${t('aqGraphTitlePt2')}`;
        case 'PM10': return `${t('aqGraphTitlePt1')} PM10 ${t('aqGraphTitlePt2')}`;
        case 'PM25': return `${t('aqGraphTitlePt1')} PM2.5 ${t('aqGraphTitlePt2')}`;
        case 'CO': return `${t('aqGraphTitlePt1')} CO ${t('aqGraphTitlePt2')}`;
        case 'SO2': return `${t('aqGraphTitlePt1')} SO2 ${t('aqGraphTitlePt2')}`;
        case 'tdi28': return t('tdi28GraphTitle');
        case 'utci26': return t('utci26GraphTitle');
        case 'utci32': return t('utci32GraphTitle');
        default: return '';
    }
};

export default GraphComponent;
