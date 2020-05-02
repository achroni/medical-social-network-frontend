import axios from "axios";
import { returnErrors, createMessage } from "./messages";
import { tokenConfig } from "./user";
import {
  SEARCH_LOADING,
  SEARCH_LOADED,
  SEARCH_MORE_LOADED,
  SEARCH_FAIL,
  SEARCH_CLEAN,
  SEARCH_USER,
  SEARCH_RELATION
} from "./types";
import {
  outgoingRequestsMessage,
  outgoingRequestsMessageSent
} from "../utils/dicts";

//GET SEARCH RESULTS
export const getSearchResults = (searchInput, more) => (dispatch, getState) => {
  dispatch({ type: SEARCH_LOADING });
  const requestPatientUrl = `/app/search/patients/`;
  const requestDoctorUrl = `/app/search/doctors/`;
  const params = {
    username: searchInput,
    firstName: searchInput,
    lastName: searchInput
  };
  axios
    .all([
      axios.get(requestPatientUrl, tokenConfig(getState, params)),
      axios.get(requestDoctorUrl, tokenConfig(getState, params))
    ])
    .then(
      axios.spread((patients, doctors) => {
        const searchedUsers = [...patients.data, ...doctors.data];
        dispatch({
          type: more ? SEARCH_MORE_LOADED : SEARCH_LOADED,
          payload: searchedUsers
        });
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: SEARCH_FAIL
      });
    });
};

// GET USER INFO
export const getSearchedUserInfo = (searchedUser, searchedUserType) => (
  dispatch,
  getState
) => {
  const requestUrl =
    searchedUserType === "doctor"
      ? `/app/fetch/${searchedUser}/doctor/`
      : `/app/fetch/${searchedUser}/patient/`;

  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      const userInfoData = res.data;
      userInfoData.userType = searchedUserType;
      dispatch(
        getSearchedUserRelation(userInfoData.username, userInfoData.user_id)
      );
      dispatch({
        type: SEARCH_USER,
        payload: userInfoData
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: SEARCH_FAIL
      });
    });
};

// GET USER RELATIONSHIP
export const getSearchedUserRelation = (searchedUser, searchedUserId) => (
  dispatch,
  getState
) => {
  const { myFriends, myCareTeam, myCircleOfTrust } = getState().relationships;
  const {
    friendRequests,
    careTeamRequests,
    circleOfTrustRequests
  } = getState().requests;

  const { outgoingRequests } = getState().requests;
  let relation = {
    friend: "none",
    care_team: "none",
    circle_of_trust: "none",
    sent_request_id_friend: null,
    sent_request_id_care_team: null,
    sent_request_id_circle_of_trust: null
  };

  for (let relationship of [
    [myFriends, "friend"],
    [myCareTeam, "care_team"],
    [myCircleOfTrust, "circle_of_trust"]
  ]) {
    if (relationship[0].some(person => person.username === searchedUser)) {
      relation[relationship[1]] = "connected";
    }
  }

  for (let request of [
    [friendRequests, "friend", "sent_request_id_friend"],
    [careTeamRequests, "care_team", "sent_request_id_care_team"],
    [
      circleOfTrustRequests,
      "circle_of_trust",
      "sent_request_id_circle_of_trust"
    ]
  ]) {
    const receivedReq = request[0].find(
      person => person.username === searchedUser
    );
    if (receivedReq) {
      relation[request[1]] = "received";
      relation[request[2]] = receivedReq.notificationId;
    }
  }

  const sentRequests = outgoingRequests.filter(
    person => person.userId === searchedUserId
  );

  sentRequests.forEach(request => {
    relation[outgoingRequestsMessage[request.notificationVerb]] = "pending";
    relation[outgoingRequestsMessageSent[request.notificationVerb]] =
      request.notificationId;
  });

  dispatch({
    type: SEARCH_RELATION,
    payload: relation
  });
};

//CLEAN STATE
export const clearSearchState = () => dispatch => {
  dispatch({ type: SEARCH_CLEAN });
};
