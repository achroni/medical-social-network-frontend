import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SidebarContent extends Component {
  render() {
    const { userType } = this.props.user;
    return (
      <>
        <Navbar style={{ backgroundColor: "#d11b23" }} dark expand="md">
          <NavbarBrand style={{ color: "#fff" }}>
            <strong>Menu</strong>
          </NavbarBrand>
        </Navbar>
        <br />

        <Navbar>
          <Nav vertical>
            <Row className="mb-4">
              <Col>
                <NavItem>
                  <NavLink href="/#/profile">
                    <i className="fa fa-user-circle" />
                    &nbsp; Profile
                  </NavLink>
                </NavItem>
              </Col>
            </Row>
            {userType === "patient" ? (
              <Row className="mb-4">
                <Col>
                  <NavItem>
                    <NavLink href="/#/healthscore">
                      <i className="fa fa-heartbeat" />
                      &nbsp; Health Score
                    </NavLink>
                  </NavItem>
                </Col>
              </Row>
            ) : null}
            <Row className="mb-4">
              <Col>
                <NavItem>
                  <NavLink href="/#/calendar">
                    <i className="fa fa-calendar" />
                    &nbsp; Calendar
                  </NavLink>
                </NavItem>
              </Col>
            </Row>

            {userType === "doctor" ? (
              <>
                <Row className="mb-4">
                  <Col>
                    <NavItem>
                      <NavLink href="#">
                        <i className="fa fa-hospital-o" />
                        &nbsp; Clinic Profile
                      </NavLink>
                    </NavItem>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col>
                    <NavItem>
                      <NavLink href="/#/careteam">
                        <i className="fa fa-group" />
                        &nbsp; Care Team
                      </NavLink>
                    </NavItem>
                  </Col>
                </Row>
              </>
            ) : (
              <Row className="mb-4">
                <Col>
                  <NavItem>
                    <NavLink href="/#/community">
                      <i className="fa fa-group" />
                      &nbsp; Community
                    </NavLink>
                  </NavItem>
                </Col>
              </Row>
            )}
            {userType === "patient" ? (
              <Row className="mb-4">
                <Col>
                  <NavItem>
                    <NavLink href="/#/blockchain_history">
                      <i className="fa fa-chain" />
                      &nbsp; Blockchain History
                    </NavLink>
                  </NavItem>
                </Col>
              </Row>
            ) : null}

            <Row className="mb-4">
              <Col>
                <NavItem>
                  <NavLink href="#">
                    <i className="fa fa-envelope-open-o" />
                    &nbsp; Messaging
                  </NavLink>
                </NavItem>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <NavItem>
                  <NavLink href="#">
                    <i className="fa fa-desktop" />
                    &nbsp; T-Appointment
                  </NavLink>
                </NavItem>
              </Col>
            </Row>
          </Nav>
        </Navbar>
      </>
    );
  }
}

SidebarContent.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent);
