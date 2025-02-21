import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styles from './Variable.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setVariable } from '../../redux/actions';

const variables = require('../../data/variables.json');

const Variable = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const selectedVariable = useSelector((state) => state.variable);
    const isMobile = useSelector((state) => state.isMobile);

    const [hoveredVariable, setHoveredVariable] = useState(null);
    const [expandedVariable, setExpandedVariable] = useState(null);
    const [hoveredSubvariable, setHoveredSubvariable] = useState(null);
    const [expandedSubvariable, setExpandedSubvariable] = useState(null);

    const handleOptionChange = (variableName, subvariableName, option) => {
        dispatch(setVariable({
            name: variableName,
            subvariable: subvariableName || null,
            domain: option.domain,
            option: option.label,
            id: option.id
        }));
    };

    const toggleExpandedVariable = (variableName) => {
        setExpandedVariable(expandedVariable === variableName ? null : variableName);
        // setExpandedSubvariable(null);
    };

    const toggleExpandedSubvariable = (subvariableName) => {
        setExpandedSubvariable(expandedSubvariable === subvariableName ? null : subvariableName);
    };

    return (
        <div className={styles.variableSubmenu}>
            <div className={styles.variableList}>
                {variables.map((variable) => (
                    <div
                        key={variable.name}
                        className={variable.name === 'temperature' ? styles.variableTemp : styles.variableItem}
                        onMouseEnter={!isMobile ? () => setHoveredVariable(variable.name) : null}
                        onMouseLeave={!isMobile ? () => setHoveredVariable(null) : null}
                    >
                        <div
                            className={selectedVariable.name === variable.name ? styles.activeVariableName : styles.variableName}
                            onClick={isMobile ? () => toggleExpandedVariable(variable.name) : null}
                        >
                            {t(variable.name)}
                        </div>

                        {/* Handle Agriculture with Subvariables */}
                        {variable.name === "agriculture" && (hoveredVariable === variable.name || expandedVariable === variable.name) && (
                            <div className={styles.subvariableList}>
                                {variable.subvariables.map((subvar) => (
                                    <div
                                        key={subvar.name}
                                        className={styles.subvariableItem}
                                        onMouseEnter={!isMobile ? () => setHoveredSubvariable(subvar.name) : null}
                                    // onMouseLeave={!isMobile ? () => setHoveredSubvariable(null) : null}
                                    >
                                        <div
                                            className={selectedVariable.subvariable === subvar.name ? styles.activeVariableName : styles.variableName}
                                            onClick={isMobile ? () => toggleExpandedSubvariable(subvar.name) : null}
                                        >
                                            {t(subvar.name)}
                                        </div>
                                        <div className={`${styles.variableOptions} ${styles.visible}`}>
                                            {(hoveredSubvariable === subvar.name || expandedSubvariable === subvar.name) && (
                                                subvar.options.map((option) => (
                                                    <RadioOption
                                                        key={option.id}
                                                        label={`${t(subvar.name)}-${t(option.label)}`}
                                                        text={t(option.label)}
                                                        checked={selectedVariable.name === variable.name && selectedVariable.subvariable === subvar.name && selectedVariable.option === option.label}
                                                        onChange={() => handleOptionChange(variable.name, subvar.name, option)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Handle Normal Variables (without Subvariables) */}
                        {variable.name !== "agriculture" && (hoveredVariable === variable.name || expandedVariable === variable.name) && variable.options && (
                            <div className={`${styles.variableOptions} ${styles.visible}`}>
                                {variable.options.map((option) => (
                                    <RadioOption
                                        key={option.id}
                                        label={`${t(variable.name)}-${t(option.label)}`}
                                        text={t(option.label)}
                                        checked={selectedVariable.name === variable.name && selectedVariable.option === option.label}
                                        onChange={() => handleOptionChange(variable.name, null, option)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Variable;
