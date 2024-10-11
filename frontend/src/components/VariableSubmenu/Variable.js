import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import styles from './Variable.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setVariable } from '../../redux/actions'; // Redux action to dispatch

// import variables from a JSON file
const variables = require('../../data/variables.json');

const Variable = () => {
    const { t } = useTranslation();

    const [hoveredVariable, setHoveredVariable] = useState(null);

    // Get the current selected variable from Redux
    const selectedVariable = useSelector((state) => state.variable);
    const dispatch = useDispatch();

    const handleOptionChange = (variableName, option) => {
        dispatch(setVariable({ name: variableName, domain: option.domain, option: option.label, id: option.id }));
    };

    return (
        <div className={styles.variableSubmenu}>
            {variables.map((variable) => (
                <div
                    key={variable.name}
                    className={variable.name === 'temperature' ? styles.variableTemp : styles.variableItem}
                    onMouseEnter={() => setHoveredVariable(variable.name)}
                    onMouseLeave={() => setHoveredVariable(null)}
                >
                    <div className={styles.variableName}>
                        {t(variable.name)}
                    </div>
                    {hoveredVariable === variable.name && variable.options.length > 0 && (
                        <div className={`${styles.variableOptions} ${hoveredVariable === variable.name ? styles.visible : ''}`}>
                            {variable.options.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    label={`${t(variable.name)}-${t(option.label)}`}
                                    name={variable.name}
                                    text={t(option.label)} 
                                    checked={selectedVariable.name === variable.name && selectedVariable.option === option.label}
                                    onChange={() => handleOptionChange(variable.name, option)} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Variable;
