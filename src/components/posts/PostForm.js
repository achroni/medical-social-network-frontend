import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col } from "reactstrap";

import avatar from "../../../static/frontend/assets/images/avatar.png";

import PostModal from "./PostModal";
import Box from "../cards/Box";

export default class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen
    }));
  };

  render() {
    return (
      <>
        <PostModal isOpen={this.state.isModalOpen} toggle={this.toggleModal} />
        <Row>
          <Box>
            <Row className="mb-2">
              <Col md={1}>
                <img className="miniProfile_wall" src={avatar} />
              </Col>
              <Col md={11}>
                <Button
                  size="md"
                  color="primary"
                  className="float-right"
                  onClick={this.toggleModal}
                >
                  Create a Post &nbsp;
                  <i className="fa fa-share" />
                </Button>
              </Col>
            </Row>
          </Box>
        </Row>
      </>
    );
  }
}
