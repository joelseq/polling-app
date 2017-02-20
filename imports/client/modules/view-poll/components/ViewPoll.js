import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  Checkbox,
  Button,
} from 'react-bootstrap';

// Grab collection for polls
import Polls, { voteHelper } from '../../../../api/polls.js';

// Component for a page that displays a poll
class ViewPoll extends Component {
  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleHandleChange = this.handleHandleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);

    this.state = {
      handle: '',
      password: '',
      selectedOptions: {},
      error: '',
      submitted: false,
    };
  }

  // Handler for selecting/unselecting options in the checkboxes
  toggleCheckbox(option) {
    const newSelectedOptions = { ...this.state.selectedOptions };

    if (option in this.state.selectedOptions) {
      delete newSelectedOptions[option];
    } else {
      newSelectedOptions[option] = 1;
    }

    this.setState({
      selectedOptions: newSelectedOptions,
    });
  }

  // Handler for the handle input
  handleHandleChange(e) {
    this.setState({
      handle: e.target.value,
    });
  }

  // Handler for the password input
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  // Handler for submitting the vote
  handleVoteSubmit(e) {
    e.preventDefault();

    const { handle, password, selectedOptions } = this.state;

    if (!handle) {
      this.setState({
        error: 'Please enter a handle',
      });
    } else if (Object.keys(selectedOptions).length < 1) {
      this.setState({
        error: 'Please vote on one of the options',
      });
    } else {
      this.setState({
        error: '',
      });

      // Create a new Poll object to be saved
      let updatedPoll = { ...this.props.poll };

      // Remove the _id key to pass validation
      delete updatedPoll._id;

      // The vote object for this user
      const vote = {
        handle,
        password,
        selectedOptions,
      };

      // Map over all the user's selectedOptions and update
      // the scores for each option in the Poll
      Object.keys(selectedOptions).forEach((option) => {
        updatedPoll.options[option] += selectedOptions[option];
      });

      if (!updatedPoll.votes) {
        updatedPoll.votes = [];
      }

      updatedPoll.votes.push(vote);

      // Client side check to make sure no duplicate votes
      if (voteHelper(updatedPoll)) {
        // Meteor method with a callback for server-side validation of no duplicates.
        Meteor.call('polls.vote', this.props.poll._id, updatedPoll, (err) => {
          if (err) {
            this.setState({
              error: 'This handle has already voted.',
            });

            // If there was an error, remove the last element to avoid bugs
            updatedPoll.votes.pop();
          } else {
            this.setState({
              submitted: true,
            });
          }
        });
      } else {
        this.setState({
          error: 'This handle has already voted.',
        });

        // If there was an error, remove the last element to avoid bugs
        updatedPoll.votes.pop();
      }
    }
  }

  renderOptions() {
    const { options } = this.props.poll;

    return Object.keys(options).map(option => (
      <Col key={option} md={7} xs={8}>
        <FormGroup>
          <Checkbox
            onChange={() => this.toggleCheckbox(option)}
          >
            {option}
          </Checkbox>
        </FormGroup>
      </Col>
    ));
  }

  // Actual layout
  render() {
    if (!this.props.poll) {
      // TODO: add a nice loading animation here instead of this
      return <h4 className="text-center">Loading...</h4>;
    }

    return (
      <Grid>
        <Row>
          <form onSubmit={this.handleVoteSubmit}>
            <h2 className="margin-left">{this.props.poll.name}</h2>
            {this.renderOptions()}
            <FormGroup controlId={'handle'}>
              <FormControl
                onChange={this.handleHandleChange}
                type="text"
                value={this.state.handle}
                placeholder="Please enter a handle"
              />
            </FormGroup>
            <FormGroup controlId={'password'}>
              <FormControl
                onChange={this.handlePasswordChange}
                type="password"
                value={this.state.password}
                placeholder="Password (Optional)"
              />
            </FormGroup>
            {this.state.error && <div className="text-danger">{this.state.error}</div>}
            <Button
              bsStyle="success"
              type="submit"
              disabled={this.state.submitted}
            >
              Vote
            </Button>
          </form>
        </Row>
      </Grid>
    );
  }
}

// A property containing the polls is required of the data.
// This object is defined here by the style guidelines
// PollPage.propTypes = {
//   poll: PropTypes.arrayOf(PropTypes.shape({
//     name: PropTypes.string.isOptional,
//     data: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//     }).isRequired,
//   })).isRequired,
// };

// The real MVP; creates the PollPage container using the routing params
// (the unique url)
export default createContainer(({ params }) => {
  Meteor.subscribe('polls'); // get the poll database

  return {
    poll: Polls.findOne(params.pollId),
  };
}, ViewPoll);
