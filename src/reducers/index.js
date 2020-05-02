import { combineReducers } from "redux";
import user from "./user";
import errors from "./errors";
import messages from "./messages";
import requests from "./requests";
import relationships from "./relationships";
import searchresults from "./searchresults";
import posts from "./posts";
import healthscore from "./healthscore";
import blockchain from "./blockchain";

export default combineReducers({
  user,
  errors,
  messages,
  requests,
  relationships,
  searchresults,
  posts,
  healthscore,
  blockchain
});
