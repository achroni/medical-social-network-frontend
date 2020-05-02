import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import {
  getMyFriends,
  getCareTeam,
  getCircleOfTrust,
  getProtectedMembers
} from "./relationships";
import {
  CREATE_PATIENT_SUCCESS,
  CREATE_PATIENT_FAIL,
  CREATE_DOCTOR_SUCCESS,
  CREATE_DOCTOR_FAIL,
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  CHANGE_THEME,
  ENTER_MODE_CIRCLE_OF_TRUST,
  EXIT_MODE_CIRCLE_OF_TRUST
} from "./types";
import {
  getRequests,
  getRequestsTimestamp,
  getOutgoingRequests
} from "./requests";
import { getHealthScores, getLatestHealthScore } from "./healthscore";

// CHECK TOKEN & LOAD USER
export const loadUser = userId => (dispatch, getState) => {
  // User Loading
  dispatch({ type: USER_LOADING });
  const id =
    getState().user.modeCoT || userId
      ? getState().user.idCoT
      : getState().user.id;
  axios
    .all([
      axios.get("/app/patients/", tokenConfig(getState)),
      axios.get("/app/doctors/", tokenConfig(getState))
    ])
    .then(
      axios.spread((resPatients, resDoctors) => {
        let userInfo = resPatients.data.find(patient => patient.user_id == id);
        let userType = "patient";
        if (!userInfo) {
          userInfo = resDoctors.data.find(doctor => doctor.user_id == id);
          userType = "doctor";
        }
        if (!userInfo) {
          userType = "none";
          throw "User not found";
        }
        dispatch({
          type: USER_LOADED,
          payload: { userInfo, userType }
        });
        dispatch(getMyFriends());
        dispatch(getCareTeam(userType));
        dispatch(getCircleOfTrust());
        if (!getState().user.modeCoT) {
          dispatch(getProtectedMembers());
        }
        dispatch(getRequests());
        dispatch(getRequestsTimestamp());
        dispatch(getOutgoingRequests());

        if (userType === "patient") {
          dispatch(getHealthScores());
          dispatch(getLatestHealthScore());
        }
      })
    )
    .catch(err => {
      // dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const loadCoT = userId => (dispatch, getState) => {
  //Circle of Trust Loading
  dispatch({
    type: ENTER_MODE_CIRCLE_OF_TRUST,
    payload: userId
  });
  dispatch(loadUser(userId));
};

// LOGIN USER
export const login = (username, password) => dispatch => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request Body
  const body = JSON.stringify({ username, password });

  axios
    .post("/api-token-auth/", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(loadUser());
    })
    .catch(err => {
      const msg = "Wrong Credentials";
      dispatch(returnErrors(msg, err.response.status));
      dispatch({
        type: LOGIN_FAIL
      });
    });
};

// CREATE PATIENT
export const createPatient = patient => dispatch => {
  axios
    .post("/app/patients/", patient)
    .then(res => {
      dispatch(
        createMessage({ successMessage: "Patient successfully created" })
      );
      dispatch({
        type: CREATE_PATIENT_SUCCESS,
        payload: patient
      });
      dispatch(login(patient.user.username, patient.user.password));
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CREATE_PATIENT_FAIL
      });
    });
};

// CREATE DOCTOR
export const createDoctor = doctor => dispatch => {
  axios
    .post("/app/doctors/", doctor)
    .then(res => {
      dispatch(
        createMessage({ successMessage: "Doctor successfully created" })
      );
      dispatch({
        type: CREATE_DOCTOR_SUCCESS,
        payload: doctor
      });
      dispatch(login(doctor.user.username, doctor.user.password));
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CREATE_DOCTOR_FAIL
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post("/logout/", null, tokenConfig(getState))
    .then(res => {
      document.getElementById("mytheme").href =
        "https://bootswatch.com/4/journal/bootstrap.min.css";
      dispatch({
        type: LOGOUT_SUCCESS
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
    });
};

// exit from protected memeber profile
export const exit = () => (dispatch, getState) => {
  //Circle of Trust Loading
  dispatch({
    type: EXIT_MODE_CIRCLE_OF_TRUST
  });
  dispatch(loadUser());
};

export const changeTheme = () => (dispatch, getState) => {
  const defaultTheme = !getState().user.defaultTheme;
  const themeName = defaultTheme ? "journal" : "cyborg";
  document.getElementById(
    "mytheme"
  ).href = `https://bootswatch.com/4/${themeName}/bootstrap.min.css`;
  dispatch({
    type: CHANGE_THEME,
    payload: defaultTheme
  });
};

// Setup config with token - helper function
export const tokenConfig = (getState, params) => {
  // Get token from state
  const token = getState().user.token;

  // Headers
  const config = params
    ? {
        headers: {
          "Content-Type": "application/json"
        },
        params
      }
    : {
        headers: {
          "Content-Type": "application/json"
        }
      };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
