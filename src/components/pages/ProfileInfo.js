import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import avatar from "../../../static/frontend/assets/images/avatar.png";

import Select from "react-select";
import Box from "../cards/Box";

const optionsSpeciality = [
  { value: "general", label: "General Practitioner" },
  { value: "cardiologist", label: "Cardiologist" },
  { value: "audiologist", label: "Audiologist" },
  { value: "allergist", label: "Allergist" },
  { value: "anesthesiologist", label: "Anesthesiologist" },
  { value: "dentist", label: "Dentist" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "endocrinologist", label: "Endocrinologist" },
  { value: "epidemiologist", label: "Epidemiologist" },
  { value: "gynecologist", label: "Gynecologist" },
  { value: "immunologist", label: "Immunologist" },
  { value: "med_geneticist", label: "Medical Geneticist" },
  { value: "microbiologist", label: "Microbiologist" },
  { value: "neonatologist", label: "Neonatologist" },
  { value: "neurologist", label: "Neurologist" },
  { value: "neurosurgeon", label: "Neurosurgeon" },
  { value: "obstetrician", label: "Obstetrician" },
  { value: "orthopedic", label: "Orthopedic Surgeon" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "physiologist", label: "Physiologist" },
  { value: "plastic_surgeon", label: "Plastic Surgeon" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "rheumatologist", label: "Rheumatologist" },
  { value: "surgeon", label: "Surgeon" },
  { value: "urologist", label: "Urologist" }
];
const optionsInterests = [
  { value: "epidimiology", label: "Epidimiology" },
  { value: "cancer", label: "Cancer Research" },
  { value: "autoimmune", label: "Autoimmune Diseases" },
  { value: "alcohol_drinking", label: "Alcohol Drinking" },
  { value: "communicable_diseases", label: "Communicable Diseasesg" },
  { value: "hepatitis_c", label: "Hepatitis C" },
  { value: "mycobacterium_tuberculosis", label: "Mycobacterium tuberculosis" },
  {
    value: "sexually_transmitted_diseases",
    label: "Sexually Transmitted Diseases"
  },
  {
    value: "substance_related_disorders",
    label: "Substance-Related Disorders"
  },

  { value: "hiv", label: "HIV" },
  { value: "hiv_infections", label: "HIV Infections" },
  { value: "adult", label: "Adult" },
  {
    value: "infectious_disease_medicine",
    label: "Infectious Disease Medicine"
  },
  { value: "blood_transfusion", label: "Blood transfusion" },
  { value: "sepsis", label: "Sepsis" }
];

class ProfileInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditFormOpen: false
    };
  }

  toggleEditForm = () => {
    this.setState(prevState => ({
      isEditFormOpen: !prevState.isEditFormOpen
    }));
  };

  getClinicalInterests = userInformation => (
    <Box>
      <CardTitle>
        <h3>
          <u>
            <strong>Clinical Interests</strong>
          </u>
        </h3>
      </CardTitle>
      <Row>
        {userInformation.interests.map(interest => (
          <Col md={6} key={interest}>
            <h5>{interest}</h5>
          </Col>
        ))}
      </Row>
    </Box>
  );

  viewProfileInfo = (userInfo, userType, userInformation) => (
    <>
      <Row className="mb-3">
        <Box>
          <Row>
            <Col md={4}>
              <div className="circleWindow profilepageProfilePic float-left">
                <img
                  src={avatar}
                  className="mainProfilePic profilepageProfilePic"
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="float-left">
                <h2>
                  <strong>
                    {userType === "doctor" ? "Dr " : ""}{" "}
                    {userInfo ? `${userInfo.lastName}` : ""}
                  </strong>
                </h2>
                <h5>
                  {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
                </h5>
                <h5>
                  {userType === "doctor" ? `${userInfo.specialization}` : ""}
                </h5>
                <h5>Greece, Athens</h5>
              </div>
            </Col>
          </Row>
        </Box>
      </Row>
      <Row className="mb-3">
        {userType === "doctor"
          ? this.getClinicalInterests(userInformation)
          : ""}
      </Row>
      <Row className="mb-3">
        <Box>
          <CardTitle>
            <h3>
              <u>
                <strong>About You</strong>
              </u>
            </h3>
          </CardTitle>
          <Row>
            <Col>
              <i>
                <p>{userInformation.notes}</p>
              </i>
            </Col>
          </Row>
        </Box>
      </Row>
    </>
  );

  editProfileInfo = (
    userInfo,
    userType,
    userInformation,
    currentInterests,
    currentSpeciality
  ) => (
    <div>
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Card>
            <Form
              action=""
              method="post"
              // onSubmit={this.handleSubmit}
              // onReset={this.handleReset}
            >
              <CardBody>
                <FormGroup row>
                  <Col md={5}>
                    <div className="circleWindow homepageProfilePic">
                      <img
                        src={avatar}
                        className="mainProfilePic homepageProfilePic"
                      />
                    </div>
                  </Col>
                  <Col>
                    <Label for="exampleCustomFileBrowser">
                      Change profile picture
                    </Label>
                    <CustomInput
                      type="file"
                      id="exampleCustomFileBrowser"
                      name="customFile"
                    />
                  </Col>
                </FormGroup>
                <hr />
                {userType === "doctor" ? (
                  <FormGroup row>
                    <Col md="4">
                      <Label> Display Name:</Label>
                    </Col>
                    <Col xs="12" md="8">
                      <Input
                        type="text"
                        id="displayName"
                        name="text"
                        onChange={this.handleChange}
                        placeholder={userInformation.dispayName}
                        required
                      />
                    </Col>
                  </FormGroup>
                ) : (
                  ""
                )}

                <FormGroup row>
                  <Col md="4">
                    <Label> First Name:</Label>
                  </Col>
                  <Col xs="12" md="8">
                    <Input
                      type="text"
                      id="firstName"
                      name="text"
                      onChange={this.handleChange}
                      placeholder={userInfo.firstName}
                      required
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="4">
                    <Label> Last Name:</Label>
                  </Col>
                  <Col xs="12" md="8">
                    <Input
                      type="text"
                      id="lastName"
                      name="text"
                      onChange={this.handleChange}
                      placeholder={userInfo.lastName}
                      required
                    />
                  </Col>
                </FormGroup>
                <hr />
                {userType === "doctor" ? (
                  <>
                    <FormGroup row>
                      <Col md="2">
                        <Label>Speciality:</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Select
                          options={optionsSpeciality}
                          defaultValue={currentSpeciality}
                          isMulti
                          isSearchable
                        />
                      </Col>
                    </FormGroup>

                    <hr />
                    <FormGroup row>
                      <Col md="2">
                        <Label>Clinical Interests:</Label>
                      </Col>
                      <Col xs="12" md="10">
                        <Select
                          options={optionsInterests}
                          defaultValue={currentInterests}
                          isMulti
                          isSearchable
                        />
                      </Col>
                    </FormGroup>
                    <hr />
                  </>
                ) : (
                  ""
                )}

                <FormGroup row>
                  <Col md="2">
                    <Label>About: </Label>
                  </Col>
                  <Col>
                    <Input
                      type="textarea"
                      id="about_text"
                      name="about_text"
                      onChange={this.handleChange}
                      defaultValue={userInformation.notes}
                      style={{ minHeight: "260px", maxHeight: "600px" }}
                    />
                  </Col>
                </FormGroup>
              </CardBody>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { userInfo, userType } = this.props.user;
    const userInformation = {
      dispayName: "Dr Yu",
      firstName: "Amandeus",
      lastName: "Yu",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ultrices sagittis orci a scelerisque purus semper eget duis. Amet volutpat consequat mauris nunc congue nisi vitae suscipit. Placerat orci nulla pellentesque dignissim enim sit amet venenatis. Tincidunt eget nullam non nisi est sit amet. Faucibus nisl tincidunt eget nullam non. Elementum tempus egestas sed sed risus. Laoreet non curabitur gravida arcu ac tortor dignissim. Ante metus dictum at tempor commodo ullamcorper. Bibendum enim facilisis gravida neque convallis acras. Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Turpis massa tincidunt dui ut ornare lectus.",
      speciality: "General Practitioner, Cardiologist",
      interests: ["Epidimiology", "Cancer Research", "Autoimmune Diseases"]
    };
    const currentInterests = [
      { value: "epidimiology", label: "Epidimiology" },
      { value: "cancer", label: "Cancer Research" },
      { value: "autoimmune", label: "Autoimmune Diseases" }
    ];
    const currentSpeciality = [
      { value: "general", label: "General Practitioner" },
      { value: "cardiologist", label: "Cardiologist" }
    ];
    return (
      <Row>
        <Col>
          <Card>
            <CardHeader>
              {this.state.isEditFormOpen ? (
                <>
                  <Button
                    size="md"
                    color="danger"
                    onClick={this.toggleEditForm}
                  >
                    Cancel
                  </Button>
                  &nbsp;
                  <Button
                    size="md"
                    color="success"
                    onClick={this.toggleEditForm}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button size="md" color="primary" onClick={this.toggleEditForm}>
                  Edit Profile
                </Button>
              )}
            </CardHeader>
            <CardBody>
              {this.state.isEditFormOpen
                ? this.editProfileInfo(
                    userInfo,
                    userType,
                    userInformation,
                    currentInterests,
                    currentSpeciality
                  )
                : this.viewProfileInfo(userInfo, userType, userInformation)}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
