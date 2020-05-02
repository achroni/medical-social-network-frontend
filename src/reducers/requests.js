import {
  REQUESTS_LOADING,
  REQUESTS_LOADED,
  REQUESTS_FAIL,
  OUTGOING_REQUESTS_LOADING,
  OUTGOING_REQUESTS_LOADED,
  OUTGOING_REQUESTS_FAIL,
  REQUESTS_TIMESTAMP_LOADING,
  REQUESTS_TIMESTAMP_LOADED,
  REQUESTS_TIMESTAMP_FAIL,
  SEND_REQUEST_FAIL
} from "../actions/types.js";

const initialState = {
  isLoading: false,
  friendRequests: [],
  careTeamRequests: [],
  circleOfTrustRequests: [],
  healthScoreRequests: [],
  isLoadingOutgoingRequests: false,
  outgoingRequests: [],
  isLoadingRequestsByTimestamp: false,
  requestsByTimestamp: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REQUESTS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case OUTGOING_REQUESTS_LOADING:
      return {
        ...state,
        isLoadingOutgoingRequests: true
      };
    case REQUESTS_TIMESTAMP_LOADING:
      return {
        ...state,
        isLoadingRequestsByTimestamp: true
      };
    case REQUESTS_LOADED:
      return {
        ...state,
        isLoading: false,
        friendRequests: action.payload.friend_requests,
        careTeamRequests: action.payload.care_team_requests,
        circleOfTrustRequests: action.payload.circle_of_trust_requests
      };
    case OUTGOING_REQUESTS_LOADED:
      return {
        ...state,
        isLoadingOutgoingRequests: false,
        outgoingRequests: action.payload
      };
    case REQUESTS_TIMESTAMP_LOADED:
      return {
        ...state,
        isLoadingRequestsByTimestamp: false,
        requestsByTimestamp: action.payload.all,
        friendRequests: action.payload.friend_requests,
        careTeamRequests: action.payload.care_team_requests,
        circleOfTrustRequests: action.payload.circle_of_trust_requests,
        healthScoreRequests: action.payload.health_score_requests
      };
    case REQUESTS_FAIL:
      return {
        ...state,
        isLoading: false,
        friendRequests: [],
        careTeamRequests: [],
        circleOfTrustRequests: []
      };
    case REQUESTS_TIMESTAMP_FAIL:
      return {
        ...state,
        isLoadingRequestsByTimestamp: false,
        requestsByTimestamp: []
      };
    case SEND_REQUEST_FAIL:
    case OUTGOING_REQUESTS_FAIL:
      return {
        ...state,
        isLoadingOutgoingRequests: false,
        outgoingRequests: []
      };
    default:
      return state;
  }
}
