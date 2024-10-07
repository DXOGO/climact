import {
    SET_TIME_PERIOD,
    SET_VARIABLE,
    SET_TEMPORAL_MEAN,
    RESET
} from './types';

export const setTimePeriod = ({ scenario, period, id }) => {
    return {
        type: SET_TIME_PERIOD,
        payload: { scenario, period, id }
    };
};

export const setVariable = ({ name, option, id }) => {
    return {
        type: SET_VARIABLE,
        payload: { name, option, id }
    };
};

export const setTemporalMean = (temporalMean) => {
    return {
        type: SET_TEMPORAL_MEAN,
        payload: temporalMean
    };
}

export const reset = () => {
    return {
        type: RESET
    };
}

