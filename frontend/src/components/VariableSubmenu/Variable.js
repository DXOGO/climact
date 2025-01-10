import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import styles from './Variable.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setVariable } from '../../redux/actions'; // Redux action to dispatch

// import variables from a JSON file
const variables = require('../../data/variables.json');

const Variable = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const selectedVariable = useSelector((state) => state.variable);
    const isMobile = useSelector((state) => state.isMobile);

    const [hoveredVariable, setHoveredVariable] = useState(null);
    const [expandedVariable, setExpandedVariable] = useState(null);

    // Get the current selected variable from Redux

    const handleOptionChange = (variableName, option) => {
        dispatch(setVariable({ name: variableName, domain: option.domain, option: option.label, id: option.id }));
    };

    const toggleExpandedVariable = (variableName) => {
        if (expandedVariable === variableName) {
            setExpandedVariable(null);
        } else {
            setExpandedVariable(variableName);
        }
    };

    return (
        <div className={styles.variableSubmenu}>
            {variables.map((variable) => (
                <div
                    key={variable.name}
                    className={variable.name === 'temperature' ? styles.variableTemp : styles.variableItem}
                    onMouseEnter={!isMobile ? () => setHoveredVariable(variable.name) : null}
                    onMouseLeave={!isMobile ? () => setHoveredVariable(null) : null}
                >
                    <div
                        className={selectedVariable.name === variable.name && selectedVariable ? styles.activeVariableName: styles.variableName }
                        onClick={isMobile ? () => toggleExpandedVariable(variable.name) : null}
                    >
                        {t(variable.name)}
                    </div>
                    {(hoveredVariable === variable.name || expandedVariable === variable.name) && variable.options.length > 0 && (
                        <div className={`${styles.variableOptions} ${hoveredVariable === variable.name || expandedVariable === variable.name ? styles.visible : ''}`}>
                            {variable.options.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    label={`${t(variable.name)}-${t(option.label)}`}
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
