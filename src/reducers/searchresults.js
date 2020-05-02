import {
  SEARCH_LOADING,
  SEARCH_LOADED,
  SEARCH_MORE_LOADED,
  SEARCH_USER,
  SEARCH_FAIL,
  SEARCH_CLEAN,
  SEARCH_RELATION
} from "../actions/types.js";

const initialState = {
  isLoading: false,
  searchResults: [],
  searchedUserInfo: null,
  searchedUserRelation: {
    friend: "none",
    care_team: "none",
    circle_of_trust: "none",
    sent_request_id_friend: null,
    sent_request_id_care_team: null,
    sent_request_id_circle_of_trust: null
  },
  searchResultsMore: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEARCH_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case SEARCH_LOADED:
      return {
        ...state,
        isLoading: false,
        searchResults: action.payload
      };
    case SEARCH_MORE_LOADED:
      return {
        ...state,
        isLoading: false,
        searchResultsMore: action.payload
      };
    case SEARCH_USER:
      return {
        ...state,
        searchedUserInfo: action.payload
      };
    case SEARCH_RELATION:
      return {
        ...state,
        searchedUserRelation: action.payload
      };
    case SEARCH_CLEAN:
      return {
        ...state,
        isLoading: false,
        searchResults: []
      };
    case SEARCH_FAIL:
      return {
        ...state,
        isLoading: false,
        searchResults: [],
        searchResultsMore: [],
        searchedUserInfo: null,
        searchedUserRelation: {
          friend: "none",
          care_team: "none",
          circle_of_trust: "none",
          sent_request_id_friend: null,
          sent_request_id_care_team: null,
          sent_request_id_circle_of_trust: null
        }
      };
    default:
      return state;
  }
}
