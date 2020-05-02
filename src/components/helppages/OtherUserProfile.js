import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Row, Col, CardTitle, Button } from "reactstrap";
import { connect } from "react-redux";

import PropTypes from "prop-types";
import {
  getSearchedUserInfo,
  getSearchedUserRelation
} from "../../actions/searchresults";
import {
  removeFriend,
  removeCareTeamMember,
  removeCircleOfTrust
} from "../../actions/relationships";
import {
  sendRequest,
  replyRequest,
  getOutgoingRequests,
  cancelRequest
} from "../../actions/requests";

import avatar from "../../../static/frontend/assets/images/avatar.png";
import Box from "../cards/Box";

import { sendRequestUrlDict } from "../../utils/dicts";

const requestsDictionary = {
  friend: "friend_requests",
  circle_of_trust: "circle_of_trust",
  care_team: "care_team_requests"
};
const relationshipsDictionary = {
  friend: "Friends",
  circle_of_trust: "Circle of Trust",
  care_team: "Care Team"
};
class OtherUserProfile extends Component {
  constructor(props) {
    super(props);
    const parts = this.props.location.pathname.split("/");
    this.userType = parts[parts.length - 2];
    this.username = parts[parts.length - 1];

    if (this.username !== this.props.user.userInfo.username) {
      this.props.getOutgoingRequests();
      this.props.getSearchedUserInfo(this.username, this.userType);
    }

    this.state = {
      relationSelected: null
    };
  }

  componentDidUpdate(prevProps) {
    const parts = this.props.location.pathname.split("/");
    if (this.username != parts[parts.length - 1]) {
      // If user searched a user while viewing another
      this.userType = parts[parts.length - 2];
      this.username = parts[parts.length - 1];
      this.props.getOutgoingRequests();
      this.props.getSearchedUserInfo(this.username, this.userType);
    }
    if (
      this.props.searchresults.searchedUserInfo &&
      (this.props.relationships.myFriends !==
        prevProps.relationships.myFriends ||
        this.props.relationships.myCircleOfTrust !==
          prevProps.relationships.myCircleOfTrust ||
        this.props.relationships.myCareTeam !==
          prevProps.relationships.myCareTeam ||
        JSON.stringify(this.props.requests.outgoingRequests) !==
          JSON.stringify(prevProps.requests.outgoingRequests) ||
        this.props.requests.friendRequests !==
          prevProps.requests.friendRequests ||
        this.props.requests.careTeamRequests !==
          prevProps.requests.careTeamRequests ||
        this.props.requests.circleOfTrustRequests !==
          prevProps.requests.circleOfTrustRequests)
    ) {
      this.props.getOutgoingRequests();
      this.props.getSearchedUserRelation(
        this.username,
        this.props.searchresults.searchedUserInfo.user_id
      );
    }
  }

  handleUnfriend = (searchedUserId, relationType) => {
    if (relationType === "friend") {
      this.props.removeFriend(searchedUserId);
    } else if (relationType === "care_team") {
      this.props.removeCareTeamMember(searchedUserId);
    } else if (relationType === "circle_of_trust") {
      this.props.removeCircleOfTrust(searchedUserId);
    }
  };

  onChange = option => {
    this.setState({
      relationSelected: option.value
    });
  };

  handleSendFriendRequest = (
    searchedUserId,
    relationType,
    searchedUserType
  ) => {
    const relation =
      searchedUserType === "doctor" ? "care_team_doctor" : relationType;
    this.props.sendRequest(searchedUserId, sendRequestUrlDict[relation]);
  };

  handleCancelRequest = notification_id => {
    this.props.cancelRequest(notification_id);
  };

  handleAcceptDecline = (notificationId, requestType, response) => {
    this.props.replyRequest(
      notificationId,
      requestsDictionary[requestType],
      response
    );
  };

  getPatientActions = (searchedUserInfo, searchedUserRelation) =>
    searchedUserInfo.userType === "patient" ? (
      <>
        {this.getButton(
          "friend",
          searchedUserRelation.friend,
          searchedUserRelation.sent_request_id_friend,
          searchedUserInfo
        )}
        {this.getButton(
          "circle_of_trust",
          searchedUserRelation.circle_of_trust,
          searchedUserRelation.sent_request_id_circle_of_trust,
          searchedUserInfo
        )}
      </>
    ) : (
      <>
        {this.getButton(
          "care_team",
          searchedUserRelation.care_team,
          searchedUserRelation.sent_request_id_care_team,
          searchedUserInfo
        )}
      </>
    );

  getDoctorActions = (searchedUserInfo, searchedUserRelation) =>
    searchedUserInfo.userType === "patient"
      ? this.getButton(
          "care_team",
          searchedUserRelation.care_team,
          searchedUserRelation.sent_request_id_care_team,
          searchedUserInfo
        )
      : null;

