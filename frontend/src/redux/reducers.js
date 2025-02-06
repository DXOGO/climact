/**
 * Redux Reducers for managing application state.
 * 
 * This file contains the root reducer for the Redux store, which manages the state of the application.
 * The state includes the selected time period, future scenario, variable, and whether the device is mobile.
 * 
 * The state is initialized with values from localStorage if available, otherwise default values are used.
 * 
 * Action Types:
 * - SET_TIME_PERIOD: Sets the selected time period.
 * - SET_FUTURE_SCENARIO: Sets the selected future scenario.
 * - SET_VARIABLE: Sets the selected variable.
 * - SET_TEMPORAL_MEAN: Sets the temporal mean.
 * - IS_MOBILE: Sets whether the device is mobile.
 * 
 * Initial State:
 * - timePeriod: The selected time period, defaulting to a future period from 2046-2065.
 * - futureScenario: The selected future scenario, defaulting to "Future SSP2-4.5".
 * - variable: The selected variable, defaulting to temperature.
 * - isMobile: A boolean indicating whether the device is mobile, based on the window width.
 * 
 * Reducer Function:
 * - rootReducer: The main reducer function that handles the different action types and updates the state accordingly.
 * 
 * @module reducers
 */

import {
    SET_TIME_PERIOD,
    SET_FUTURE_SCENARIO,
    SET_VARIABLE,
    SET_TEMPORAL_MEAN,
    IS_MOBILE
} from './types';

// Retrieve persisted state from localStorage
const persistedTimePeriod = localStorage.getItem('selectedTimePeriod');
const persistedFutureScenario = localStorage.getItem('selectedFutureScenario');
const persistedVariable = localStorage.getItem('selectedVariable');

// Define the initial state
const initialState = {
    timePeriod: persistedTimePeriod ? JSON.parse(persistedTimePeriod) : {
        domain: 'future',
        period: '2046-2065',
        id: '2046_2065'
    },
    futureScenario: persistedFutureScenario ? JSON.parse(persistedFutureScenario) : {
        scenario: 'Future SSP2-4.5',
        id: 'ssp245'
    },  
    variable: persistedVariable ? JSON.parse(persistedVariable) : {
        name: 'temperature',
        domain: 'TEMPS',
        option: 'meanTemp',
        id: 'Tmean'
    },
    isMobile: window.innerWidth <= 768
};

// Define the root reducer
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIME_PERIOD:
            return {
                ...state,
                timePeriod: {
                    domain: action.payload.domain,
                    period: action.payload.period,
                    id: action.payload.id
                }
            };
        case SET_FUTURE_SCENARIO:
            return {
                ...state,
                futureScenario: {
                    scenario: action.payload.scenario,
                    id: action.payload.id,
                }
            };
        case SET_VARIABLE:
            return {
                ...state,
                variable: {
                    name: action.payload.name,
                    domain: action.payload.domain,
                    option: action.payload.option,
                    id: action.payload.id
                }
            };
        case SET_TEMPORAL_MEAN:
            return {
                ...state,
                temporalMean: action.payload
            };
        case IS_MOBILE:
            return {
                ...state,
                isMobile: action.payload
            };
        default:
            return state;
    }
};

export default rootReducer;
