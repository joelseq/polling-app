import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
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
export default class UrlBox extends Component {
  constructor(props) {
    super(props);

    this.onCopy = this.onCopy.bind(this);

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

  render() {
    return (
      <Jumbotron className="text-center">
        {/* Optional notification for copied link, can be removed if
         we decide to go with something else */ }
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref={(comp) => { this.alert = comp; }}
          className="toast-top-center"
        />
        <h2>{this.state.shareURL}</h2>
        <CopyToClipboard text={this.state.shareURL} onCopy={this.onCopy}>
          <Button bsStyle="primary" bsSize="large">Copy</Button>
        </CopyToClipboard>
      </Jumbotron>
    );
  }

}

