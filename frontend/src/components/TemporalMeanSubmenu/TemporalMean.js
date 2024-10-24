import React from "react";
import styles from "./TemporalMean.module.css";
import RadioOption from "../RadioOption/RadioOption";

import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setTemporalMean } from '../../redux/actions'; // Redux action to dispatch


const TemporalMean = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const selectedTemporalMean = useSelector((state) => state.temporalMean);

    const handleOptionChange = (option) => {
        dispatch(setTemporalMean(option));
    }

    return (
        <div className={styles.optionGroup}>
            <div className={styles.subheading}>{t("temporalMeanType")}</div>
            <RadioOption
                label="temporalMean-annual"
                name="temporalMean"
                text={t("annual")}
                checked={selectedTemporalMean === "annual"}
                onChange={() => handleOptionChange(t("annual"))}
            />
        </div>
    );
};

export default TemporalMean;