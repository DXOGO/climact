import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './FutureScenario.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setFutureScenario } from '../../redux/actions';
import { useTranslation } from 'react-i18next';

// Import the future scenario data from the JSON file
const futureScenarios = require('../../data/futurescenario.json');

const FutureScenario = () => {
    const { t } = useTranslation();

    // Get the selected future scenario from Redux
    const selectedFutureScenario = useSelector((state) => state.futureScenario);
    const dispatch = useDispatch();

    const handleOptionChange = (scenario, id) => {
        dispatch(setFutureScenario({ scenario, id }));
    };

    return (
        <div className={styles.container}>
            {futureScenarios.map((scenario) => (
                <div key={scenario.name} className={styles.optionGroup}>
                    <h5 className={styles.subheading}>{t(scenario.name.toLowerCase())}</h5>
                    <div className={styles.radioButtonsFutureScenario}>
                        {scenario.options.map((option) => (
                            <div style={{ marginRight: '30px' }} key={option.id}>
                                <RadioOption
                                    label={`${scenario.name}-${option.label}`}
                                    text={option.label}
                                    checked={
                                        selectedFutureScenario.id === option.id &&
                                        selectedFutureScenario.scenario === option.label
                                    }
                                    onChange={() => handleOptionChange(option.label, option.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FutureScenario;
