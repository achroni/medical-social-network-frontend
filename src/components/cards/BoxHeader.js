import React from "react";
import { Col, Card, CardHeader, CardTitle, CardBody } from "reactstrap";

import PropTypes from "prop-types";

export const BoxHeader = ({ size = 12, header, children }) => (
  <Col md={size}>
    <Card>
      <CardHeader
        className="text-white"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <CardTitle style={{ textAlign: "center" }}>
          <strong>{header}</strong>
        </CardTitle>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  </Col>
);

BoxHeader.propTypes = {
  size: PropTypes.number,
  header: PropTypes.string.isRequired,
  children: PropTypes.any
};

export default BoxHeader;
