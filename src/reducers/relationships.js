import {
  MY_FRIENDS_LOADING,
  MY_FRIENDS_LOADED,
  MY_FRIENDS_FAIL,
  CIRCLE_OF_TRUST_LOADING,
  CIRCLE_OF_TRUST_LOADED,
  CIRCLE_OF_TRUST_FAIL,
  PROTECTED_MEMBERS_LOADING,
  PROTECTED_MEMBERS_LOADED,
  PROTECTED_MEMBERS_FAIL,
  MY_CARE_TEAM_LOADING,
  MY_CARE_TEAM_LOADED,
  MY_CARE_TEAM_FAIL,
  NON_FRIENDS_LOADING,
  NON_FRIENDS_LOADED,
  NON_FRIENDS_FAIL,
  NON_CIRCLE_OF_TRUST_LOADING,
  NON_CIRCLE_OF_TRUST_LOADED,
  NON_CIRCLE_OF_TRUST_FAIL,
  NON_CARE_TEAM_LOADING,
  NON_CARE_TEAM_LOADED,
  NON_CARE_TEAM_FAIL
} from "../actions/types.js";

const initialState = {
  isLoadingFriends: false,
  isLoadingCareTeam: false,
  isLoadingProtectedMembers: false,
  isLoadingCircleOfTrust: false,
  myFriends: [],
  myCareTeam: [],
  myProtectedMembers: [],
  myCircleOfTrust: [],
  isLoadingNonFriends: false,
  nonFriends: [],
  isLoadingNonCircleOfTrust: false,
  nonCircleOfTrust: [],
  isLoadingNonCareTeam: false,
  nonCareTeam: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MY_FRIENDS_LOADING:
      return {
        ...state,
        isLoadingFriends: true
      };
    case NON_FRIENDS_LOADING:
      return {
        ...state,
        isLoadingNonFriends: true
      };
    case MY_FRIENDS_LOADED:
      return {
        ...state,
        isLoadingFriends: false,
        myFriends: action.payload
      };
    case NON_FRIENDS_LOADED:
      return {
        ...state,
        isLoadingNonFriends: false,
        nonFriends: action.payload
      };
    case MY_FRIENDS_FAIL:
      return {
        ...state,
        isLoadingFriends: false,
        myFriends: []
      };
    case NON_FRIENDS_FAIL:
      return {
        ...state,
        isLoadingNonFriends: false,
        nonFriends: []
      };
    case CIRCLE_OF_TRUST_LOADING:
      return {
        ...state,
        isLoadingCircleOfTrust: true
      };
    case NON_CIRCLE_OF_TRUST_LOADING:
      return {
        ...state,
        isLoadingNonCircleOfTrust: true
      };
    case CIRCLE_OF_TRUST_LOADED:
      return {
        ...state,
        isLoadingCircleOfTrust: false,
        myCircleOfTrust: action.payload
      };
    case NON_CIRCLE_OF_TRUST_LOADED:
      return {
        ...state,
        isLoadingNonCircleOfTrust: false,
        nonCircleOfTrust: action.payload
      };
    case CIRCLE_OF_TRUST_FAIL:
      return {
        ...state,
        isLoadingCircleOfTrust: false,
        myCircleOfTrust: []
      };
    case NON_CIRCLE_OF_TRUST_FAIL:
      return {
        ...state,
        isLoadingNonCircleOfTrust: false,
        nonCircleOfTrust: []
      };
    case MY_CARE_TEAM_LOADING:
      return {
        ...state,
        isLoadingCareTeam: true
      };
    case NON_CARE_TEAM_LOADING:
      return {
        ...state,
        isLoadingNonCareTeam: true
      };
    case MY_CARE_TEAM_LOADED:
      return {
        ...state,
        isLoadingCareTeam: false,
        myCareTeam: action.payload
      };
    case NON_CARE_TEAM_LOADED:
      return {
        ...state,
        isLoadingNonCareTeam: false,
        nonCareTeam: action.payload
      };
    case MY_CARE_TEAM_FAIL:
      return {
        ...state,
        isLoadingCareTeam: false,
        myCareTeam: []
      };
    case NON_CARE_TEAM_FAIL:
      return {
        ...state,
        isLoadingNonCareTeam: false,
        nonCareTeam: []
      };
    case PROTECTED_MEMBERS_LOADING:
      return {
        ...state,
        isLoadingProtectedMembers: true
      };
    case PROTECTED_MEMBERS_LOADED:
      return {
        ...state,
        isLoadingProtectedMembers: false,
        myProtectedMembers: action.payload
      };
    case PROTECTED_MEMBERS_FAIL:
      return {
        ...state,
        isLoadingProtectedMembers: false,
        myProtectedMembers: []
      };
    default:
      return state;
  }
}
