import {
  HEALTH_SCORES_LOADING,
  HEALTH_SCORES_LOADED,
  HEALTH_SCORES_FAIL,
  CREATE_HEALTH_SCORE_SUCCESS,
  CREATE_HEALTH_SCORE_FAIL,
  LATEST_HEALTH_SCORE_LOADING,
  LATEST_HEALTH_SCORE_LOADED,
  LATEST_HEALTH_SCORE_FAIL
} from "../actions/types";

const initialState = {
  isLoading: false,
  healthScores: [],
  isLoadingLatest: false,
  latestHealthScore: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case HEALTH_SCORES_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case HEALTH_SCORES_LOADED:
      return {
        ...state,
        isLoading: false,
        healthScores: action.payload
      };
    case HEALTH_SCORES_FAIL:
      return {
        ...state,
        isLoading: false,
        healthScores: []
      };
    case LATEST_HEALTH_SCORE_LOADING:
      return {
        ...state,
        isLoadingLatest: true
      };
    case LATEST_HEALTH_SCORE_LOADED:
      return {
        ...state,
        isLoadingLatest: false,
        latestHealthScore: action.payload
      };
    case LATEST_HEALTH_SCORE_FAIL:
      return {
        ...state,
        isLoadingLatest: false,
        latestHealthScore: []
      };
    case CREATE_HEALTH_SCORE_SUCCESS:
    case CREATE_HEALTH_SCORE_FAIL:
    default:
      return state;
  }
}
