import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const config = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

class Alerts extends Component {
  notifyError = msg => toast.error(msg, config);
  notifySuccess = msg => toast.success(msg, config);

  componentDidUpdate(prevProps) {
    const { error, message } = this.props;
    if (error !== prevProps.error) {
      if (error.msg.username) {
        this.notifyError(`Username: ${error.msg.username.join()}`);
      }
      //   if (error.msg.email) {
      //     this.notifyError(`Email: ${error.msg.email.join()}`);
      //   }
      if (error.msg.password) {
        this.notifyError(`Password: ${error.msg.password.join()}`);
      }
      if (error.msg.passwordsNotMatch) {
        this.notifyError(error.msg.passwordsNotMatch.join());
      }
      if (error.msg === "Wrong Credentials") {
        this.notifyError("Wrong Credentials");
      } else if (error.msg === "non_field_errors" || error.msg.detail) {
        this.notifyError("Error occurred");
      }
      if (error.status === 409) {
        this.notifyError(error.msg);
      }
    }

    if (message !== prevProps.message) {
      if (message.successMessage) {
        this.notifySuccess(message.successMessage);
      }
    }
  }

  render() {
    return (
      <div>
        <ToastContainer />
      </div>
    );
  }
}

Alerts.propTypes = {
  error: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  error: state.errors,
  message: state.messages
});

export default connect(mapStateToProps)(Alerts);
