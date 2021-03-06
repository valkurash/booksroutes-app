import { actionTypes } from './actions'
import { AnyAction } from 'redux';


export const exampleInitialState = {
  count: 0,
  error: false,
  lastUpdate: 0,
  light: false,
  placeholderData: null,
};

export interface MainReduxState {
  count: number,
  error: boolean,
  lastUpdate: number,
  light: boolean,
  placeholderData: any[],
}

function reducer(state = exampleInitialState, action:AnyAction) {
  switch (action.type) {
    case actionTypes.FAILURE:
      return {
        ...state,
        ...{ error: action.error },
      }

    case actionTypes.INCREMENT:
      return {
        ...state,
        ...{ count: state.count + 1 },
      }

    case actionTypes.DECREMENT:
      return {
        ...state,
        ...{ count: state.count - 1 },
      }

    case actionTypes.RESET:
      return {
        ...state,
        ...{ count: exampleInitialState.count },
      }

    case actionTypes.LOAD_DATA_SUCCESS:
      return {
        ...state,
        ...{ placeholderData: action.data },
      }

    case actionTypes.TICK_CLOCK:
      return {
        ...state,
        ...{ lastUpdate: action.ts, light: !!action.light },
      }

    default:
      return state
  }
}

export default reducer
