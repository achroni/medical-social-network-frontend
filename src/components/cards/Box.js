import React from "react";
import { Col, Card, CardBody } from "reactstrap";

import PropTypes from "prop-types";

export const Box = ({
  size = 12,
  colClassNames = "",
  cardBodyClassNames = "",
  customStyle = {},
  children
}) => (
  <Col md={size} className={colClassNames}>
    <Card style={customStyle}>
      <CardBody className={cardBodyClassNames}>{children}</CardBody>
    </Card>
  </Col>
);

Box.propTypes = {
  size: PropTypes.number,
  colClassNames: PropTypes.string,
  cardBodyClassNames: PropTypes.string,
  customStyle: PropTypes.any,
  children: PropTypes.any
};

export default Box;
