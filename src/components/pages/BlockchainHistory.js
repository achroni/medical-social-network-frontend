import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Badge,
  Table
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { hashHistory } from "../../actions/blockchain";

import Select from "react-select";

const optionsType = [
  { value: "timeline_create_post", label: "Create Post" },
  { value: "timeline_edit_post", label: "Edit Post" },
  { value: "timeline_delete_post", label: "Delete Post" }
];

class BlockchainHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeTransaction: null
    };
  }

  componentDidMount() {
    this.props.hashHistory();
  }

  handleFilterType = e => {
    this.setState({
      typeTransaction: e ? e : null
    });
  };

  getHashes(Hashes) {
    let elements = Hashes;
    if (this.state.typeTransaction) {
      elements = elements.filter(
        obj => obj.assed_id.split("#")[0] === this.state.typeTransaction.value
      );
    }
    return (
      <>
        {elements.map(obj => {
          const type = obj.assed_id.split("#");
          const real_hash = obj.description.slice(
            0,
            obj.description.length / 2
          );

          const calc_hash = obj.calculated_hash
            ? obj.calculated_hash.slice(0, obj.calculated_hash.length / 2)
            : "";
          return calc_hash ? (
            <tr>
              <td>{type[0]}</td>
              <td>{real_hash}...</td>
              <td>{calc_hash}...</td>
              {obj.description === obj.calculated_hash ? (
                <td>
                  <i className="fa fa-check-square-o" />
                </td>
              ) : (
                <td>
                  <i className="fa fa-close" />
                </td>
              )}
            </tr>
          ) : null;
        })}
      </>
    );
  }

  render() {
    const { Hashes } = this.props.blockchain;

    return (
      <Row>
        <Col>
          <Row>
            <Col md={3}>
              <h5>
                <strong>Transactions</strong>
              </h5>
            </Col>
            <Col md={5}>
              <Select
                id="typeTransaction"
                name="typeTransaction"
                options={optionsType}
                onChange={this.handleFilterType}
                placeholder={"Transaction Type"}
                isClearable
              />
            </Col>
          </Row>
          &nbsp;
          <Row>
            <Col>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Real Hash</th>
                    <th>Calculated Hash</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{this.getHashes(Hashes)}</tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

BlockchainHistory.propTypes = {
  hashHistory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  blockchain: state.blockchain
});

const mapDispatchToProps = {
  hashHistory
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockchainHistory);
