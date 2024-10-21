import {
    SET_TEMPORAL_MEAN,
    SET_TIME_PERIOD,
    SET_VARIABLE,
    IS_MOBILE
} from './types';

const persistedVariable = localStorage.getItem('selectedVariable');
const persisterTimePeriod = localStorage.getItem('selectedTimePeriod');

const initialState = {
    timePeriod: persisterTimePeriod ? JSON.parse(persisterTimePeriod) : {
        scenario: 'Future SSP2-4.5',
        period: '2046-2065',
        id: 'ssp245_2046_2065'
    },
    variable: persistedVariable ? JSON.parse(persistedVariable) : {
        name: 'temperature',
        domain: 'TEMPS',
        option: 'meanTemp',
        id: 'Tmean'
    },
    temporalMean: 'annual',
    isMobile: window.innerWidth <= 768
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
