import axios from "axios";
import { returnErrors, createMessage } from "./messages";
import { tokenConfig } from "./user";
import {
  getMyFriends,
  getCareTeam,
  getCircleOfTrust,
  getNonCareTeam,
  getNonCircleOfTrust,
  getNonFriends,
  getProtectedMembers
} from "./relationships";
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
} from "./types";
import { notificationVerbToRequests } from "../utils/dicts";

//GET REQUESTS
export const getRequests = () => (dispatch, getState) => {
  dispatch({ type: REQUESTS_LOADING });
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .get("/app/user/notifications/by_category/", config)
    .then(async res => {
      const users = await getUsers(tokenConfig(getState));
      let payload;
      if (users) {
        const newFriendRequests = getRequestInfo(
          users.patients,
          users.doctors,
          res.data.friend_requests
        );
        const newCareTeamRequests = getRequestInfo(
          users.patients,
          users.doctors,
          res.data.care_team_requests
        );
        const newCOTRequests = getRequestInfo(
          users.patients,
          users.doctors,
          res.data.circle_of_trust_requests
        );
        payload = {
          friend_requests: newFriendRequests,
          care_team_requests: newCareTeamRequests,
          circle_of_trust_requests: newCOTRequests
        };
      } else {
        payload = res.data;
      }
      dispatch({
        type: REQUESTS_LOADED,
        payload
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: REQUESTS_FAIL
      });
    });
};

const getUsers = async token => {
  const [resPatients, resDoctors] = await axios.all([
    axios.get("/app/patients/", token),
    axios.get("/app/doctors/", token)
  ]);
  // TODO error handling
  const users = { patients: resPatients.data, doctors: resDoctors.data };
  return users;
};

const getRequestInfo = (patients, doctors, requests) => {
  return requests.map(req => {
    const reqUserId = req.sender_id ? req.sender_id : req.recipient_id;
    const reqRelation = req.notification_verb
      ? req.notification_verb
      : req.message;
    let userInfo = patients.find(patient => patient.user_id == reqUserId);
    if (userInfo) {
      return {
        notificationId: req.notification_id,
        notificationVerb: reqRelation,
        userId: reqUserId,
        userType: "patient",
        username: userInfo.username,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        description: req.description,
        senderTip: req.sender_tip
      };
    }
    userInfo = doctors.find(doctor => doctor.user_id == reqUserId);
    if (userInfo) {
      return {
        notificationId: req.notification_id,
        notificationVerb: reqRelation,
        userId: reqUserId,
        userType: "doctor",
        username: userInfo.username,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        specialization: userInfo.specialization,
        description: req.description,
        senderTip: req.sender_tip
      };
    } else {
      return {
        notificationId: req.notification_id,
        notificationVerb: reqRelation,
        userId: req.sender_id,
        userType: "NotFound",
        username: "",
        firstName: "",
        lastName: "",
        description: req.description,
        senderTip: req.sender_tip
      };
    }
  });
};

//GET REQUESTS WITH TIMESTAMP?
export const getRequestsTimestamp = () => (dispatch, getState) => {
  dispatch({ type: REQUESTS_TIMESTAMP_LOADING });
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .get("/app/user/notifications/", config)
    .then(async res => {
      const users = await getUsers(tokenConfig(getState));
      let payload = {
        all: [],
        friend_requests: [],
        care_team_requests: [],
        circle_of_trust_requests: [],
        health_score_requests: []
      };

      let requests = [];
      res.data.forEach(req => {
        if (
          notificationVerbToRequests[req.notification_verb] ===
          "health_score_requests"
        )
          payload[notificationVerbToRequests[req.notification_verb]].push(req);
        else requests.push(req);
      });

      if (users) {
        const all = getRequestInfo(users.patients, users.doctors, requests);
        payload.all = all;
        for (const request of all) {
          payload[notificationVerbToRequests[request.notificationVerb]].push(
            request
          );
        }
      }
      dispatch({
        type: REQUESTS_TIMESTAMP_LOADED,
        payload
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: REQUESTS_TIMESTAMP_FAIL
      });
    });
};

//GET OUTGOING REQUESTS
export const getOutgoingRequests = () => (dispatch, getState) => {
  dispatch({ type: OUTGOING_REQUESTS_LOADING });
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .get("/app/user/outgoing/requests/", config)
    .then(async res => {
      const users = await getUsers(tokenConfig(getState));
      const payload = users
        ? getRequestInfo(users.patients, users.doctors, res.data)
        : res.data;
      dispatch({
        type: OUTGOING_REQUESTS_LOADED,
        payload
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: OUTGOING_REQUESTS_FAIL
      });
    });
};

export const replyRequest = (notificationId, requestType, response) => (
  dispatch,
  getState
) => {
  const requestUrl = `/app/user/${requestType}/${notificationId}/`;
  const body = { requestStatus: response };
  axios
    .put(requestUrl, body, tokenConfig(getState))
    .then(res => {
      if (response === "accepted") {
        dispatch(
          createMessage({ successMessage: "Friend successfully added" })
        );
        if (requestType === "friend_requests") {
          dispatch(getMyFriends());
        } else if (requestType === "circle_of_trust") {
          dispatch(getCircleOfTrust());
          dispatch(getProtectedMembers());
        } else {
          dispatch(getCareTeam());
        }
      }
      dispatch(getRequests());
      dispatch(getRequestsTimestamp());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// SEND REQUEST

export const sendRequest = (receiverId, requestType) => (
  dispatch,
  getState
) => {
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/${requestType}/`
    : `/app/${requestType}/`;
  const body = {};
  if (
    requestType === "request/doctor" ||
    (getState().user.modeCoT && requestType === "care_team")
  ) {
    body.doctor_id = receiverId;
  } else if (requestType === "care_team") {
    body.user_id = receiverId;
  } else if (requestType === "circle_of_trust") {
    body.invited = receiverId;
  } else {
    //friend
    body.receiver = receiverId;
  }

  axios
    .post(requestUrl, body, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({ successMessage: "Friend request successfully sent" })
      );
      dispatch(getOutgoingRequests());
      if (requestType === "circle_of_trust") {
        dispatch(getNonCircleOfTrust());
      } else if (requestType === "friends") {
        dispatch(getNonFriends());
      } else {
        dispatch(getNonCareTeam());
      }
    })
    .catch(err => {
      const message =
        err.response.status === 409
          ? "You have already sent this request"
          : err.response.data;
      dispatch(returnErrors(message, err.response.status));
      dispatch({
        type: SEND_REQUEST_FAIL
      });
    });
};

// CANCEL REQUEST

export const cancelRequest = notificationId => (dispatch, getState) => {
  axios
    .delete(
      `/app/delete/outgoing/request/${notificationId}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "Request successfully cancelled"
        })
      );
      dispatch(getOutgoingRequests());
    })
    .catch(err => {
      const message =
        err.response.status === 409
          ? "You have already sent this request"
          : err.response.data;
      dispatch(returnErrors(message, err.response.status));
      dispatch({
        type: SEND_REQUEST_FAIL
      });
    });
};

//READ NOTIFICATION
export const readNotification = notificationId => (dispatch, getState) => {
  axios
    .put(
      `/app/read/health/notification/${notificationId}/`,
      {},
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(
        createMessage({
          successMessage: "This notification is successfully read"
        })
      );
      dispatch(getRequestsTimestamp());
    })
    .catch(err => {
      const message =
        err.response.status === 409
          ? "You have already sent this request"
          : err.response.data;
      dispatch(returnErrors(message, err.response.status));
    });
};
