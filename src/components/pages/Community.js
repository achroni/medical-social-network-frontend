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

import Select, { components } from "react-select";

import avatar from "../../../static/frontend/assets/images/avatar.png";
import Box from "../cards/Box";

import { loadCoT } from "../../actions/user";
import { getRequests, replyRequest, sendRequest } from "../../actions/requests";
import {
  getMyFriends,
  getNonFriends,
  removeFriend,
  getCareTeam,
  getNonCareTeam,
  removeCareTeamMember,
  getCircleOfTrust,
  getNonCircleOfTrust,
  removeCircleOfTrust,
  getProtectedMembers,
  removeProtectedMember
} from "../../actions/relationships";

import { sendRequestUrlDict } from "../../utils/dicts";

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTab: "1",
      isModalOpen: false,
      isDropdownOpen: false,
      userIdToBeFriend: null
    };
  }

  componentDidMount() {
    const { modeCoT } = this.props.user;
    this.props.getRequests();
    this.props.getMyFriends();
    this.props.getCareTeam();
    this.props.getCircleOfTrust();
    this.props.getNonFriends();
    this.props.getNonCircleOfTrust();
    this.props.getNonCareTeam();

    if (!modeCoT) {
      this.props.getProtectedMembers();
    }
  }

  toggle = tab => {
    this.setState({
      openTab: tab
    });
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }));
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  handleChange = e => {
    this.setState({
      userIdToBeFriend: e ? e.value : null
    });
  };

  handleSendRequest = requestType => {
    const { modeCoT } = this.props.user;
    const req =
      modeCoT && requestType === "care_team_doctor"
        ? "care_team"
        : sendRequestUrlDict[requestType];

    this.props.sendRequest(this.state.userIdToBeFriend, req);
  };

  handleAcceptDecline = (notificationId, requestType, response) => {
    this.props.replyRequest(notificationId, requestType, response);
  };

  handleUnfriend = (userId, requestType) => {
    if (requestType === "friend") this.props.removeFriend(userId);
    if (requestType === "care_team") this.props.removeCareTeamMember(userId);
    if (requestType === "circle_of_trust")
      this.props.removeCircleOfTrust(userId);
    if (requestType === "protected_member")
      this.props.removeProtectedMember(userId);
  };

  loadCircleOfTrust = userId => {
    this.props.loadCoT(userId);
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
                  <Link
                    to={`/${
                      requestType === "care_team_requests"
                        ? "doctor"
                        : "patient"
                    }/${req.username}`}
                  >
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

  getAddNewFriends(listType, nonFriends) {
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
                isDisabled={!nonFriends.length}
                onChange={this.handleChange}
                options={nonFriends}
                placeholder={
                  nonFriends.length
                    ? "Search for new friends"
                    : "No persons available to add..."
                }
              />
            </Col>
            <Col md={3}>
              <Button
                color="primary"
                block
                onClick={() => {
                  this.handleSendRequest(listType);
                }}
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

  getProtectedList(elements, listType) {
    return (
      <>
        {elements.map(friend => (
          <Box key={friend.user_id} size={6} colClassNames="mb-3">
            <Row>
              <Col md={8}>
                <Row>
                  <Col>
                    <Link className="requestProfilePic" to="#">
                      <img src={avatar} className="requestProfilePic" />
                    </Link>
                  </Col>
                  <Col>
                    <Link
                      to={`/${
                        listType === "care_team" ? "doctor" : "patient"
                      }/${friend.username}`}
                    >
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
                </Row>
              </Col>
              <Col md={4}>
                <Row className="mb-1">
                  <Col>
                    <Button color="secondary" block>
                      <Link
                        to="/homepage"
                        onClick={() => {
                          this.loadCircleOfTrust(friend.user_id);
                        }}
                      >
                        {" "}
                        Enter
                      </Link>
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      onClick={() => {
                        this.handleUnfriend(friend.user_id, "protected_member");
                      }}
                      color="danger"
                      block
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Box>
        ))}
      </>
    );
  }

  getFriendList(elements, listType) {
    return (
      <>
        {elements.map(friend => (
          <Box key={friend.user_id} size={6} colClassNames="mb-3">
            <Row>
              <Col md={3}>
                <Link className="requestProfilePic" to="#">
                  <img src={avatar} className="requestProfilePic" />
                </Link>
              </Col>
              <Col md={5}>
                <Link
                  to={`/${listType === "care_team" ? "doctor" : "patient"}/${
                    friend.username
                  }`}
                >
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
                    this.handleUnfriend(friend.user_id, listType);
                  }}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </Box>
        ))}
      </>
    );
  }

  render() {
    const {
      isLoading,
      friendRequests,
      careTeamRequests,
      circleOfTrustRequests
    } = this.props.requests;
    const {
      myFriends,
      myCareTeam,
      myCircleOfTrust,
      myProtectedMembers,
      isLoadingNonFriends,
      isLoadingNonCareTeam,
      isLoadingNonCircleOfTrust
    } = this.props.relationships;
    const { modeCoT } = this.props.user;

    if (
      isLoading ||
      isLoadingNonFriends ||
      isLoadingNonCareTeam ||
      isLoadingNonCircleOfTrust
    ) {
      return (
        <div className="myCentered">
          <h2>Loading...</h2>
          <div className="loader" />{" "}
        </div>
      );
    }

    const nonFriends = this.getOptions(this.props.relationships.nonFriends);
    const nonCircleOfTrust = this.getOptions(
      this.props.relationships.nonCircleOfTrust
    );
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
              Friends
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.openTab === "3" })}
              onClick={() => {
                this.toggle("3");
              }}
            >
              Circle of Trust
            </NavLink>
          </NavItem>
          {!modeCoT ? (
            <>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.openTab === "4" })}
                  onClick={() => {
                    this.toggle("4");
                  }}
                >
                  Protected Members
                </NavLink>
              </NavItem>
            </>
          ) : null}

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.openTab === "5" })}
              onClick={() => {
                this.toggle("5");
              }}
            >
              Care Team
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.openTab}>
          <TabPane tabId="1">
            <Row className="mt-4">
              <Col>
                <Row className="mb-4">
                  <Box>
                    <CardTitle>
                      {friendRequests.length > 0 ? (
                        <strong>Answer to Friend Requests</strong>
                      ) : (
                        <h6>You have no Friend Requests</h6>
                      )}
                    </CardTitle>
                    {this.getRequestList(friendRequests, "friend_requests")}
                  </Box>
                </Row>
                <Row className="mb-4">
                  <Box>
                    <CardTitle>
                      {circleOfTrustRequests.length > 0 ? (
                        <strong>Answer to Circle Of Trust Requests</strong>
                      ) : (
                        <h6>You have no Circle Of Trust Requests</h6>
                      )}
                    </CardTitle>
                    {this.getRequestList(
                      circleOfTrustRequests,
                      "circle_of_trust"
                    )}
                  </Box>
                </Row>
                <Row className="mb-4">
                  <Box>
                    <CardTitle>
                      {careTeamRequests.length > 0 ? (
                        <strong>Answer to Care Team Requests</strong>
                      ) : (
                        <h6>You have no Care Team Requests</h6>
                      )}
                    </CardTitle>
                    {this.getRequestList(
                      careTeamRequests,
                      "care_team_requests"
                    )}
                  </Box>
                </Row>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row className="mt-4">
              <Box>
                {this.getAddNewFriends("friend", nonFriends)}
                {myFriends.length > 0 ? (
                  <Row>{this.getFriendList(myFriends, "friend")}</Row>
                ) : (
                  <Row>
                    <Col sm="12">
                      <div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <h3 className="myCentered">You have no friends</h3>
                      </div>
                    </Col>
                  </Row>
                )}
              </Box>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row className="mt-4">
              <Box>
                {this.getAddNewFriends("circle_of_trust", nonCircleOfTrust)}
                {myCircleOfTrust.length > 0 ? (
                  <Row>
                    {this.getFriendList(myCircleOfTrust, "circle_of_trust")}
                  </Row>
                ) : (
                  <Row>
                    <Col sm="12">
                      <div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <h3 className="myCentered">
                          You have no Circle Of Trust
                        </h3>
                      </div>
                    </Col>
                  </Row>
                )}
              </Box>
            </Row>
          </TabPane>
          {!modeCoT ? (
            <>
              {" "}
              <TabPane tabId="4">
                <Row className="mt-4">
                  <Box>
                    {myProtectedMembers.length > 0 ? (
                      <Row>
                        {this.getProtectedList(
                          myProtectedMembers,
                          "circle_of_trust"
                        )}
                      </Row>
                    ) : (
                      <Row>
                        <Col sm="12">
                          <div>
                            <br />
                            <br />
                            <br />
                            <br />
                            <h3 className="myCentered">
                              You have no Circle Of Trust
                            </h3>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Box>
                </Row>
              </TabPane>
            </>
          ) : null}

          <TabPane tabId="5">
            <Row className="mt-4">
              <Box>
                {this.getAddNewFriends("care_team_doctor", nonCareTeam)}
                {myCareTeam.length > 0 ? (
                  <Row>{this.getFriendList(myCareTeam, "care_team")}</Row>
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

Community.propTypes = {
  getRequests: PropTypes.func.isRequired,
  replyRequest: PropTypes.func.isRequired,
  sendRequest: PropTypes.func.isRequired,
  requests: PropTypes.any,
  getMyFriends: PropTypes.func.isRequired,
  getNonFriends: PropTypes.func.isRequired,
  removeFriend: PropTypes.func.isRequired,
  getCareTeam: PropTypes.func.isRequired,
  getNonCareTeam: PropTypes.func.isRequired,
  removeCareTeamMember: PropTypes.func.isRequired,
  getCircleOfTrust: PropTypes.func.isRequired,
  getNonCircleOfTrust: PropTypes.func.isRequired,
  removeCircleOfTrust: PropTypes.func.isRequired,
  getProtectedMembers: PropTypes.func.isRequired,
  removeProtectedMember: PropTypes.func.isRequired,
  loadCoT: PropTypes.func.isRequired,
  relationships: PropTypes.any
};

const mapStateToProps = state => ({
  user: state.user,
  requests: state.requests,
  relationships: state.relationships
});

const mapDispatchToProps = {
  getRequests,
  replyRequest,
  sendRequest,
  getMyFriends,
  getNonFriends,
  removeFriend,
  getCareTeam,
  getNonCareTeam,
  removeCareTeamMember,
  removeCircleOfTrust,
  getCircleOfTrust,
  getNonCircleOfTrust,
  getProtectedMembers,
  removeProtectedMember,
  loadCoT
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);
