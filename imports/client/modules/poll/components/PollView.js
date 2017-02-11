import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Grab collection for polls
import { Polls } from '../../../../api/polling.js';

// Component for a page that displays a poll
// TODO Rework this UI!!!
class PollPage extends Component {

  // TODO: Do the job of rendering the poll
  renderPolls() {
    let dataString = ''; // Initialize the variable that we will return
    if (this.props.ready) { // Check if we have data and the poll exists
      if (this.props.polls[0]) {
        dataString = this.props.polls[0].data.name;
      } else {
        dataString = (<h1>Poll not found!</h1>);
      }
    } else { // Not ready, then loading!
      dataString = 'Loading!';
    }
    return dataString;
  }

  // Actual layout
  render() {
    return (
      <div className="container">
        <h1>HERE</h1>
        <h2>{this.renderPolls()}</h2>
      </div>
    );
  }
}

// A property containing the polls is required of the data.
// This object is defined here by the style guidelines
PollPage.propTypes = {
  polls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isOptional,
    data: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  ready: PropTypes.bool.isRequired,
};

// The real MVP; creates the PollPage container using the routing params
// (the unique url)
export default createContainer(({ params }) => {
  const handle = Meteor.subscribe('polls'); // get the poll database
  const ready = handle.ready(); // Check whether data is sent yet

  return { // Look in the database for an object with the same id as the
           // unique url parameter
    ready,
    polls: Polls.find({ _id: params.pollId }).fetch(),
  };
}, PollPage);
