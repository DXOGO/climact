import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './TimePeriod.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setTimePeriod } from '../../redux/actions';

import { useTranslation } from 'react-i18next';

// Import the time period data from the JSON file
const timePeriods = require('../../data/timeperiod.json');

const TimePeriod = () => {

    const { t } = useTranslation();

    // Get the selected time period from Redux
    const selectedTimePeriod = useSelector((state) => state.timePeriod);
    const dispatch = useDispatch();

    const handleOptionChange = (domain, period, id) => {
        dispatch(setTimePeriod({ domain, period, id }));
    };

    return (
        <div className={styles.container}>
            {timePeriods.map((timePeriod) => (
                <div key={timePeriod.period} className={styles.optionGroup}>
                    <h5 className={styles.subheading}>{t(timePeriod.domain)}</h5>
                    <div className={styles.radioButtonsTimePeriod}>
                        {timePeriod.period.map((period) => (
                            <div style={{marginRight: '30px'}} key={period.id}>
                                <RadioOption
                                    label={`${timePeriod.domain}-${period.label}`}
                                    text={period.label}
                                    checked={
                                        selectedTimePeriod.period === period.label &&
                                        selectedTimePeriod.domain === timePeriod.domain
                                    }
                                    onChange={() => handleOptionChange(timePeriod.domain, period.label, period.id)}
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
