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
  Input
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getHealthScores, createHealthScore } from "../../actions/healthscore";

class HealthScoreModal extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newScore = {
      mobility: formData.get("radio1"),
      selfCare: formData.get("radio2"),
      usualActivities: formData.get("radio3"),
      painDiscomfort: formData.get("radio4"),
      anxietyDepression: formData.get("radio5")
    };
    this.props.createHealthScore(newScore);
    this.props.toggle();
  };

  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <Form onSubmit={this.handleSubmit}>
          <ModalBody>
            <legend style={{ textAlign: "center" }}>
              <strong>Questions</strong>
            </legend>
            <FormGroup tag="fieldset">
              <h5>MOBILITY</h5>
              <FormGroup check>
                <Input type="radio" name="radio1" value={1} required /> I have
                no problems in walking about
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio1" value={2} required /> I have
                some problems in walking about
              </FormGroup>
              <FormGroup check disabled>
                <Input type="radio" name="radio1" value={3} required /> I am
                confined to bed
              </FormGroup>
            </FormGroup>
            <FormGroup tag="fieldset">
              <h5>SELF-CARE</h5>
              <FormGroup check>
                <Input type="radio" name="radio2" value={1} required /> I have
                no problems with self-care
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio2" value={2} required /> I have
                some problems washing or dressing myself
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio2" value={3} required /> I am
                unable to wash or dress myself
              </FormGroup>
            </FormGroup>
            <FormGroup tag="fieldset">
              <h5>USUAL ACTIVITIES</h5>
              <FormGroup check>
                <Input type="radio" name="radio3" value={1} required /> I have
                no problems with performing my usual activities
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio3" value={2} required /> I have
                some problems with performing my usual activities
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio3" value={3} required /> I am
                unable to perform my usual activities
              </FormGroup>
            </FormGroup>
            <FormGroup tag="fieldset">
              <h5>PAIN/DISCOMFORT</h5>
              <FormGroup check>
                <Input type="radio" name="radio4" value={1} required /> I have
                no pain or discomfort
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio4" value={2} required /> I have
                moderate pain or discomfort
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio4" value={3} required /> I have
                extreme pain or discomfort
              </FormGroup>
            </FormGroup>
            <FormGroup tag="fieldset">
              <h5>ANXIETY/DEPRESSION</h5>
              <FormGroup check>
                <Input type="radio" name="radio5" value={1} required /> I am not
                anxious or depressed
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio5" value={2} required /> I am
                moderately anxious or depressed
              </FormGroup>
              <FormGroup check>
                <Input type="radio" name="radio5" value={3} required /> I am
                extremely anxious or depressed
              </FormGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" type="submit">
              Submit
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

HealthScoreModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  getHealthScores: PropTypes.func.isRequired,
  createHealthScore: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = { getHealthScores, createHealthScore };

export default connect(mapStateToProps, mapDispatchToProps)(HealthScoreModal);
