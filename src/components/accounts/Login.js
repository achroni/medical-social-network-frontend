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
  Button,
  Row,
  Col
} from "reactstrap";
import { login } from "../../actions/user";

import home_img from "../../../static/frontend/assets/images/home.jpeg";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.login(this.state.username, this.state.password);
  };

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/homepage" />;
    }
    return (
      <div>
        <Row>
          <Col md={8}>
            <section
              style={{
                backgroundImage: `url(${home_img})`
              }}
            >
              <div
                style={{
                  marginLeft: "70px",
                  marginRight: "70px",
                  minHeight: "400px"
                }}
              >
                <br />
                <br />
                <Row>
                  <Col>
                    <br />
                    <h1 align="center">
                      Welcome to <strong>Impilo</strong>
                    </h1>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <br />
                    <h3 align="center">
                      The Impilo Project provides a secure world to save your
                      medical history.
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <br />
                    <h6 align="center">
                      You have the opportunity to connect with your closest
                      doctors and people and share your health status with them.
                    </h6>
                  </Col>
                </Row>
              </div>
            </section>

            {/* <Row>
              <Col>
                <img
                  src={home_img}
                  // className="mainProfilePic profilepageProfilePic"
                />
              </Col>
            </Row> */}
          </Col>
          <Col md={4}>
            <Card>
              <CardHeader>
                <strong>Log in</strong>
              </CardHeader>
              <Form
                action=""
                method="post"
                onSubmit={this.handleSubmit}
                onReset={this.handleReset}
              >
                <CardBody>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      onChange={this.handleChange}
                      required
                    />
                    <FormText className="help-block">
                      Please enter your username
                    </FormText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      onChange={this.handleChange}
                      required
                    />
                    <FormText className="help-block">
                      Please enter your password
                    </FormText>
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary">
                    <i className="fa fa-dot-circle-o"></i> Log In
                  </Button>
                </CardFooter>
              </Form>
            </Card>
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
