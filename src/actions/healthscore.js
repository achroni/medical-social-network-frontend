import axios from "axios";
import { createMessage, returnErrors } from "./messages";
import { tokenConfig } from "./user";
import {
  HEALTH_SCORES_LOADING,
  HEALTH_SCORES_LOADED,
  HEALTH_SCORES_FAIL,
  CREATE_HEALTH_SCORE_SUCCESS,
  CREATE_HEALTH_SCORE_FAIL,
  LATEST_HEALTH_SCORE_LOADING,
  LATEST_HEALTH_SCORE_LOADED,
  LATEST_HEALTH_SCORE_FAIL
} from "./types";

// GET LATEST HEALTH SCORE
export const getLatestHealthScore = () => (dispatch, getState) => {
  dispatch({ type: LATEST_HEALTH_SCORE_LOADING });
  const config = getState().user.modeCoT
    ? tokenConfig(getState, { member_id: getState().user.idCoT })
    : tokenConfig(getState);
  axios
    .get("/app/latest/health/score/", config)
    .then(res => {
      dispatch({
        type: LATEST_HEALTH_SCORE_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: LATEST_HEALTH_SCORE_FAIL
      });
    });
};

//GET HISTORY OF HEALTH SCORES
export const getHealthScores = () => (dispatch, getState) => {
  dispatch({ type: HEALTH_SCORES_LOADING });
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/health_score/`
    : "/app/health/score/";
  axios
    .get(requestUrl, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: HEALTH_SCORES_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: HEALTH_SCORES_FAIL
      });
    });
};

//CREATE A HEALTH SCORE
export const createHealthScore = healthscore => (dispatch, getState) => {
  const requestUrl = getState().user.modeCoT
    ? `/app/cot_action/member/${getState().user.idCoT}/health_score/`
    : "/app/health/score/";
  axios
    .post(requestUrl, healthscore, tokenConfig(getState))
    .then(res => {
      dispatch(
        createMessage({ successMessage: "Health Score for today submitted" })
      );
      dispatch({
        type: CREATE_HEALTH_SCORE_SUCCESS
      });
      dispatch(getHealthScores());
      dispatch(getLatestHealthScore());
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status));
      dispatch({
        type: CREATE_HEALTH_SCORE_FAIL
      });
    });
};
