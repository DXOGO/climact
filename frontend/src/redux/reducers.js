import {
    SET_TIME_PERIOD,
    SET_FUTURE_SCENARIO,
    SET_VARIABLE,
    SET_TEMPORAL_MEAN,
    IS_MOBILE
} from './types';

const persistedTimePeriod = localStorage.getItem('selectedTimePeriod');
const persistedFutureScenario = localStorage.getItem('selectedFutureScenario');
const persistedVariable = localStorage.getItem('selectedVariable');

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
