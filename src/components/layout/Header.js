import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Collapse,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  Badge,
  Container,
  NavLink,
  Fade,
  TabContent,
  TabPane
} from "reactstrap";

import classnames from "classnames";
import Select, { components } from "react-select";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";
import { withRouter } from "react-router-dom";

import { logout, exit } from "../../actions/user";
import {
  getSearchResults,
  clearSearchState
} from "../../actions/searchresults";
import {
  getRequestsTimestamp,
  getOutgoingRequests,
  replyRequest,
  cancelRequest,
  readNotification
} from "../../actions/requests";
import {
  notificationVerbToFriendlyDict,
  notificationVerbToUrlDict
} from "../../utils/dicts";

import avatar from "../../../static/frontend/assets/images/avatar.png";

const headerTitles = {
  homepage: "Home Page",
  profile: "Profile",
  healthscore: "Health Score",
  calendar: "Calendar",
  community: "Community",
  careteam: "Care Team",
  patient: "Patient",
  doctor: "Doctor",
  blockchain_history: "Blockchain History"
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.dropdownRef = React.createRef();
    this.dropdownNavlinkRef = React.createRef();
    this.notificationBellRef = React.createRef();
    this.notificationBellNavlinkRef = React.createRef();
    this.state = {
      isDropdownOpen: false,
      isNotificationBellOpen: false,
      notificationNumberHide: false,
      notificationBellNumberHide: false,
      openTab: "1",
      searchValue: ""
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.isAuthenticated !== prevProps.user.isAuthenticated) {
      if (this.props.user.isAuthenticated) {
        // polling for changes
        this.timer = setInterval(() => this.getItems(), 5000);
      } else {
        // on logout
        clearInterval(this.timer);
        this.timer = null;
        this.setState({
          notificationNumberHide: false,
          notificationBellNumberHide: false
        });
      }
    }
    if (
      this.props.user.isAuthenticated &&
      this.props.requests.requestsByTimestamp.length >
        prevProps.requests.requestsByTimestamp.length &&
      prevProps.requests.requestsByTimestamp.every(val =>
        JSON.stringify(this.props.requests.requestsByTimestamp).includes(
          JSON.stringify(val)
        )
      )
    ) {
      // if new request is added
      this.setState({
        notificationNumberHide: false
      });
    }
    if (
      this.props.user.isAuthenticated &&
      this.props.requests.healthScoreRequests.length >
        prevProps.requests.healthScoreRequests.length &&
      prevProps.requests.healthScoreRequests.every(val =>
        JSON.stringify(this.props.requests.healthScoreRequests).includes(
          JSON.stringify(val)
        )
      )
    ) {
      // if new request is added
      this.setState({
        notificationBellNumberHide: false
      });
    }
  }
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutsideDropdown);

    document.addEventListener(
      "mousedown",
      this.handleClickOutsideNotificationBell
    );
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
    document.removeEventListener(
      "mousedown",
      this.handleClickOutsideNotificationBell
    );
  }

  getItems() {
    this.props.getRequestsTimestamp();
    this.props.getOutgoingRequests();
  }

  handleClickOutsideDropdown = e => {
    if (
      this.state.isDropdownOpen &&
      this.dropdownRef &&
      !this.dropdownRef.contains(e.target) &&
      this.dropdownNavlinkRef &&
      !this.dropdownNavlinkRef.contains(e.target)
    ) {
      this.toggleDropdown();
    }
  };

  handleClickOutsideNotificationBell = e => {
    if (
      this.state.isNotificationBellOpen &&
      this.notificationBellRef &&
      !this.notificationBellRef.contains(e.target) &&
      this.notificationBellNavlinkRef &&
      !this.notificationBellNavlinkRef.contains(e.target)
    ) {
      this.toggleNotificationBell();
    }
  };

  toggleConditionallyDropdown = () => {
    if (!this.state.isDropdownOpen) {
      this.setState({
        isDropdownOpen: true
      });
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen,
      notificationNumberHide: true
    }));
  };

  toggleNotificationBell = () => {
    this.setState(prevState => ({
      isNotificationBellOpen: !prevState.isNotificationBellOpen,
      notificationBellNumberHide: true
    }));
  };

  onChange = result => {
    if (result.firstName === "..more") {
      this.props.history.push(`/search/${this.state.searchValue}`);
    } else if (result) {
      const userType = result.specialization ? "doctor" : "patient";
      this.props.history.push(`/${userType}/${result.username}`);
    }
  };

  handleAcceptDecline = (notificationId, requestType, response) => {
    this.props.replyRequest(
      notificationId,
      notificationVerbToUrlDict[requestType],
      response
    );
  };

  handleCancelRequest = notification_id => {
    this.props.cancelRequest(notification_id);
  };

  handleLogout = () => {
    this.props.logout();
  };

  handleExit = () => {
    this.props.exit();
  };

  handleReadNotification = notification_id => {
    this.toggleNotificationBell();
    this.props.readNotification(notification_id);
  };

  formatOptionLabel = ({
    firstName,
    lastName,
    specialization,
    username,
    type
  }) =>
    type ? (
      <span>{firstName}</span>
    ) : (
      <Row className="mr-0">
        <Col md={10}>
          {firstName} {lastName}
        </Col>
        <Col md={1}>
          {specialization ? (
            <i className="fa fa-user-md fa-lg" />
          ) : (
            <i className="fa fa-user fa-lg" />
          )}
        </Col>
      </Row>
    );

  debounceHandleSearch = debounce(value => {
    if (value === "") this.props.clearSearchState();
    else {
      this.props.getSearchResults(value, false);
      this.setState({
        searchValue: value
      });
    }
  }, 100);

  toggle = tab => {
    this.setState({
      openTab: tab
    });
  };

  getTabItem = (incomingRequests, outgoingRequests) => (
    <>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.openTab === "1" })}
            onClick={() => {
              this.toggle("1");
            }}
          >
            Incoming Requests
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: this.state.openTab === "2" })}
            onClick={() => {
              this.toggle("2");
            }}
          >
            Outgoing Requests
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={this.state.openTab} className="ml-2">
        <TabPane tabId="1">
          {incomingRequests.length ? (
            incomingRequests.map(req =>
              this.getDropdownItem(
                req.firstName,
                req.lastName,
                req.username,
                req.userType,
                req.specialization,
                req.notificationVerb,
                req.notificationId,
                req.description,
                "in"
              )
            )
          ) : (
            <Row className="mt-2 mr-1 mb-1">
              <Col>
                <h6 style={{ textAlign: "center" }}>
                  You don't have any requests
                </h6>
              </Col>
            </Row>
          )}
        </TabPane>
        <TabPane tabId="2">
          {outgoingRequests.length ? (
            outgoingRequests.map(req =>
              this.getDropdownItem(
                req.firstName,
                req.lastName,
                req.username,
                req.userType,
                req.specialization,
                req.notificationVerb,
                req.notificationId,
                req.senderTip,
                "out"
              )
            )
          ) : (
            <Row className="mt-2 mr-1 mb-1">
              <Col>
                <h6 style={{ textAlign: "center" }}>
                  You don't have any requests
                </h6>
              </Col>
            </Row>
          )}
        </TabPane>
      </TabContent>
    </>
  );

  getDropdownItem = (
    firstName,
    lastName,
    username,
    userType,
    userSpecialization,
    requestType,
    notificationId,
    description,
    tabType
  ) => (
    <>
      <Row className="mt-2 mr-1 mb-1">
        <Col>
          <Row>
            <Col md={6}>
              <Row>
                <Col>
                  <Link
                    to={`/${
                      userType === "doctor" ? "doctor" : "patient"
                    }/${username}`}
                    onClick={this.toggleDropdown}
                  >
                    <span>
                      {firstName} {lastName}
                    </span>
                  </Link>
                  {userType === "doctor" ? (
                    <strong> {userSpecialization} </strong>
                  ) : null}
                </Col>
              </Row>

              <Row>
                <Col>
                  <i>{notificationVerbToFriendlyDict[requestType]}</i>
                </Col>
              </Row>
            </Col>
            {tabType === "in" ? (
              <>
                <Col md={3}>
                  <Button
                    color="success"
                    onClick={() => {
                      this.handleAcceptDecline(
                        notificationId,
                        requestType,
                        "accepted"
                      );
                    }}
                  >
                    Accept
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    color="danger"
                    onClick={() => {
                      this.handleAcceptDecline(
                        notificationId,
                        requestType,
                        "not accepted"
                      );
                    }}
                  >
                    Decline
                  </Button>
                </Col>
              </>
            ) : (
              <Col md={6}>
                <Button
                  color="danger"
                  onClick={() => {
                    this.handleCancelRequest(notificationId);
                  }}
                  className="myCentered"
                >
                  Cancel Request
                </Button>
              </Col>
            )}
          </Row>
          <Row>
            <Col>
              <small>{description}</small>
            </Col>
          </Row>
          <hr />
        </Col>
      </Row>
    </>
  );

  getNotification = (notificationId, description) => (
    <>
      <Row className="mt-2 mb-1">
        <Col>
          <Row className="ml-1">
            <Col md={10}>
              <small>
                <strong>{description}</strong>
              </small>
            </Col>
            <Col md={2}>
              <Link
                to="/healthscore"
                onClick={() => {
                  this.handleReadNotification(notificationId);
                }}
              >
                <i className="fa fa-circle-o fa-sm" />
              </Link>
            </Col>
          </Row>
          <hr />
        </Col>
      </Row>
    </>
  );

  setDropDownRef = container => {
    this.dropdownRef = container;
  };

  setNotificationBellRef = container => {
    this.notificationBellRef = container;
  };

  setDropdownNavlinkRef = navlink => {
    this.dropdownNavlinkRef = navlink;
  };

  setNotificationBellNavlinkRef = navlink => {
    this.notificationBellNavlinkRef = navlink;
  };

  getNotificationBellDropdown = healthScoreRequests =>
    this.state.isNotificationBellOpen ? (
      <div ref={this.setNotificationBellRef}>
        <Fade
          in={this.state.isNotificationBellOpen}
          className="w-45 border-info bg-white rounded"
          style={{
            position: "absolute",
            top: "95%",
            right: "1%",
            border: "solid",
            borderWidth: "4px"
          }}
        >
          <div style={{ minWidth: "300px" }}>
            <Row className="mt-2">
              <Col>
                <h6 style={{ textAlign: "center" }}>Notifications</h6>
              </Col>
            </Row>
            <hr />
            {healthScoreRequests.length ? (
              healthScoreRequests.map(req =>
                this.getNotification(req.notification_id, req.description)
              )
            ) : (
              <Row className="mt-2 mr-1 mb-1">
                <Col>
                  <h6 style={{ textAlign: "center" }}>
                    You don't have any notifications
                  </h6>
                </Col>
              </Row>
            )}
          </div>
        </Fade>
      </div>
    ) : null;

  getFriendRequestDropdown = (incomingRequests, outgoingRequests) =>
    this.state.isDropdownOpen ? (
      <div ref={this.setDropDownRef}>
        <Fade
          in={this.state.isDropdownOpen}
          className="w-45 border-info bg-white rounded"
          style={{
            position: "absolute",
            top: "95%",
            right: "8%",
            border: "solid",
            borderWidth: "4px"
          }}
        >
          <div style={{ minWidth: "440px" }}>
            {this.getTabItem(incomingRequests, outgoingRequests)}
          </div>
        </Fade>
      </div>
    ) : null;

  render() {
    const { isAuthenticated, userInfo, modeCoT } = this.props.user;
    const currentpage =
      headerTitles[this.props.location.pathname.split("/")[1]];

    const { searchResults, isLoading } = this.props.searchresults;

    const {
      healthScoreRequests,
      requestsByTimestamp,
      outgoingRequests
    } = this.props.requests;

    const authLinks = (
      <>
        <NavItem>
          <Link to="/profile" className="nav-link sitewideUser">
            {userInfo ? `${userInfo.username}` : ""}
            <img src={avatar} />
          </Link>
        </NavItem>
        <NavItem>
          <div className="separator" />
        </NavItem>
        <NavItem>
          <div ref={this.setDropdownNavlinkRef}>
            <NavLink onClick={this.toggleDropdown}>
              <i
                className="fa fa-users fa-lg"
                style={
                  this.state.isDropdownOpen ? { color: "var(--primary)" } : {}
                }
              >
                {requestsByTimestamp.length &&
                !this.state.notificationNumberHide ? (
                  <h6>
                    <Badge
                      color="info"
                      style={{
                        position: "fixed",
                        top: "10px",
                        right: "160px"
                      }}
                    >
                      {requestsByTimestamp.length}
                    </Badge>
                  </h6>
                ) : null}
              </i>
            </NavLink>
          </div>
        </NavItem>
        <NavItem>
          <Link to="#" className="nav-link">
            <i className="fa fa-comment-o fa-lg" />
          </Link>
        </NavItem>
        <NavItem>
          <div ref={this.setNotificationBellNavlinkRef}>
            <NavLink onClick={this.toggleNotificationBell}>
              <i
                className="fa fa-bell-o fa-lg"
                style={
                  this.state.isNotificationBellOpen
                    ? { color: "var(--primary)" }
                    : {}
                }
              >
                {healthScoreRequests.length &&
                !this.state.notificationBellNumberHide ? (
                  <h6>
                    <Badge
                      color="info"
                      style={{
                        position: "fixed",
                        top: "10px",
                        right: "85px"
                      }}
                    >
                      {healthScoreRequests.length}
                    </Badge>
                  </h6>
                ) : null}
              </i>
            </NavLink>
          </div>
        </NavItem>
        {/* <NavItem>
          <a className="nav-link" onClick={this.props.changeTheme}>
            <i className="fa fa-adjust fa-lg" />
          </a>
        </NavItem> */}
        <NavItem>
          <div className="separator" />
        </NavItem>

        <NavItem>
          {modeCoT ? (
            <>
              <Link to="#" onClick={this.handleExit} className="nav-link">
                &nbsp; &nbsp;
                <strong>Exit</strong>
                &nbsp;
              </Link>
            </>
          ) : (
            <Link to="#" onClick={this.handleLogout} className="nav-link">
              <strong>Logout</strong>
            </Link>
          )}
        </NavItem>
      </>
    );
    const guestLinks = (
      <>
        <NavItem>
          <Link to="/register" className="nav-link">
            <strong>Sign Up</strong>
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/" className="nav-link">
            <strong>Log In</strong>
          </Link>
        </NavItem>
      </>
    );
    const sidebarMenu = (
      <NavbarBrand
        onClick={this.props.onToggleSideBar}
        style={{ color: "white" }}
      >
        <i className="fa fa-navicon fa-lg" />
      </NavbarBrand>
    );

    const DropdownIndicator = props => {
      return (
        components.DropdownIndicator && (
          <components.DropdownIndicator {...props}>
            <i className="fa fa-search fa-lg" />
          </components.DropdownIndicator>
        )
      );
    };

    const options =
      searchResults.length >= 6
        ? searchResults
            .slice(0, 5)
            .concat([{ firstName: "..more", lastName: "", type: "more" }])
        : searchResults;

    const searchBar = (
      <div style={{ width: "25%" }}>
        <Select
          isLoading={isLoading}
          formatOptionLabel={this.formatOptionLabel}
          noOptionsMessage={value =>
            value.inputValue === "" ? null : "No Match"
          }
          isClearable
          isSearchable
          onInputChange={this.debounceHandleSearch}
          onChange={this.onChange}
          components={{ DropdownIndicator }}
          options={options}
          filterOption={() => true}
          placeholder={"Search"}
          value={""}
        />
      </div>
    );
    const backgroundColor = modeCoT ? "#000000" : "#e44d3a";
    return (
      <div>
        <Navbar style={{ backgroundColor }} dark expand="md" fixed="top">
          {isAuthenticated ? sidebarMenu : null}
          <NavbarBrand href="/#/homepage">
            <strong>Impilo</strong>
          </NavbarBrand>
          {isAuthenticated ? searchBar : null}
          {isAuthenticated ? (
            <div style={{ width: "2%" }}>
              <span className="myCentered" style={{ color: "white" }}>
                <strong>{currentpage}</strong>
              </span>
            </div>
          ) : null}
          <Collapse isOpen={true} navbar>
            <Nav className="ml-auto" navbar>
              {isAuthenticated ? authLinks : guestLinks}
            </Nav>
          </Collapse>
          {this.getFriendRequestDropdown(requestsByTimestamp, outgoingRequests)}
          {this.getNotificationBellDropdown(healthScoreRequests)}
        </Navbar>
      </div>
    );
  }
}

Header.propTypes = {
  onToggleSideBar: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  exit: PropTypes.func.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  clearSearchState: PropTypes.func.isRequired,
  getRequestsTimestamp: PropTypes.func.isRequired,
  getOutgoingRequests: PropTypes.func.isRequired,
  replyRequest: PropTypes.func.isRequired,
  cancelRequest: PropTypes.func.isRequired,
  readNotification: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  searchresults: state.searchresults,
  requests: state.requests
});

const mapDispatchToProps = {
  logout,
  exit,
  getSearchResults,
  clearSearchState,
  getRequestsTimestamp,
  getOutgoingRequests,
  replyRequest,
  cancelRequest,
  readNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
