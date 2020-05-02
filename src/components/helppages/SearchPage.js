import React, { Component } from "react";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import avatar from "../../../static/frontend/assets/images/avatar.png";
import Box from "../cards/Box";

import {
  getSearchResults,
  clearSearchState
} from "../../actions/searchresults";

class SearchPage extends Component {
  constructor(props) {
    super(props);
    const parts = this.props.location.pathname.split("/");
    this.searchValue = parts[parts.length - 1];
    this.props.getSearchResults(this.searchValue, true);
  }

  componentDidUpdate(prevProps) {
    const parts = this.props.location.pathname.split("/");
    if (this.searchValue != parts[parts.length - 1]) {
      this.searchValue = parts[parts.length - 1];
      this.props.getSearchResults(this.searchValue, true);
    }
    if (
      JSON.stringify(this.props.searchresults.searchResultsMore) !==
      JSON.stringify(prevProps.searchresults.searchResultsMore)
    ) {
      this.searchValue = parts[parts.length - 1];
      this.props.getSearchResults(this.searchValue, true);
    }
  }

  render() {
    const { userInfo } = this.props.user;
    const { searchResultsMore, isLoading } = this.props.searchresults;
    if (searchResultsMore.length)
      return (
        <>
          <Row className="mb-3">
            <Col>
              <h5>Users </h5>
            </Col>
          </Row>
          {searchResultsMore.sort().map(user => (
            <Row className="mb-3" key={user.user_id}>
              <Box size={6}>
                <Row>
                  <Col md={3}>
                    <Link className="circleWindow searchProfilePic " to="#">
                      <img
                        src={avatar}
                        className="mainProfilePic searchProfilePic"
                      />
                    </Link>
                  </Col>
                  <Col md={9}>
                    <Link
                      to={`/${user.specialization ? "doctor" : "patient"}/${
                        user.username
                      }`}
                    >
                      <strong>
                        {user.firstName} {user.lastName}
                      </strong>
                    </Link>
                    {user.specialization ? (
                      <p>
                        <i>{user.specialization}</i>
                      </p>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Box>
            </Row>
          ))}
        </>
      );
    else {
      return <p>No Results </p>;
    }
  }
}

SearchPage.propTypes = {
  user: PropTypes.object.isRequired,
  getSearchResults: PropTypes.func.isRequired,
  clearSearchState: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  searchresults: state.searchresults
});

const mapDispatchToProps = { getSearchResults, clearSearchState };

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
