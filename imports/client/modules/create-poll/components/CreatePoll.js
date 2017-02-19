import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import {
  Grid,
  Button,
  FormGroup,
  ControlLabel,
  FormControl,
  Radio,
  Row,
  Col,
} from 'react-bootstrap';

import '../../../main.js';

/**
 * CreatePoll - component that handles the creation of polls. There are
 * no props passed in to this component which is why propTypes and defaultProps
 * aren't specified.
 */
export default class CreatePoll extends Component {
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
    this.removeOption = this.removeOption.bind(this);

    // This is the same as doing getInitialState but the ES6 way
    this.state = {
      name: '',
      isWeighted: false,
      isPrivate: false,
      optionName: '',
      options: {},
      password: '',
      loading: false,
    };
  }

  // Handler for the question input
  handleQuestionChange(e) {
    this.setState({
      ...this.state,
      name: e.target.value,
    });
  }

  // Handler for the password input
  handlePasswordChange(e) {
    this.setState({
      ...this.state,
      password: e.target.value,
    });
  }

  // Handler for the weighted radio buttons
  handleWeightedChange(isWeighted) {
    this.setState({
      ...this.state,
      isWeighted,
    });
  }

  // Handler for the private radio buttons
  handlePrivateChange(isPrivate) {
    this.setState({
      ...this.state,
      isPrivate,
    });
  }

  // Handler for the option name change input
  handleOptionNameChange(e) {
    this.setState({
      ...this.state,
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
        ...this.state,
        options: newOptions,
        optionName: '',
      });
    }
  }

  // Handler for creating a poll
  handlePollCreate() {
    // Destructuring the state object
    const { name, isWeighted, options, isPrivate, password } = this.state;

    Meteor.call('polls.insert', {
      name,
      isWeighted,
      options,
      isPrivate,
      password,
    }, (err, result) => {
      if (err || !result) {
        // TODO: add proper error handling
        console.log('Something went wrong');
      }
      this.setState({
        loading: false,
      });
      // TODO: route the user to either the poll page or poll edit page
      // after successful poll creation.
    });

    // When the DB is creating the poll, we disable the create button
    // for UX purposes and to avoid users accidentally creating the
    // same poll twice.
    this.setState({
      loading: true,
    });
  }

  // Function to remove an option from the options in state
  removeOption(option) {
    // This filters out the selected option to remove from the options in the
    // state. It iterates over each option and only returns the element if it
    // is not equal to the option we are trying to remove.
    const newOptions = this.state.options.filter(opt => opt !== option);

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
    return (
      <Grid>
        <h1 className="text-center">Create a Poll</h1>
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <FormGroup controlId={'question'}>
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
          </FormGroup>
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
                disabled={this.state.options.length < 2 || this.state.loading}
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
