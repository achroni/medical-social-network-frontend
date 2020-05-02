import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  CardTitle,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import classnames from "classnames";

import avatar from "../../../static/frontend/assets/images/avatar.png";
import Box from "../cards/Box";

import Select from "react-select";

import { getRequests, replyRequest, sendRequest } from "../../actions/requests";
import {
  getCareTeam,
  getNonCareTeam,
  removeCareTeamMember
} from "../../actions/relationships";

class CareTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: "1",
      userIdToBeFriend: null
    };
  }

  toggle = tab => {
    this.setState({
      openTab: tab
    });
  };

  componentDidMount() {
    this.props.getCareTeam();
    this.props.getNonCareTeam();
  }

  handleUnfriendCareTeam = userId => {
    this.props.removeCareTeamMember(userId);
  };

  handleAcceptDecline = (notificationId, requestType, response) => {
    this.props.replyRequest(notificationId, requestType, response);
  };

  handleSendRequest = requestType => {
    this.props.sendRequest(this.state.userIdToBeFriend, "care_team");
  };

  handleChange = e => {
    this.setState({
      userIdToBeFriend: e ? e.value : null
    });
  };

  getRequestList(requests, requestType) {
    return (
      <>
        {requests.map(req => (
          <Fragment key={req.notificationId}>
            <hr />
            <Row>
              <Col md={2}>
                <div className=" requestProfilePic ">
                  <img src={avatar} className=" requestProfilePic" />
                </div>
              </Col>
              <Col md={5}>
                <Row>
                  {" "}
                  <Link to={`/patient/${req.username}`}>
                    <span>
                      {req.firstName} {req.lastName}
                    </span>
                  </Link>
                </Row>
                <Row>
                  <i>{req.specialization}</i>
                </Row>
              </Col>
              <Col md={2} className="mr-1">
                <Button
                  color="success"
                  className="myCentered"
                  onClick={() => {
                    this.handleAcceptDecline(
                      req.notificationId,
                      requestType,
                      "accepted"
                    );
                  }}
                  block
                >
                  Accept
                </Button>
              </Col>
              <Col md={2} className="ml-1">
                <Button
                  color="danger"
                  className="myCentered"
                  onClick={() => {
                    this.handleAcceptDecline(
                      req.notificationId,
                      requestType,
                      "not accepted"
                    );
                  }}
                  block
                >
                  Decline
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <small>{req.description}</small>
              </Col>
            </Row>
          </Fragment>
        ))}
      </>
    );
  }

  formatOptionLabel = ({ label }) => (
    <>
      <Row className="mr-0">
        <Col md={9}>{label}</Col>
        <Col md={1}>
          <img className="miniProfile_comment" src={avatar} />
        </Col>
      </Row>
    </>
  );

  getOptions = patients => {
    return patients.map(user => ({
      value: user.user_id,
      label: `${user.firstName} ${user.lastName}`
    }));
  };

  getAddNewFriends(nonFriends) {
    return (
      <Row className="mb-5">
        <Box size={10}>
          <Row>
            <Col md={3}>Add new friends:</Col>
            <Col md={6}>
              <Select
                formatOptionLabel={this.formatOptionLabel}
                noOptionsMessage={value =>
                  value.inputValue === "" ? null : "No Match"
                }
                isClearable
                isSearchable
                onChange={this.handleChange}
                options={nonFriends}
                placeholder={"Search for new friends"}
              />
            </Col>
            <Col md={3}>
              <Button
                color="primary"
                block
                onClick={this.handleSendRequest}
                disabled={!this.state.userIdToBeFriend}
              >
                Send
              </Button>
            </Col>
          </Row>
        </Box>
      </Row>
    );
  }

  getCareTeamList(elements) {
    return (
      <Row>
        {elements.map(friend => (
          <Box key={friend.user_id} size={6} colClassNames="mb-3">
            <Row>
              <Col md={3}>
                <Link className="requestProfilePic" to="#">
                  <img src={avatar} className="requestProfilePic" />
                </Link>
              </Col>
              <Col md={5}>
                <Link to={`/patient/${friend.username}`}>
                  {friend.firstName} {friend.lastName}
                </Link>
                {friend.specialization ? (
                  <p>
                    <i>{friend.specialization}</i>
                  </p>
                ) : (
                  ""
                )}
              </Col>
              <Col md={4}>
                <Button
                  color="danger"
                  className="myCentered"
                  onClick={() => {
                    this.handleUnfriendCareTeam(friend.user_id);
                  }}
                >
                  Unfriend
                </Button>
              </Col>
            </Row>
          </Box>
        ))}
      </Row>
    );
  }

  render() {
    const { myCareTeam } = this.props.relationships;
    const { careTeamRequests } = this.props.requests;

    const nonCareTeam = this.getOptions(this.props.relationships.nonCareTeam);
    return (
      <>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.openTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Requests
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.openTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              Care Team
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.openTab}>
          <TabPane tabId="1">
            <Row className="mt-4">
              <Box customStyle={{ minHeight: "200px" }}>
                <CardTitle>
                  {careTeamRequests.length > 0 ? (
                    <strong>Answer to Care Team Requests</strong>
                  ) : (
                    <span className="myCentered">
                      {" "}
                      <strong>
                        <h5>You have no Care Team Requests</h5>
                      </strong>
                    </span>
                  )}
                </CardTitle>
                {this.getRequestList(careTeamRequests, "care_team_requests")}
              </Box>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="mt-4">
              <Box>
                {this.getAddNewFriends(nonCareTeam)}
                {myCareTeam.length > 0 ? (
                  <Row>
                    <Col>{this.getCareTeamList(myCareTeam)}</Col>
                  </Row>
                ) : (
                  <Row>
                    <Col sm="12">
                      <div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <h3 className="myCentered">You have no Care Team</h3>
                      </div>
                    </Col>
                  </Row>
                )}
              </Box>
            </Row>
          </TabPane>
        </TabContent>
      </>
    );
  }
}

CareTeam.propTypes = {
  getCareTeam: PropTypes.func.isRequired,
  removeCareTeamMember: PropTypes.func.isRequired,
  getNonCareTeam: PropTypes.func.isRequired,
  replyRequest: PropTypes.func.isRequired,
  sendRequest: PropTypes.func.isRequired,
  relationships: PropTypes.any
};

const mapStateToProps = state => ({
  requests: state.requests,
  relationships: state.relationships
});

const mapDispatchToProps = {
  getRequests,
  replyRequest,
  sendRequest,
  getCareTeam,
  getNonCareTeam,
  removeCareTeamMember
};

export default connect(mapStateToProps, mapDispatchToProps)(CareTeam);
