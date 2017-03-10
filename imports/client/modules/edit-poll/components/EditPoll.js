import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Datetime from 'react-datetime';
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
    // A hashmap of key = option and
    // value = amount of votes
    options: React.PropTypes.object,
    // bool / whether poll has expiration
    isTimed: React.PropTypes.boolean,
    // date of expiry
    expiresAt: React.PropTypes.object,
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
    isTimed: true,
    expiresAt: new Date(),
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
    this.renderOptions = this.renderOptions.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this);
    this.handleOptionSubmit = this.handleOptionSubmit.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.state = {
      pollName: this.props.poll.name,
      options: {},
      optionName: '',
      showPollNameModal: false,
      showDatetime: false,
      error: '',
    };
  }

  /* Here is a method for opening a poll name prompt for changing the poll name,
   * but it is unclear whether this is the best option for this functionality */
  pollNamePrompt() {
    this.setState({ showPollNameModal: true });
    this.setState({ pollName: this.props.poll.name });
    this.setState({ options: this.props.poll.options });
    this.setState({ isTimed: this.props.poll.isTimed });
    this.setState({ expiresAt: this.props.poll.expiresAt });
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

  /* Handler for the option name change input */
  handleOptionNameChange(e) {
    this.setState({
      ...this.state,
      optionName: e.target.value,
    });
  }

  // Handler for the show add exp date input
  handleExpDateShow(showDatetime) {
    this.setState({
      ...this.state,
      showDatetime,
    });
  }

  // Handler for the show add exp date input
  handleEditDateButtonChange(isTimed) {
    var date = new Date();

    // add a day
    date.setDate(date.getDate() + 1);

    this.setState({
      ...this.state,
      showDatetime: false,
      isTimed,
      expiresAt: date,
    });
  }

  handleDateChange(e) {
    var expAt = e.toDate();

    this.setState({
      ...this.state,
      expiresAt: expAt,
    });
  }

  /* Handler for adding an option, in the modal window provided */
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
    }
  }

  //Function to blank out invalid dates (past days) for the user
  //calender input
  checkIfValid(currentDate, selectedDate) {
    
    //If the user has selected a day then check if their time is valid
    //as well
    if( selectedDate && !(selectedDate.isAfter(Datetime.moment()))) {
      return currentDate.isAfter(Datetime.moment());
    }
   
    //Otherwise just blank out any days before the current date
    return currentDate.isAfter(Datetime.moment().subtract(1, 'day'));
  }
  /* Handler for updating the poll in the database. Currently just updates the
   * poll's name, but can be easily modified to change the poll options if
   * needed */
  updatePoll() {
    const { pollName, options, isTimed, expiresAt } = this.state;

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
    updatedPoll.options = options;
    updatedPoll.isTimed = isTimed;
    updatedPoll.expiresAt = expiresAt;


    Meteor.call('polls.editPoll', this.props.poll._id, updatedPoll);

    this.setState({ showPollNameModal: false });
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

  /* Helper function to render all the options, used elsewhere, bad style,
   * however, this project is not going to be big enough to require us to
   * separate this out into different component.
   */
  renderOptions() {
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
          * this UI may be changed as we move forward
          * TODO: Move this into a separate component. */ }
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
            <ControlLabel>Add Options: </ControlLabel>
            { /* As I write this code, I have returned from a walk along the
               * coast, where I was comforted by the idea of the beauty of
               * life, and that despite all conflict the water and the
               * seagulls will be there. Despite what may come of me in the
               * years, those birds will continue to live and die as well.
               *
               * We are always distracted by the trivial, but in our code,
               * our craft, we embody the truth ever present in the world,
               * just out of sight. */ }
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
            </form>
            <Row>
              <Col xs={12}>
                <Row>
                  {this.renderOptions()}
                </Row>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Row>
              <Button 
                bsStyle="success"
                onClick={() => this.handleEditDateButtonChange(!this.state.isTimed)}
              > { this.state.isTimed ? "Remove Expiration Date" : 
                                    "Add Expiration Date" }</Button>
              { this.state.isTimed
                ?
                <Button 
                  bsStyle="success"
                  onClick={() => this.handleExpDateShow(!this.state.showDatetime)}
                > { !this.state.showDatetime ? "Edit Expiration Date" : 
                                    "Hide Calendar" }</Button>
                : null
              }
            <Button
              onClick={this.updatePoll}
              bsStyle="success"
              type="submit"
            >Submit</Button>
            <Button onClick={this.closePollNamePrompt}>Close</Button>
            </Row>
            <Row>
              { this.state.showDatetime
                ?
                <Datetime onChange={this.handleDateChange} 
                            input={false} 
                            defaultValue={this.state.expiresAt}
                            isValidDate={this.checkIfValid}/>
                : null
              }
            </Row>
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
