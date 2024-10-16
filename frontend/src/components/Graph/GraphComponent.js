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
    } else if (variable.id === 'WS100m') {
        name = t('wind');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setErrorMessage(null); // Reset error message
                setChartOptions(null);  // Reset chart options

                const response = await axios.get(`http://localhost:3001/api/data/${variable.domain}/${variable.id}/${timePeriod.id}`);


                if (response.status === 200 && response.data && response.data.length > 0) {
                    const data = response.data;


                    // For variables with line plot where x-axis is the month and y-axis is the value
                    const months = data.map(item => item.month);
                    const values = data.map(item => item.value);

                    const minValue = Math.min(...values);
                    const maxValue = Math.max(...values);

                    // Calculate a reasonable tick interval based on the data range
                    const range = maxValue - minValue;
                    const tickInterval = range > 20 ? 5 : (range > 10 ? 2 : 1);

                    // Set y-axis label and tooltip units based on variable domain
                    let yAxisTitle = '';
                    let tooltipUnit = '';

                    if (variable.domain === 'TEMPS') {
                        yAxisTitle = t('yAxisTitleTemp');
                        tooltipUnit = '°C';
                    } else if (variable.domain === 'NDAYS') {
                        yAxisTitle = t('yAxisTitleNDays');
                        tooltipUnit = ' days';
                    } else if (variable.domain === 'WS') {
                        yAxisTitle = t('yAxisTitleWs');
                        tooltipUnit = ' m/s';
                    }

                    // Set chart options dynamically
                    setChartOptions({
                        chart: {
                            type: 'line',
                            backgroundColor: '#25292C',
                            spacingTop: 20,
                            fontFamily: 'Epilogue',
                            height: Math.max(screenHeight * 0.35, 300),
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
                            min: Math.floor(minValue) == 0 ? 0 : Math.floor(minValue) - 1,
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
    }, [variable, timePeriod, t, screenHeight]);

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
                </div>

                {/* Render either the chart or an error message */}
                {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
            </div>
        )
    );
};

export default GraphComponent;
