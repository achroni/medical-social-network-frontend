import axios from "axios";
import { returnErrors, createMessage } from "./messages";
import { tokenConfig } from "./user";
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
} from "./types";

//GET MY FRIENDS
export const getMyFriends = () => (dispatch, getState) => {
  dispatch({ type: MY_FRIENDS_LOADING });
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/friends/`
    : "/app/friends/";
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: MY_FRIENDS_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: MY_FRIENDS_FAIL
      });
    });
};

//REMOVE A FRIEND
export const removeFriend = userId => (dispatch, getState) => {
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/remove/friend/${userId}/`
    : `/app/remove/friend/${userId}`;
  axios
    .delete(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({ successMessage: "Friend successfully removed" })
      );
      dispatch(getMyFriends());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//GET NON FRIENDS
export const getNonFriends = () => (dispatch, getState) => {
  dispatch({ type: NON_FRIENDS_LOADING });
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/get/non_friends/`
    : "/app/fetch/non_friends/";
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: NON_FRIENDS_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: NON_FRIENDS_FAIL
      });
    });
};

//GET CIRCLE OF TRUST
export const getCircleOfTrust = () => (dispatch, getState) => {
  dispatch({ type: CIRCLE_OF_TRUST_LOADING });
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/circle_of_trust/`
    : "/app/circle_of_trust/";
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: CIRCLE_OF_TRUST_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CIRCLE_OF_TRUST_FAIL
      });
    });
};

//REMOVE FROM CIRCLE OF TRUST
export const removeCircleOfTrust = userId => (dispatch, getState) => {
  const requestUrl = `/app/remove/user/${userId}/circle_of_trust/`;
  axios
    .delete(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "Member of your Circle of Trust successfully removed"
        })
      );
      dispatch(getCircleOfTrust());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//GET NON CIRCLE OF TRUST
export const getNonCircleOfTrust = () => (dispatch, getState) => {
  dispatch({ type: NON_CIRCLE_OF_TRUST_LOADING });
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/non_circle_of_trust/`
    : "/app/fetch/non_circle_of_trust/";
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: NON_CIRCLE_OF_TRUST_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: NON_CIRCLE_OF_TRUST_FAIL
      });
    });
};

//GET PROTECTED MEMBERS
export const getProtectedMembers = () => (dispatch, getState) => {
  dispatch({ type: PROTECTED_MEMBERS_LOADING });
  axios
    .get("/app/fetch/protected/members/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: PROTECTED_MEMBERS_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: PROTECTED_MEMBERS_FAIL
      });
    });
};

// REMOVE A PROTECTED MEMBER
export const removeProtectedMember = userId => (dispatch, getState) => {
  const requestUrl = `/app/remove/protected/member/${userId}/`;
  axios
    .delete(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "A Protected Member successfully removed"
        })
      );
      dispatch(getProtectedMembers());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//GET CARE TEAM
export const getCareTeam = type => (dispatch, getState) => {
  dispatch({ type: MY_CARE_TEAM_LOADING });
  const userType = type ? type : getState().user.userType;

  let requestUrl;
  if (userType === "doctor") {
    requestUrl = "/app/doctor/patients/";
  } else if (getState().user.modeCoT) {
    requestUrl = `/app/cot_action/member/${getState().user.idCoT}/care_team/`;
  } else {
    requestUrl = "/app/care_team/";
  }
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: MY_CARE_TEAM_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: MY_CARE_TEAM_FAIL
      });
    });
};

//REMOVE A DOCTOR FROM CARE TEAM
export const removeCareTeamMember = userId => (dispatch, getState) => {
  const userType = getState().user.userType;

  let requestUrl;
  if (userType === "doctor") {
    requestUrl = `/app/doctor/patient/${userId}/`;
  } else if (getState().user.modeCoT) {
    requestUrl = `/app/cot_action/member/${
      getState().user.idCoT
    }/remove/doctor/${userId}/`;
  } else {
    requestUrl = `/app/remove/doctor/${userId}/care_team/`;
  }
  axios
    .delete(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "Member of your Care Team successfully removed"
        })
      );
      dispatch(getCareTeam());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

//GET NON CARE TEAM
export const getNonCareTeam = () => (dispatch, getState) => {
  dispatch({ type: NON_CARE_TEAM_LOADING });

  const userType = getState().user.userType;

  let requestUrl;
  if (userType === "doctor") {
    requestUrl = "/app/fetch/doctors/potential/patients/";
  } else if (getState().user.modeCoT) {
    requestUrl = `/app/cot_action/member/${
      getState().user.idCoT
    }/get/non_care_team/`;
  } else {
    requestUrl = "/app/fetch/non_care_team/";
  }
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: NON_CARE_TEAM_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: NON_CARE_TEAM_FAIL
      });
    });
};

// Setup config with token - helper function
export const tokenConfigData = (getState, userId) => {
  // Get token from state
  const token = getState().user.token;

  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      user_id: userId
    }
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
