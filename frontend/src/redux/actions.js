import {
    SET_TIME_PERIOD,
    SET_FUTURE_SCENARIO,
    SET_VARIABLE,
    SET_TEMPORAL_MEAN,
    IS_MOBILE
} from './types';

export const setTimePeriod = ({ domain, period, id }) => {
    return {
        type: SET_TIME_PERIOD,
        payload: { domain, period, id }
    };
};

export const setFutureScenario = ({ scenario, id }) => {
    return {
        type: SET_FUTURE_SCENARIO,
        payload: { scenario, id }
    };
}

export const setVariable = ({ name, domain, option, id }) => {
    return {
        type: SET_VARIABLE,
        payload: { name, domain, option, id }
    };
};

export const setTemporalMean = (temporalMean) => {
    return {
        type: SET_TEMPORAL_MEAN,
        payload: temporalMean
    };
}

export const setIsMobile = (isMobile) => {
    return {
        type: IS_MOBILE,
        payload: isMobile
    };
}

