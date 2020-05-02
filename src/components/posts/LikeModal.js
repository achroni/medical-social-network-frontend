import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";
import Select from "react-select";

import Box from "../cards/Box";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import avatar from "../../../static/frontend/assets/images/avatar.png";

export default class LikeModal extends Component {
  getLikePersonList = elements => (
    <>
      {elements.map((object, i) => (
        <Row className="mb-3" key={i}>
          <Box>
            <Row>
              <Col md={3}>
                <Link className="miniProfile_wall_link" to="#">
                  <img className="miniProfile_wall" src={avatar} />
                </Link>
              </Col>
              <Col md={7}>
                <Link to={`/patient/${object.person.username}`}>
                  <strong>
                    {object.person.firstName} {object.person.lastName}
                  </strong>
                </Link>
              </Col>
            </Row>
          </Box>
        </Row>
      ))}
    </>
  );

  render() {
    const { likeList } = this.props;
    if (!likeList) {
      return (
        <div className="myCentered">
          <h2>Loading...</h2>
          <div className="loader" />{" "}
        </div>
      );
    }
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader
          toggle={this.props.toggle}
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          <Row>
            <Col>
              <strong>
                Who likes it <i className="fa fa-heart-o" />
              </strong>
            </Col>
          </Row>
        </ModalHeader>
        <ModalBody
          style={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}
        >
          <Row>
            <Col>{this.getLikePersonList(likeList)}</Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

LikeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  likeList: PropTypes.any
};
