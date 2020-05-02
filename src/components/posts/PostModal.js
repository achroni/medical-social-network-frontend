import React, { Component } from "react";
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

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { createPost } from "../../actions/posts";
import avatar from "../../../static/frontend/assets/images/avatar.png";

const optionsType = [
  { value: "text_post", label: "Text" },
  { value: "article_post", label: "Article" },
  { value: "doctor_recommendation_post", label: "Doctor Recommendation" },
  { value: "appointment_post", label: "Appointment" },
  { value: "prescription_post", label: "Prescription" },
  { value: "personal_measurements", label: "Personal Measurements" },
  { value: "medicine_dosage", label: "Medicine Dosage" }
];
class PostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: { value: "text_post", label: "Text" },
      text: "",
      url: "",
      doctorRecommendation: "",
      receiver: ""
    };
  }

  handleCreatePost = e => {
    e.preventDefault();
    const { type, text, url, doctorRecommendation, receiver } = this.state;
    const post = {
      type: type.value,
      text
    };
    if (receiver.value !== "") {
      post.user = receiver.value;
    }
    if (type.value === "doctor_recommendation_post") {
      post.doctorRecommendation = doctorRecommendation;
    } else if (type.value === "article_post") {
      post.url = url;
    }

    this.props.createPost(post);
    this.props.toggle();
    this.setState({
      type: { value: "text_post", label: "Text" },
      text: "",
      url: "",
      doctorRecommendation: "",
      receiver: ""
    });
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelectType = e => {
    this.setState({
      type: e ? e : null
    });
  };

  handleSelectReceiver = e => {
    this.setState({
      receiver: e ? e : null
    });
  };

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

  render() {
    const { myCareTeam, myProtectedMembers } = this.props.relationships;
    const { modeCoT } = this.props.user;
    let friends = null;
    if (!modeCoT) {
      friends =
        this.props.user.userType === "patient"
          ? this.getOptions(myProtectedMembers)
          : this.getOptions(myCareTeam);
    }
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader className="bg-primary" toggle={this.props.toggle}>
          <span className="text-center text-white">Create a Post</span>
        </ModalHeader>
        <Form>
          <ModalBody>
            <Row>
              <Col>
                <FormGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-bookmark-o" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <div style={{ width: "418px" }}>
                      <Select
                        id="typePost"
                        name="typePost"
                        options={optionsType}
                        onChange={this.handleSelectType}
                        placeholder={"Select the type of post"}
                        value={this.state.type}
                        isRequired
                      />
                    </div>
                  </InputGroup>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  {friends ? (
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-address-book-o" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <div style={{ width: "415px" }}>
                        <Select
                          formatOptionLabel={this.formatOptionLabel}
                          isClearable
                          isSearchable
                          onChange={this.handleSelectReceiver}
                          options={friends}
                          placeholder={
                            this.props.user.userType === "doctor"
                              ? "Select a patient to post"
                              : "Post to other User"
                          }
                          value={this.state.receiver}
                        />
                      </div>
                    </InputGroup>
                  ) : null}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                Text:
                <FormGroup>
                  <Input
                    type="textarea"
                    id="text"
                    name="text"
                    placeholder="Write down here"
                    style={{ minHeight: "120px", maxHeight: "250px" }}
                    onChange={this.handleInputChange}
                    value={this.state.text}
                  />
                </FormGroup>
              </Col>
            </Row>

            {this.state.type.value === "article_post" ? (
              <Row>
                <Col>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-link" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="your website goes here"
                        pattern="https?://.+"
                        onChange={this.handleInputChange}
                        isRequired
                        value={this.state.url}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
            {this.state.type.value === "doctor_recommendation_post" ? (
              <Row>
                <Col>
                  Doctor Recommendation:
                  <FormGroup>
                    <Input
                      type="textarea"
                      id="doctorRecommendation"
                      name="doctorRecommendation"
                      placeholder="Write down here"
                      style={{ minHeight: "120px", maxHeight: "250px" }}
                      onChange={this.handleInputChange}
                      value={this.state.doctorRecommendation}
                    />
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.handleCreatePost}
              disabled={
                this.props.user.userType === "doctor" && !this.state.receiver
              }
            >
              Post
            </Button>
            <Button color="secondary" onClick={this.props.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

PostModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  relationships: state.relationships
});

const mapDispatchToProps = { createPost };

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
