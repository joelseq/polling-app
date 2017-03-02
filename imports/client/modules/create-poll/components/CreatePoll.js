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
  Row,
  Col,
	ButtonGroup,
} from 'react-bootstrap';

var moment = require('moment');

import '../../../main.js';
import '../../../../ui/react-datetime.css'

import PopOver from './PopOver.js'

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
    this.removeOption = this.removeOption.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    // This is the same as doing getInitialState but the ES6 way
    this.state = {
      // might wanna move this
      name: '',
      isWeighted: false,
      isPrivate: false,
      hasExpDate: false,
      optionName: '',
      options: {},
      password: '',
      loading: false,
      expiresAt: new Date(0, 0, 0, 0, 0, 0),
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

  // Handler for the show add exp date input
  handleExpDateChange(hasExpDate) {
    this.setState({
      ...this.state,
      hasExpDate,
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
    const { name, isWeighted, options, isPrivate, password, expiresAt, hasExpDate } = this.state;

    Meteor.call('polls.insert', {
      name,
      isWeighted,
      options,
      isPrivate,
      password,
      expiresAt,
    }, (err, result) => {
      if (err || !result) {
        // TODO: add proper error handling
        console.log('Something went wrong');
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
    });
  }

  checkIfValid(currentDate, selectedDate) {
    console.log("hit");
    console.log(Datetime.moment());
    if( selectedDate ) {
       return currentDate.isAfter(Datetime.moment().subtract(1, 'day'));
    }
    return true;
  }

  handleDateChange(e) {
    var expAt = e.toDate();
    console.log(expAt);

    this.setState({
      ...this.state,
      expiresAt: expAt,
    });

		if(!this.state.hasExpDate){
			this.setState({
				...this.state,
				expiresAt: new Date(0, 0, 0, 0, 0, 0),
			});
		}
    
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
    // not sure what the right way 
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
          <Row>
            <Col md={4} className={"text-center col-xs-4"}>
              <FormGroup controlId={'weighted'}>
							<ControlLabel>Poll Type</ControlLabel>
							{' '}
							<PopOver />
							{/* These radio buttons are now 'controlled' as well
								* Further reading: same link as above
								*/}
							<br />
								<ButtonGroup className={"btn-group"}>
									<Button 
										onClick={() => this.handleWeightedChange(true)}
										className={"btn center-block"}
										bsStyle={ this.state.isWeighted
											?
											"success"
											: ""
										}
									checked={this.state.isWeighted}
									>Weighted</Button>
									<Button
										onClick={() => this.handleWeightedChange(false)}
										className={"btn center-block"}
										bsStyle={ !this.state.isWeighted
											?
											"success"
											: ""
										}
									>Unweighted</Button>
								</ButtonGroup>
                {/*<Radio
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
                </Radio>*/}
              </FormGroup>
            </Col>
            <Col md={4} className={"text-center col-xs-4"}>
              <FormGroup controlId={'private'}>
                <ControlLabel>Poll Privacy</ControlLabel>
								<Button 
									className={"btn btn-primary center-block"}
									bsStyle="success"
									onClick={() => this.handlePrivateChange(!this.state.isPrivate)}
								> {this.state.isPrivate ? "Make Poll Public" : "Make Poll Private"} 
								</Button>
                {/*<Radio
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
                </Radio>*/}
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
							<ControlLabel>Poll Termination</ControlLabel>
              <Button 
                className={"btn btn-primary center-block"}
                bsStyle="success"
                onClick={() => this.handleExpDateChange(!this.state.hasExpDate)}
              > {this.state.hasExpDate ? "Remove Expiration Date" : "Add Expiration Date"} 
							</Button>
              <br />
              { this.state.hasExpDate
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

CreatePoll.propTypes = {
  router: routerShape,
};

export default withRouter(CreatePoll);
