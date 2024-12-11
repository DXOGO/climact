import React, { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { MdErrorOutline, MdInfoOutline } from "react-icons/md";

import styles from './GraphComponent.module.css';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';


const GraphComponent = () => {
    const { t } = useTranslation();

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [chartOptions, setChartOptions] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null); // To store error messages

    const timePeriod = useSelector((state) => state.timePeriod);
    const futureScenario = useSelector((state) => state.futureScenario);
    const variable = useSelector((state) => state.variable);
    const isMobile = useSelector((state) => state.isMobile);
    
    let title;

    // Set the graph title based on the selected variable
    switch (variable.id) {
        case 'Tmax':
            title = t('maximumTemperatureGraphTitle');
            break;
        case 'Tmin':
            title = t('minimumTemperatureGraphTitle');
            break;
        case 'Tmean':
            title = t('meanTemperatureGraphTitle');
            break;
        case 'very_hot_days':
            title = t('veryHotDaysGraphTitle');
            break;
        case 'hot_days':
            title = t('hotDaysGraphTitle');
            break;
        case 'tropical_nights':
            title = t('tropicalNightsGraphTitle');
            break;
        case 'frost_days':
            title = t('frostDaysGraphTitle');
            break;
        case 'cold_days':
            title = t('coldDaysGraphTitle');
            break;
        case 'wind_energy_100m':
            title = t('windGraphTitle');
            break;
        case 'solar_energy':
            title = t('solarGraphTitle');
            break;
        case 'high_days_fwi':
            title = t('hfwiGraphTitle');
            break;
        case 'very_high_days_fwi':
            title = t('vhfwiGraphTitle');
            break;
        case 'extreme_days_fwi':
            title = t('efwiGraphTitle');
            break;
        case 'very_extreme_fwi':
            title = t('vefwiGraphTitle');
            break;
        case 'exceptional_days_fwi':
            title = t('exfwiGraphTitle');
            break;
        case 'NO2':
            title = t('aqGraphTitlePt1') + ' NO2 ' + t('aqGraphTitlePt2');
            break;
        case 'O3':
            title = t('aqGraphTitlePt1') + ' O3 ' + t('aqGraphTitlePt2');
            break;
        case 'PM10':
            title = t('aqGraphTitlePt1') + ' PM10 ' + t('aqGraphTitlePt2');;
            break;
        case 'PM25':
            title = t('aqGraphTitlePt1') + ' PM2.5 ' + t('aqGraphTitlePt2');
            break;
        case 'CO':
            title = t('aqGraphTitlePt1') + ' CO ' + t('aqGraphTitlePt2');
            break;
        case 'SO2':
            title = t('aqGraphTitlePt1') + ' SO2 ' + t('aqGraphTitlePt2');
            break;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setErrorMessage(null); // Reset error message
                setChartOptions(null);  // Reset chart options

                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/data/${variable.domain}/${variable.id}/${timePeriod.domain === 'historical' ? 'hist' : futureScenario.id + '_' + timePeriod.id}`);

                if (response.status === 200 && response.data && response.data.length > 0) {
                    const data = response.data;


                    // For variables with line plot where x-axis is the month and y-axis is the value
                    const months = data.map(item => item.month);
                    const values = data.map(item => item.value);

                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);

                    // Calculate a reasonable tick interval based on the data range
                    const range = maxValue - minValue;
                    const tickInterval = range >= 100 ? 50 : (range >= 20 ? 5 : (range > 10 ? 2 : (range > 1 ? 1 : 0.2)));

                    // Set y-axis label and tooltip units based on variable domain
                    let yAxisTitle = '';
                    let tooltipUnit = '';

                    if (variable.domain === 'TEMPS') {
                        yAxisTitle = t('yAxisTitleTemp');
                        tooltipUnit = '°C';
                    } else if (variable.domain === 'NDAYS' || variable.domain === 'FWI' || variable.domain === 'AQ') {
                        yAxisTitle = t('yAxisTitleNDays');
                        tooltipUnit = ' days';
                    } else if (variable.domain === 'WIND') {
                        yAxisTitle = t('yAxisTitleWind');
                        tooltipUnit = ' kW.h/m2';
                    } else if (variable.domain === 'SOLAR') {
                        yAxisTitle = t('yAxisTitleSolar');
                        tooltipUnit = ' kW.h/m2';
                    }

                    // Set chart options dynamically
                    setChartOptions({
                        chart: {
                            type: 'line',
                            backgroundColor: 'rgb(39, 49, 57, 0)',
                            spacingTop: 20,
                            fontFamily: 'Epilogue',
                            height: isMobile ? 250 : (Math.max(screenHeight * 0.35, screenHeight > 800 ? 350 : 300)),
                            width: !isMobile ? null : 600,
                        },
                        title: {
                            text: '',
                        },

                        xAxis: {
                            lineColor: '#68727D',
                            categories: months,
                            labels: {
                                style: {
                                    color: '#68727D',
                                    fontSize: '12px',
                                },
                            },
                        },
                        yAxis: {
                            title: {
                                text: yAxisTitle,
                                x: -10,
                                style: {
                                    color: '#68727D',
                                    fontSize: '12px',
                                    fontFamily: 'Epilogue',
                                },
                            },
                            labels: {
                                style: {
                                    color: '#68727D',
                                    fontSize: '12px',
                                    fontFamily: 'Epilogue',
                                },
                            },
                            // tickInterval: 5,
                            gridLineColor: 'rgba(44, 44, 54, 0.1)',
                            gridLineWidth: 1.5,
                            min: Math.floor(minValue) === 0 ? 0 : Math.floor(minValue) - 1,
                            max: Math.floor(maxValue) + 1,
                            tickInterval: tickInterval,

                        },
                        series: [{
                            name: `${variable.name} (${timePeriod.scenario})`,
                            data: values,
                            color: '#44A3DA',
                        }],
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false,
                                    style: {
                                        enableMouseTracking: true,
                                        color: '#373C41'
                                    },
                                },
                            },
                        },
                        tooltip: {
                            useHTML: true, // Enable HTML for tooltips
                            formatter: function () {
                                return `Average<br /><strong>${this.category}</strong>: ${this.y.toFixed(1)}${tooltipUnit}`;
                            },
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            borderWidth: 2,
                            borderColor: 'rgb(217, 223, 228)',
                            padding: 10,
                            shadow: false,
                            style: {
                                color: 'rgb(44, 44, 54)',
                                fontSize: '11px',
                            }
                        },
                        legend: {
                            enabled: false, // Disable the legend
                        },
                        credits: {
                            enabled: false, // Disable the credits
                        },
                    });

                } else {
                    setErrorMessage(t('noChartAvailable'));
                }
            } catch (error) {
                console.error('Error fetching data:', error);

                // Check if the error has a response from the backend
                if (error.response) {
                    console.error('Error response from backend:', error.response.data);
                    // Use the error message from the backend, or fallback to a generic message
                    setErrorMessage(t('noChartAvailable'));
                } else {
                    // In case there's no response (network or other issues)
                    setErrorMessage(t('noChartAvailable'));
                }
            }
        };

        fetchData();
    }, [variable, timePeriod, futureScenario, t, screenHeight, isMobile]);

    return (
        errorMessage ? (
            <p className={styles.errorMessage}>
                <MdErrorOutline size={28} style={{ marginBottom: '12px', flexShrink: 0 }} />
                {errorMessage}
            </p>
        ) : (
            <div className={styles.graphContainer}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.chartTitle}>
                        {title}
                    </h2>
                    <h4 className={styles.chartSubtitle}>
                        {`${futureScenario.scenario}, ${timePeriod.period}`}
                    </h4>
                    <div className={styles.chartDescriptionInfo}>
                        <div className={styles.chartDescription}>
                            <div className={styles.chartDescriptionMain}>
                                <MdInfoOutline size={24} style={{ marginBottom: '4px', marginRight: '8px', flexShrink: 0 }} />
                                {t('graphInfoMain')}
                            </div>
                            <div className={styles.chartDescriptionExample}>
                                {t('graphInfoSecondary')}
                            </div>
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

export default GraphComponent;
