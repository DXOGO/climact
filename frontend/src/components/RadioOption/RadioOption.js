import React from 'react';
import styles from './RadioOption.module.css';

const RadioOption = ({ label, text, onChange, checked }) => {
    return (
        <div className={styles.radioOption}>
            <input
                type="radio"
                id={label}
                // name={name}
                className={styles.radioInput}
                onChange={onChange}
                checked={checked}
            />
            <label htmlFor={label} className={styles.radioLabel}>
                <span className={styles.customRadio}></span>
                {text}
            </label>
        </div>
    );
};

export default RadioOption;