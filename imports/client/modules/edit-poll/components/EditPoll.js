import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Well,
  FormGroup,
  ControlLabel,
  Col,
  Row,
  FormControl,
  PageHeader,
  Grid,
  Modal,
  Button,
} from 'react-bootstrap';
import UrlBox from './UrlBox.js';

import '../../../main.js';

import Polls from '../../../../api/polls.js';

// Prop Types for this Component
const propTypes = {
  // Poll object in DB from createContainer
  poll: React.PropTypes.shape({
    // Mongo ID for Poll
    _id: React.PropTypes.string,
    /* Whether the poll is weighted
    isWeighted: React.PropTypes.bool, */
    // Name / Question of the poll
    name: React.PropTypes.string,
    /* A hashmap of key = option and
    // value = amount of votes
    options: React.PropTypes.object, */
  }),
};

// Default Props if none are provided
const defaultProps = {
  poll: {
    _id: '123',
    isWeighted: false,
    name: 'Default Poll',
    options: {
      'Option 1': 0,
      'Option 2': 0,
    },
  },
};

/**
 * EditPoll - component that handles the editing of polls. There are several
 * functionalities involved, including changing the polls options and name,
 * and allowing the sharing of the poll's unique id.
 */
class EditPoll extends Component {

  constructor(props) {
    super(props);

    this.pollNamePrompt = this.pollNamePrompt.bind(this);
    this.closePollNamePrompt = this.closePollNamePrompt.bind(this);
    this.handlePollNameChange = this.handlePollNameChange.bind(this);
    this.updatePoll = this.updatePoll.bind(this);

    this.state = {
      pollName: this.props.poll.name,
      showPollNameModal: false,
      error: '',
    };
  }

  /* Here is a method for opening a poll name prompt for changing the poll name,
   * but it is unclear whether this is the best option for this functionality */
  pollNamePrompt() {
    this.setState({ showPollNameModal: true });
    this.setState({ pollName: this.props.poll.name });
  }

  /* Here is a method for closing a poll name prompt for changing the poll name,
   * but it is unclear whether this is the best option for this functionality */
  closePollNamePrompt() {
    this.setState({ showPollNameModal: false });
  }

  /* Simple method for handling changing the state of the poll name on the
   * component */
  handlePollNameChange(e) {
    this.setState({ pollName: e.target.value });
  }

  /* Handler for updating the poll in the database. Currently just updates the
   * poll's name, but can be easily modified to change the poll options if
   * needed */
  updatePoll() {
    const { pollName } = this.state;

    if (!pollName) {
      this.setState({
        error: 'Please enter a name',
      });
    }

    // Create a new Poll object to be saved
    const updatedPoll = { ...this.props.poll };

    // Remove the _id key to pass validation
    delete updatedPoll._id;

    updatedPoll.name = pollName;

    Meteor.call('polls.changeName', this.props.poll._id, updatedPoll);

    this.setState({ showPollNameModal: false });
  }

  render() {
    if (!this.props.poll) {
      // TODO: add a nice loading animation here instead of this
      return <h4 className="text-center">Loading...</h4>;
    }

    // Ensure the poll's details are populated in the state
    return (
      <Grid>
        <PageHeader className="text-center">
          Success! Here is your unique poll URL:
        </PageHeader>
        <UrlBox />
        <Well>
          <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.pollNamePrompt}
            block
          >Edit Poll Details</Button>
        </Well>

        {/* Using this modal to handle updating the poll information, but
          * this UI may be changed as we move forward */ }
        <Modal
          show={this.state.showPollNameModal}
          onHide={this.closePollNamePrompt}
        >

          <Modal.Header closeButton>
            <Modal.Title>Change Poll Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={12} xs={12}>
                <form onSubmit={this.updatePoll}>
                  <FormGroup>
                    <ControlLabel>Question: </ControlLabel>
                    <FormControl
                      onChange={this.handlePollNameChange}
                      type="text"
                      value={this.state.pollName}
                      placeholder="Enter question for poll"
                    />
                  </FormGroup>
                </form>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.updatePoll}
              bsStyle="success"
              type="submit"
            >Submit</Button>
            <Button onClick={this.closePollNamePrompt}>Close</Button>
          </Modal.Footer>

        </Modal>

      </Grid>
    );
  }
}

EditPoll.propTypes = propTypes;
EditPoll.defaultProps = defaultProps;

export default createContainer(({ params }) => {
  Meteor.subscribe('polls'); // get the poll database
  const grabbedPoll = Polls.findOne(params.pollId);

  return {
    poll: grabbedPoll,
  };
}, EditPoll);
