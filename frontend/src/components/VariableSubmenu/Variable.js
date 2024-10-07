import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Variable.module.css';
import RadioOption from '../RadioOption/RadioOption';
import { setVariable } from '../../redux/actions'; // Redux action to dispatch

// import variables from a JSON file
const variables = require('../../data/variables.json');

const Variable = () => {
    const [hoveredVariable, setHoveredVariable] = useState(null);

    // Get the current selected variable from Redux
    const selectedVariable = useSelector((state) => state.variable);
    const dispatch = useDispatch();

    const handleOptionChange = (variableName, option) => {
        dispatch(setVariable({ name: variableName, option: option.label, id: option.id }));
    };
    
    return (
        <div className={styles.variableSubmenu}>
            {variables.map((variable) => (
                <div
                    key={variable.name}
                    className={variable.name === 'Temperature' ? styles.variableTemp : styles.variableItem}
                    onMouseEnter={() => setHoveredVariable(variable.name)}
                    onMouseLeave={() => setHoveredVariable(null)}
                >
                    <div className={styles.variableName}>
                        {variable.name}
                    </div>
                    {hoveredVariable === variable.name && variable.options.length > 0 && (
                        <div className={`${styles.variableOptions} ${hoveredVariable === variable.name ? styles.visible : ''}`}>
                            {variable.options.map((option) => (
                                <RadioOption
                                    key={option.id}
                                    label={`${variable.name}-${option.label}`}
                                    name={variable.name}
                                    text={option.label} // Use the label for display
                                    checked={selectedVariable.name === variable.name && selectedVariable.option === option.label}
                                    onChange={() => handleOptionChange(variable.name, option)} // Pass the option object
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
