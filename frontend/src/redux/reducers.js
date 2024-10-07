import {
    SET_TEMPORAL_MEAN,
    SET_TIME_PERIOD,
    SET_VARIABLE,
    RESET
} from './types';

const persistedVariable = localStorage.getItem('selectedVariable');
const persisterTimePeriod = localStorage.getItem('selectedTimePeriod');

const initialState = {
    timePeriod: persisterTimePeriod ? JSON.parse(persisterTimePeriod) : {
        scenario: 'Future SSP2-4.5',
        period: '2046-2065',
        id: 'wrfout_ssp245_2046_2065_TEMPS'
    },
    variable: persistedVariable ? JSON.parse(persistedVariable) : {
        name: 'Temperature',
        option: 'Mean',
        id: 'T2MEAN'
    },
    temporalMean: 'Annual',
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TIME_PERIOD:
            return {
                ...state,
                timePeriod: {
                    scenario: action.payload.scenario,
                    period: action.payload.period,
                    id: action.payload.id
                }
            };
        case SET_VARIABLE:
            return {
                ...state,
                variable: {
                    name: action.payload.name,
                    option: action.payload.option,
                    id: action.payload.id
                }
            };
        case SET_TEMPORAL_MEAN:
            return {
                ...state,
                temporalMean: action.payload
            };
        case RESET:
            return initialState;
        default:
            return state;
    }
};

export default rootReducer;