  getButton = (relationType, relationValue, requestId, searchedUserInfo) => {
    if (relationValue === "connected") {
      return (
        <Row className="mb-1">
          <Col>
            <Button
              onClick={() => {
                {
                  searchedUserInfo.user_id
                    ? this.handleUnfriend(
                        searchedUserInfo.user_id,
                        relationType
                      )
                    : this.handleUnfriend(
                        searchedUserInfo.doctor_id,
                        relationType
                      );
                }
              }}
              block
              color="danger"
              size="sm"
            >
              Remove from your {relationshipsDictionary[relationType]}
            </Button>
          </Col>
        </Row>
      );
    } else if (relationValue === "received") {
      return (
        <Row className="mb-1">
          <Col>
            <Button
              color="success"
              onClick={() => {
                this.handleAcceptDecline(requestId, relationType, "accepted");
              }}
              block
              size="sm"
            >
              Accept {relationshipsDictionary[relationType]} Request
            </Button>
          </Col>
          <Col>
            <Button
              color="danger"
              onClick={() => {
                this.handleAcceptDecline(
                  requestId,
                  relationType,
                  "not accepted"
                );
              }}
              block
              size="sm"
            >
              Decline {relationshipsDictionary[relationType]} Request
            </Button>
          </Col>
        </Row>
      );
    } else if (relationValue === "pending") {
      return (
        <Row className="mb-1">
          <Col>
            <Button
              onClick={() => {
                this.handleCancelRequest(requestId);
              }}
              block
              color="danger"
              size="sm"
            >
              Cancel {relationshipsDictionary[relationType]} Request
            </Button>
          </Col>
        </Row>
      );
    } else {
      return (
        <Row className="mb-1">
          <Col>
            <Button
              onClick={() => {
                this.handleSendFriendRequest(
                  searchedUserInfo.user_id,
                  relationType,
                  searchedUserInfo.userType
                );
              }}
              block
              color="primary"
              size="sm"
            >
              Add to your {relationshipsDictionary[relationType]}
            </Button>
          </Col>
        </Row>
      );
    }
  };

  render() {
    const { searchedUserInfo, searchedUserRelation } = this.props.searchresults;
    const { userType } = this.props.user;

    if (this.username === this.props.user.userInfo.username) {
      return <Redirect to="/profile" />;
    }

    if (!searchedUserInfo) {
      return (
        <div className="myCentered">
          <h2>Loading...</h2>
          <div className="loader" />{" "}
        </div>
      );
    }
    return (
      <Row>
        <Box>
          <Row className="mb-3">
            <Box>
              <Row>
                <Col md={4}>
                  <div className="circleWindow profilepageProfilePic">
                    <img
                      src={avatar}
                      className="mainProfilePic profilepageProfilePic"
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <h2>
                    <strong>
                      {searchedUserInfo.userType === "doctor" ? "Dr " : ""}
                      {searchedUserInfo ? `${searchedUserInfo.lastName}` : ""}
                    </strong>
                  </h2>
                  <h5>
                    {searchedUserInfo
                      ? `${searchedUserInfo.firstName}  ${searchedUserInfo.lastName}`
                      : ""}
                  </h5>
                  <h5>
                    {searchedUserInfo.userType === "doctor"
                      ? `${searchedUserInfo.specialization}`
                      : ""}
                  </h5>
                  <h5>Greece, Athens</h5>
                </Col>
                <Col md={4}>
                  {userType === "patient"
                    ? this.getPatientActions(
                        searchedUserInfo,
                        searchedUserRelation
                      )
                    : this.getDoctorActions(
                        searchedUserInfo,
                        searchedUserRelation
                      )}
                </Col>
              </Row>
            </Box>
          </Row>
          <Row className="mb-3">
            {searchedUserInfo.userType === "doctor"
              ? "" // ? this.getClinicalInterests(userInformation)
              : ""}
          </Row>
          <Row className="mb-3">
            <Box>
              <CardTitle>
                <h3>
                  <u>
                    <strong>
                      About{" "}
                      {searchedUserInfo.userType === "doctor" ? "Dr " : ""}
                      {searchedUserInfo.userType === "patient" &&
                      searchedUserInfo.gender === "female"
                        ? "Ms. "
                        : ""}
                      {searchedUserInfo.userType === "patient" &&
                      searchedUserInfo.gender === "male"
                        ? "Mr. "
                        : ""}
                      {searchedUserInfo ? `${searchedUserInfo.lastName}` : ""}
                    </strong>
                  </u>
                </h3>
              </CardTitle>
              <Row>
                <Col>
                  <i>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.Ultrices sagittis orci a scelerisque purus semper
                      eget duis. Amet volutpat consequat mauris nunc congue nisi
                      vitae suscipit. Placerat orci nulla pellentesque dignissim
                      enim sit amet venenatis. Tincidunt eget nullam non nisi
                      est sit amet. Faucibus nisl tincidunt eget nullam non.
                      Elementum tempus egestas sed sed risus. Laoreet non
                      curabitur gravida arcu ac tortor dignissim. Ante metus
                      dictum at tempor commodo ullamcorper. Bibendum enim
                      facilisis gravida neque convallis acras. Dolor sed viverra
                      ipsum nunc aliquet bibendum enim facilisis. Turpis massa
                      tincidunt dui ut ornare lectus.{" "}
                    </p>
                    {/* <p>{userInformation.notes}</p> */}
                  </i>
                </Col>
              </Row>
            </Box>
          </Row>
        </Box>
      </Row>
    );
  }
}

OtherUserProfile.propTypes = {
  user: PropTypes.object.isRequired,
  getSearchedUserInfo: PropTypes.func.isRequired,
  getSearchedUserRelation: PropTypes.func.isRequired,
  removeFriend: PropTypes.func.isRequired,
  removeCareTeamMember: PropTypes.func.isRequired,
  sendRequest: PropTypes.func.isRequired,
  replyRequest: PropTypes.func.isRequired,
  cancelRequest: PropTypes.func.isRequired,
  getOutgoingRequests: PropTypes.func.isRequired,
  removeCircleOfTrust: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  requests: state.requests,
  relationships: state.relationships,
  searchresults: state.searchresults
});

const mapDispatchToProps = {
  getSearchedUserInfo,
  getSearchedUserRelation,
  removeFriend,
  removeCareTeamMember,
  sendRequest,
  replyRequest,
  cancelRequest,
  getOutgoingRequests,
  removeCircleOfTrust
};

export default connect(mapStateToProps, mapDispatchToProps)(OtherUserProfile);
