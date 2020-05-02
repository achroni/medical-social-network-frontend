import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardBody, CardTitle } from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import Select from "react-select";

import Box from "../cards/Box";
import BoxHeader from "../cards/BoxHeader";
import Post from "../posts/Post";
import PostForm from "../posts/PostForm";
import avatar from "../../../static/frontend/assets/images/avatar.png";

import { getMyPosts } from "../../actions/posts";
import { getTimeAgo } from "../../utils/helpers";
import { postTypeDict } from "../../utils/dicts";

const optionsType = [
  { value: "text_post", label: "Text" },
  { value: "article_post", label: "Article" },
  { value: "doctor_recommendation_post", label: "Doctor Recommendation" },
  { value: "appointment_post", label: "Appointment" },
  { value: "prescription_post", label: "Prescription" },
  { value: "personal_measurements", label: "Personal Measurements" },
  { value: "medicine_dosage", label: "Medicine Dosage" }
];

const now = new Date();
const events = [
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3))
  },
  {
    id: 15,
    title: "Point in Time Event",
    start: now,
    end: now
  }
];
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeFilter: null
    };
  }

  componentDidMount() {
    this.props.getMyPosts();
  }

  getPostList(posts) {
    let elements = Object.keys(posts);
    if (this.state.typeFilter) {
      elements = elements.filter(
        postId => posts[postId].type === this.state.typeFilter.value
      );
    }

    return (
      <>
        {elements
          .sort((a, b) => b - a)
          .map(postId => (
            <Row className="mb-3" key={postId}>
              <Post
                postId={posts[postId].postId}
                senderUsername={posts[postId].person.username}
                senderName={`${posts[postId].person.firstName} ${posts[postId].person.lastName}`}
                receiverUsername={posts[postId].person.username}
                receiverName={`${posts[postId].person.firstName} ${posts[postId].person.lastName}`}
                receiverId={posts[postId].person.user_id}
                timestamp={getTimeAgo(posts[postId].created)}
                text={posts[postId].text}
                type={postTypeDict[posts[postId].type]}
                url={posts[postId].url ? posts[postId].url : null}
                doctorRecommendation={
                  posts[postId].doctorRecommendation
                    ? posts[postId].doctorRecommendation
                    : null
                }
                postInfo={posts[postId]}
              ></Post>
            </Row>
          ))}
      </>
    );
  }

  handleFilterType = e => {
    this.setState({
      typeFilter: e ? e : null
    });
  };

  render() {
    const { userInfo, userType } = this.props.user;
    const { myPosts } = this.props.posts;
    const { score } =
      userType === "patient" ? this.props.healthscore.latestHealthScore : "";
    return (
      <div className="clearfix">
        <Row>
          <Col md="3">
            <Row className="mb-3">
              <Col>
                <Card style={{ minWidth: "130px" }}>
                  <CardBody>
                    <Row className="mb-2">
                      <Col>
                        <div className="circleWindow homepageProfilePic ">
                          <img
                            src={avatar}
                            className="mainProfilePic homepageProfilePic"
                          />
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col>
                        <p style={{ textAlign: "center" }}>
                          <strong>
                            {userInfo ? `${userInfo.username}` : ""}
                          </strong>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h5 style={{ textAlign: "center" }}>
                          <strong>
                            {userType === "doctor" ? "Dr " : ""}
                            {userInfo
                              ? `${userInfo.lastName} ${userInfo.firstName}`
                              : ""}
                          </strong>
                        </h5>
                      </Col>
                    </Row>
                    {userType === "doctor" ? (
                      <Row>
                        <Col>
                          <p style={{ textAlign: "center" }}>
                            {userInfo.specialization}
                          </p>
                        </Col>
                      </Row>
                    ) : null}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {userType === "patient" ? (
              <Row>
                <BoxHeader header="Latest Health Score">
                  <Row>
                    <Col>
                      {score ? (
                        <h5 style={{ textAlign: "center" }}>{score}%</h5>
                      ) : (
                        <p style={{ textAlign: "center" }}>
                          <strong>
                            You have not submitted any health score yet
                          </strong>
                        </p>
                      )}
                    </Col>
                  </Row>
                </BoxHeader>
              </Row>
            ) : null}
          </Col>
          <Col md="6">
            <Row className="mb-3">
              <Col>
                <PostForm />
              </Col>
            </Row>
            {userInfo ? this.getPostList(myPosts) : null}
          </Col>
          <Col md="3">
            <Row>
              <Box>
                <Row>
                  <Col>
                    <h5 style={{ textAlign: "center" }}>Filter Posts</h5>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <p style={{ textAlign: "center" }}>Type Of Post</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Select
                      id="typePost"
                      name="typePost"
                      options={optionsType}
                      onChange={this.handleFilterType}
                      placeholder={"Select..."}
                      isClearable
                    />
                  </Col>
                </Row>
              </Box>
            </Row>
            <Row className="mt-3">
              <BoxHeader header="Upcoming Events">
                {events.map(event => (
                  <div key={event.id}>
                    <CardTitle>
                      <u>{event.title}</u>
                    </CardTitle>
                    <p>{event.start.toDateString()}</p>
                    <p>
                      {event.start.toLocaleTimeString()} -
                      {event.end.toLocaleTimeString()}
                    </p>
                    <hr />
                  </div>
                ))}
              </BoxHeader>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
  getMyPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  posts: state.posts,
  healthscore: state.healthscore
});

const mapDispatchToProps = { getMyPosts };

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
