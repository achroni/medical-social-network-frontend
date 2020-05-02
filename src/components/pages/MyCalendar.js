import React, { Component } from "react";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Row, Col, CardTitle } from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import BoxHeader from "../cards/BoxHeader";

const localizer = momentLocalizer(moment);
const now = new Date();
const events = [
  {
    id: 14,
    title: "Today",
    start: new Date(new Date().setHours(new Date().getHours() - 3)),
    end: new Date(new Date().setHours(new Date().getHours() + 3))
  },
  {
    id: 15,
    title: "Point in Time Event",
    start: now,
    end: now
  }
];

class MyCalendar extends Component {
  render() {
    return (
      <Row className="mt-4">
        <Col md={8}>
          <div style={{ height: "500px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
            />
          </div>
        </Col>
        <Col>
          <Row className="mb-3">
            <BoxHeader header="Upcoming Events">
              {events.map(event => (
                <div key={event.id}>
                  <CardTitle>
                    <u>{event.title}</u>
                  </CardTitle>
                  <p>{event.start.toDateString()}</p>
                  <p>
                    {event.start.toLocaleTimeString()} -
                    {event.end.toLocaleTimeString()}
                  </p>
                  <hr />
                </div>
              ))}
            </BoxHeader>
          </Row>
          <Row>
            <BoxHeader header="Upcoming Telappointment"></BoxHeader>
          </Row>
        </Col>
      </Row>
    );
  }
}

MyCalendar.propTypes = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyCalendar);
