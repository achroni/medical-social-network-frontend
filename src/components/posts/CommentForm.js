import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Input,
  Card,
  CardBody,
  Button,
  Row,
  Col
} from "reactstrap";

import avatar from "../../../static/frontend/assets/images/avatar.png";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createComment } from "../../actions/posts";

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment_text: ""
    };
  }

  handleCreateComment = e => {
    if (e) {
      e.preventDefault();
    }

    const { comment_text } = this.state;
    const comment = {
      text: [comment_text]
    };
    this.props.createComment(comment, this.props.postId);
    this.setState({ comment_text: "" });
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.comment_text !== "") {
        this.handleCreateComment();
      }
    }
  };

  render() {
    return (
      <Form action="" method="post">
        <Row className="mb-2">
          <Col md={1}>
            <Link to="#">
              <img className="miniProfile_comment" src={avatar} />
            </Link>
          </Col>
          <Col>
            <FormGroup>
              <Input
                type="textarea"
                id="comment_text"
                name="comment_text"
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
                placeholder="Add a comment ..."
                style={{ minHeight: "25px", maxHeight: "100px" }}
                value={this.state.comment_text}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              type="submit"
              size="sm"
              color="primary"
              className="float-right"
              onClick={this.handleCreateComment}
              disabled={this.state.comment_text === ""}
            >
              Post &nbsp;
              <i className="fa fa-share" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = { createComment };

export default connect(mapStateToProps, mapDispatchToProps)(CommentForm);
