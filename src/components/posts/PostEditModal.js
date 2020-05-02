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

import { editPost } from "../../actions/posts";
import axios from "axios";

const dictOptions = {
  text_post: { value: "text_post", label: "Text" },
  article_post: { value: "article_post", label: "Article" },
  doctor_recommendation_post: {
    value: "doctor_recommendation_post",
    label: "Doctor Recommendation"
  },
  appointment_post: { value: "appointment_post", label: "Appointment" },
  prescription_post: { value: "prescription_post", label: "Prescription" },
  personal_measurements: {
    value: "personal_measurements",
    label: "Personal Measurements"
  },
  medicine_dosage: { value: "medicine_dosage", label: "Medicine Dosage" }
};
const optionsType = [
  { value: "text_post", label: "Text" },
  { value: "article_post", label: "Article" },
  { value: "doctor_recommendation_post", label: "Doctor Recommendation" },
  { value: "appointment_post", label: "Appointment" },
  { value: "prescription_post", label: "Prescription" },
  { value: "personal_measurements", label: "Personal Measurements" },
  { value: "medicine_dosage", label: "Medicine Dosage" }
];
class PostEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      text: "",
      url: "",
      doctorRecommendation: "",
      loaded: false
    };
  }

  getPost = async (token, postId) => {
    // Headers
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      }
    };

    const resPost = await axios.get(`/app/posts/${postId}/`, config);
    return resPost.data;
  };

  componentDidUpdate() {
    const { token } = this.props.user;
    const { postId } = this.props;
    if (this.props.isOpen && !this.state.loaded) {
      this.getPost(token, postId).then(res => {
        const new_state = {
          type: res.type,
          text: res.text,
          loaded: true
        };
        if (res.doctorRecommendation) {
          new_state.doctorRecommendation = res.doctorRecommendation;
        } else if (res.url) {
          new_state.url = res.url;
        }
        this.setState(new_state);
      });
    }
  }

  handleUpdatePost = e => {
    e.preventDefault();
    const { type, text, url, doctorRecommendation } = this.state;
    const newPost = {
      type,
      text,
      url: "",
      doctorRecommendation: ""
    };
    if (type === "article_post") {
      newPost.url = url;
    }
    if (type === "doctor_recommendation_post") {
      newPost.doctorRecommendation = doctorRecommendation;
    }
    this.props.editPost(this.props.postId, newPost);
    this.props.toggle();
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSelectType = e => {
    this.setState({
      type: e ? e.value : null
    });
  };

  render() {
    const { type, text, url, doctorRecommendation } = this.state;

    if (!this.state.loaded) {
      return (
        <div className="myCentered">
          <h2>Loading...</h2>
          <div className="loader" />{" "}
        </div>
      );
    }
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader className="bg-secondary" toggle={this.props.toggle}>
          <span className="text-center text-white">Edit this Post</span>
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
                        value={dictOptions[type]}
                      />
                    </div>
                  </InputGroup>
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
                    value={text}
                  />
                </FormGroup>
              </Col>
            </Row>

            {type === "article_post" ? (
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
                        value={url}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
            {type === "doctor_recommendation_post" ? (
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
                      value={doctorRecommendation}
                    />
                  </FormGroup>
                </Col>
              </Row>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleUpdatePost}>
              Update
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

PostEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  receiverId: PropTypes.number.isRequired,
  editPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = { editPost };

export default connect(mapStateToProps, mapDispatchToProps)(PostEditModal);
