import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Grid,
  Row,
  HelpBlock,
  Col,
  FormGroup,
  Modal,
  ControlLabel,
  FormControl,
  Checkbox,
  Button,
} from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Grab collection for polls
import Polls, { voteHelper } from '../../../../api/polls.js';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithTooltip = createSliderWithTooltip(Slider);

// Prop Types for this Component
const propTypes = {
  // Poll object in DB from createContainer
  poll: PropTypes.shape({
    // Mongo ID for Poll
    _id: PropTypes.string,
    // Whether the poll is weighted
    isWeighted: PropTypes.bool,
    isPrivate: PropTypes.bool,
    // Name / Question of the poll
    name: PropTypes.string,
    // A hashmap of key = option and
    // value = amount of votes
    options: PropTypes.object,
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

// Component for a page that displays a poll
class ViewPoll extends Component {
  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);
    this.renderPassNeededDialog = this.renderPassNeededDialog.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleHandleChange = this.handleHandleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.checkHandle = this.checkHandle.bind(this);

    this.state = {
      handle: '',
      password: '',
      selectedOptions: {},
      error: '',
      submitted: false,
      showHandleModal: true,
      handleError: '',
      passValidError: '',
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

  // Handler for the slider of weighted options
  handleSliderChange(value, option) {
    const newSelectedOptions = { ...this.state.selectedOptions };

    newSelectedOptions[option] = value;

    this.setState({
      selectedOptions: newSelectedOptions,
    });
  }

  // Handler for the handle input
  handleHandleChange(e) {
    this.setState({
      handle: e.target.value,
      handleError: '',
    });
  }

  // Handler for the password input
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      passValidError: '',
    });
  }

  // Handler for submitting the vote
  handleVoteSubmit(e) {
    e.preventDefault();

    const { handle, password, selectedOptions } = this.state;

    this.checkHandle(e);

    if (Object.keys(selectedOptions).length < 1) {
      this.setState({
        error: 'Please vote on one of the options',
      });
    } else {
      this.setState({
        error: '',
      });

      // Create a new Poll object to be saved
      const updatedPoll = { ...this.props.poll };

      // Remove the _id key to pass validation
      delete updatedPoll._id;

      // The vote object for this user
      const vote = {
        handle,
        password,
        selectedOptions,
      };

      if (!updatedPoll.votes) {
        updatedPoll.votes = [];
      }

      updatedPoll.votes.push(vote);

      // Client side check to make sure no duplicate votes
      if (voteHelper(updatedPoll)) {
        // Map over all the user's selectedOptions and update
        // the scores for each option in the Poll
        Object.keys(selectedOptions).forEach((option) => {
          updatedPoll.options[option] += selectedOptions[option];
        });

        // Meteor method with a callback for server-side validation of no duplicates.
        Meteor.call('polls.vote', this.props.poll._id, updatedPoll, (err) => {
          if (err) {
            this.setState({
              error: 'This handle has already voted.',
            });

            // If there was an error, remove the last element to avoid bugs
            updatedPoll.votes.pop();

            // Map over all the user's selectedOptions and update
            // the scores for each option in the Poll to undo changes
            Object.keys(selectedOptions).forEach((option) => {
              updatedPoll.options[option] -= selectedOptions[option];
            });
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
  checkHandle(e) {
    e.preventDefault();
    if (this.state.handle === '') {
      this.setState({ handleError: 'Please enter a non-empty handle!' });
    } else {
      Meteor.call(
        'polls.checkPassAndHandle',
        {
          pollId: this.props.poll._id,
          otherHandle: this.state.handle,
          pass: this.state.password,
        },
        (err) => {
          if (err) {
            if (err.error === 500) {
              this.setState({ handleError: err.reason });
            } else if (err.error === 501) {
              this.setState({ passValidError: err.reason });
            }
            this.setState({ showHandleModal: true });
          } else {
            this.setState({ showHandleModal: false });
          }
        }
      );
    }
  }

  renderOptions() {
    const { options, isWeighted } = this.props.poll;

    if (isWeighted) {
      return Object.keys(options).map(option => (
        <Col key={option} md={7} xs={8} className="margin-bottom">
          <p>{option}</p>
          <SliderWithTooltip
            onAfterChange={val => this.handleSliderChange(val, option)}
            min={0}
            max={10}
          />
        </Col>
      ));
    }

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

  renderPassNeededDialog() {
    if (this.props.poll.isPrivate) {
      return (
        <FormGroup controlId={'password'}>
          <ControlLabel>Password: </ControlLabel>
          <FormControl
            onChange={this.handlePasswordChange}
            type="text"
            value={this.state.password}
            placeholder="Please enter the password"
          />
          <HelpBlock>{this.state.passValidError}</HelpBlock>
        </FormGroup>
      );
    }
    return null;
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

        <Modal
          show={this.state.showHandleModal}
        >
          <Modal.Header>
            <Modal.Title>Access Poll!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.checkHandle}>
              <FormGroup controlId={'handle'}>
                <ControlLabel>Name: </ControlLabel>
                <FormControl
                  onChange={this.handleHandleChange}
                  type="text"
                  value={this.state.handle}
                  placeholder="Please enter a handle"
                />
                <HelpBlock>{this.state.handleError}</HelpBlock>
              </FormGroup>
              {this.renderPassNeededDialog()}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.checkHandle}
              bsStyle="success"
              type="submit"
            >Submit</Button>
          </Modal.Footer>

        </Modal>

      </Grid>
    );
  }
}

ViewPoll.propTypes = propTypes;
ViewPoll.defaultProps = defaultProps;

// The real MVP; creates the ViewPoll container using the routing params
// (the unique url)
export default createContainer(({ params }) => {
  Meteor.subscribe('polls'); // get the poll database

  return {
    poll: Polls.findOne(params.pollId),
  };
}, ViewPoll);
