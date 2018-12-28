import get from 'lodash/get';
import update from 'immutability-helper';
import { types, generateType } from './';

const getActionPayloadName = (action) => {
  if(!action || !action.payload ) return;
  return action.payload.name; 
};

// this reducer handles all state changes for the uiState slice
export default function reducer(state = {}, action) {
    // add initial state
    if (action.type === generateType(types.add, getActionPayloadName(action))) {
        return { ...state, [action.payload.name]: action.payload.state };
    }

    // delete state
    if (action.type === generateType(types.delete, getActionPayloadName(action))) {
        const tempState = { ...state };
        delete tempState[action.payload.name];
        return tempState;
    }

    // reset to initial state
    if (action.type === generateType(types.reset, getActionPayloadName(action))) {
        return { ...state, [action.payload.name]: action.payload.state };
    }

    // shallow merge for state updates
    if (action.type === generateType(types.set, getActionPayloadName(action))) {
        return update(
            state,
            // if store not created with combinedReducers, assume state is top-level
            state[action.payload.name]
                ? {
                    [action.payload.name]: { $merge: action.payload.state },
                }
                : { $merge: action.payload.state },
        );
    }

    return state;
}
