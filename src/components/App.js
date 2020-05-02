import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Sidebar from "react-sidebar";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Register from "./accounts/Register";
import Login from "./accounts/Login";
import Alerts from "./layout/Alerts";
import SidebarContent from "./layout/SidebarContent";
import ProfileInfo from "./pages/ProfileInfo";

import Header from "./layout/Header";
import PrivateRoute from "./common/PrivateRoute";
import HomePage from "./pages/HomePage";
import myCalendar from "./pages/MyCalendar";
import Community from "./pages/Community";
import BlockchainHistory from "./pages/BlockchainHistory";
import CareTeam from "./pages/CareTeam";
import HealthScore from "./pages/HealthScore";

import { loadUser } from "../actions/user";
import OtherUserProfile from "./helppages/OtherUserProfile";
import SearchPage from "./helppages/SearchPage";

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dockedSidebar: true
    };
  }

  componentDidMount() {
    this.props.loadUser();
  }

  toggleSideBar = () => {
    this.setState(prevState => ({
      dockedSidebar: !prevState.dockedSidebar
    }));
  };

  render() {
    return (
      <Router>
        <Sidebar
          sidebar={<SidebarContent />}
          docked={this.state.dockedSidebar && this.props.isAuthenticated}
          styles={{
            sidebar: {
              background: this.props.defaultTheme
                ? "#f2f1f0"
                : "var(--secondary)"
            }
          }}
        >
          <>
            <Header onToggleSideBar={this.toggleSideBar} />
            <Alerts />

            <div className="container mt-5 pt-5">
              <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/" component={Login} />
                <PrivateRoute exact path="/homepage" component={HomePage} />
                <PrivateRoute exact path="/profile" component={ProfileInfo} />
                <PrivateRoute
                  exact
                  path="/healthscore"
                  component={HealthScore}
                />
                <PrivateRoute exact path="/calendar" component={myCalendar} />
                <PrivateRoute exact path="/community" component={Community} />
                <PrivateRoute exact path="/careteam" component={CareTeam} />
                <PrivateRoute
                  exact
                  path="/blockchain_history"
                  component={BlockchainHistory}
                />
                <PrivateRoute
                  exact
                  path="/:userType(patient|doctor)/:userId"
                  component={OtherUserProfile}
                />
                <PrivateRoute
                  exact
                  path="/search/:searchValue"
                  component={SearchPage}
                />
              </Switch>
            </div>
          </>
        </Sidebar>
      </Router>
    );
  }
}

App.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  defaultTheme: state.user.defaultTheme
});

const mapDispatchToProps = { loadUser };

export default connect(mapStateToProps, mapDispatchToProps)(App);
