import React, { Component } from 'react';
import {
  Grid,
  Modal,
  Button,
} from 'react-bootstrap';
import UrlBox from './UrlBox.js';

import '../../../main.js';

/**
 * EditPoll - component that handles the editing of polls. There are several
 * functionalities involved, including changing the polls options and name,
 * and allowing the sharing of the poll's unique id.
 */
export default class EditPoll extends Component {

  constructor(props) {
    super(props);

    this.pollNamePrompt = this.pollNamePrompt.bind(this);
    this.closePollNamePrompt = this.closePollNamePrompt.bind(this);

    this.state = {
      pollId: this.props.pollId,
      showPollNameModal: false,
    };
  }

  /* Here is a method for opening a poll name prompt for changing the poll name,
   * but it is unclear whether this is the best option for this functionality */
  pollNamePrompt() {
    this.setState({ showPollNameModal: true });
  }

  /* Here is a method for closing a poll name prompt for changing the poll name,
   * but it is unclear whether this is the best option for this functionality */
  closePollNamePrompt() {
    this.setState({ showPollNameModal: false });
  }

  render() {
    return (
      <Grid>
        <h1 className="text-center">Success! Here is your unique poll URL:</h1>
        <UrlBox />
        <Button bsStyle="primary" bsSize="large" onClick={this.pollNamePrompt}>
          Change Poll Name
        </Button>

        <Modal
          show={this.state.showPollNameModal}
          onHide={this.closePollNamePrompt}
        >

          <Modal.Header closeButton>
            <Modal.Title>Change Poll Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>This would contain the input for changing the poll name</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closePollNamePrompt}>Close</Button>
          </Modal.Footer>

        </Modal>

      </Grid>
    );
  }
}

EditPoll.propTypes = {
  pollId: React.PropTypes.string,
};

