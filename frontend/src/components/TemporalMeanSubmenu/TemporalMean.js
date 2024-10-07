import React from "react";
import styles from "./TemporalMean.module.css";
import RadioOption from "../RadioOption/RadioOption";

const TemporalMean = () => {
    return (
        <div className={styles.optionGroup}>
            <RadioOption label="annual" name="temporal-mean" text="Annual" checked={true} />
        </div>
    );
};

export default TemporalMean;