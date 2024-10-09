import React, { useEffect, useState } from 'react';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import styles from './GraphComponent.module.css';

import { useSelector } from 'react-redux';
import axios from 'axios';


const GraphComponent = () => {
    const [chartOptions, setChartOptions] = useState({});
    const timePeriod = useSelector(state => state.timePeriod);
    const variable = useSelector(state => state.variable);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Example API endpoint: /api/data/tmed/hist or /api/data/tmax/ssp245_2046_2065
                const response = await axios.get(`http://localhost:3001/api/data/${variable.id}/${timePeriod.id}`);
                const data = response.data; // Assuming the data returns an array of temperature values for each month

                const months = data.map(item => item.month);
                const temperatures = data.map(item => item.temperature);

                // Set chart options dynamically
                setChartOptions({
                    chart: {
                        type: 'line',
                        backgroundColor: '#25292C',
                        spacingTop: 20,
                        fontFamily: 'Epilogue',
                        height: 300,
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
                            text: '°C',
                            align: 'high',
                            x: -6,
                            y: 8,
                            rotation: 0, // Make the title horizontal
                            style: {
                                color: '#fff',
                                fontSize: '14px',
                            },
                        },
                        labels: {
                            style: {
                                color: '#fff',
                                fontSize: '14px',
                            },
                        },
                        tickInterval: 5,
                        gridLineColor: '#373C41',
                        gridLineWidth: 1.5,
                        min: 5,
                        max: 30,
                    },
                    series: [{
                        name: `${variable.name} (${timePeriod.scenario})`,
                        data: temperatures,
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
                            return `<strong>${this.x}</strong>: ${this.y.toFixed(1)}°C`;
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
                    {`${variable.name} - ${variable.option}`}
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
