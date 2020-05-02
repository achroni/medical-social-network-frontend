import {
  BLOCKCHAIN_LOADING,
  BLOCKCHAIN_LOADED,
  BLOCKCHAIN_FAIL
} from "../actions/types.js";

const initialState = {
  isLoading: false,
  Hashes: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BLOCKCHAIN_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case BLOCKCHAIN_LOADED:
      return {
        ...state,
        isLoading: false,
        Hashes: action.payload
      };
    case BLOCKCHAIN_FAIL:
      return {
        ...state,
        isLoading: false,
        Hashes: []
      };
    default:
      return state;
  }
}
