import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  CREATE_PATIENT_SUCCESS,
  CREATE_PATIENT_FAIL,
  CREATE_DOCTOR_SUCCESS,
  CREATE_DOCTOR_FAIL,
  CHANGE_THEME,
  ENTER_MODE_CIRCLE_OF_TRUST,
  EXIT_MODE_CIRCLE_OF_TRUST
} from "../actions/types.js";

const initialState = {
  token: localStorage.getItem("token"),
  id: localStorage.getItem("id"),
  isAuthenticated: null,
  isLoading: false,
  userType: null,
  userInfo: null,
  modeCoT: false,
  idCoT: null,
  defaultTheme: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        userInfo: action.payload.userInfo,
        userType: action.payload.userType
      };
    case ENTER_MODE_CIRCLE_OF_TRUST:
      return {
        ...state,
        modeCoT: true,
        idCoT: action.payload
      };
    case EXIT_MODE_CIRCLE_OF_TRUST:
      return {
        ...state,
        modeCoT: false,
        idCoT: null
      };
    case CREATE_DOCTOR_SUCCESS:
      return {
        ...state,
        userType: "doctor",
        userInfo: action.payload
      };
    case CREATE_PATIENT_SUCCESS:
      return {
        ...state,
        userType: "patient",
        userInfo: action.payload
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("id", action.payload.id);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case CHANGE_THEME:
      return {
        ...state,
        defaultTheme: action.payload
      };
    case AUTH_ERROR:
    case CREATE_PATIENT_FAIL:
    case CREATE_DOCTOR_FAIL:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      return {
        ...state,
        token: null,
        id: null,
        userType: null,
        userInfo: null,
        isAuthenticated: false,
        isLoading: false,
        defaultTheme: true,
        modeCoT: false,
        idCoT: null
      };
    default:
      return state;
  }
}
