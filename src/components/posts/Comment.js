import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Form,
  FormGroup,
  Input,
  Button
} from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import avatar from "../../../static/frontend/assets/images/avatar.png";

import { getComments, deleteComment, editComment } from "../../actions/posts";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      editingComment: false,
      text: ""
    };
  }

  componentDidMount() {
    const { postId } = this.props;
    if (postId) {
      this.props.getComments(postId);
    }
    const { text } = this.props;
    this.setState({
      text
    });
  }

  toggleDropdown = () => {
    this.setState(prevState => ({
      isDropdownOpen: !prevState.isDropdownOpen
    }));
  };

  toggleEditMode = () => {
    this.setState(prevState => ({
      editingComment: !prevState.editingComment
    }));
  };

  handleUpdateComment = () => {
    const newComment = {
      text: this.state.text
    };
    const { postId, commentId } = this.props;
    this.props.editComment(postId, commentId, newComment);
    this.toggleEditMode();
  };

  handleDeleteComment = () => {
    const { postId, commentId } = this.props;
    this.props.deleteComment(postId, commentId);
  };

  handleChangeText = e => {
    this.setState({ text: e.target.value });
  };

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.text !== "") {
        this.handleUpdateComment();
      }
    }
  };

  render() {
    const {
      senderUsername,
      senderName,
      timestampCreated,
      timestampEdited
    } = this.props;
    const myUsername = this.props.user.userInfo.username;
    return (
      <div>
        <Row className="mb-2">
          <Col>
            <Row className="mb-2">
              <Col>
                <div className="wallPostNames">
                  <Link className="miniProfile_comment" to="#">
                    <img className="miniProfile_comment" src={avatar} />
                  </Link>
                  &nbsp;
                  <Link to={`/patient/${senderUsername}`}>
                    <strong style={{ fontSize: "15px" }}>{senderName}</strong>
                  </Link>
                </div>
              </Col>
            </Row>
            {this.state.editingComment ? (
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Input
                        type="textarea"
                        id="comment_text"
                        name="comment_text"
                        onChange={this.handleChangeText}
                        style={{ minHeight: "25px", maxHeight: "100px" }}
                        defaultValue={this.props.text}
                        onKeyDown={this.handleKeyDown}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      className="float-right"
                      color="secondary"
                      onClick={this.toggleEditMode}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="float-right mr-1"
                      color="primary"
                      onClick={this.handleUpdateComment}
                      disabled={this.state.text === ""}
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
            ) : (
              <Row>
                <Col>
                  <p style={{ fontSize: "15px" }}>{this.props.text}</p>
                </Col>
              </Row>
            )}
            {!this.state.editingComment ? (
              <Row>
                <Col>
                  <div className="float-left">
                    <i className="fa fa-clock-o fa-xs" />
                    &nbsp;
                    <span style={{ fontSize: "13px" }}>{timestampCreated}</span>
                  </div>
                </Col>
                {timestampEdited ? (
                  <Col>
                    <div className="float-right">
                      <i className="fa fa-clock-o fa-xs" />
                      &nbsp;
                      <span style={{ fontSize: "13px" }}>
                        Edited: {timestampEdited}
                      </span>
                    </div>
                  </Col>
                ) : null}
              </Row>
            ) : null}
          </Col>
          {myUsername === senderUsername && !this.state.editingComment ? (
            <Col md={1}>
              <Dropdown
                direction="right"
                isOpen={this.state.isDropdownOpen}
                toggle={this.toggleDropdown}
              >
                <DropdownToggle color="primary" tag="a">
                  <a>
                    <i className="fa fa-ellipsis-h fa-md optionsIconComment" />
                  </a>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.toggleEditMode}>
                    Edit
                  </DropdownItem>
                  <DropdownItem onClick={this.handleDeleteComment}>
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          ) : null}
        </Row>
      </div>
    );
  }
}

Comment.propTypes = {
  senderUsername: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  timestampCreated: PropTypes.any,
  timestampEdited: PropTypes.any,
  getComments: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  posts: state.posts
});

const mapDispatchToProps = {
  getComments,
  deleteComment,
  editComment
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
