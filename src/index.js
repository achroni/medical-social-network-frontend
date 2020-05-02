import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/App";

import store from "./store";
import "../static/frontend/assets/style/App.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
