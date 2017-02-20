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
import Polls from '../../../../api/polls.js';

// Component for a page that displays a poll
// TODO Rework this UI!!!
class PollPage extends Component {
  constructor(props) {
    super(props);

    this.renderOptions = this.renderOptions.bind(this);

    this.state = {
      handle: '',
    };
  }

  renderOptions() {
    const { options } = this.props.poll;

    return Object.keys(options).map(option => (
      <Col key={option} md={7} xs={8}>
        <FormGroup>
          <Checkbox>{option}</Checkbox>
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
          <form>
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
            <Button bsStyle="success" type="submit">Vote</Button>
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
}, PollPage);
