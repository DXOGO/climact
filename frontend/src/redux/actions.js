/**
 * Action Types
 */
import {
    SET_TIME_PERIOD,
    SET_FUTURE_SCENARIO,
    SET_VARIABLE,
    SET_TEMPORAL_MEAN,
    IS_MOBILE
} from './types';

/**
 * Action creator for setting the time period.
 * 
 * @param {Object} payload - The payload object.
 * @param {string} payload.domain - The domain of the time period.
 * @param {string} payload.period - The period to be set.
 * @param {string} payload.id - The identifier for the time period.
 * @returns {Object} The action object.
 */
export const setTimePeriod = ({ domain, period, id }) => {
    return {
        type: SET_TIME_PERIOD,
        payload: { domain, period, id }
    };
};

/**
 * Action creator for setting the future scenario.
 * 
 * @param {Object} payload - The payload object.
 * @param {string} payload.scenario - The future scenario to be set.
 * @param {string} payload.id - The identifier for the scenario.
 * @returns {Object} The action object.
 */
export const setFutureScenario = ({ scenario, id }) => {
    return {
        type: SET_FUTURE_SCENARIO,
        payload: { scenario, id }
    };
}

/**
 * Action creator for setting the variable.
 * 
 * @param {Object} payload - The payload object.
 * @param {string} payload.name - The name of the variable.
 * @param {string} payload.domain - The domain of the variable.
 * @param {string} payload.option - The option for the variable.
 * @param {string} payload.id - The identifier for the variable.
 * @returns {Object} The action object.
 */
export const setVariable = ({ name, domain, option, id }) => {
    return {
        type: SET_VARIABLE,
        payload: { name, domain, option, id }
    };
};

/**
 * Action creator for setting the temporal mean.
 * 
 * @param {string} temporalMean - The temporal mean to be set.
 * @returns {Object} The action object.
 */
export const setTemporalMean = (temporalMean) => {
    return {
        type: SET_TEMPORAL_MEAN,
        payload: temporalMean
    };
}

/**
 * Action creator for setting the mobile status.
 * 
 * @param {boolean} isMobile - The mobile status to be set.
 * @returns {Object} The action object.
 */
export const setIsMobile = (isMobile) => {
    return {
        type: IS_MOBILE,
        payload: isMobile
    };
}

