import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withRouter, routerShape } from 'react-router';
import {
  ToastContainer,
  ToastMessage,
} from 'react-toastr';
import {
  Button,
  Jumbotron,
} from 'react-bootstrap';

/* For the "copied!" alert message */
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

/**
 * UrlBox - component that displays the URL in a nicely formatted box, with
 * buttons to copy, as well as a tiny notification that the text has been
 * successfully copied.
 */
class UrlBox extends Component {
  constructor(props) {
    super(props);

    this.onCopy = this.onCopy.bind(this);
    this.voteRedirect = this.voteRedirect.bind(this);

    // This is the same as doing getInitialState but the ES6 way
    this.state = {
      shareURL: document.URL.substring(0, document.URL.lastIndexOf('/')),
    };
  }

  // Copy to clipboard function call, displays the alert to the screen
  onCopy() {
    this.alert.success('', 'Copied Link to Clipboard!', {
      closeButton: false,
      timeOut: 1000,
    });
  }

  /* Use the router to redirect the user to the voting page, do so by grabbing
   * the preceding portion of the url pathname. A bit inefficient, but it
   * works, and was the easiest solution I found after spending an hour. */
  voteRedirect() {
    const pathName = window.location.pathname;
    const pollIdSubstring = pathName.substring(0, pathName.lastIndexOf('/'));

    this.props.router.push(pollIdSubstring);
  }

  render() {
    return (
      <Jumbotron className="text-center">
        {/* Optional notification for copied link, can be removed if
          * we decide to go with something else */ }
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref={(comp) => { this.alert = comp; }}
          className="toast-top-center"
        />
        <h2>{this.state.shareURL}</h2>

        {/* TODO: Modify this UI so that the buttons are properly spaced by
          * adding custom css */ }
        <CopyToClipboard text={this.state.shareURL} onCopy={this.onCopy}>
          <Button bsStyle="primary" bsSize="large">Copy</Button>
        </CopyToClipboard>
        {' '}
        <Button
          bsStyle="primary"
          bsSize="large"
          onClick={this.voteRedirect}
        > Vote</Button>

      </Jumbotron>
    );
  }

}

UrlBox.propTypes = {
  router: routerShape,
};

export default withRouter(UrlBox);
