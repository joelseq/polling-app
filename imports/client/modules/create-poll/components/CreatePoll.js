import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter, routerShape } from 'react-router';
import Datetime from 'react-datetime';
import {
  Grid,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Radio,
  HelpBlock,
  Row,
  Col,
} from 'react-bootstrap';

var moment = require('moment');

import '../../../main.js';
import '../../../../ui/react-datetime.css'

/**
 * CreatePoll - component that handles the creation of polls. There are
 * no props passed in to this component which is why propTypes and defaultProps
 * aren't specified.
 */
class CreatePoll extends Component {
  constructor(props) {
    super(props);

    // The reason we have to bind 'this' in each of these methods is so that
    // we get access to the calling object (component). This is just common
    // convention and you don't need to over think it. Further reading if interested:
    // http://reactkungfu.com/2015/07/why-and-how-to-bind-methods-in-your-react-component-classes/
    // https://github.com/airbnb/javascript/tree/master/react#methods
    this.handleQuestionChange = this.handleQuestionChange.bind(this);
    this.handleWeightedChange = this.handleWeightedChange.bind(this);
    this.handleOptionNameChange = this.handleOptionNameChange.bind(this);
    this.handleOptionSubmit = this.handleOptionSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePrivateChange = this.handlePrivateChange.bind(this);
    this.handlePollCreate = this.handlePollCreate.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.getPollNameValidationState =
      this.getPollNameValidationState.bind(this);
    this.removeOption = this.removeOption.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEditPassChange = this.handleEditPassChange.bind(this);

    // This is the same as doing getInitialState but the ES6 way
    this.state = {
      // might wanna move this
      name: '',
      isWeighted: false,
      isPrivate: false,
      isTimed: false,
      optionName: '',
      options: {},
      password: '',
      loading: false,
      expiresAt: new Date(0, 0, 0, 0, 0, 0),
      pollNameError: '',
      optionError: '',
      editPass: '',
      error: '',
    };
  }

  getPollNameValidationState() {
    const length = this.state.name.length;
    if (length > 0) return 'success';
    else if (length === 0) return 'error';

    return null;
  }

  // Handler for the edit pass input
  handleEditPassChange(e) {
    this.setState({
      ...this.state,
      editPass: e.target.value,
    });
  }

  // Handler for the question input
  handleQuestionChange(e) {
    this.setState({
      name: e.target.value,
      pollNameError: '',
    });
  }

  // Handler for the password input
  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  // Handler for the weighted radio buttons
  handleWeightedChange(isWeighted) {
    this.setState({
      isWeighted,
    });
  }

  // Handler for the private radio buttons
  handlePrivateChange(isPrivate) {
    this.setState({
      isPrivate,
    });
  }

  // Handler for the show add exp date input
  handleExpDateShow(isTimed) {
    this.setState({
      ...this.state,
      isTimed,
    });
  }

  // Handler for the option name change input
  handleOptionNameChange(e) {
    this.setState({
      optionName: e.target.value,
    });
  }

  // Handler for adding an option
  handleOptionSubmit(e) {
    e.preventDefault();

    const { optionName, options } = this.state;

    // Make sure the input isn't empty and the option hasn't already been added
    // TODO: Show a warning when the user is trying to add the same option twice
    if (optionName.length > 0 && !(optionName in options)) {
      const newOptions = { ...options };

      newOptions[optionName] = 0;

      this.setState({
        options: newOptions,
        optionName: '',
        optionError: '',
      });
    }
  }

