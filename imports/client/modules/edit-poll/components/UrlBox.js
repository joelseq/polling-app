import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { withRouter, routerShape } from 'react-router';
import {
  ToastContainer,
  ToastMessage,
} from 'react-toastr';
import {
  Row,
  Col,
  Panel,
  Grid,
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
    this.closePoll = this.closePoll.bind(this);

    // This is the same as doing getInitialState but the ES6 way
    this.state = {
      shareURL: document.URL.substring(0, document.URL.lastIndexOf('/')),
      isClosed: this.props.isClosed,
    };
  }

  // Copy to clipboard function call, displays the alert to the screen
  onCopy() {
    this.alert.success('', 'Copied Link to Clipboard!', {
      closeButton: false,
      timeOut: 1000,
    });
  }

  closePoll() {

    const pathName = window.location.pathname;
    const pollIdSubstring = pathName.substring(7, pathName.lastIndexOf('/'));
    var closed = this.state.isClosed;
    var closed = !closed;
    this.setState({ isClosed: closed });
    Meteor.call('polls.changePollStatus', pollIdSubstring, closed); 
    var message = "";
    if(closed){
      message = 'Poll has been closed!';
    }
    else{
      message = 'Poll has been opened!';
    }
    this.alert.success('', message, {closeButton: false, timeOut: 1000,
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
        <Grid>
          <Panel className="table-responsive"><h4>{this.state.shareURL}</h4></Panel>

          {/* TODO: Modify this UI so that the buttons are properly spaced by
            * adding custom css */ }
          <Row>
            <Col md={2} mdOffset={3} xs={12}>
              <CopyToClipboard text={this.state.shareURL} onCopy={this.onCopy}>
                <Button bsStyle="primary" block>Copy</Button>
              </CopyToClipboard>
            </Col>
            {' '}
            <Col md={2} xs={12}>
              <Button
                bsStyle="primary"
                onClick={this.voteRedirect}
                block
              > View Poll</Button>
            </Col> 
            {' '}
            <Col md={2} mdOffset={0} xs={12}>
              <Button
                bsStyle="primary"
                onClick={this.closePoll}
                block
              > {this.state.isClosed ? "Open Poll" : "Close Poll" }</Button>
            </Col>
          </Row>
        </Grid>

      </Jumbotron>
    );
  }

}

UrlBox.propTypes = {
  router: routerShape,
  isClosed: React.PropTypes.bool,
};

export default withRouter(UrlBox);
