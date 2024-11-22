import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './TimePeriod.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setTimePeriod } from '../../redux/actions';

// Import the time period data from the JSON file
const timePeriods = require('../../data/timeperiod.json');

const TimePeriod = () => {
    // Get the selected time period from Redux
    const selectedTimePeriod = useSelector((state) => state.timePeriod);
    const dispatch = useDispatch();

    const handleOptionChange = (scenario, period, id) => {
        dispatch(setTimePeriod({ scenario, period, id }));
    };

    return (
        <div className={styles.container}>
            {timePeriods.map((timePeriod) => (
                <div key={timePeriod.scenario} className={styles.optionGroup}>
                    <h5 className={styles.subheading}>{timePeriod.scenario}</h5>
                    <div className={styles.radioButtonsTimePeriod}>
                        {timePeriod.period.map((period) => (
                            <div style={{marginRight: '30px'}}>
                            <RadioOption
                                key={period.id} // Unique key for each radio option
                                label={`${timePeriod.scenario}-${period.label}`}
                                name="time-period"
                                text={period.label}
                                checked={
                                    selectedTimePeriod.period === period.label &&
                                    selectedTimePeriod.scenario === timePeriod.scenario
                                }
                                onChange={() => handleOptionChange(timePeriod.scenario, period.label, period.id)} // Handle selection change
                            />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimePeriod;