  // Handler for creating a poll
  handlePollCreate() {
    // Destructuring the state object
    const { name, isWeighted, options, isPrivate, password, editPass, isTimed, expiresAt} =
      this.state;
    if (name === '') {
      this.setState({ pollNameError: 'No poll name provided!' });
      return;
    }

    // Check for the correct number of options
    const optionNum = Object.keys(options).length;
    if (optionNum < 2) {
      this.setState({ optionError:
        'Too few options specified, please add another before submitting!' });
      this.setState({
        loading: false,
      });
      return;
    }

    if (options.length < 2) {
      this.setState({
        error: 'Too few options. Please add at least 2.',
      });
    } else if (!name) {
      this.setState({
        error: 'Please add a poll name.',
      });
    } else if (isPrivate && !password) {
      this.setState({
        error: 'Please enter a password if the poll is private.',
      });
    } else {
      Meteor.call('polls.insert', {
        name,
        isWeighted,
        options,
        isPrivate,
        password,
        editPassword: editPass,
        isTimed,
        expiresAt,
      }, (err, result) => {
        if (err || !result) {
          // TODO: add proper error handling
          this.setState({
            error: 'Something went wrong with creating Poll.',
          });
        }
        this.setState({
          loading: false,
        });

        // route the user to either the poll page or poll edit page
        // after successful poll creation.
        this.props.router.push(`/polls/${result}/edit`);
      });

      // When the DB is creating the poll, we disable the create button
      // for UX purposes and to avoid users accidentally creating the
      // same poll twice.
      this.setState({
        loading: true,
        error: '',
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

  handleDateChange(e) {
    var expAt = e.toDate();

    this.setState({
      ...this.state,
      expiresAt: expAt,
    });
    
  }

  // Function to remove an option from the options in state
  removeOption(option) {
    // This filters out the selected option to remove from the options in the
    // state. It iterates over each option and only returns the element if it
    // is not equal to the option we are trying to remove.
    const newOptions = { ...this.state.options };

    delete newOptions[option];

    this.setState({
      options: newOptions,
    });
  }

  // Helper function to render all the options
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
    const { options, loading, name, isPrivate, password } = this.state;
    const disabled = Object.keys(options).length < 2 || loading ||
      !name || (isPrivate && !password);

    return (
      <Grid>
        <h1 className="text-center">Create a Poll</h1>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <FormGroup
            controlId={'question'}
            validationState={this.getPollNameValidationState()}
          >
            <ControlLabel>Question: </ControlLabel>
            {/* This component is now 'controlled'. Further reading:
              * https://facebook.github.io/react/docs/forms.html
              */}
            <FormControl
              onChange={this.handleQuestionChange}
              type="text"
              value={this.state.question}
              placeholder="Enter question for poll"
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup
            controlId={'editPass'}
          >
            <HelpBlock>{this.state.pollNameError}</HelpBlock>
            <ControlLabel>Administration Password: </ControlLabel>
            <FormControl
              onChange={this.handleEditPassChange}
              type="text"
              value={this.state.editPass}
              placeholder="Enter password for the poll's edit page (optional)"
            />
            <FormControl.Feedback />
          </FormGroup>
          <Row>
            <Col md={4}>
              <FormGroup controlId={'weighted'}>
                <ControlLabel>Weighted?</ControlLabel>
                <p className="CreatePoll__info">
                  Weighted: Votes for options can have weights ranging from 1 to 10 (both inclusive)
                </p>
                <p className="CreatePoll__info">
                  Unweighted: Votes for options are weighted equally
                </p>
                {/* These radio buttons are now 'controlled' as well
                  * Further reading: same link as above
                  */}
                <Radio
                  onChange={() => this.handleWeightedChange(true)}
                  checked={this.state.isWeighted}
                >
                  Yes
                </Radio>
                <Radio
                  onChange={() => this.handleWeightedChange(false)}
                  checked={!this.state.isWeighted}
                >
                  No
                </Radio>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup controlId={'private'}>
                <ControlLabel>Private?</ControlLabel>
                <Radio
                  onChange={() => this.handlePrivateChange(true)}
                  checked={this.state.isPrivate}
                >
                  Yes
                </Radio>
                <Radio
                  onChange={() => this.handlePrivateChange(false)}
                  checked={!this.state.isPrivate}
                >
                  No
                </Radio>
              </FormGroup>
              { this.state.isPrivate
                ?
                  <FormGroup controlId={'password'}>
                    <ControlLabel>Password: </ControlLabel>
                    {/* This component is now 'controlled'. Further reading:
                      * https://facebook.github.io/react/docs/forms.html
                      */}
                    <FormControl
                      onChange={this.handlePasswordChange}
                      type="password"
                      defaultValue={this.state.password}
                      placeholder="Enter password for poll"
                    />
                  </FormGroup>
                : null
              }
            </Col>
            <Col md={4} className={"text-center container col-xs-4"}>
              <Button 
                className={"btn btn-primary center-block"}
                bsStyle="success"
                onClick={() => this.handleExpDateShow(!this.state.isTimed)}
              > Add Expiration date </Button>
              <br />
              { this.state.isTimed
                ?
                <Datetime onChange={this.handleDateChange} input={false} isValidDate={this.checkIfValid}/>
                : null
              }
            </Col>
          </Row>
        </form>
        <Row>
          <Col md={8} xs={10} mdOffset={2} xsOffset={1}>
            <h3>Options:</h3>
            {/* After some consideration I have decided to split up creating the poll into 2 forms.
            The reasons are:
            1) If everything is inside the parent form then if someone hits enter during any
               stage of the process of creating a poll, it will submit and create the incomplete
               poll.
            2) Splitting up adding options into its own form allows for people to submit and add
               options by hitting enter now which is good for UX. */}
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
          </Col>
        </Row>
        <Grid>
          <Row>
            <Col xs={12}>
              <Row>
                {this.renderOptions()}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={6} mdOffset={3} xs={8} xsOffset={2}>
              <Button
                className="margin-top"
                bsStyle="primary"
                block
                disabled={disabled}
                onClick={!this.state.loading ? this.handlePollCreate : null}
              >
                Create
              </Button>
            </Col>
          </Row>
        </Grid>
      </Grid>
    );
  }
}

CreatePoll.propTypes = {
  router: routerShape,
};

export default withRouter(CreatePoll);
