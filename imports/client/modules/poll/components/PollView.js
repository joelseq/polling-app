import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Grab collection for polls
import { Polls } from '../../../../api/polling.js';

// Component for a page that displays a poll
class PollPage extends Component {
  constructor(props) {
    super(props);
  }

  // TODO: Do the job of rendering the poll
  renderPolls() {
		console.log( this.props.polls[0] );
  }

  // Actual layout
  render() {
    return (
      <div className="container">
				<h1>HERE</h1>
        <ul>
          {this.renderPolls()}
        </ul>
      </div>
    );
  }
}

// A property containing the polls is required of the data.
PollPage.propTypes = {
  polls: PropTypes.array.isRequired,
};

// The real MVP; creates the PollPage container using the routing params
// (the unique url)
export default createContainer(({ params }) => {
  console.log( params.pollId ); // TODO: remove this

  return { // Look in the database for an object with the same id as the 
           // unique url parameter
    polls: Polls.find({ "_id" : new Mongo.ObjectID(params.pollId) }).fetch(),
  };
}, PollPage);
