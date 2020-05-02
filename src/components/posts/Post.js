import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button
} from "reactstrap";
import Comment from "./Comment";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ReactTinyLink } from "react-tiny-link";

import avatar from "../../../static/frontend/assets/images/avatar.png";
import CommentForm from "./CommentForm";
import Box from "../cards/Box";
import PostEditModal from "./PostEditModal";
import LikeModal from "./LikeModal";

import {
  deletePost,
  getComments,
  getLikes,
  likePost,
  unlikePost
} from "../../actions/posts";
import { getTimeAgo } from "../../utils/helpers";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isCommentsOpen: false,
      isLikeSelected: false,
      isEditModalOpen: false,
      isLikeModalOpen: false,
      isMounted: false
    };
  }
  componentDidMount() {
    const { postId } = this.props;
    if (postId) {
      this.props.getComments(postId);
      this.props.getLikes(postId);
    }
  }

  componentDidUpdate(prevProps) {
    const { postId } = this.props;
    const userId = this.props.user.userInfo.user_id;
    const { myLikes } = this.props.posts;

    if (
      !this.state.isMounted &&
      myLikes[postId] &&
      myLikes[postId].length !== 0
    ) {
      const found = myLikes[postId].find(
        likePerson => likePerson.person.user_id === userId
      );
      this.setState({
        isLikeSelected: found ? true : false,
        isMounted: true
      });
    }
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };
  toggleComments = () => {
    this.setState(prevState => ({
      isCommentsOpen: !prevState.isCommentsOpen
    }));
  };
  toggleLike = () => {
    this.setState(prevState => ({
      isLikeSelected: !prevState.isLikeSelected
    }));
  };

  toggleModal = () => {
    this.setState(prevState => ({
      isEditModalOpen: !prevState.isEditModalOpen
    }));
  };

  toggleLikeModal = () => {
    this.setState(prevState => ({
      isLikeModalOpen: !prevState.isLikeModalOpen
    }));
  };

  handleDeletePost = postId => {
    this.props.deletePost(postId);
  };

  handleLike = postId => {
    if (this.state.isLikeSelected) {
      this.props.unlikePost(postId);
    } else {
      this.props.likePost(postId);
    }
    this.toggleLike();
  };

  getCommentList = (elements, postId) => (
    <>
      {elements.reverse().map((object, i) => (
        <Row className="mt-3" key={i}>
          <Box cardBodyClassNames="pt-2 pb-0">
            <Comment
              senderUsername={object.username}
              senderName={`${object.firstName} ${object.lastName}`}
              timestampCreated={getTimeAgo(object.dateCreated)}
              timestampEdited={
                object.dateModified ? getTimeAgo(object.dateModified) : null
              }
              text={object.text}
              commentId={object.id}
              postId={postId}
            ></Comment>
          </Box>
        </Row>
      ))}
      <br />
      <Row>
        <Box>
          <CommentForm postId={postId} />
        </Box>
      </Row>
    </>
  );

  render() {
    const myUsername = this.props.user.userInfo.username;
    const {
      postId,
      receiverUsername,
      receiverName,
      receiverId,
      timestamp,
      text,
      type,
      url,
      doctorRecommendation,
      postInfo
    } = this.props;

    let { senderUsername, senderName } = this.props;
    if (postInfo.care_team !== null) {
      senderUsername = postInfo.care_team.username;
      senderName = `${postInfo.care_team.firstName} ${postInfo.care_team.lastName}`;
    } else if (postInfo.circle_of_trust !== null) {
      senderUsername = postInfo.circle_of_trust.username;
      senderName = `${postInfo.circle_of_trust.firstName} ${postInfo.circle_of_trust.lastName}`;
    }
    const { myComments, myLikes } = this.props.posts;
    return (
      <Col>
        <PostEditModal
          postId={postId}
          receiverId={receiverId}
          isOpen={this.state.isEditModalOpen}
          toggle={this.toggleModal}
        />
        <LikeModal
          likeList={myLikes[postId]}
          isOpen={this.state.isLikeModalOpen}
          toggle={this.toggleLikeModal}
        />
        <Card>
          <CardHeader>
            <Row className="mb-1">
              <Col md={1} className="pl-1 pr-4">
                <Link
                  className="miniProfile_wall_link"
                  to={`/${
                    postInfo.care_team ? "doctor" : "patient"
                  }/${senderUsername}`}
                >
                  <img className="miniProfile_wall" src={avatar} />
                </Link>
              </Col>
              <Col
                md={myUsername === senderUsername ? 7 : 8}
                className="pl-2 pr-0"
              >
                <Row>
                  <Col>
                    <div className="wallPostNames">
                      <Link
                        to={`/${
                          postInfo.care_team ? "doctor" : "patient"
                        }/${senderUsername}`}
                      >
                        <strong>{senderName}</strong>
                      </Link>
                      <i
                        className="fa fa-caret-right"
                        style={{ paddingLeft: "1%", paddingRight: "1%" }}
                      />
                      <Link to={`/patient/${receiverUsername}`}>
                        <strong>{receiverName}</strong>
                      </Link>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <span
                    className="ml-5"
                    style={{
                      color: "#b2b2b2",
                      fontSize: "14px"
                    }}
                  >
                    {type}
                  </span>
                </Row>
              </Col>
              <Col
                md={3}
                className={
                  myUsername === senderUsername ? "pl-0 pr-0" : "pl-0 pr-3"
                }
              >
                <div className="float-right">
                  <i className="fa fa-clock-o fa-xs" />
                  &nbsp;
                  <small>{timestamp}</small>
                </div>
              </Col>
              {myUsername === senderUsername ? (
                <Col md={1} className="pl-0 pr-2">
                  <Dropdown
                    direction="right"
                    isOpen={this.state.isDropdownOpen}
                    toggle={this.toggleDropdown}
                    className="float-right"
                  >
                    <DropdownToggle color="primary" tag="a">
                      <i className="fa fa-ellipsis-v fa-lg optionsIcon" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={this.toggleModal}>
                        Edit
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          this.handleDeletePost(postId);
                        }}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </Col>
              ) : null}
            </Row>
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <p>{text}</p>
              </Col>
            </Row>
            {url ? (
              <Row>
                <Col>
                  <ReactTinyLink
                    cardSize="small"
                    showGraphic={true}
                    maxLine={2}
                    minLine={1}
                    url={url}
                  />
                </Col>
              </Row>
            ) : null}
            {doctorRecommendation ? (
              <Row>
                <Col>
                  <strong>
                    <u>Doctor Recommendation:</u>
                  </strong>
                  <p> {doctorRecommendation}</p>
                </Col>
              </Row>
            ) : null}

            <Row className="mt-1">
              <Col md={9}>
                {myLikes[postId] && myLikes[postId].length ? (
                  <Link to="#" onClick={this.toggleLikeModal}>
                    <small>{myLikes[postId].length} Likes</small>
                  </Link>
                ) : null}
              </Col>
              <Col md={3}>
                {myComments[postId] && myComments[postId].length ? (
                  <small>{myComments[postId].length} Comments</small>
                ) : null}
              </Col>
            </Row>

            <hr />
            <Row>
              <Col>
                <Button
                  block
                  outline
                  color="info"
                  onClick={() => {
                    this.handleLike(postId);
                  }}
                  active={this.state.isLikeSelected}
                >
                  <i className="fa fa-heart-o" /> Like &nbsp;
                </Button>
              </Col>

              <Col>
                <Button
                  block
                  outline
                  color="info"
                  onClick={this.toggleComments}
                  active={this.state.isCommentsOpen}
                >
                  <i className="fa fa-comments-o" /> Comments &nbsp;
                  {this.state.isCommentsOpen ? (
                    <i className="fa fa-chevron-down" />
                  ) : (
                    <i className="fa fa-chevron-up" />
                  )}
                </Button>
              </Col>
            </Row>
            {this.state.isCommentsOpen
              ? this.getCommentList(myComments[postId], postId)
              : null}
          </CardBody>
        </Card>
      </Col>
    );
  }
}

Post.propTypes = {
  children: PropTypes.any,
  deletePost: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  getLikes: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  senderUsername: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
  receiverUsername: PropTypes.string.isRequired,
  receiverId: PropTypes.number.isRequired,
  receiverName: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.any,
  postInfo: PropTypes.any
};

const mapStateToProps = state => ({
  user: state.user,
  posts: state.posts
});

const mapDispatchToProps = {
  deletePost,
  getComments,
  getLikes,
  likePost,
  unlikePost
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
