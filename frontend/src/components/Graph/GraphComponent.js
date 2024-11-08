import React, { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { MdErrorOutline } from "react-icons/md";

import styles from './GraphComponent.module.css';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';


const GraphComponent = () => {
    const { t } = useTranslation();

    const isMobile = useSelector(state => state.isMobile);
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
    const timePeriod = useSelector(state => state.timePeriod);
    const variable = useSelector(state => state.variable);

    let name;

    // Set the graph title based on the selected variable
    if (variable.id === 'Tmax') {
        name = t('maximumTemperatureGraph');
    } else if (variable.id === 'Tmin') {
        name = t('minimumTemperatureGraph');
    } else if (variable.id === 'Tmean') {
        name = t('meanTemperatureGraph');
    } else if (variable.id === 'very_hot_days') {
        name = t('veryHotDays') + ' ' + t('perYear');
    } else if (variable.id === 'tropical_nights') {
        name = t('tropicalNights') + ' ' + t('perYear');
    } else if (variable.id === 'frost_days') {
        name = t('frostDays') + ' ' + t('perYear');
    } else if (variable.id === 'cold_days') {
        name = t('coldDays') + ' ' + t('perYear');
    } else if (variable.id === 'hot_days') {
        name = t('hotDays') + ' ' + t('perYear');
    } else if (variable.id === 'wind_energy_100m') {
        name = t('wind');
    } else if (variable.id === 'solar_energy') {
        name = t('solar');
    } else if (variable.id === 'high_days_fwi') {
        //const orString = t('hfwi');
        //name = orString.replace(/\s*\(.*?\)\s*/g, '') + ' ' + t('perYear');
        name = t('hfwi');
    } else if (variable.id === 'very_high_days_fwi') {
        //const orString = t('vhfwi');
        //name = orString.replace(/\s*\(.*?\)\s*/g, '') + ' ' + t('perYear');
        name = t('vhfwi');
    } else if (variable.id === 'extreme_days_fwi') {
        //const orString = t('edfwi');
        //name = orString.replace(/\s*\(.*?\)\s*/g, '') + ' ' + t('perYear');
        name = t('efwi');
    } else if (variable.id === 'very_extreme_fwi') {
        //const orString = t('vefwi');
        //name = orString.replace(/\s*\(.*?\)\s*/g, '') + ' ' + t('perYear');
        name = t('vefwi');
    } else if (variable.id === 'excepetional_days_fwi') {
        //const orString = t('exfwi');
        //name = orString.replace(/\s*\(.*?\)\s*/g, '') + ' ' + t('perYear');
        name = t('exfwi');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setErrorMessage(null); // Reset error message
                setChartOptions(null);  // Reset chart options

                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/data/${variable.domain}/${variable.id}/${timePeriod.id}`);


                if (response.status === 200 && response.data && response.data.length > 0) {
                    const data = response.data;


                    // For variables with line plot where x-axis is the month and y-axis is the value
                    const months = data.map(item => item.month);
                    const values = data.map(item => item.value);

                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);

                    // Calculate a reasonable tick interval based on the data range
                    const range = maxValue - minValue;
                    const tickInterval = range >= 100 ? 50 : (range >= 20 ? 5 : (range > 10 ? 2 : 1));

                    // Set y-axis label and tooltip units based on variable domain
                    let yAxisTitle = '';
                    let tooltipUnit = '';

                    if (variable.domain === 'TEMPS') {
                        yAxisTitle = t('yAxisTitleTemp');
                        tooltipUnit = '°C';
                    } else if (variable.domain === 'NDAYS' || variable.domain === 'FWI') {
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
                            backgroundColor: '#25292C',
                            spacingTop: 20,
                            fontFamily: 'Epilogue',
                            height: isMobile ? 250 : Math.max(screenHeight * 0.35, 350),
                            width: !isMobile ? null : 600,
                        },
                        title: {
                            text: '',
                        },

                        xAxis: {
                            categories: months,
                            labels: {
                                style: {
                                    color: '#fff',
                                    fontSize: '14px',
                                },
                            },
                        },
                        yAxis: {
                            title: {
                                text: yAxisTitle,
                                x: -10,
                                style: {
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontFamily: 'Epilogue',
                                },
                            },
                            labels: {
                                style: {
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontFamily: 'Epilogue',
                                },
                            },
                            // tickInterval: 5,
                            gridLineColor: '#373C41',
                            gridLineWidth: 1.5,
                            min: Math.floor(minValue) === 0 ? 0 : Math.floor(minValue) - 1,
                            max: Math.floor(maxValue) + 1,
                            tickInterval: tickInterval,

                        },
                        series: [{
                            name: `${variable.name} (${timePeriod.scenario})`,
                            data: values,
                            color: '#6EA9C0',
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
                                return `Average<br /><strong>${this.x}</strong>: ${this.y.toFixed(1)}${tooltipUnit}`;
                            },
                            backgroundColor: '#25292C',
                            borderWidth: 2,
                            borderColor: '#373C41',
                            padding: 10,
                            shadow: false,
                            style: {
                                color: '#fff',
                                fontSize: '12px',
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
    }, [variable, timePeriod, t, screenHeight, isMobile]);

    return (
        errorMessage ? (
            <p className={styles.errorMessage}>
                <MdErrorOutline size={32} style={{ marginBottom: '16px' }} />
                {errorMessage}
            </p>
        ) : (
            <div className={styles.graphContainer}>
                <div className={styles.chartHeader}>
                    <h2 className={styles.chartTitle}>
                        {name}
                    </h2>
                    <h4 className={styles.chartSubtitle}>
                        {`${timePeriod.scenario}, ${timePeriod.period}`}
                    </h4>
                    <div className={styles.chartDescription}>
                        { variable.description ? variable.description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at ligula nisi. Phasellus in gravida augue, ac hendrerit orci. Nam et est rutrum, viverra neque ac, gravida massa'}
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
