import React, { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import styles from './GraphComponent.module.css';

import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';


const GraphComponent = () => {
    const { t } = useTranslation();

    const [chartOptions, setChartOptions] = useState({});
    const timePeriod = useSelector(state => state.timePeriod);
    const variable = useSelector(state => state.variable);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/data/${variable.domain}/${variable.id}/${timePeriod.id}`);
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
                    yAxisTitle = 'Temperature (ºC)';
                    tooltipUnit = '°C';
                } else if (variable.domain === 'NDAYS') {
                    yAxisTitle = 'Number of days';
                    tooltipUnit = ' days';
                }

                // Set chart options dynamically
                setChartOptions({
                    chart: {
                        type: 'line',
                        backgroundColor: '#25292C',
                        spacingTop: 20,
                        fontFamily: 'Epilogue',
                        height: 280,
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
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [variable, timePeriod]);

    return (
        <div className={styles.graphContainer}>
            <div>
                <h2 className={styles.chartTitle}>
                    {`${t(variable.name)} - ${t(variable.option)}`}
                </h2>
                <h4 className={styles.chartSubtitle}>
                    {`${timePeriod.scenario}, ${timePeriod.period}`}
                </h4>
            </div>

            {/* Render the Highcharts chart */}
            {chartOptions && <HighchartsReact highcharts={Highcharts} options={chartOptions} />}
        </div>
    );
};

export default GraphComponent;
