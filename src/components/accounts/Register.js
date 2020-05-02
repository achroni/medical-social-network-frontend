import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Row,
  Col
} from "reactstrap";
import { createDoctor, createPatient } from "../../actions/user";
import { returnErrors } from "../../actions/messages";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      notes: "",
      specialization: "",
      telephone: "",
      usertype: "",
      username: "",
      email: "",
      password: "",
      password2: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      notes,
      specialization,
      telephone,
      usertype,
      username,
      email,
      password,
      password2
    } = this.state;

    if (password !== password2) {
      this.props.returnErrors({
        passwordsNotMatch: ["Passwords do not match"]
      });
    } else {
      if (usertype === "patient") {
        const newPatient = {
          user: {
            username,
            password,
            email
          },
          firstName,
          lastName,
          dateOfBirth,
          gender,
          notes,
          telephone
        };
        this.props.createPatient(newPatient);
      }
      if (usertype === "doctor") {
        const newDoctor = {
          user: {
            username,
            password,
            email
          },
          firstName,
          lastName,
          dateOfBirth,
          gender,
          notes,
          specialization,
          telephone
        };
        this.props.createDoctor(newDoctor);
      }
    }
  };

  handleReset = () =>
    this.setState({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      notes: "",
      specialization: "",
      telephone: "",
      usertype: "",
      username: "",
      email: "",
      password: "",
      password2: ""
    });

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/homepage" />;
    }
    return (
      <div>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Card>
              <CardHeader>
                <strong>Register</strong>
              </CardHeader>
              <Form
                action=""
                method="post"
                onSubmit={this.handleSubmit}
                onReset={this.handleReset}
              >
                <CardBody>
                  <Label>
                    <strong>Are you a doctor or a patient?</strong>
                  </Label>
                  <FormGroup row style={{ margin: "0 auto" }}>
                    <FormGroup check inline>
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="doctor"
                        name="usertype"
                        value="doctor"
                        onChange={this.handleChange}
                        checked={this.state.usertype === "doctor"}
                        required
                      />
                      <Label
                        className="form-check-label"
                        check
                        htmlFor="doctor"
                      >
                        Doctor
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input
                        className="form-check-input"
                        type="radio"
                        id="patient"
                        name="usertype"
                        value="patient"
                        onChange={this.handleChange}
                        checked={this.state.usertype === "patient"}
                        required
                      />
                      <Label
                        className="form-check-label"
                        check
                        htmlFor="patient"
                      >
                        Patient
                      </Label>
                    </FormGroup>
                  </FormGroup>
                  <br />
                  <FormGroup>
                    <Label>
                      <strong>Enter your personal info</strong>
                    </Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-male" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        onChange={this.handleChange}
                        placeholder="First Name"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-male" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        onChange={this.handleChange}
                        placeholder="Last Name"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-calendar" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        onChange={this.handleChange}
                        placeholder="date placeholder"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-intersex" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        name="gender"
                        id="gender"
                        onChange={this.handleChange}
                        placeholder="Gender"
                        required
                      >
                        <option value="" disabled selected>
                          Gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-sticky-note-o" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="textarea"
                        id="notes"
                        name="notes"
                        onChange={this.handleChange}
                        placeholder="Write down notes here"
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-phone" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="telephone"
                        name="telephone"
                        onChange={this.handleChange}
                        placeholder="Phone Number"
                      />
                    </InputGroup>
                  </FormGroup>
                  {this.state.usertype === "doctor" ? (
                    <FormGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-medkit" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="specialization"
                          name="specialization"
                          onChange={this.handleChange}
                          placeholder="Speciality"
                        />
                      </InputGroup>
                    </FormGroup>
                  ) : null}
                  <Label>
                    <strong>Enter your account info</strong>
                  </Label>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        id="username"
                        name="username"
                        onChange={this.handleChange}
                        placeholder="Username"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-envelope" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        onChange={this.handleChange}
                        placeholder="Email"
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-asterisk" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        onChange={this.handleChange}
                        placeholder="Password"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fa fa-asterisk" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        id="password2"
                        name="password2"
                        autoComplete="current-password"
                        onChange={this.handleChange}
                        placeholder="Repeat Password"
                        required
                      />
                    </InputGroup>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary">
                    <i className="fa fa-dot-circle-o"></i> Sign Up
                  </Button>
                  <Button type="reset" size="sm" color="danger">
                    <i className="fa fa-ban"></i> Reset
                  </Button>
                </CardFooter>
              </Form>
            </Card>
            <p>
              Already have an account? <Link to="/">Log In</Link>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

Register.propTypes = {
  createDoctor: PropTypes.func.isRequired,
  createPatient: PropTypes.func.isRequired,
  returnErrors: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = { createDoctor, createPatient, returnErrors };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
