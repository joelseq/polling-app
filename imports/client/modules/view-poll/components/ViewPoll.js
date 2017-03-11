import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {
  Grid,
  Row,
  Well,
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
import { withRouter } from 'react-router';

// Grab collection for polls
import Polls from '../../../../api/polls.js';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const SliderWithTooltip = createSliderWithTooltip(Slider);

// Prop Types for this Component
const propTypes = {
  router: PropTypes.object,
  // Poll object in DB from createContainer
  poll: PropTypes.shape({
    // Mongo ID for Poll
    _id: PropTypes.string,
    // Whether the poll is weighted
    isWeighted: PropTypes.bool,
    isPrivate: PropTypes.bool,
    isVoterEditable: PropTypes.bool,
    votes: PropTypes.object,
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
    this.removeOption = this.removeOption.bind(this);
    this.handleHandleChange = this.handleHandleChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.checkHandle = this.checkHandle.bind(this);
    this.handleOptionSubmit = this.handleOptionSubmit.bind(this);
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this);
    this.renderPollOptionModal = this.renderPollOptionModal.bind(this);
    this.closeEditOptionsModal = this.closeEditOptionsModal.bind(this);
    this.updatePoll = this.updatePoll.bind(this);

    this.state = {
      handle: '',
      password: '',
      selectedOptions: {},
      error: '',
      submitted: false,
      showHandleModal: true,
      handleError: '',
      passValidError: '',
      options: {},
      optionName: '',
      optionError: '',
      showEditOptionModal: false,
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

  // Handler for the input box when suggesting a new option name
  handleOptionNameChange(e) {
    this.setState({
      ...this.state,
      optionName: e.target.value,
      optionError: '',
    });
  }

  /* Function to remove an option from the options in state */
  removeOption(option) {
    /* From StackOverflow:
     * Object.keys to list all properties in raw (the original data)
     * Array.prototype.filter to select keys that are present in the
     * allowed list
     * Array.prototype.reduce to build a new object with only the
     * allowed properties. */
    const newOptions = Object.keys(this.state.options)
      .filter(opt => opt !== option)
      .reduce((obj, key) => {
        const newObj = obj;
        newObj[key] = this.state.options[key];
        return newObj;
      }, {});

    this.setState({
      options: newOptions,
    });
  }

  /* Handler for updating the poll in the database. Currently just updates the
   * poll's name, but can be easily modified to change the poll options if
   * needed */
  updatePoll(e) {
    e.preventDefault();
    const { options } = this.state;

    const optionNum = Object.keys(options).length;
    if (optionNum < 2) {
      this.setState({ optionError:
        'Too few options specified, please add another before submitting!' });
      return;
    }

    // Create a new Poll object to be saved
    const updatedPoll = { ...this.props.poll };

    // Remove the _id key to pass validation
    delete updatedPoll._id;

    updatedPoll.options = options;

    Meteor.call('polls.suggestOptions',
      this.props.poll._id,
      updatedPoll,
      () => {
        this.setState({ showEditOptionModal: false });
      }
    );
  }


  // Handler for the form submission for entering a new option
  handleOptionSubmit(e) {
    e.preventDefault();

    const { optionName, options } = this.state;

    // Make sure the input isn't empty and the option hasn't already been added
    // TODO: Show a warning when the user is trying to add the same option twice
    if (optionName.length > 0 && !(optionName in options)) {
      const newOptions = { ...options };

      newOptions[optionName] = 0;

      this.setState({
        ...this.state,
        options: newOptions,
        optionName: '',
      });
    } else {
      this.setState({ optionError: 'Please enter a non-duplicate option!' });
    }
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

      // Meteor method with a callback for server-side validation of no duplicates.
      Meteor.call('polls.vote', this.props.poll._id, updatedPoll, vote,
        (err) => {
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
            this.props.router.push(`/polls/${this.props.poll._id}/results`);
          }
        }
      );
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
            const pollVotes = this.props.poll.votes;

            if (pollVotes) {
              for (const vote of pollVotes) {
                if (vote.handle === this.state.handle) {
                  this.setState({
                    selectedOptions: vote.selectedOptions,
                  });
                }
              }
            }

            this.setState({ showHandleModal: false });
          }
        }
      );
    }
  }


  closeEditOptionsModal() {
    this.setState({ showEditOptionModal: false });
    return null;
  }

  renderPollOptionModal() {
    this.setState({
      options: this.props.poll.options,
      showEditOptionModal: true,
    });
    return null;
  }

  /* Helper function to render all the options, used elsewhere, bad style,
   * however, this project is not going to be big enough to require us to
   * separate this out into different component.
   */
  renderOptionEdit() {
    return Object.keys(this.state.options).map(option => (
      <Col key={option} className="CreatePoll__option" md={4} sm={6} xs={12}>
        <button
          onClick={() => this.removeOption(option)}
          className="CreatePoll__option-close-button"
        >
          &times;
        </button>
        <p>{option}</p>
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
            checked={this.state.selectedOptions[option] === 1}
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
        { this.props.poll.isVoterEditable ? (
          <Well>
            <Button
              bsStyle="primary"
              bsSize="large"
              onClick={this.renderPollOptionModal}
              block
            >Add and Remove Poll Options</Button>
          </Well>
          ) : ''
        }

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

        <Modal
          show={this.state.showEditOptionModal}
          onHide={this.closeEditOptionsModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Change Poll Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ControlLabel>Modify Options: </ControlLabel>
            <form onSubmit={this.handleOptionSubmit}>
              <div className="CreatePoll__add-option">
                <FormControl
                  onChange={this.handleOptionNameChange}
                  value={this.state.optionName}
                  type="text"
                  placeholder="Enter an option"
                />
                <Button
                  className="CreatePoll__add-button"
                  bsStyle="success"
                  type="submit"
                >
                  Add Option
                </Button>
              </div>
              <HelpBlock>{this.state.optionError}</HelpBlock>
            </form>
            <Row>
              <Col xs={12}>
                <Row>
                  {this.renderOptionEdit()}
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.updatePoll}
              bsStyle="success"
              type="submit"
            >Submit</Button>
            <Button onClick={this.closeEditOptionsModal}>Close</Button>
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
}, withRouter(ViewPoll));
